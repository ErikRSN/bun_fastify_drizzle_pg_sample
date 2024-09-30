from flask import Flask, request, jsonify, render_template
from transformers import pipeline

# Initialize Flask app
app = Flask(__name__)

# Load a pre-trained NER model
nlp = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

# Common business types for fallback when the NER model misses it
business_types = ["coiffeur", "restaurant", "bakery", "bar", "gym", "cafe"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/parse_query', methods=['POST'])
def parse_query():
    # Get the query from the POST request
    data = request.json
    query = data.get('query')

    if not query:
        return jsonify({'error': 'Query not provided'}), 400

    # Use the Hugging Face model to perform Named Entity Recognition (NER)
    ner_results = nlp(query)

    # DEBUG: Print the raw output from the NER model
    print(ner_results)

    # Extract relevant entities (like location, business type)
    structured_data = {
        'business_type': None,
        'location': None
    }

    # Extract detected entities
    for entity in ner_results:
        if 'LOC' in entity['entity']:  # If it's a location
            structured_data['location'] = entity['word']
        if 'ORG' in entity['entity']:  # If it's an organization, treat it as a business type
            structured_data['business_type'] = entity['word']

    # Fallback: If no business type is detected, check the query for common business types
    if not structured_data['business_type']:
        for business in business_types:
            if business in query.lower():
                structured_data['business_type'] = business
                break

    # Return the structured data as a JSON response
    return jsonify(structured_data)

# Run the Flask app
if __name__ == '__main__':
    app.run(port=5000, debug=True)
