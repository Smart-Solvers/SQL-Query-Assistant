# AI SQL Query Assistant

The AI SQL Query Assistant is a powerful tool that enables users to interact with databases using natural language queries. This project combines a React frontend for a smooth user interface with a FastAPI backend for robust query processing.

## Table of Contents

1. [Features](#features)
2. [Prerequisities](#prerequisities)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
    - [Running the Backend Locally](#running-the-backend-locally)
    - [Running the React Frontend](#running-the-react-frontend)
5. [Project Structure](#project-structure)
6. [Usage](#usage)
7. [Contact Page](#contactpage)
8. [Deployment](#deployment)


## Features
* Natural language to SQL query conversion
* Interactive user interface for query input and results display
* Real-time query execution and response



## Installation

- Python 3.7+
- Node.js (version 14 or later recommended)
- npm (Node Package Manager)
- pip (Python Package Installer)


### Prerequisites


### Steps

1. Clone the repository:
    ```shell
    git clone https://github.com/Smart-Solvers/SQL-Query-Assistant.git
    cd SQL-Query-Assistant
    ```

2. Set up the backend:
    ```shell
    cd backend
    pip install -r requirements.txt
    ```

3. Set up the frontend:
    ```shell
    cd ../frontend
    npm install
    ```

## Running the Application


### Running the Backend

To host the FastAPI endpoint on your localhost:

1. Navigate to the backend directory:
    ```shell
    cd backend
    ```

2. Start the FASTAPI server:
    ```shell
    uvicorn main:app --reload
    ```
The backend will be available at http://localhost:8000.

### Running the React Frontend

To run the React application and connect it to the FastAPI endpoint:

1. In a new terminal, navigate to the frontend directory:
    ```shell
    cd frontend
    ```

2. Start the React development server:
    ```shell
    npm start
    ```
The application will open in your default browser at http://localhost:3000
## Project Structure

```plaintext
SQL-Query-Assistant/
├── backend/
│   ├── main.py               # FastAPI main application
│   ├── requirements.txt      # Python dependencies
│   └── ...                   # Other backend files and directories
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── index.js          # Entry point for the React application
|   |   |__ components/       # React components
│   │   └── ...               # Other React components and files
│   ├── public/
│   └── package.json          # Node.js dependencies and scripts
└── README.md                 # Project documentation
```

## Usage

## 1. Launching the Application

1. Ensure both the backend and frontend servers are running as described in the "Running the Application" section.
2. Open your web browser and navigate to http://localhost:3000


## 2. User Interface Overview

The main interface consists of several  components:

1. Home Page
2. Login Page
3. About Page
4. Contact Page

- In Home page Click on Get started, You will be redirected to the Login page
- User need to login with the username, host, password
- After login , the page will redirect to the Query Interface

The Query interface consists of several key components:

1. Database selection dropdown (if multiple databases are supported)
2. Query input field
3. Submit button
4. Results display area
5. History panel (for viewing past queries)

## 3. Entering a Query

1. select the target database from the dropdown menu.
2. In the main input field, type your question or request in natural language.

For example:

"Show me all the tables in the database"

"What were the total sales in Q1 of 2023?"

"List the top 5 products by revenue"

## 4.  Submitting the Query

* Click the "Send" button or press Enter to process your query.
* The application will display a loading indicator while processing.

## 5. Reviewing the Generated SQL

* Once processed, the application will show you the SQL query generated from your natural language input and the result of the query
* You can copy the sql query

## 6. Exporting Results
* You can download the results in the form of json file into your local, by clicking the download button

## 7. Query History

* Your past queries are saved in the history panel.
* Click on the chat, the history will be restored

## 7. Delete Query History
* you can also delete the query history by clicking the delete button next to the chat

## 8. Logging Out

* you can logout once you are done

## Contact Page

* Here you can give your feedback or any other information you would to dicuss with us
* Enter your name, email and the information and click on submit
* It will automatically sent the email to our mail_id
* In response you will receive a automatically generated email from our email

## Deployment

The AI SQL Query Assistant is now deployed and accessible online:

* Frontend: Deployed using Vercel
        - You can access the live application at https://query-assistant-7ggafgab6-pragnias-projects.vercel.app/

* Backend: Deployed using Render
        - The API is accessible at https://sql-query-assistant-5.onrender.com/docs