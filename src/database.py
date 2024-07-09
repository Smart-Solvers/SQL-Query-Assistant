# 3rd party
import pymysql

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
