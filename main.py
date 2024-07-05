from fastapi import FastAPI, HTTPException, Depends
from appp.database import get_database_connection
from appp.schemas import QueryRequest, QueryResponse
from appp.services.query_service import QueryService
from appp.services.llm_service import generate_sql_query
from appp.utils.preprocessing import preprocess_query

app = FastAPI()

@app.post("/query", response_model=QueryResponse)
async def query_data(request: QueryRequest, db=Depends(get_database_connection)):
    query_service = QueryService(db)
    # llm_service = LLMService()

    try:
        # print(request.query)
        generated_query = generate_sql_query(request.query)
        
        # print(generated_query)

        processed_query = preprocess_query(generated_query)

        # print(processed_query)
        response = query_service.get_data(processed_query)

        return QueryResponse(response=response)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)