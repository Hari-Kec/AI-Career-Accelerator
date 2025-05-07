from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import threading

app = Flask(__name__)

# This allows ALL origins and methods (good for dev, restrict later for prod)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.route('/')
def home():
    return "LinkedIn Bot API is running!"

@app.route('/run', methods=['POST', 'OPTIONS'])
def trigger_bot():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight OK'})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response

    # Get user_id from request body
    data = request.json
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    def run_bot():
        subprocess.run(["python", "runAiBot.py", "--user_id", user_id])

    thread = threading.Thread(target=run_bot)
    thread.start()

    response = jsonify({"status": "Bot started", "user_id": user_id})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200

if __name__ == '__main__':
    app.run(debug=True)
