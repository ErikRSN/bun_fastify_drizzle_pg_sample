Multilingual Search Tool with Fastify, Bun, Hugging Face, and PostgreSQL
Project Overview

This project is a multilingual search tool that processes unstructured user queries and returns relevant results from a PostgreSQL database. The tool is built using the following technologies:

    Bun: Fast JavaScript runtime for handling server-side code.
    Fastify: Lightweight web framework to handle API routes.
    Drizzle ORM: Object-relational mapper to interact with the PostgreSQL database.
    PostgreSQL: Database to store products, services, and location data.
    Hugging Face Transformers: To process unstructured queries, extract meaningful data (e.g., service types, locations), and handle multilingual input.
    Python Flask API: Runs Hugging Face models and provides entity extraction capabilities.

Goals

    Multilingual Search: Accept user queries in different languages (e.g., French, German, Italian, English) and process them correctly.
    Unstructured to Structured Data: Convert unstructured search input into structured data (service types and locations).
    Database Querying: Use structured data to search a PostgreSQL database for matching results.
    Entity Recognition: Use Hugging Face Transformers to extract business types and locations from the user's query.
    Fast and Efficient: Ensure that the search is fast and responsive using Bun, Fastify, and Hugging Face.

Project Architecture

    Fastify Backend: Handles user input and routes requests.
    Python Flask API: Processes queries using Hugging Face's multilingual models to extract structured data (e.g., NER).
    PostgreSQL Database: Stores products/services and location data. Queries are made using Drizzle ORM from Fastify.
    Hugging Face Transformers: Used for named entity recognition (NER) to extract structured information from unstructured queries in multiple languages.
    Google Translate API: Translates queries to English if needed.

Project Setup

1. Install Dependencies for Bun and Fastify

Ensure Bun is installed and then install the necessary dependencies for Fastify, Drizzle ORM, and PostgreSQL.

Run the following to install the dependencies for the Bun-Fastify setup.

This will install dependencies such as Fastify, Drizzle ORM, and PostgreSQL integration.

You can then run the Fastify server with the relevant command. 2. Set up PostgreSQL Database

    Set up a PostgreSQL server.

    Create a database named "sample."

    Restore the sample database using the provided dump file.

    Verify that three tables (users, sample, etc.) have been restored with data.

    Use the credentials (testuser@example.com, testpass) to log in and test the initial setup.

Python Flask API with Hugging Face

1. Set Up Virtual Environment and Install Dependencies

Set up a virtual environment for the Flask API and install dependencies for Hugging Face and transformers.

Install virtualenv and activate the virtual environment.

Then install the required Python packages.

Alternatively, install dependencies from requirements.txt if provided. 2. Run the Flask API

Once all dependencies are installed, you can run the Flask API that integrates with Hugging Face transformers for NER processing.

Run the Flask API using the relevant command. 3. Flask API Overview

The Flask API uses Hugging Face's transformers to perform Named Entity Recognition (NER) on user input. The API extracts structured data such as locations (e.g., "Zurich") and business types (e.g., "coiffeur").

    The NER model used is dbmdz/bert-large-cased-finetuned-conll03-english for multilingual recognition.
    The API takes unstructured queries and returns structured data that Fastify uses to query the PostgreSQL database.

Actions Available

Here are some of the endpoints available once the project is up and running:

    Authentication and Sample Data:
        localhost:3000/login: Login endpoint.
        localhost:3000/register: Register endpoint.
        localhost:3000/logout: Logout endpoint.
        localhost:3000/sample/getall: Fetch all sample data.
        localhost:3000/sample/addone: Add one entry to the sample data.

    Multilingual Search API:
        Flask API running on localhost:5000/parse_query: Accepts unstructured queries and returns structured data (business type, location).
        Example query: POST localhost:5000/parse_query with body { "query": "coiffeur in Zurich" }.

Testing Multilingual Search

Here are some sample unstructured queries you can use to test the multilingual search functionality:

    "I am looking for a restaurant in Geneva"
        Expected Output: {"business_type": "restaurant", "location": "Geneva"}

    "Find a gym in Zurich"
        Expected Output: {"business_type": "gym", "location": "Zurich"}

    "Is there a coiffeur near Lausanne?"
        Expected Output: {"business_type": "coiffeur", "location": "Lausanne"}

Use these queries via the Flask API, and ensure that the extracted structured data is correctly processed by Fastify and PostgreSQL to return the relevant results.
Additional Notes

    Model Fine-tuning: The NER model (dbmdz/bert-large-cased-finetuned-conll03-english) is pre-trained for multilingual tasks. For improved accuracy on specific business types, you may consider fine-tuning the model or expanding the fallback business type dictionary in the Flask API.
    Deployment: For production, replace Flask’s built-in server with a WSGI server such as Gunicorn. Use SSL for secure communication.
