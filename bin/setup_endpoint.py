import json
import os
import csv

# pylint: disable=import-error
import splunk.admin as admin
import splunk.rest
from splunk import ResourceNotFound



class BrokenHostsSetup(admin.MConfigHandler):
    """
    Initial Setup for Broken Hosts
    """

    def setup(self):
        pass

    def handleList(self, _):  # pylint: disable=invalid-name
        pass

    '''
    After user clicks Save on setup page, take updated parameters,
    normalize them, and save them somewhere
    '''
    def handleEdit(self, _):  # pylint: disable=invalid-name

        session_key = self.getSessionKey()
        
        splunk_home = os.environ.get("SPLUNK_HOME")
        default_file = os.path.join(
            splunk_home,
            "etc",
            "apps",
            "broken_hosts",
            "default",
            "data",
            "expectedTime.csv.default")
        with open(default_file, "r") as f:
            reader = csv.DictReader(f)
            for line in reader:
                self.write_line(session_key, line)

    @staticmethod
    def write_line(session_key, line):
        splunk.rest.simpleRequest(
            '/servicesNS/nobody/broken_hosts/storage/collections/data/expectedTime',
            method='POST',
            jsonargs=json.dumps(line),
            sessionKey=session_key
        )


# initialize the handler
admin.init(BrokenHostsSetup, admin.CONTEXT_NONE)
