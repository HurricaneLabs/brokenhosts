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
            rows = csv.DictReader(opened_file)

            """
            The following logic determines if a row is sent to a specific KV Store:
                1. Any comment with 'default entry' AND lateSecs is a non-zero value - will be sent to the expectedTime KV Store
                2. Any comment with 'default entry' AND lateSecs is a zero value - Youwill be sent to bh_suppressions KV Store
            """
            for row in rows:
                if "default entry" in row["comments"] and int(row["lateSecs"]) > 0:
                    self.write_to_kv(session_key, row, "expected_time_value")
                if "default entry" in row["comments"] and int(row["lateSecs"]) == 0:
                    self.write_to_kv(session_key, row, "bh_suppressions_value")

    def write_to_kv(self, session_key, line, type):
        """
        Writes line to KVStore, called in handleEdit()
        """

        url = None

        if (type == "expected_time_value"):
            url = "/servicesNS/nobody/broken_hosts/storage/collections/data/expectedTime"

        if (type == "bh_suppressions_value"):
            url = "/servicesNS/nobody/broken_hosts/storage/collections/data/bh_suppressions"

        if url != None:
            splunk.rest.simpleRequest(
                url,
                method='POST',
                jsonargs=json.dumps(line),
                sessionKey=session_key
            )


# initialize the handler
admin.init(BrokenHostsSetup, admin.CONTEXT_NONE)
