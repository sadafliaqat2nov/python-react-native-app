from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    
    num1 = data.get('num1') 
    num2 = data.get('num2')
    operator = data.get('operator')
    
    if operator == '+':
        result = num1 + num2
    elif operator == '-':
        result = num1 - num2
    elif operator == '*':
        result = num1 * num2
    elif operator == '/':
        if num2 != 0:
            result = num1 / num2
        else:
            return jsonify({'error': 'Cannot divide by zero'}), 400
    else:
        return jsonify({'error': 'Invalid operator'}), 400
    
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
