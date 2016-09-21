import os
import shutil
splunk_home = os.environ.get("SPLUNK_HOME")
if splunk_home:
    lookupfile = os.path.join(splunk_home, "etc", "apps", "broken_hosts", "lookups", "expectedTime.csv")
    defaultfile = os.path.join(splunk_home, "etc", "apps", "broken_hosts", "lookups", "expectedTime.csv.default")
    if not os.path.isfile(lookupfile):
        if os.path.isfile(defaultfile):
            shutil.copyfile(defaultfile, lookupfile)
