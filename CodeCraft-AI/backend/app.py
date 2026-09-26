"""
app.py
------
Flask entry point for the CodeCraft AI backend.

Routes:
  GET  /api/health          -> simple check that the server is running
  POST /api/generate        -> generate code + explanation for a prompt/language
  GET  /api/history         -> list previous generations (summary only)
  GET  /api/history/<id>    -> full details of one previous generation
"""

import os

from dotenv import load_dotenv

load_dotenv()  # load backend/.env before anything else reads os.environ

from flask import Flask, jsonify, request
from flask_cors import CORS

from models import (
    get_all_generations,
    get_generation_by_id,
    init_db,
    save_generation,
)
from services.ai_service import generate_code

app = Flask(__name__)

# The React dev server runs on :5173, the Flask API on :5000 — CORS must
# allow that origin or the browser will block every request.
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

init_db()


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}
    prompt = (data.get("prompt") or "").strip()
    language = (data.get("language") or "").strip()

    if not prompt:
        return jsonify({"success": False, "error": "Please enter a programming requirement."}), 400

    if not language:
        return jsonify({"success": False, "error": "Please select a programming language."}), 400

    try:
        code, explanation = generate_code(prompt, language)
    except Exception as error:  # noqa: BLE001 - never let an AI/provider error crash the request
        print(f"[app] /api/generate error: {error}")
        return jsonify({"success": False, "error": "Unable to generate code. Please try again."}), 500

    if not code:
        return jsonify({"success": False, "error": "Unable to generate code. Please try again."}), 500

    try:
        save_generation(prompt, language, code, explanation)
    except Exception as error:  # noqa: BLE001 - a failed save shouldn't hide a successful generation
        print(f"[app] Failed to save generation to the database: {error}")

    return jsonify({"success": True, "code": code, "explanation": explanation})


@app.route("/api/history", methods=["GET"])
def history():
    items = get_all_generations()
    return jsonify({"success": True, "history": items})


@app.route("/api/history/<int:generation_id>", methods=["GET"])
def history_detail(generation_id):
    item = get_generation_by_id(generation_id)
    if not item:
        return jsonify({"success": False, "error": "Generation not found."}), 404
    return jsonify({"success": True, "generation": item})


if __name__ == "__main__":
    port = int(os.environ.get("FLASK_PORT", 5000))
    app.run(debug=True, port=port)
