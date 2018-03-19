import splunk.admin as admin
import splunk.rest
from splunk import ResourceNotFound
import json

import os
import csv
import re
import sys



'''
Copyright (C) 2005 - 2010 Splunk Inc. All Rights Reserved.
Description:  This skeleton python script handles the parameters in the configuration page.

      handleList method: lists configurable parameters in the configuration page
      corresponds to handleractions = list in restmap.conf

      handleEdit method: controls the parameters and saves the values
      corresponds to handleractions = edit in restmap.conf

'''

class BrokenHostsSetup(admin.MConfigHandler):
    '''
    Set up supported arguments
    '''
    def setup(self):
        pass

    '''
    Read the initial values of the parameters from the custom file
        myappsetup.conf, and write them to the setup page.

    If the app has never been set up,
        uses .../app_name/default/myappsetup.conf.

    If app has been set up, looks at
        .../local/myappsetup.conf first, then looks at
    .../default/myappsetup.conf only if there is no value for a field in
        .../local/myappsetup.conf

    For boolean fields, may need to switch the true/false setting.

    For text fields, if the conf file says None, set to the empty string.
    '''

    def handleList(self, confInfo):
        pass
    '''
    After user clicks Save on setup page, take updated parameters,
    normalize them, and save them somewhere
    '''
    def handleEdit(self, confInfo):
        name = self.callerArgs.id
        args = self.callerArgs
        sessionKey=self.getSessionKey()
        
        splunk_home = os.environ.get("SPLUNK_HOME")
        defaultfile = os.path.join(splunk_home, "etc", "apps", "broken_hosts", "default", "data", "expectedTime.csv.default")
        with open(defaultfile, "r") as f:
            reader = csv.DictReader(f)
            for line in reader:
                self.writeLine(sessionKey, line)

    def writeLine(self, sessionKey, line):
        splunk.rest.simpleRequest('/servicesNS/nobody/broken_hosts/storage/collections/data/expectedTime', method='POST', jsonargs=json.dumps(line), sessionKey=sessionKey)

# initialize the handler
admin.init(BrokenHostsSetup, admin.CONTEXT_NONE)

