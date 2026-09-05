import os
import time

from dotenv import load_dotenv
from google import genai


# ============================================================
# GEMINI CONFIGURATION
# ============================================================

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY is missing from backend/.env"
    )

client = genai.Client(
    api_key=api_key
)

MODEL_NAME = "gemini-3.6-flash"


# ============================================================
# COMMON GEMINI REQUEST FUNCTION
# ============================================================

def ask_gemini(prompt, feature_name="AI request"):
    """
    Send a prompt to Gemini and handle common errors.
    """

    max_attempts = 3

    for attempt in range(max_attempts):

        try:

            print(
                f"Gemini {feature_name} attempt "
                f"{attempt + 1}/{max_attempts}"
            )

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )

            if not response.text:

                raise Exception(
                    "Gemini returned an empty response."
                )

            return response.text.strip()

        except Exception as e:

            error_message = str(e)

            print(
                f"Gemini {feature_name} Error:",
                error_message
            )

            # ------------------------------------------------
            # QUOTA / RATE LIMIT ERROR
            # ------------------------------------------------

            if (
                "429" in error_message
                or "RESOURCE_EXHAUSTED" in error_message
            ):

                raise Exception(
                    "Gemini API quota exceeded. "
                    "Your current free-tier request limit "
                    "has been reached. Please wait for the "
                    "quota to reset or upgrade your Gemini "
                    "API project."
                )

            # ------------------------------------------------
            # TEMPORARY SERVER ERROR
            # ------------------------------------------------

            if "503" in error_message:

                if attempt < max_attempts - 1:

                    print(
                        "Gemini is temporarily busy. "
                        "Retrying in 3 seconds..."
                    )

                    time.sleep(3)

                    continue

                raise Exception(
                    "Gemini is temporarily busy. "
                    "Please try again later."
                )

            # ------------------------------------------------
            # OTHER ERROR
            # ------------------------------------------------

            raise Exception(
                f"{feature_name} failed: {error_message}"
            )

    raise Exception(
        f"{feature_name} failed. "
        "Please try again later."
    )


# ============================================================
# GENERATE CODE
# ============================================================

def generate_code(
    prompt,
    language,
    framework="None"
):

    full_prompt = f"""
You are CodeCraft AI, an expert software developer.

Your job is to generate complete, working source code
based on the user's requirement.

USER REQUIREMENT:
{prompt}

PROGRAMMING LANGUAGE:
{language}

FRAMEWORK:
{framework}

RULES:

1. Generate complete executable source code.
2. Include all required imports.
3. Use clean and readable code.
4. Follow good programming practices.
5. Handle common errors where appropriate.
6. Keep the solution beginner-friendly.
7. Make sure the code is logically complete.
8. Return ONLY the source code.
9. Do NOT use Markdown code fences.
10. Do NOT add explanations outside the code.
11. Do NOT write ```python or ```javascript.
12. Do NOT write an explanation before or after the code.

Generate the code now.
"""

    return ask_gemini(
        full_prompt,
        "code generation"
    )


# ============================================================
# EXPLAIN CODE
# ============================================================

def explain_code(code, language):

    prompt = f"""
You are CodeCraft AI, an expert programming teacher.

Explain the following {language} code in a simple,
beginner-friendly way.

CODE:
{code}

Provide the following sections:

=== OVERALL PURPOSE ===

Explain what the program does.

=== CODE EXPLANATION ===

Explain the important lines and sections
of the program in a clear way.

=== IMPORTANT CONCEPTS ===

Explain variables, functions, loops, conditions,
classes, libraries, data structures, and other
important programming concepts used.

=== POSSIBLE IMPROVEMENTS ===

Suggest improvements for:

- Readability
- Error handling
- Performance
- Security
- Maintainability
- Best practices

=== SIMPLE SUMMARY ===

Give a short and easy-to-understand summary
of how the program works.

Use simple language suitable for a student
who is learning programming.
"""

    return ask_gemini(
        prompt,
        "code explanation"
    )


# ============================================================
# DEBUG CODE
# ============================================================

def debug_code(code, language):

    prompt = f"""
You are CodeCraft AI, an expert software debugger.

Debug the following {language} program.

CODE:
{code}

Analyze the code carefully.

Check for:

1. Syntax errors
2. Logical errors
3. Runtime problems
4. Security problems
5. Performance problems
6. Incorrect input handling
7. Missing error handling

Your response MUST contain these sections:

=== ERRORS FOUND ===

List every problem found.

For each error explain:

- Error
- Location
- Why it happens
- Severity

If there are no errors, write:

No major errors found.

=== CORRECTED CODE ===

Provide the complete corrected code.

IMPORTANT:

- Return the complete code.
- Do not remove working functionality.
- Preserve the original purpose of the program.

=== FIXES EXPLAINED ===

Explain every important change.

Explain:

- What was wrong
- Why it was wrong
- How it was fixed

=== SUMMARY ===

Give a short summary of the debugging result.
"""

    return ask_gemini(
        prompt,
        "code debugging"
    )


# ============================================================
# OPTIMIZE CODE
# ============================================================

def optimize_code(code, language):

    prompt = f"""
You are CodeCraft AI, an expert software optimization engineer.

Optimize the following {language} program.

CODE:
{code}

Analyze the code for:

1. Performance
2. Readability
3. Maintainability
4. Security
5. Duplicate code
6. Variable naming
7. Error handling
8. Unnecessary operations
9. Memory usage
10. Code structure

Then provide an improved version of the code.

Use exactly this format:

=== ANALYSIS ===

Explain the problems or areas that can be improved.

=== OPTIMIZED CODE ===

Provide the complete optimized {language} code.

IMPORTANT:

- Preserve the original functionality.
- Do not remove important features.
- Make the code easier to maintain.
- Use appropriate best practices.

=== IMPROVEMENTS ===

Explain each improvement and why it is better.

=== PERFORMANCE ===

Explain any performance improvements.

=== SUMMARY ===

Give a short summary of the optimization.
"""

    return ask_gemini(
        prompt,
        "code optimization"
    )


# ============================================================
# GENERATE TEST CASES
# ============================================================

def generate_test_cases(code, language):

    prompt = f"""
You are CodeCraft AI, an expert software testing engineer.

Generate comprehensive test cases for the following
{language} program.

CODE:
{code}

Analyze the program and create useful test cases.

Include:

1. Normal test cases
2. Boundary test cases
3. Edge cases
4. Invalid input cases
5. Empty input cases
6. Large input cases where applicable
7. Error handling cases

Use this format:

=== TEST CASES ===

Test Case ID:
TC001

Description:
Describe what is being tested.

Input:
Provide the input.

Expected Output:
Provide the expected output.

Actual Output:
To be executed

Result:
Not Executed

Then continue with:

TC002
TC003
TC004
etc.

=== EDGE CASES ===

List important edge cases.

=== INVALID INPUT CASES ===

List important invalid input scenarios.

=== TEST SUMMARY ===

Total number of test cases:
Normal test cases:
Boundary test cases:
Edge cases:
Invalid input cases:

IMPORTANT:

- Do not execute the code.
- Do not invent actual runtime output.
- Use "To be executed" for Actual Output.
- Use "Not Executed" for Result.
- Make the test cases relevant to the actual program.
"""

    return ask_gemini(
        prompt,
        "test case generation"
    )