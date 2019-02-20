import requests
from bs4 import BeautifulSoup
headers = {
    "User-Agent":
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36"
}
res = requests.get('https://www.ribbonfarm.com/', headers=headers)
links = []
soup = BeautifulSoup(res.text, 'html.parser')
links.extend([link['href'] for link in soup.select(".entry-title-link")])

print(links)
