"""
Populates KV Store with default values
"""

import json
import os
import csv

# pylint: disable=import-error
from splunk import admin
import splunk.rest


class BrokenHostsSetup(admin.MConfigHandler):
    """
    Initial Setup for Broken Hosts
    """

    def setup(self):
        """
        super() method - not used
        """

    def handleList(self, _):  # pylint: disable=invalid-name
        """
        super() method - not used
        """

    def handleEdit(self, _):  # pylint: disable=invalid-name
        """
        super() method - handles populating KVStore with default values
        """

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
        with open(default_file, "r", encoding='utf-8') as opened_file:
            reader = csv.DictReader(opened_file)
            for line in reader:
                self.write_line(session_key, line)

    @staticmethod
    def write_line(session_key, line):
        """
        Writes line to KVStore, called in handleEdit()
        """
        splunk.rest.simpleRequest(
            '/servicesNS/nobody/broken_hosts/storage/collections/data/expectedTime',
            method='POST',
            jsonargs=json.dumps(line),
            sessionKey=session_key
        )


# initialize the handler
admin.init(BrokenHostsSetup, admin.CONTEXT_NONE)