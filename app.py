from flask import Flask, request, jsonify, render_template
from transformers import pipeline

# Initialize Flask app
app = Flask(__name__)

# Load a pre-trained NER model (switching to a more specific NER model)
nlp = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

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

    # Check the actual entity labels returned by the model and update conditions accordingly
    for entity in ner_results:
        print(f"Entity: {entity['word']}, Label: {entity['entity']}")
        if 'LOC' in entity['entity']:  # Location entity label (update if necessary)
            structured_data['location'] = entity['word']
        if 'MISC' in entity['entity'] or 'ORG' in entity['entity']:  # Business/service type entity label
            structured_data['business_type'] = entity['word']

    # Return the structured data as a JSON response
    return jsonify(structured_data)

# Run the Flask app
if __name__ == '__main__':
    app.run(port=5000, debug=True)
