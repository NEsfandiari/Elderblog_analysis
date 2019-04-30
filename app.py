from flask import Flask
from flask_cors import CORS, cross_origin
from links import top_100
from words import unique_idf
import csv
import json

app = Flask(__name__)
CORS(app)


@app.route('/counter/<params>')
def return_top(params):
    params = params.split('-')

    start_date = int(params[0])
    end_date = int(params[1])
    non_ribbonfarm = True if params[2] == 'true' else False
    search = None if params[3] == 'false' else params[3]

    data = top_100(start_date, end_date, non_ribbonfarm, search)
    return json.dumps(data)


@app.route('/words')
def return_words():
    data = unique_idf()
    return json.dumps(data)
