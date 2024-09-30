# code

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run app.js
```

This project was created using `bun init` in bun v1.1.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

This project is a starter for using bun with Fastify, PostgreSQL, Drizzle-orm in a easy to use complete solution to quickly launch a server that already works.

By default it uses pdkf2 for hashing passwords with iteration count=1000. This also matches with the way passwords are saved in web2py and py4web. This started as a migration project.

I have included a sample database dump to get you started. To use it set up PostgreSQL server, create a database named "sample". Then run the following command:

pg_restore -h <hostname> -p <port, default is 5432> -U <userid> -W --verbose --dbname=<sample or whatever name you have used> <dumpfile>

Once loaded confirm that there are 3 tables and data is in users and sample. That should get you started.

To start use the email testuser@example.com, password: testpass to log in.

Actions available:

localhost:3000/login
localhost:3000/register
localhost:3000/logout

localhost:3000/sample/getall
localhost:3000?sample/addone

////////////////////////////////////

# Multilingual Search Tool with Fastify, Bun, Hugging Face, and PostgreSQL

## Project Overview

This project is a multilingual search tool that processes unstructured user queries and returns relevant results from a PostgreSQL database. The tool is built using the following technologies:

- **Bun**: Fast JavaScript runtime for handling server-side code.
- **Fastify**: Lightweight web framework to handle API routes.
- **Drizzle ORM**: Object-relational mapper to interact with the PostgreSQL database.
- **PostgreSQL**: Database to store products, services, and location data.
- **Hugging Face Transformers**: To process unstructured queries, extract meaningful data (e.g., service types, locations), and handle multilingual input.
- **Python Flask API**: Runs Hugging Face models and provides entity extraction capabilities.

## Goals

1. **Multilingual Search**: Accept user queries in different languages (e.g., French, German, Italian, English) and process them correctly.
2. **Unstructured to Structured Data**: Convert unstructured search input into structured data (service types and locations).
3. **Database Querying**: Use structured data to search a PostgreSQL database for matching results.
4. **Entity Recognition**: Use Hugging Face Transformers to extract business types and locations from the user's query.
5. **Fast and Efficient**: Ensure that the search is fast and responsive using Bun, Fastify, and Hugging Face.

## Project Architecture

1. **Fastify Backend**: Handles user input and routes requests.
2. **Python Flask API**: Processes queries using Hugging Face's multilingual models to extract structured data (e.g., NER).
3. **PostgreSQL Database**: Stores products/services and location data. Queries are made using Drizzle ORM from Fastify.
4. **Hugging Face Transformers**: Used for named entity recognition (NER) to extract structured information from unstructured queries in multiple languages.
5. **Google Translate API**: Translates queries to English.

## Project Setup

### 1. Install Dependencies

First, ensure you have Bun installed. Then, install the following dependencies:

- **Fastify**: For handling routes and API requests.
- **Drizzle ORM**: For interacting with PostgreSQL.
- **PostgreSQL**: To store and query data.
- **Langdetect**: For detecting the language of the search query.
- **Google Translate API**: For translating non-English queries to English.
- **Fetch**: For making HTTP requests between Fastify and the Python API.

### 2. Virtual environment and dependencies

Install virtual environment and dependencies for python:

````bash pip install virtualenv


```bash source venv/Scripts/activate


```bash pip install flask transformers torch

```bash pip install -r requirements.txt

### 3. Run the Flask API

python app.py
````
