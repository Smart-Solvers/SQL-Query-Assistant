

# def preprocess_query(raw_query):
#     return raw_query
#     # pass

# def preprocess_query(raw_query):
    
#     print("RAW: ", raw_query)
#     # Split the query at the first semicolon and take only the first part
#     cleaned_query = raw_query.split(';')[0]
    
#     # Remove any leading/trailing whitespace
#     cleaned_query = cleaned_query.strip()
    
#     # Add the semicolon back to the end of the query
#     cleaned_query += ';'
    
#     print("CLEANED: ", cleaned_query)
    
#     return cleaned_query


import re

def preprocess_query(raw_query):
    print("RAW: ", raw_query)
    
    cleaned_query = re.sub(r'```(?:sql)?|```', '', raw_query)
    
    sql_keywords = r'\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|WITH)\b'
    match = re.search(sql_keywords, cleaned_query, re.IGNORECASE)
    if match:
        cleaned_query = cleaned_query[match.start():]
    
    cleaned_query = cleaned_query.split(';')[0]
    
    cleaned_query = re.sub(r'--.*$', '', cleaned_query, flags=re.MULTILINE)
    cleaned_query = re.sub(r'/\*[\s\S]*?\*/', '', cleaned_query)
    
    cleaned_query = cleaned_query.strip()
    
    cleaned_query += ';'
    
    cleaned_query = re.sub(r'\s+', ' ', cleaned_query)
        
    return cleaned_query