from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import threading

app = Flask(__name__)

# Allow CORS from your local frontend only
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "https://0881-103-218-133-171.ngrok-free.app"]}}, supports_credentials=True)


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
