# 3rd party
from pydantic import BaseModel

# in-built
from typing import Any


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    response: Any
