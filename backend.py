from flask import Flask, request, jsonify
from openai import OpenAI
import os 
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
load_dotenv()
client = OpenAI(api_key=os.getenv("OPEN_AI_KEY"))
response=client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}]
)
print(response.choices[0].message.content)

@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.json
        context = data.get("context", "")
        question = data.get("question", "")
        prompt = f"Context:\n{context}\n\nQuestion:\n{question}\nAnswer ONLY based on the context above. Do NOT use any other knowledge"
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a context aware AI which sees the content of the webpage and answer based on the content you see"},
                {"role": "user", "content": prompt}
            ]
        )
        answer = response.choices[0].message.content.strip()
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)