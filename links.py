import requests
import pdb
import csv
from bs4 import BeautifulSoup
from collections import Counter


def scrape_links_ribbonfarm():
    headers = {
        "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36"
    }
    res = requests.get('https://www.ribbonfarm.com/', headers=headers)
    with open('links.csv', 'w') as f:
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
                new_outbound = []
                for hyper in soup.select(".entry-content p > a"):
                    if hasattr(hyper, "href"):
                        try:
                            new_outbound.append(hyper['href'])
                        except KeyError:
                            print("I failed here {}".format(hyper))
                title = soup.select('.entry-title')[0].get_text()
                date = soup.select('.date')[0].get_text()
                author = soup.select('.author a')[0].get_text()
                print(new_outbound)
                for link in new_outbound:
                    csv_w.writerow([link, title, author, date])
            if btn:
                res = requests.get(btn[0].a['href'], headers=headers)
            else:
                break


def top_100(start=2007, end=2019, non_ribbonfarm=False, search=False):
    with open('links.csv', 'r') as f:
        csv_r = list(csv.reader(f))
        flat = [
            link[0] for link in csv_r
            if start <= int(link[3].split()[-1]) <= end and (
                not non_ribbonfarm or 'ribbonfarm' not in link[0]) and (
                    not search or search in link[0])
        ]
        data = Counter(flat)
        return data.most_common(100)


def all_data():
    with open('links.csv', 'r') as f:
        fieldnames = ("Link", "Article", "Author", "Date")
        data = csv.DictReader(f, fieldnames=fieldnames)
        data = [row for row in data]
        return data