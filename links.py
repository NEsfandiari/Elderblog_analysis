import requests
import pdb
from bs4 import BeautifulSoup
headers = {
    "User-Agent":
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36"
}
outbound_links = []
res = requests.get('https://www.ribbonfarm.com/', headers=headers)
while True:
    links = []
    soup = BeautifulSoup(res.text, 'html.parser')
    links.extend([link['href'] for link in soup.select(".entry-title-link")])
    btn = soup.select('.pagination-next')
    for link in links:
        res = requests.get(link, headers=headers)
        soup = BeautifulSoup(res.text, 'html.parser')
        outbound_links.extend([
            hyper.a['href'] for hyper in soup.select("em")
            if len(hyper.contents) > 1
        ])
    print(outbound_links)
    if btn:
        res = requests.get(btn[0].a['href'], headers=headers)
    else:
        break
