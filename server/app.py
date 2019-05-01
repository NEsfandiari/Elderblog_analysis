from flask import Flask, make_response
from flask_cors import CORS
from links import top_100
from words import unique_idf
import json

app = Flask(__name__)
CORS(app)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    return make_response("Elderblog Analysis Server :)")


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
