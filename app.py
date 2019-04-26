from flask import Flask
import csv
import json
from flask_cors import CORS, cross_origin
from links import top_100, all_data
app = Flask(__name__)
CORS(app)


@app.route('/data')
def return_data():
    data = all_data()
    return json.dumps(data)


@app.route('/counter')
def return_top():
    data = top_100()
    return json.dumps(data)
