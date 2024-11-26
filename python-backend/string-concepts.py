from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/stringconcepts', methods=['GET'])
def stringconcepts():
    inputNumOne = 12
    inputNumTwo = 2.5
    name = "Sadaf"
    return jsonify({'implicitResult': inputNumOne + inputNumTwo, 'name': name[-4:-2]})

if __name__ == '__main__':
    app.run(debug=True, port=5001)