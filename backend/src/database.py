# 3rd party
import pymysql
from fastapi.security import HTTPBasicCredentials

# custom
from src.config.log_handler import logger


def get_database_connection(host, user, password, database=None):
    return pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=database,
        cursorclass=pymysql.cursors.DictCursor,
    )


def get_databases(host, user, password):
    system_databases = [
        "information_schema",
        "performance_schema",
        "mysql",
        "sys",
    ]
    connection = get_database_connection(host, user, password)
    try:
        with connection.cursor() as cursor:
            cursor.execute("SHOW DATABASES")
            databases = [
                db["Database"]
                for db in cursor.fetchall()
                if db["Database"] not in system_databases
            ]
        return databases
    finally:
        connection.close()


def get_database_schema(database, host, user, password):
    schema = {}
    try:
        connection = get_database_connection(host, user, password, database)
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()

            for table in tables:
                table_name = table[f"Tables_in_{database}"]
                schema[table_name] = []

                cursor.execute(f"DESCRIBE {table_name}")
                columns = cursor.fetchall()
                for column in columns:
                    schema[table_name].append(
                        {
                            "Column Name": column["Field"],
                            "Data Type": column["Type"],
                        }
                    )
    except Exception as e:
        logger.log_error(f"Error fetching database schema: {e}")
        raise
    finally:
        connection.close()
    return schema

def post_database(
    host: str,
    credentials: HTTPBasicCredentials,
    database: str,
    user_query: str,
    processed_query: str,
    response: str,
):
    try:
        response = str(response)
        connection = get_database_connection(
            host, credentials.username, credentials.password, database
        )
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO sql_assistant.query_table (user_name, user_input, processed_query, response)
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(
                sql,
                (credentials.username, user_query, processed_query, response),
            )
            connection.commit()

    except pymysql.MySQLError as e:
        logger.log_info(f"Insertion failed, chat skipped!! {e}")
        return

    finally:
        connection.close()
