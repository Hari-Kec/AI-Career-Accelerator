from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import threading

app = Flask(__name__)

# Allow CORS from your local frontend only
CORS(app, origins="*", supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

@app.route('/')
def home():
    return "LinkedIn Bot API is running!"

@app.route('/run', methods=['POST'])  # change to POST if your React code uses POST
def trigger_bot():
    def run_bot():
        subprocess.run(["python", "runAiBot.py"])
    threading.Thread(target=run_bot).start()
    return jsonify({"status": "Bot started successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
