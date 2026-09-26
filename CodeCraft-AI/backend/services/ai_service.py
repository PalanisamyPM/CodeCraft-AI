"""
services/ai_service.py
-----------------------
The ONLY file that knows how to talk to an AI provider. Keeping this
isolated means the rest of the backend (app.py) never needs to change if
you swap providers later — it just calls generate_code(prompt, language).

Behaviour:
  - If ANTHROPIC_API_KEY is set in the environment, real code + an
    explanation are generated using the Claude API.
  - If the key is missing (or the API call fails), a clearly-labelled
    demo/mock response is returned instead, so the rest of the app
    (saving to the DB, copy/download, history, etc.) can still be tested.
"""

import os
import json

try:
    from anthropic import Anthropic
except ImportError:  # the package may not be installed yet in demo mode
    Anthropic = None

API_KEY = os.environ.get("ANTHROPIC_API_KEY", "").strip()
MODEL_NAME = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5")

_client = Anthropic(api_key=API_KEY) if (API_KEY and Anthropic) else None

SYSTEM_PROMPT = """You are CodeCraft AI, a coding assistant built into a college web app.
A user will describe a programming requirement in plain English and name a
target programming language. Your job:

1. Write clean, correct, runnable source code in that language that solves
   the requirement. Include short inline comments where they help a
   beginner follow along.
2. Write a short, beginner-friendly explanation (3-6 sentences) of what the
   code does and how it works. Avoid unexplained jargon.

Respond with ONLY a single JSON object and nothing else — no markdown
fences, no commentary before or after it. Use exactly this shape:
{"code": "<the source code>", "explanation": "<the explanation>"}
"""


def generate_code(prompt, language):
    """Return (code, explanation) for the given requirement + language."""
    if _client is None:
        return _mock_generate(prompt, language)

    try:
        message = _client.messages.create(
            model=MODEL_NAME,
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"Programming language: {language}\nRequirement: {prompt}",
                }
            ],
        )
        raw_text = "".join(
            block.text for block in message.content if getattr(block, "type", None) == "text"
        )
        data = json.loads(_strip_code_fence(raw_text))
        code = (data.get("code") or "").strip()
        explanation = (data.get("explanation") or "").strip()

        if not code:
            raise ValueError("AI response did not contain any code")

        return code, explanation

    except Exception as error:  # noqa: BLE001 - any failure should fall back, not crash the request
        print(f"[ai_service] Falling back to demo mode, AI call failed: {error}")
        return _mock_generate(prompt, language)


def _strip_code_fence(text):
    """Remove ```json ... ``` fences in case the model adds them anyway."""
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
    return text.strip()


# ---------------------------------------------------------------------------
# Demo / mock mode — used whenever there is no API key or the API call fails.
# ---------------------------------------------------------------------------

_DEMO_NOTE = (
    "This is DEMO output. No ANTHROPIC_API_KEY was found (or the AI request "
    "failed), so CodeCraft AI generated this placeholder instead of calling "
    "the real model. Add a valid key to backend/.env and restart the "
    "server to get real, requirement-specific code."
)

_MOCK_BODIES = {
    "Python": (
        "def main():\n"
        '    print("This is demo output from CodeCraft AI.")\n'
        '    print("Add ANTHROPIC_API_KEY to backend/.env for real generations.")\n\n\n'
        'if __name__ == "__main__":\n'
        "    main()\n"
    ),
    "Java": (
        "public class Main {\n"
        "    public static void main(String[] args) {\n"
        '        System.out.println("This is demo output from CodeCraft AI.");\n'
        '        System.out.println("Add ANTHROPIC_API_KEY to backend/.env for real generations.");\n'
        "    }\n"
        "}\n"
    ),
    "C": (
        "#include <stdio.h>\n\n"
        "int main(void) {\n"
        '    printf("This is demo output from CodeCraft AI.\\n");\n'
        '    printf("Add ANTHROPIC_API_KEY to backend/.env for real generations.\\n");\n'
        "    return 0;\n"
        "}\n"
    ),
    "C++": (
        "#include <iostream>\n"
        "using namespace std;\n\n"
        "int main() {\n"
        '    cout << "This is demo output from CodeCraft AI." << endl;\n'
        '    cout << "Add ANTHROPIC_API_KEY to backend/.env for real generations." << endl;\n'
        "    return 0;\n"
        "}\n"
    ),
    "JavaScript": (
        "function main() {\n"
        '  console.log("This is demo output from CodeCraft AI.");\n'
        '  console.log("Add ANTHROPIC_API_KEY to backend/.env for real generations.");\n'
        "}\n\n"
        "main();\n"
    ),
    "HTML": (
        "<!DOCTYPE html>\n"
        '<html lang="en">\n'
        "<head>\n"
        '  <meta charset="UTF-8">\n'
        "  <title>Demo Page</title>\n"
        "</head>\n"
        "<body>\n"
        "  <h1>This is demo output from CodeCraft AI.</h1>\n"
        "  <p>Add ANTHROPIC_API_KEY to backend/.env for real generations.</p>\n"
        "</body>\n"
        "</html>\n"
    ),
    "CSS": (
        "body {\n"
        "  font-family: sans-serif;\n"
        "  background-color: #10151d;\n"
        "  color: #e6e9ef;\n"
        "}\n\n"
        "/* This is demo output from CodeCraft AI. */\n"
        "/* Add ANTHROPIC_API_KEY to backend/.env for real generations. */\n"
    ),
    "SQL": (
        "SELECT 'This is demo output from CodeCraft AI.' AS message;\n"
        "-- Add ANTHROPIC_API_KEY to backend/.env for real generations.\n"
    ),
}

_COMMENT_STYLES = {
    "Python": "#",
    "CSS": None,  # handled with /* */ separately
    "HTML": None,  # handled with <!-- --> separately
    "SQL": "--",
}


def _mock_generate(prompt, language):
    body = _MOCK_BODIES.get(language, _MOCK_BODIES["Python"])

    if language == "HTML":
        header = f"<!-- Requirement: {prompt} -->\n"
    elif language == "CSS":
        header = f"/* Requirement: {prompt} */\n"
    elif language in ("Python", "SQL"):
        marker = _COMMENT_STYLES.get(language, "#")
        header = f"{marker} Requirement: {prompt}\n"
    else:
        header = f"// Requirement: {prompt}\n"

    code = header + "\n" + body
    explanation = _DEMO_NOTE
    return code, explanation
