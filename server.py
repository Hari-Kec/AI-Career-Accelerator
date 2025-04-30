from flask import Flask, jsonify
import subprocess
import threading
from flask_cors import CORS 
app = Flask(__name__)
CORS(app)


@app.route('/run-resume-optimizer', methods=['GET'])
def run_resume_optimizer():
    def run_streamlit():
        # Path to your Streamlit app
        subprocess.run(['streamlit', 'run', 'models/app.py'])
    
    # Run in a separate thread to avoid blocking
    thread = threading.Thread(target=run_streamlit)
    thread.start()
    
    return jsonify({'status': 'Streamlit app is starting...'})

if __name__ == '__main__':
    app.run(port=5000)