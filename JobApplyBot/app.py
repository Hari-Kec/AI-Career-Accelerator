from flask import Flask, jsonify, request
import subprocess
import threading
import os

app = Flask(__name__)

# Global variable to track if bot is running
bot_process = None
bot_output = []

@app.route('/api/run-bot', methods=['POST'])
def run_bot():
    global bot_process

    if bot_process and bot_process.poll() is None:
        return jsonify({"status": "error", "message": "Bot is already running"}), 400

    def run_script():
        global bot_process, bot_output
        try:
            print("Starting bot...")
            process = subprocess.Popen(
                ['python', 'runAiBot.py'],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True
            )
            bot_process = process

            # Stream output line by line
            for line in iter(process.stdout.readline, ''):
                line = line.strip()
                print(line)
                bot_output.append(line)

            process.stdout.close()
            process.wait()

        except Exception as e:
            bot_output.append(f"Error starting bot: {str(e)}")
            print("Error:", e)

    # Run in background thread
    thread = threading.Thread(target=run_script)
    thread.start()

    return jsonify({"status": "started"})

@app.route('/api/bot-status', methods=['GET'])
def bot_status():
    global bot_process, bot_output

    status = {
        "running": bot_process is not None and bot_process.poll() is None,
        "output": bot_output
    }

    return jsonify(status)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)