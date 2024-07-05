from pydantic import BaseModel
from typing import Any

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    response: Any