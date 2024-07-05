# import streamlit as st
# import pandas as pd
# import plotly.express as px
# from appp.database import get_database_connection
# from appp.services.query_service import QueryService
# from appp.services.llm_service import generate_sql_query
# from appp.utils.preprocessing import preprocess_query

# # Set page config
# st.set_page_config(page_title="SQL Query Assistant", layout="wide", initial_sidebar_state="expanded")

# # Custom CSS to improve UI
# st.markdown("""
# <style>
#     .reportview-container {
#         background: #f0f2f6
#     }
#     .sidebar .sidebar-content {
#         background: #262730
#     }
#     .Widget>label {
#         color: #262730;
#         font-family: monospace;
#     }
#     .stTextInput>div>div>input {
#         color: #262730;
#     }
# </style>
# """, unsafe_allow_html=True)

# # Sidebar
# st.sidebar.title("SQL Query Assistant")
# st.sidebar.image("https://img.icons8.com/color/96/000000/sql.png", width=100)

# # Main content
# st.title("Natural Language to SQL Query Converter")

# # User input
# user_query = st.text_area("Enter your query in natural language:", height=100)

# if st.button("Generate SQL"):
#     with st.spinner("Generating SQL query..."):
#         try:
#             # Generate SQL query
#             generated_sql = generate_sql_query(user_query)
            
#             # Display generated SQL
#             st.subheader("Generated SQL Query:")
#             st.code(generated_sql, language="sql")
            
#             # Process and execute query
#             processed_query = preprocess_query(generated_sql)
#             db = get_database_connection()
#             query_service = QueryService(db)
#             result = query_service.get_data(processed_query)
            
#             # Display results
#             st.subheader("Query Results:")
#             if result:
#                 df = pd.DataFrame(result)
#                 st.dataframe(df)
                
#                 # Data visualization
#                 st.subheader("Data Visualization")
#                 if len(df.columns) >= 2:
#                     col1, col2 = st.columns(2)
#                     with col1:
#                         chart_type = st.selectbox("Select chart type:", ["Bar", "Line", "Scatter"])
#                     with col2:
#                         x_axis = st.selectbox("Select X-axis:", df.columns)
#                         y_axis = st.selectbox("Select Y-axis:", [col for col in df.columns if col != x_axis])
                    
#                     if chart_type == "Bar":
#                         fig = px.bar(df, x=x_axis, y=y_axis)
#                     elif chart_type == "Line":
#                         fig = px.line(df, x=x_axis, y=y_axis)
#                     else:
#                         fig = px.scatter(df, x=x_axis, y=y_axis)
                    
#                     st.plotly_chart(fig, use_container_width=True)
#                 else:
#                     st.info("Not enough columns for visualization. Query result should have at least two columns.")
#             else:
#                 st.info("No results found for the given query.")
            
#         except Exception as e:
#             st.error(f"An error occurred: {str(e)}")

# # Additional features
# st.sidebar.subheader("Additional Features")

# # Query history
# if 'query_history' not in st.session_state:
#     st.session_state.query_history = []

# if st.sidebar.button("Show Query History"):
#     st.sidebar.subheader("Query History")
#     for idx, query in enumerate(st.session_state.query_history):
#         st.sidebar.text(f"{idx + 1}. {query[:50]}...")

# # Save query
# if st.sidebar.button("Save Current Query"):
#     if user_query:
#         st.session_state.query_history.append(user_query)
#         st.sidebar.success("Query saved!")
#     else:
#         st.sidebar.warning("No query to save.")

# # Clear history
# if st.sidebar.button("Clear History"):
#     st.session_state.query_history = []
#     st.sidebar.success("History cleared!")

# # Help section
# with st.sidebar.expander("Help"):
#     st.markdown("""
#     **How to use:**
#     1. Enter your query in natural language in the text area.
#     2. Click 'Generate SQL' to convert it to SQL and see results.
#     3. Explore the generated SQL, query results, and data visualizations.
#     4. Use additional features in the sidebar to manage your queries.
#     """)

# # Footer
# st.markdown("---")
# st.markdown("Created with ❤️ using Streamlit")



#### Working Fine, but schema directly displaying in side bar


# import streamlit as st
# import pandas as pd
# import plotly.express as px
# from appp.database import get_database_connection
# from appp.services.query_service import QueryService
# from appp.services.llm_service import generate_sql_query
# from appp.utils.preprocessing import preprocess_query
# from appp.database import get_database_schema
# # from pandas import DataFrame as df

# if 'db_schema' not in st.session_state:
#     st.session_state.db_schema = get_database_schema()
    

# # Set page config
# st.set_page_config(page_title="SQL Query Assistant", layout="wide", initial_sidebar_state="expanded")

# with st.sidebar.expander("Database Schema"):
#     for table, columns in st.session_state.db_schema.items():
#         st.sidebar.subheader(f"Table: {table}")
#         for column in columns:
#             st.sidebar.text(f"  - {column['Column Name']} ({column['Data Type']})")

# # Custom CSS to improve UI
# st.markdown("""
# <style>
#     .reportview-container {
#         background: #f0f2f6
#     }
#     .sidebar .sidebar-content {
#         background: #262730
#     }
#     .Widget>label {
#         color: #262730;
#         font-family: monospace;
#     }
#     .stTextInput>div>div>input {
#         color: #262730;
#     }
# </style>
# """, unsafe_allow_html=True)

# # Initialize session state
# if 'generated_sql' not in st.session_state:
#     st.session_state.generated_sql = None
# if 'query_result' not in st.session_state:
#     st.session_state.query_result = None
# if 'query_history' not in st.session_state:
#     st.session_state.query_history = []

# # Sidebar
# st.sidebar.title("SQL Query Assistant")
# st.sidebar.image("https://img.icons8.com/color/96/000000/sql.png", width=100)

# st.sidebar.subheader("Database Schema")
# if st.session_state.db_schema:
#     selected_table = st.sidebar.selectbox("Select a table", options=list(st.session_state.db_schema.keys()))
    
#     if selected_table:
#         columns = st.session_state.db_schema[selected_table]
#         df = pd.DataFrame(columns, columns=['Column Name', 'Data Type'])
#         st.sidebar.table(df)
# else:
#     st.sidebar.warning("Unable to fetch database schema.")

# # Main content
# st.title("Natural Language to SQL Query Converter")

# # User input
# user_query = st.text_area("Enter your query in natural language:", height=100)

# def generate_and_execute_query():
#     try:
#         # Generate SQL query
#         st.session_state.generated_sql = generate_sql_query(user_query)
        
#         # Process and execute query
#         processed_query = preprocess_query(st.session_state.generated_sql)
#         db = get_database_connection()
#         query_service = QueryService(db)
#         st.session_state.query_result = query_service.get_data(processed_query)
        
#         # Add to query history
#         if user_query not in st.session_state.query_history:
#             st.session_state.query_history.append(user_query)
    
#     except Exception as e:
#         st.error(f"An error occurred: {str(e)}")

# if st.button("Generate SQL"):
#     with st.spinner("Generating SQL query..."):
#         generate_and_execute_query()

# # Display generated SQL and results
# if st.session_state.generated_sql:
#     st.subheader("Generated SQL Query:")
#     processed_query = preprocess_query(st.session_state.generated_sql)
#     st.code(processed_query, language="sql")

# if st.session_state.query_result:
#     st.subheader("Query Results:")
#     df = pd.DataFrame(st.session_state.query_result)
#     st.dataframe(df)
    
#     # Data visualization
#     st.subheader("Data Visualization")
#     if len(df.columns) >= 2:
#         col1, col2 = st.columns(2)
#         with col1:
#             chart_type = st.selectbox("Select chart type:", ["Bar", "Line", "Scatter"], key="chart_type")
#         with col2:
#             x_axis = st.selectbox("Select X-axis:", df.columns, key="x_axis")
#             y_axis = st.selectbox("Select Y-axis:", [col for col in df.columns if col != x_axis], key="y_axis")
        
#         if chart_type == "Bar":
#             fig = px.bar(df, x=x_axis, y=y_axis)
#         elif chart_type == "Line":
#             fig = px.line(df, x=x_axis, y=y_axis)
#         else:
#             fig = px.scatter(df, x=x_axis, y=y_axis)
        
#         st.plotly_chart(fig, use_container_width=True)
#     else:
#         st.info("Not enough columns for visualization. Query result should have at least two columns.")

# # Additional features
# st.sidebar.subheader("Additional Features")

# # Query history
# if st.sidebar.button("Show Query History"):
#     st.sidebar.subheader("Query History")
#     for idx, query in enumerate(st.session_state.query_history):
#         st.sidebar.text(f"{idx + 1}. {query[:50]}...")

# # Clear history
# if st.sidebar.button("Clear History"):
#     st.session_state.query_history = []
#     st.sidebar.success("History cleared!")

# # Help section
# with st.sidebar.expander("Help"):
#     st.markdown("""
#     **How to use:**
#     1. Enter your query in natural language in the text area.
#     2. Click 'Generate SQL' to convert it to SQL and see results.
#     3. Explore the generated SQL, query results, and data visualizations.
#     4. Use additional features in the sidebar to manage your queries.
#     """)

# # Footer
# st.markdown("---")
# st.markdown("Created with ❤️ using Streamlit")




import streamlit as st
import pandas as pd
import plotly.express as px
from appp.database import get_database_connection, get_database_schema
from appp.services.query_service import QueryService
from appp.services.llm_service import generate_sql_query
from appp.utils.preprocessing import preprocess_query

# Set page config
st.set_page_config(page_title="SQL Query Assistant", layout="wide", initial_sidebar_state="expanded")

# Custom CSS to improve UI
st.markdown("""
<style>
    .reportview-container {
        background: #f0f2f6
    }
    .sidebar .sidebar-content {
        background: #262730
    }
    .Widget>label {
        color: #262730;
        font-family: monospace;
    }
    .stTextInput>div>div>input {
        color: #262730;
    }
    .dataframe {
        font-size: 12px;
    }
    .dataframe th {
        text-align: left;
        background-color: #f0f2f6;
    }
    .dataframe td {
        text-align: left;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'generated_sql' not in st.session_state:
    st.session_state.generated_sql = None
if 'query_result' not in st.session_state:
    st.session_state.query_result = None
if 'query_history' not in st.session_state:
    st.session_state.query_history = []
if 'db_schema' not in st.session_state:
    st.session_state.db_schema = get_database_schema()

# Sidebar
st.sidebar.title("SQL Query Assistant")
# st.sidebar.image("https://img.icons8.com/color/96/000000/sql.png", width=100)

# Schema display
st.sidebar.subheader("Database Schema")
if st.session_state.db_schema:
    selected_table = st.sidebar.selectbox("Select a table", options=list(st.session_state.db_schema.keys()))
    
    if selected_table:
        columns = st.session_state.db_schema[selected_table]
        df = pd.DataFrame(columns)
        st.sidebar.table(df.style.set_properties(**{'text-align': 'left'}))
else:
    st.sidebar.warning("Unable to fetch database schema.")

# Main content
st.title("Natural Language to SQL Query Converter")

# User input
user_query = st.text_area("Enter your query in natural language:", height=100)

def generate_and_execute_query():
    try:
        # Generate SQL query
        raw_sql = generate_sql_query(user_query)
        
        # Preprocess the generated SQL
        st.session_state.generated_sql = preprocess_query(raw_sql)
        
        # Process and execute query
        db = get_database_connection()
        query_service = QueryService(db)
        st.session_state.query_result = query_service.get_data(st.session_state.generated_sql)
        
        # Add to query history
        if user_query not in st.session_state.query_history:
            st.session_state.query_history.append(user_query)
    
    except Exception as e:
        st.error(f"An error occurred: {str(e)}")

if st.button("Generate SQL"):
    with st.spinner("Generating SQL query..."):
        generate_and_execute_query()

# Display generated SQL and results
if st.session_state.generated_sql:
    st.subheader("Generated SQL Query:")
    st.code(st.session_state.generated_sql, language="sql")

if st.session_state.query_result:
    st.subheader("Query Results:")
    df = pd.DataFrame(st.session_state.query_result)
    st.dataframe(df)
    
    # Data visualization
    st.subheader("Data Visualization")
    if len(df.columns) >= 2:
        col1, col2 = st.columns(2)
        with col1:
            chart_type = st.selectbox("Select chart type:", ["Bar", "Line", "Scatter"], key="chart_type")
        with col2:
            x_axis = st.selectbox("Select X-axis:", df.columns, key="x_axis")
            y_axis = st.selectbox("Select Y-axis:", [col for col in df.columns if col != x_axis], key="y_axis")
        
        if chart_type == "Bar":
            fig = px.bar(df, x=x_axis, y=y_axis)
        elif chart_type == "Line":
            fig = px.line(df, x=x_axis, y=y_axis)
        else:
            fig = px.scatter(df, x=x_axis, y=y_axis)
        
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Not enough columns for visualization. Query result should have at least two columns.")

# Additional features
st.sidebar.subheader("Additional Features")

# Query history
if st.sidebar.button("Show Query History"):
    st.sidebar.subheader("Query History")
    for idx, query in enumerate(st.session_state.query_history):
        st.sidebar.text(f"{idx + 1}. {query[:50]}...")

# Clear history
if st.sidebar.button("Clear History"):
    st.session_state.query_history = []
    st.sidebar.success("History cleared!")

# Help section
with st.sidebar.expander("Help"):
    st.markdown("""
    **How to use:**
    1. Enter your query in natural language in the text area.
    2. Click 'Generate SQL' to convert it to SQL and see results.
    3. Explore the generated SQL, query results, and data visualizations.
    4. Use additional features in the sidebar to manage your queries.
    5. Select a table from the dropdown to view its schema.
    """)

# Footer
st.markdown("---")
st.markdown("Created by Sai Varshith")