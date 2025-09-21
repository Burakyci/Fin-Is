from flask import jsonify, request
from firebase_functions import https_fn
from scoring.engine import compute_score

@https_fn.on_request()
def credit_decision(request):
    # CORS preflight
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*", 
            # //TODO BURAYI UNUTMA 
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
        return ("", 200, headers)

    headers = {"Access-Control-Allow-Origin": "*"}

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON payload provided"}), 400, headers

        score, details = compute_score(data)

        return jsonify({
            "score": score,
            "details": details
        }), 200, headers

    except Exception as e:
        return jsonify({"error": str(e)}), 500, headers
