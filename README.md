# Hallucinations Backend

This repository contains the backend server for a research project investigating AI hallucinations. The primary purpose of this application is to support a user study by managing data collection through surveys, creativity tests, and interactions with an AI chatbot.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js, used to build the REST API.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: ODM library for MongoDB and Node.js.
- **OpenAI**: Node.js library for interacting with the OpenAI API.
- **dotenv**: Module to load environment variables from a `.env` file.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **xlsx**: Library for reading and writing spreadsheet files (specifically for `Patent_Data.xlsx`).

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/) (which includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community) (or access to a MongoDB Atlas cluster)

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd hallucinations-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a `.env` file in the root of the project and add the following environment variables:

    ```
    MONGODB_URI=<your_mongodb_connection_string>
    OPENAI_API_KEY=<your_openai_api_key>
    PORT=5000
    ```

## Running the Application

-   **Development Mode**: To run the server with nodemon for automatic restarts on file changes:
    ```bash
    npm run dev
    ```

-   **Production Mode**: To run the server in production:
    ```bash
    npm start
    ```

The server will be running at `http://localhost:5000`.

## Project Structure

```
.
├── data/
│   └── Patent_Data.xlsx      # Spreadsheet with patent data.
├── models/                   # Mongoose schemas for MongoDB collections.
├── routes/                   # API route definitions.
├── .env.example              # Example environment variables.
├── .gitignore
├── db.js                     # MongoDB connection logic.
├── package.json
├── README.md
├── server.js                 # Main application entry point.
└── vercel.json               # Configuration for Vercel deployment.
```

## API Endpoints

The following are the API endpoints available in this application. All endpoints are prefixed with `/api`.

### Survey Endpoints

#### `POST /PreSurvey`
-   **Description**: Submits the pre-study survey data.
-   **Request Body**: An object containing the pre-survey responses.
-   **Response**: A success message and the ID of the created survey document.

#### `POST /PostSurvey`
-   **Description**: Submits the post-study survey data.
-   **Request Body**: An object containing the post-survey responses, including a `preSurveyId`.
-   **Response**: A success message and the ID of the created survey document.

### Alternate Uses Test (AUT) Endpoints

#### `POST /AUT`
-   **Description**: Submits the results of the Alternate Uses Test (AUT) for a user.
-   **Request Body**:
    ```json
    {
      "useCases": ["string"],
      "preSurveyId": "string",
      "object": "string"
    }
    ```
-   **Response**: The created AUT document.

#### `POST /AUT_gpt`
-   **Description**: Submits the results of the AUT performed with GPT.
-   **Request Body**:
    ```json
    {
      "useCases": ["string"],
      "preSurveyId": "string",
      "round": "number",
      "object": "string",
      "temperature": "number",
      "task": "number"
    }
    ```
-   **Response**: The created AUT GPT document.

### Patent Endpoints

#### `GET /patents`
-   **Description**: Retrieves all patents from the database.

#### `GET /patents/category/:category`
-   **Description**: Retrieves all patents within a specific category.

#### `POST /patent-assignment`
-   **Description**: Assigns a set of patents to a user based on their `preSurveyId`. This is typically called after the pre-survey is submitted.
-   **Request Body**:
    ```json
    {
      "preSurveyId": "string"
    }
    ```
-   **Response**: The patent assignment document, populated with patent details.

#### `GET /patent-assignment/:preSurveyId`
-   **Description**: Retrieves the patent assignment for a specific user.

#### `GET /patent-for-task/:preSurveyId/:taskNumber`
-   **Description**: Retrieves the specific patent and hallucination level for a given task number.

### Chatbot Endpoints

#### `POST /chatbotmessages`
-   **Description**: Saves the chat messages from a user's interaction with the chatbot for a specific task.
-   **Request Body**:
    ```json
    {
      "preSurveyId": "string",
      "task": "number",
      "round": "number",
      "chatMessages": ["object"]
    }
    ```
-   **Response**: A confirmation object including the saved document.

### OpenAI Proxy

#### `POST /openai`
-   **Description**: Acts as a proxy to the OpenAI Chat Completions API to avoid exposing the API key on the client-side.
-   **Request Body**:
    ```json
    {
      "messages": ["object"],
      "config": {
        "temperature": "number",
        "top_p": "number",
        "max_tokens": "number"
      }
    }
    ```
-   **Response**: The response from the OpenAI API.

## Deployment

This application is configured for deployment on [Vercel](https://vercel.com/). The `vercel.json` file contains the necessary configuration for serverless deployment. When deploying to Vercel, ensure that the environment variables (`MONGODB_URI`, `OPENAI_API_KEY`) are set in the project settings.
