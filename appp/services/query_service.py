class QueryService:
    def __init__(self, db):
        self.db = db

    def get_data(self, query):
        try:
            with self.db.cursor() as cursor:
                cursor.execute(query)
                result = cursor.fetchall()
            self.db.close()
            return result

        except Exception as e:
            print(f"Error Executing SQL query: {e}")
