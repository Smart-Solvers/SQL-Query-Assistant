# custom
from src.config.log_handler import logger


class QueryService:
    def __init__(self, db) -> None:
        self.db = db

    def get_data(self, query) -> None:
        try:
            with self.db.cursor() as cursor:
                cursor.execute(query)
                result = cursor.fetchall()
            return result

        except Exception as e:
            logger.log_error(f"Error Executing SQL query: {e}")
            raise

        finally:
            self.db.close()
