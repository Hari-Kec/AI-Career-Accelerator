from flask import Flask, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)  # Allow all origins for now (tighten later)

@app.route('/run-resume-optimizer', methods=['POST'])  # Change to POST
def run_resume_optimizer():
    try:
        # Just return the Streamlit URL - don't try to start it here
        return jsonify({
            'status': 'success',
            'message': 'Streamlit app is ready',
            'url': 'https://ai-career-accelerator-1.onrender.com'  # Your deployed Streamlit URL
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)