from pydantic import BaseModel
from typing import Any, List, Dict

class LoginRequest(BaseModel):
    host: str
    username: str
    password: str

class DatabaseConnectionInfo(BaseModel):
    host: str
    username: str
    password: str

class QueryRequest(BaseModel):
    database: str
    query: str

class QueryResponse(BaseModel):
    sql_query: str
    response: List[Dict[str, Any]]