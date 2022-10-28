import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
import schedule
from time import sleep

cred = credentials.Certificate("rsf-crowd-data-7a55f97a7e58.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://rsf-crowd-data-default-rtdb.firebaseio.com"
})


ref = db.reference("byday")
days_of_the_week = ["Monday", "Tuesday", "Wednesday",
                    "Thursday", "Friday", "Saturday", "Sunday"]



def update_db_day(day):
    with open("./data/json/{}.json".format(day)) as f:
        data = json.load(f)
        ref.child(day).set(data)

def update_db_all():
    for day in days_of_the_week:
        update_db_day(day)


def runner():
    update_db_all()


if __name__ == "__main__":
    schedule.every().day.at("23:00").do(runner)
    while True:
        schedule.run_pending()
        sleep(3600)
    runner()