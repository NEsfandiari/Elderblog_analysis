import requests
import pdb
import csv
from bs4 import BeautifulSoup
from collections import Counter


def scrape_all_ribbonfarm():
    headers = {
        "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36"
    }
    res = requests.get('https://www.ribbonfarm.com/', headers=headers)
    with open('links.csv', 'a') as f:
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
                new_outbound = [
                    hyper.a['href'] for hyper in soup.select("em")
                    if hyper.a and hyper.a['href'] not in [
                        'https://git.zfadd.is/zacharius/Mastobots',
                        'http://refactorcamp.org/'
                        'http://tempobook.com'
                    ]
                ]
                print(new_outbound)
                for link in new_outbound:
                    csv_w.writerow([link])
            if btn:
                res = requests.get(btn[0].a['href'], headers=headers)
            else:
                break


def counter():
    with open('links.csv', 'r') as f:
        csv_r = list(csv.reader(f))
        flat = [link[0] for link in csv_r]
        print(Counter(flat))