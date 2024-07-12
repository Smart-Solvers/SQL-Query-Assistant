# Standard library imports
import os
from datetime import datetime

# Third-party imports
import streamlit as st
import pandas as pd
import plotly.express as px
from dotenv import load_dotenv
from streamlit_option_menu import option_menu
import requests
import io

# Custom imports
from src.database import (
    get_database_connection,
    get_database_schema,
    get_databases,
)
from src.services.query_service import QueryService
from src.services.llm_service import generate_sql_query
from src.utils.preprocessing import preprocess_query
from src.config.log_handler import logger

load_dotenv()

# Set page config
st.set_page_config(
    page_title="AI SQL Assistant",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for improved UI
st.markdown(
    """
<style>
    .reportview-container {
        background: linear-gradient(to right, #2c3e50, #4ca1af);
        color: white;
    }
    .sidebar .sidebar-content {
        background: rgba(38, 39, 48, 0.8);
    }
    .Widget>label {
        color: #ffffff;
        font-family: 'Roboto', sans-serif;
    }
    .stTextInput>div>div>input {
        color: white !important;
        background-color: rgba(38, 39, 48, 0.8) !important;
        border: 1px solid #4ca1af;
    }
    .dataframe {
        font-size: 12px;
        background-color: rgba(255, 255, 255, 0.1);
    }
    .dataframe th {
        background-color: rgba(76, 161, 175, 0.3);
    }
    .stTextInput>div>div>input::placeholder {
        color: #a0a0a0;
    }
    .stTextInput>label {
        color: white !important;
    }
    .stButton>button {
        color: #ffffff;
        background-color: #4ca1af;
        border: none;
    }
    .stButton>button:hover {
        background-color: #2c3e50;
    }
    .stSelectbox>div>div>select {
        color: white;
        background-color: rgba(38, 39, 48, 0.8);
    }
</style>
""",
    unsafe_allow_html=True,
)

# Initialize session state
if "connected" not in st.session_state:
    st.session_state.connected = False
if "current_db" not in st.session_state:
    st.session_state.current_db = None
if "generated_sql" not in st.session_state:
    st.session_state.generated_sql = None
if "query_result" not in st.session_state:
    st.session_state.query_result = None
if "query_history" not in st.session_state:
    st.session_state.query_history = {}
if "db_schema" not in st.session_state:
    st.session_state.db_schema = None
if "theme" not in st.session_state:
    st.session_state.theme = "light"


# Function to load Lottie animations
def load_lottie_url(url: str):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()


# Login Page
if not st.session_state.connected:
    st.title("AI SQL Assistant")

    default_host = os.getenv("DB_HOST", "localhost")
    default_user = os.getenv("DB_USERNAME", "root")
    default_password = os.getenv("DB_PASSWORD", "password")

    col1, col2 = st.columns(2)
    with col1:
        host = st.text_input("Host")
        user = st.text_input("User")
        password = st.text_input("Password", type="password")

    with col2:
        st.markdown("### Quick Connect")
        if st.button("Use Local Host", key="default_conn"):
            try:
                conn = get_database_connection(
                    default_host, default_user, default_password
                )
                st.session_state.connection_params = {
                    "host": default_host,
                    "user": default_user,
                    "password": default_password,
                }
                st.session_state.connected = True
                st.success("Localhost Database connected successfully!")
                logger.log_info("Localhost Database connected successfully!")
                st.rerun()
            except Exception as e:
                st.error(f"Connection failed: {str(e)}")

    if st.button("Connect", key="custom_conn"):
        try:
            conn = get_database_connection(host, user, password)
            st.session_state.connection_params = {
                "host": host,
                "user": user,
                "password": password,
            }
            st.session_state.connected = True
            st.success("Connected successfully!")
            logger.log_info("Connected successfully!")
            st.rerun()
        except Exception as e:
            st.error(f"Connection failed: {str(e)}")

# Main Application
else:
    # Sidebar
    with st.sidebar:
        st.title("SQL Query Assistant")
        menu = option_menu(
            "Main Menu",
            ["Home", "Query", "Visualize", "Logout"],
            icons=["house", "code-square", "bar-chart", "gear"],
            menu_icon="cast",
            default_index=0,
        )

    if menu == "Home":
        st.title("Welcome to Advanced SQL Assistant")
        st.write("Select an option from the sidebar to get started.")

        # Display some statistics or recent activity
        st.subheader("Recent Activity")
        if st.session_state.current_db and st.session_state.query_history.get(
            st.session_state.current_db
        ):
            recent_queries = st.session_state.query_history[
                st.session_state.current_db
            ][-5:]
            for query in recent_queries:
                st.info(query)
        else:
            st.info("No recent queries.")

    elif menu == "Query":
        if st.session_state.current_db is None:
            databases = get_databases(**st.session_state.connection_params)
            selected_db = st.selectbox("Select a database", options=databases)
            if st.button("Use Selected Database"):
                st.session_state.current_db = selected_db
                st.session_state.db_schema = get_database_schema(
                    selected_db, **st.session_state.connection_params
                )
                st.session_state.query_history[selected_db] = []
                st.rerun()

        if st.session_state.current_db:
            st.title(
                "Natural Language to SQL Query Converter - "
                f"{st.session_state.current_db}"
            )

            # Schema display
            with st.expander("Database Schema"):
                if st.session_state.db_schema:
                    selected_table = st.selectbox(
                        "Select a table",
                        options=list(st.session_state.db_schema.keys()),
                    )

                    if selected_table:
                        columns = st.session_state.db_schema[selected_table]
                        df = pd.DataFrame(columns)
                        st.table(
                            df.style.set_properties(**{"text-align": "left"})
                        )
                else:
                    st.warning("Unable to fetch database schema.")

            # User input
            user_query = st.text_area(
                "Enter your query in natural language:", height=100
            )

            def generate_and_execute_query():
                try:
                    with st.spinner("Generating and executing query..."):
                        raw_sql = generate_sql_query(
                            user_query,
                            st.session_state.current_db,
                            st.session_state.connection_params,
                        )
                        st.session_state.generated_sql = preprocess_query(
                            raw_sql
                        )

                        db = get_database_connection(
                            **st.session_state.connection_params,
                            database=st.session_state.current_db,
                        )
                        query_service = QueryService(db)
                        st.session_state.query_result = query_service.get_data(
                            st.session_state.generated_sql
                        )

                        if (
                            user_query
                            not in st.session_state.query_history[
                                st.session_state.current_db
                            ]
                        ):
                            st.session_state.query_history[
                                st.session_state.current_db
                            ].append(user_query)

                except Exception as e:
                    st.error(f"An error occurred: {str(e)}")

            if st.button("Generate and Execute SQL"):
                generate_and_execute_query()

            # Display generated SQL and results
            if st.session_state.generated_sql:
                st.subheader("Generated SQL Query:")
                st.code(st.session_state.generated_sql, language="sql")

            if st.session_state.query_result:
                st.subheader("Query Results:")
                df = pd.DataFrame(st.session_state.query_result)
                st.dataframe(df)

                # Export options
                export_format = st.selectbox(
                    "Export format", ["CSV", "JSON", "Excel"]
                )
                if st.button("Export Data"):
                    if export_format == "CSV":
                        st.download_button(
                            "Download CSV",
                            df.to_csv(index=False),
                            "query_result.csv",
                            "text/csv",
                        )
                    elif export_format == "JSON":
                        st.download_button(
                            "Download JSON",
                            df.to_json(orient="records"),
                            "query_result.json",
                            "application/json",
                        )
                    else:
                        output = io.BytesIO()
                        with pd.ExcelWriter(
                            output, engine="xlsxwriter"
                        ) as writer:
                            df.to_excel(
                                writer, sheet_name="Sheet1", index=False
                            )
                        st.download_button(
                            "Download Excel",
                            output.getvalue(),
                            "query_result.xlsx",
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        )

    elif menu == "Visualize":
        st.title("Data Visualization")

        if st.session_state.query_result:
            df = pd.DataFrame(st.session_state.query_result)

            chart_type = st.selectbox(
                "Select chart type:",
                ["Bar", "Line", "Scatter", "Pie"],
            )

            if len(df.columns) >= 2:
                x_axis = st.selectbox(
                    "Select X-axis:", df.columns, key="x_axis"
                )
                y_axis = st.selectbox(
                    "Select Y-axis:",
                    [col for col in df.columns if col != x_axis],
                    key="y_axis",
                )

                if chart_type == "Bar":
                    fig = px.bar(df, x=x_axis, y=y_axis)
                elif chart_type == "Line":
                    fig = px.line(df, x=x_axis, y=y_axis)
                elif chart_type == "Scatter":
                    fig = px.scatter(df, x=x_axis, y=y_axis)
                elif chart_type == "Pie":
                    fig = px.pie(df, names=x_axis, values=y_axis)
                # elif chart_type == "Heatmap":
                #     fig = px.imshow(df.corr())

                st.plotly_chart(fig, use_container_width=True)

                # Advanced options
                with st.expander("Advanced Options"):
                    color_scale = st.selectbox(
                        "Color Scale",
                        ["Viridis", "Plasma", "Inferno", "Magma", "Cividis"],
                    )
                    fig.update_layout(coloraxis_colorscale=color_scale)

                    title = st.text_input("Chart Title", "My Chart")
                    fig.update_layout(title_text=title, title_x=0.5)

                    show_legend = st.checkbox("Show Legend", value=True)
                    fig.update_layout(showlegend=show_legend)

                # Allow saving the chart
                if st.button("Save Chart"):
                    fig.write_image("chart.png")
                    st.success("Chart saved as chart.png")
            else:
                st.info(
                    "Not enough columns for visualization. "
                    "Query result should have at least two columns."
                )
        else:
            st.info("No data to visualize. Please run a query first.")

    elif menu == "Logout":
        # if st.button("Logout"):
        for key in list(st.session_state.keys()):
            del st.session_state[key]
        st.rerun()

    # Footer
    st.markdown("---")
    st.markdown(
        "Created by Code Warriors ⚔️ | Last updated: "
        + datetime.now().strftime("%Y-%m-%d")
    )
