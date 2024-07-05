import pymysql

# Database configuration
DB_HOST = 'localhost'
DB_USER = 'sai'
DB_PASSWORD = 'password'
DB_NAME = 'my_db'

def get_database_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )


def get_database_schema():
    schema = {}
    try:
        connection = get_database_connection()
        with connection.cursor() as cursor:

            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            
            for table in tables:
                table_name = table[f'Tables_in_{DB_NAME}']
                schema[table_name] = []
                
                cursor.execute(f"DESCRIBE {table_name}")
                columns = cursor.fetchall()
                for column in columns:
                    schema[table_name].append({
                        'Column Name': column['Field'],
                        'Data Type': column['Type']
                    })
    except Exception as e:
        print(f"Error fetching database schema: {e}")
    finally:
        connection.close()
    return schema