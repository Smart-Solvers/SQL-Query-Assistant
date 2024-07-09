# 3rd party
from fastapi import FastAPI, HTTPException, Depends

# custom
from src.database import get_database_connection
from src.schemas import QueryRequest, QueryResponse
from src.services.query_service import QueryService
from src.services.llm_service import generate_sql_query
from src.utils.preprocessing import preprocess_query

app = FastAPI()


@app.post("/query", response_model=QueryResponse)
async def query_data(
    request: QueryRequest, db=Depends(get_database_connection)
):
    query_service = QueryService(db)

    try:
        generated_query = generate_sql_query(request.query)

        processed_query = preprocess_query(generated_query)

        response = query_service.get_data(processed_query)

        return QueryResponse(response=response)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
