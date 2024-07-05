import requests
from appp.database import get_database_schema

API_URL = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct"
API_TOKEN = "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"

headers = {"Authorization": f"Bearer {API_TOKEN}"}

def generate_sql_query(user_input: str) -> str:
    schema = get_database_schema()
    
    schema_str = "Database Schema:\n"
    for table, columns in schema.items():
        schema_str += f"Table: {table}\n"
        for column in columns:
            schema_str += f"  - {column['Column Name']} ({column['Data Type']})\n"
        
    prompt = f"""Given the following Database schema:

{schema_str}
    
Translate the following natural language query into a Single MySQL query. Only output the SQL query, nothing else.

User input: {user_input}

SQL query:"""

    data = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 200,
            "return_full_text": False,
            "do_sample": False,
            "temperature": 0.1
        }
    }
    
    response = requests.post(API_URL, headers=headers, json=data)
    if response.status_code != 200:
        raise Exception(f"Request failed: {response.status_code}, {response.text}")
    
    response_json = response.json()
    sql_query = response_json[0]['generated_text'].strip()
    
    print("RAWWWW: ", sql_query)
    # Remove any explanatory text before or after the SQL query
    # sql_lines = [line for line in sql_query.split('\n') if line.strip().upper().startswith(('SELECT', 'WITH'))]
    # sql_query = '\n'.join(sql_lines)
    
    sql_queries = sql_query.split(';')
    sql_query = sql_queries[0].strip() if sql_queries else ""
    
    print(sql_query)
        
    return sql_query


# import requests

# API_URL = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct"
# API_TOKEN = "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"

# headers = {"Authorization": f"Bearer {API_TOKEN}"}

# def generate_sql_query(user_input: str) -> str:
#     prompt = f"""Generate a single MySQL query to answer the following question or perform the requested action. Only output the SQL query, nothing else.

# User input: {user_input}

# MySQL query:"""

#     data = {
#         "inputs": prompt,
#         "parameters": {
#             "max_new_tokens": 200,
#             "return_full_text": False,
#             "do_sample": False,
#             "temperature": 0.1
#         }
#     }
    
#     response = requests.post(API_URL, headers=headers, json=data)
#     if response.status_code != 200:
#         raise Exception(f"API request failed: {response.status_code}, {response.text}")
    
#     response_json = response.json()
#     sql_query = response_json[0]['generated_text'].strip()
    
#     # Basic validation of the generated query
#     # valid_keywords = ('SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP')
#     # if not any(sql_query.upper().startswith(keyword) for keyword in valid_keywords):
#     #     raise ValueError("Invalid SQL query generated")
    
#     sql_lines = [line for line in sql_query.split('\n') if line.strip().upper().startswith(('SELECT', 'WITH'))]
#     sql_query = '\n'.join(sql_lines)
    
#     return sql_query