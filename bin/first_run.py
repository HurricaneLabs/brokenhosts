import os
import shutil
splunk_home = os.environ.get("SPLUNK_HOME")
if splunk_home:
    lookupfile = os.path.join(splunk_home, "etc", "apps", "broken_sources", "lookups", "expectedTime.csv")
    samplefile = os.path.join(splunk_home, "etc", "apps", "broken_sources", "lookups", "expectedTime.csv.sample")
    if not os.path.isfile(lookupfile):
        if os.path.isfile(samplefile):
            shutil.copyfile(samplefile, lookupfile)

