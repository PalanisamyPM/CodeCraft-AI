from flask import Flask, request, jsonify
from flask_cors import CORS
from services.ai_service import (
    generate_code,
    explain_code,
    debug_code,
    optimize_code,
    generate_test_cases
)

app = Flask(__name__)

CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "CodeCraft AI Backend is running!"
    })


@app.route("/api/generate", methods=["POST"])
def generate():

    data = request.json

    prompt = data.get("prompt")
    language = data.get("language")
    framework = data.get("framework", "None")

    if not prompt:
        return jsonify({
            "success": False,
            "error": "Requirement is required"
        }), 400

    try:

        result = generate_code(
            prompt,
            language,
            framework
        )

        return jsonify({
            "success": True,
            "result": result
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/explain", methods=["POST"])
def explain():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "No data received"
            }), 400

        code = data.get("code", "").strip()
        language = data.get("language", "Python")

        if not code:

            return jsonify({
                "success": False,
                "error": "No code provided"
            }), 400

        print("\n==============================")
        print("CODE EXPLANATION REQUEST")
        print("==============================")
        print("Language:", language)

        result = explain_code(
            code,
            language
        )

        print("==============================")
        print("EXPLANATION GENERATED")
        print("==============================\n")

        return jsonify({
            "success": True,
            "explanation": result
        })

    except Exception as e:

        print("EXPLANATION ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/debug", methods=["POST"])
def debug():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "No data received"
            }), 400

        code = data.get("code", "").strip()
        language = data.get("language", "Python")

        if not code:
            return jsonify({
                "success": False,
                "error": "No code provided"
            }), 400

        print("\n==============================")
        print("CODE DEBUG REQUEST")
        print("==============================")
        print("Language:", language)

        result = debug_code(code, language)

        print("==============================")
        print("DEBUG COMPLETED")
        print("==============================\n")

        return jsonify({
            "success": True,
            "result": result
        })

    except Exception as e:

        print("DEBUG ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/optimize", methods=["POST"])
def optimize():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "No data received"
            }), 400

        code = data.get("code", "").strip()
        language = data.get("language", "Python")

        if not code:
            return jsonify({
                "success": False,
                "error": "No code provided"
            }), 400

        print("\n==============================")
        print("⚡ CODE OPTIMIZATION REQUEST")
        print("==============================")
        print("Language:", language)

        result = optimize_code(code, language)

        print("==============================")
        print("✅ OPTIMIZATION COMPLETED")
        print("==============================\n")

        return jsonify({
            "success": True,
            "result": result
        })

    except Exception as e:

        print("OPTIMIZATION ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/test-cases", methods=["POST"])
def test_cases():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "No data received"
            }), 400

        code = data.get("code", "").strip()
        language = data.get("language", "Python")

        if not code:
            return jsonify({
                "success": False,
                "error": "No code provided"
            }), 400

        print("\n==============================")
        print("🧪 TEST CASE GENERATION REQUEST")
        print("==============================")
        print("Language:", language)

        result = generate_test_cases(
            code,
            language
        )

        print("==============================")
        print("✅ TEST CASES GENERATED")
        print("==============================\n")

        return jsonify({
            "success": True,
            "result": result
        })

    except Exception as e:

        print(
            "TEST CASE ERROR:",
            str(e)
        )

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)