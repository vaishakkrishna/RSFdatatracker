from lib2to3.pgen2 import driver
import os
from selenium import webdriver
from bs4 import BeautifulSoup
import pandas as pd
from time import sleep
from selenium.webdriver.firefox.options import Options as FirefoxOptions
options = FirefoxOptions()
options.add_argument("--headless")
driver = webdriver.Firefox(options=options)
driver.get("https://recsports.berkeley.edu/rsf-weight-room-crowd-meter/")
driver.implicitly_wait(15)

while (True):
    inp = input("inp: ")
    try:
        f = driver.execute_script(inp)
    except e:
        print("you done fucked up")
    print(f)
driver.quit()

"return document.getElementsByTagName(\"span\")[5].textContent"
# print("1")
# content = driver.page_source
# print(content)
# soup = BeautifulSoup(content, features="lxml")
# print("3")
# f = soup.findAll('div', attrs={'class': 'styles_fullness__rayxl'})
# print(f)
# for a in f:
#     percent = a.find('span')
#     print("5")
#     fullness_percent.append(fullness_percent.text)


# print(fullness_percent)
