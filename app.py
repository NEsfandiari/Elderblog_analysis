from flask import Flask
import csv
import json
import pdb
app = Flask(__name__)


@app.route('/')
def return_data():
    with open('links.csv', 'r') as f:
        fieldnames = ("Link", "Article", "Author", "Date")
        data = csv.DictReader(f, fieldnames=fieldnames)
        data = {"data": [row for row in data]}
        return json.dumps(data)
