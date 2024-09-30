from flask import Flask, request, jsonify, render_template
from transformers import pipeline

# Initialize Flask app
app = Flask(__name__)

# Load Hugging Face NER pipeline (multilingual model)
# You can change the model to one that supports specific languages if needed
nlp = pipeline("ner", model="xlm-roberta-base")

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

    # Extract relevant entities (like location, business type)
    structured_data = {
        'business_type': None,
        'location': None
    }

    for entity in ner_results:
        if entity['entity'] == 'B-LOC':  # Location entity
            structured_data['location'] = entity['word']
        if entity['entity'] == 'B-MISC':  # Business/service type entity
            structured_data['business_type'] = entity['word']

    # Return the structured data as a JSON response
    return jsonify(structured_data)

# Run the Flask app
if __name__ == '__main__':
    app.run(port=5000, debug=True)