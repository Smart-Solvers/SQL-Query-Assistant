# in-built
import os

# 3rd party
import requests
from dotenv import load_dotenv

# custom
from src.database import get_database_schema


load_dotenv()

API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")

API_URL = (
    "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct"
)

headers = {"Authorization": f"Bearer {API_TOKEN}"}


def generate_sql_query(
    user_input: str, database: str, connection_params: dict
) -> str:
    schema = get_database_schema(database, **connection_params)

    schema_str = f"Database: {database}\nSchema:\n"
    for table, columns in schema.items():
        schema_str += f"Table: {table}\n"
        for column in columns:
            schema_str += (
                f"  - {column['Column Name']} ({column['Data Type']})\n"
            )

    prompt = f"""Given the following Database schema:

{schema_str}

Translate the following natural language query into a Single MySQL query.
Only output the SQL query, nothing else.

User input: {user_input}

SQL query:"""

    data = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 200,
            "return_full_text": False,
            "do_sample": False,
            "temperature": 0.1,
        },
    }

    response = requests.post(API_URL, headers=headers, json=data)
    if response.status_code != 200:
        raise Exception(
            f"Request failed: {response.status_code}, {response.text}"
        )

    response_json = response.json()
    sql_query = response_json[0]["generated_text"].strip()

    sql_queries = sql_query.split(";")
    sql_query = sql_queries[0].strip() if sql_queries else ""

    return sql_query
