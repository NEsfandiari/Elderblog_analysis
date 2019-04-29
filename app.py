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


@app.route('/counter/<date_range>/<non_ribbonfarm>/<search>')
def return_top(date_range, non_ribbonfarm, search):
    date_range = date_range.split('-')
    non_ribbonfarm = True if non_ribbonfarm == 'true' else False
    search = None if search == 'false' else search
    data = top_100(
        int(date_range[0]), int(date_range[1]), non_ribbonfarm, search)
    return json.dumps(data)
