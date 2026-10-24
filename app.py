
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


def get_category(bmi):
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal Weight"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obesity"


def get_advice(category):
    advice = {
        "Underweight": "Consider discussing nutrition and healthy weight goals with a healthcare professional.",
        "Normal Weight": "You are within the usual healthy BMI range for adults. Keep up your healthy habits!",
        "Overweight": "Consider sustainable eating and activity habits, and seek professional guidance if needed.",
        "Obesity": "A healthcare professional can help assess your overall health and discuss suitable next steps."
    }
    return advice[category]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json(silent=True) or {}

    try:
        height = float(data.get("height", 0))
        weight = float(data.get("weight", 0))
    except (ValueError, TypeError):
        return jsonify({"error": "Enter valid numbers."}), 400

    if not 50 <= height <= 250:
        return jsonify({"error": "Height must be between 50 and 250 cm."}), 400

    if not 10 <= weight <= 500:
        return jsonify({"error": "Weight must be between 10 and 500 kg."}), 400

    height_m = height / 100
    bmi = weight / (height_m ** 2)
    category = get_category(bmi)

    return jsonify({
        "bmi": round(bmi, 2),
        "category": category,
        "advice": get_advice(category),
        "height": height,
        "weight": weight
    })


if __name__ == "__main__":
    app.run(debug=True)
