#!/usr/bin/env python
# coding: utf-8


import enum
import pandas as pd
from datetime import datetime
from datetime import time
from datetime import timedelta
import matplotlib.pyplot as plt
from matplotlib import dates
from dateutil import tz, parser
import matplotlib.dates as mdates
from scipy.interpolate import interp1d
import numpy as np
import json

myFmt = mdates.DateFormatter('%H:%M')
days_of_the_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def within_opening_hours(dt: datetime) -> bool:
    if 0 <= dt.weekday() <= 4:
        return 7 <= dt.hour <= 22
    elif dt.weekday() == 5:
        return 8 <= dt.hour <= 17
    else:
        return 8 <= dt.hour <= 22
    
def hour_minute_only(dt: datetime) -> datetime:
    return datetime.now().replace(hour=dt.hour, minute=dt.minute, second=0)


def save_df_array_csv(df_array):
    for i, day in enumerate(days_of_the_week):
        df_array[i].to_csv("./data/csv/{}.csv".format(day), index=False)

def save_df_array_json(df_array):
    for i, day in enumerate(days_of_the_week):
        df_array[i].to_json("./data/json/{}.json".format(day), orient="records")
            
def format_rsf_data():
    rsf_data = pd.read_csv("rsf_data.csv")
    rsf_data["Date"] = pd.to_datetime(rsf_data["Date"], format="%d/%m/%Y %H:%M:%S")
    rsf_data["Date"] = rsf_data["Date"] - pd.Timedelta(hours=7)
    rsf_data = rsf_data[rsf_data["Date"].apply(within_opening_hours)].reindex()
    days_of_week_data = [rsf_data[rsf_data["Date"].apply(datetime.weekday) == i] for i in range(7)]
    for i in range(7):
        # group by 10-minute intervals and find the mean of "Weight Rooms" in each group
        days_of_week_data[i] = days_of_week_data[i].groupby(pd.Grouper(key="Date", freq="20min"))["Weight Rooms"].mean().reset_index()
    return days_of_week_data
def plot_rsf_data(days_of_week_data):
    pd.plotting.register_matplotlib_converters()
    plt_1, ax = plt.subplots()
    plt.legend(days_of_the_week)
    ax.xaxis.set_major_formatter(myFmt)
    for i in range(7):
        x = days_of_week_data[i]["Date"].apply(hour_minute_only)
        y = days_of_week_data[i]["Weight Rooms"].values
        ax.plot(x, y, label=days_of_the_week[i])
    ax.legend(days_of_the_week)
    plt.grid()
    # plt.savefig("rsf_data.png")
    plt.show()
    # Keep line for each day of the week, overlay on graph, find averages


def main():
    save_df_array_json(format_rsf_data())

if __name__ == "__main__":
    main()