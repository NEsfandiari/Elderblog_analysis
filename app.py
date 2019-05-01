from flask import Flask, send_from_directory, render_template, Blueprint
from links import top_100
from words import unique_idf
import json
import os

app = Flask(__name__, static_folder="build/static", template_folder="build")
app.config['FREEZER_DESTINATION'] = 'Flask_Static_Build'


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    return render_template("index.html")


@app.route('/data/links/<params>')
def return_top(params):
    params = params.split('-')

    start_date = int(params[0])
    end_date = int(params[1])
    non_ribbonfarm = True if params[2] == 'true' else False
    search = None if params[3] == 'false' else params[3]

    data = top_100(start_date, end_date, non_ribbonfarm, search)
    return json.dumps(data)


@app.route('/data/words')
def return_words():
    data = unique_idf()
    return json.dumps(data)


if __name__ == '__main__':
    print('Starting Flask!')
    app.run(debug=True)
