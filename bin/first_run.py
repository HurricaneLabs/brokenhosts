import os
import shutil
import csv
splunk_home = os.environ.get("SPLUNK_HOME")
splunk_home='a'
if splunk_home:
    lookupfile = os.path.join(splunk_home, "etc", "apps", "broken_hosts", "lookups", "expectedTime.csv")
    defaultfile = os.path.join(splunk_home, "etc", "apps", "broken_hosts", "lookups", "expectedTime.csv.default")
    if not os.path.isfile(lookupfile):
        if os.path.isfile(defaultfile):
            shutil.copyfile(defaultfile, lookupfile)
    else:
        expected_fields = ["index","sourcetype","host","lateSecs","suppressUntil","contact","comments"]
        current_fields = []
        tempfile = os.path.join(splunk_home, "etc", "apps", "broken_hosts", "lookups", "expectedTime.csv.tmp")
        f=open(lookupfile, "r")
        reader = csv.DictReader(f)
        current_fields = reader.fieldnames
        if current_fields != expected_fields:
            with open(tempfile, "w") as f_temp:
                writer = csv.DictWriter(f_temp, expected_fields)
                writer.writeheader()
                for line in reader:
                    writer.writerow(line)
            shutil.copyfile(tempfile, lookupfile)
        f.close()

