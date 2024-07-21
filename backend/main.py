from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from src.database import get_databases, get_database_connection
from src.schemas import QueryRequest, QueryResponse, LoginRequest, DatabaseConnectionInfo
from src.services.query_service import QueryService
from src.services.llm_service import generate_sql_query
from src.utils.preprocessing import preprocess_query

app = FastAPI()

security = HTTPBasic()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login")
async def login(login_request: LoginRequest):
    try:
        connection = get_database_connection(
            login_request.host,
            login_request.username,
            login_request.password
        )
        print(connection)
        connection.close()
        return {"message": "Login successful"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/databases")
async def list_databases(credentials: HTTPBasicCredentials = Depends(security)):
    try:
        databases = get_databases("localhost", credentials.username, credentials.password)
        return databases
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=QueryResponse)
async def query_data(request: QueryRequest, credentials: HTTPBasicCredentials = Depends(security),
                     x_host: str = Header(..., alias="X-Host")):
    try:
        db = get_database_connection(x_host, credentials.username, credentials.password, request.database)
        query_service = QueryService(db)

        generated_query = generate_sql_query(request.query, request.database, {
            "host": "localhost",
            "user": credentials.username,
            "password": credentials.password
        })

        processed_query = preprocess_query(generated_query)

        response = query_service.get_data(processed_query)

        return QueryResponse(sql_query=processed_query, response=response)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)