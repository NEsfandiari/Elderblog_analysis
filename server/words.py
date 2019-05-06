import requests
import csv
import pdb
import re
from bs4 import BeautifulSoup
from collections import Counter
from math import log
import json


def scrape_words_ribbonfarm():
    headers = {
        "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36"
    }
    res = requests.get('https://www.ribbonfarm.com/', headers=headers)
    with open('./data/words.csv', 'w') as f:
        csv_w = csv.writer(f)
        while True:
            links = []
            soup = BeautifulSoup(res.text, 'html.parser')
            links.extend(
                [link['href'] for link in soup.select(".entry-title-link")])
            btn = soup.select('.pagination-next')
            for link in links:
                res = requests.get(link, headers=headers)
                soup = BeautifulSoup(res.text, 'html.parser')
                p_tags = []
                for text in soup.select(".entry-content p"):
                    try:
                        p_tags.append(text.get_text())
                    except KeyError:
                        print("I failed here {}".format(text))
                title = soup.select('.entry-title')[0].get_text()
                date = soup.select('.date')[0].get_text()
                author = soup.select('.author a')[0].get_text()
                print(p_tags)
                csv_w.writerow(["".join(p_tags), title, author, date])
            if btn:
                res = requests.get(btn[0].a['href'], headers=headers)
            else:
                break


class SetEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)


def tf():
    with open('./data/words.csv', 'r') as f:
        csv_r = list(csv.reader(f))
        all_author_tf = dict()
        for post, title, author, date in csv_r:

            edited = "".join([
                char.lower() for char in post
                if char.isalnum() or char == ' ' or ord(char) == 215
            ]).split(' ')

            author_data = all_author_tf[author] = all_author_tf.get(
                author,
                dict(
                    unique_words=set(),
                    word_choice_tf={},
                    total_word_count=0,
                    documents=0))

            c = Counter(edited)
            doc = author_data['word_choice_tf'][title] = author_data[
                'word_choice_tf'].get(title, dict())
            total_terms = len(edited)

            for word, count in c.items():
                if word:
                    doc[word] = (count / total_terms)
                    author_data['unique_words'].add(word)
            author_data['total_word_count'] += total_terms
            author_data['documents'] += 1
        with open('./data/tf_data.txt', 'w') as f:
            json.dump(all_author_tf, f, cls=SetEncoder)


def unique_idf():
    all_author_tf = None
    with open('./data/tf_data.txt', 'r') as f:
        all_author_tf = json.load(f)
    total_documents = sum(
        [author_data['documents'] for author_data in all_author_tf.values()])
    all_author_idf = dict()

    for author, author_data in all_author_tf.items():
        author_idf = all_author_idf[author] = dict()
        for word in author_data['unique_words']:
            count = 0
            articles = []
            for author2, author_data2 in all_author_tf.items():
                for title, doc in author_data2['word_choice_tf'].items():
                    if word in doc:
                        if author == author2:
                            articles.append(title)
                        count += 1

            if count > 1:
                author_idf[word] = [log((total_documents) / count), articles]
    with open('./data/idf_data.txt', 'w') as f:
        json.dump(all_author_idf, f)

    all_author_word_choice_idf = []
    id = 0
    for author, author_data in all_author_idf.items():
        author_idf = []
        for key, val in author_data.items():
            author_idf.append({
                "author": author,
                "word": key,
                "score": val[0],
                'articles': val[1],
                "id": id
            })
            id += 1
        all_author_word_choice_idf.append([author, author_idf])
    with open('./data/word_choice_data.txt', 'w') as f:
        json.dump(all_author_word_choice_idf, f)


import pdb


def eigen_posts():
    idf_data, tf_data = None, None
    with open('./data/idf_data.txt', 'r') as f:
        idf_data = json.load(f)
    with open('./data/tf_data.txt', 'r') as f2:
        tf_data = json.load(f2)

    all_author_eigen_posts = dict()
    for author, author_data in tf_data.items():
        eigen_posts = all_author_eigen_posts[author] = dict()
        for post, words in author_data["word_choice_tf"].items():
            post_score = 0
            count = 0
            for word in words.keys():
                if word in idf_data[author]:
                    post_score += idf_data[author][word][0]
                    count += 1

            if count > 0:
                all_author_eigen_posts[author][post] = post_score / count

    with open('./data/eigen_post_data.txt', 'w') as f3:
        json.dump(all_author_eigen_posts, f3)
