import os
import shutil
import csv
import requests, json

splunk_home = os.environ.get("SPLUNK_HOME")
if splunk_home:
    lookupfile = os.path.join(splunk_home, "etc", "apps", "broken_hosts", "lookups", "expectedTime.csv")
    defaultfile = os.path.join(splunk_home, "etc", "apps", "broken_hosts", "lookups", "expectedTime.csv.default")
    if not os.path.isfile(lookupfile):
        if os.path.isfile(defaultfile):
            shutil.copyfile(defaultfile, lookupfile)
    else:
        expected_fields = ["index","sourcetype","host","lateSecs","suppressUntil","contact","comments"]
        tempfile = os.path.join(splunk_home, "etc", "apps", "broken_hosts", "lookups", "expectedTime.csv.tmp")
        f=open(lookupfile, "r")
        reader = csv.DictReader(f)
        with open(tempfile, "w") as f_temp:
            writer = csv.DictWriter(f_temp, expected_fields)
            writer.writeheader()
            for line in reader:
                if "sourcetype" not in line or line["sourcetype"] == "":
                    line["sourcetype"] = "*"
                if "index" not in line or line["index"] == "":
                    line["index"] = "*"
                if "host" not in line or line["host"] == "":
                    line["host"] = "*"
                if "lateSecs" not in line or line["lateSecs"] == "":
                    line["lateSecs"] = "0"
                writer.writerow(line)
        f.close()
        shutil.copyfile(tempfile, lookupfile)

