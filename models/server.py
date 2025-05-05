from flask import Flask, jsonify
import subprocess
import threading
from flask_cors import CORS 

app = Flask(__name__)
CORS(app, resources={
    r"/run-resume-optimizer": {
        "origins": "http://localhost:5173",
        "methods": ["GET"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/run-resume-optimizer', methods=['GET'])
def run_resume_optimizer():
    try:
        def run_streamlit():
            subprocess.run(['streamlit', 'run', 'models/app.py'])
        
        thread = threading.Thread(target=run_streamlit)
        thread.daemon = True  # This makes the thread exit when main program exits
        thread.start()
        
        return jsonify({
            'status': 'success',
            'message': 'Streamlit app is starting...',
            'url': 'http://localhost:8501'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)