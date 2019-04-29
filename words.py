import requests
import csv
import pdb
import re
from bs4 import BeautifulSoup
from collections import Counter
from math import log


def scrape_words_ribbonfarm():
    headers = {
        "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36"
    }
    res = requests.get('https://www.ribbonfarm.com/', headers=headers)
    with open('words.csv', 'w') as f:
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


def tf_idf():
    with open('words.csv', 'r') as f:
        csv_r = list(csv.reader(f))

        #tf
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

        #idf
        total_documents = sum([
            author_data['documents'] for author_data in all_author_tf.values()
        ])
        all_author_idf = dict()
        for author, author_data in all_author_tf.items():
            author_idf = all_author_idf[author] = dict()
            for word in author_data['unique_words']:
                count = 0
                for author2, author_data2 in all_author_tf.items():
                    for doc in author_data2['word_choice_tf'].values():
                        if word in doc and author != author2:
                            count += 1
                if count > 0:
                    author_idf[word] = log(
                        (total_documents - author_data['documents']) / count)

        all_author_tf_idf = dict()
        for author, author_data in all_author_idf.items():
            all_author_tf_idf[author] = sorted(
                author_data, key=author_data.get)
        return all_author_tf, all_author_idf
