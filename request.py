from datetime import datetime

import os
import requests
import schedule
from csv import writer
from time import sleep
rooms = ["Annex Weight Room", "Extension Weight Room",
         "Main Weight Room", "Weight Rooms"]
url = "https://api.density.io/v2/spaces?page=1&page_size=5000"
headers = {
    "authority": "api.density.io",
    "method": "GET",
    "path": "/v2/spaces?page:1&page_size:5000",
    "scheme": "https",
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q:0.9,es;q:0.8",
    "authorization": "Bearer shr_o69HxjQ0BYrY2FPD9HxdirhJYcFDCeRolEd744Uj88e",
    "origin": "https://safe.density.io",
    "referer": "https://safe.density.io/",
    "sec-ch-ua": "\"Chromium\";v:\"106\", \"Google Chrome\";v:\"106\", \"Not;A:Brand\";v:\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"}

# sets up headers and creates csv file


def setup_csv(file_name):
    if os.path.exists(file_name):
        i = 'n'
        #i = input("File already exists. overwrite? (y/n)")
        if i == "y":
            print("Overwriting...")
        else:
            print("Appending to file...")
            return
    f = open(file_name, "w")
    f.write(
        "Date,Annex Weight Room,Extension Weight Room,Main Weight Room,Weight Rooms\n")
    f.close()

# returns an array of data: [Annex Weight Room, Extension Weight Room, Main Weight Room, Weight Rooms]
# each weight room has: [current_count, capacity]


def get_rsf_data():
    res = []
    resp = requests.get(url, headers=headers).json()
    for i in range(4):
        res.append(int(resp["results"][i]["current_count"] /
                   resp["results"][i]["capacity"]*100))
    curr_occupied = resp["results"][3]["current_count"]
    cap = resp["results"][3]["capacity"]
    print("RSF is", round(curr_occupied/cap, 3)*100, "% full")
    return res


def append_data_to_csv(file_name, rsf_data):
    append_data_to_csv_with_date(
        file_name, rsf_data, datetime.now().strftime("%d/%m/%Y %H:%M:%S"))

# rsf_data is in the format of: [%Annex Weight Room, %Extension Weight Room, %Main Weight Room, %Weight Rooms]


def append_data_to_csv_with_date(file_name, rsf_data, date):
    with open(file_name, 'a+', newline='') as write_obj:
        # Create a writer object from csv module
        csv_writer = writer(write_obj)
        # Add contents of list as last row in the csv file
        csv_writer.writerow([date] + rsf_data)


def initialie():
    setup_csv("rsf_data.csv")


def runner():
    rsf_data = get_rsf_data()
    append_data_to_csv("rsf_data.csv", rsf_data)


if __name__ == "__main__":
    initialie()
    schedule.every(5).minutes.do(runner)

    while True:
        schedule.run_pending()
        sleep(30)
