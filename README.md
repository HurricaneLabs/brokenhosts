Copyright 2016 Hurricane Labs

Default configuration for broken hosts sanity check  
Use the expectedTime lookup table for tuning

Lookup File Editor app (https://splunkbase.splunk.com/app/1724/) is extremely helpful for tuning

# Installation steps: #
=======================
1. install app on your splunk search head
2. run app setup


# How does the app work? #
==========================
This works using splunk metadata. This metadata contains information about when the last time a log was received, and we alert if that is later than "expected". 
There is a default number of seconds that a host is allowed to be late (late seconds) that is configured in the set up page [default is 4 hours], and you can configure a different amount of late seconds in the lookup table (the Lookup Editor app is really helpful, since it allows you to edit the lookup table from within Splunk). 

The search runs every 10 minutes, and will wait 1 hour before alerting again after it triggers.

Each line of the lookup table has several columns. The first two are index and host. These are used to select which data you want to adjust the late seconds for. If you want to specify late seconds for all hosts in an index, then you would put an asterisk (*) in the "host" column. Likewise, if you want to specify late seconds for an entire host no matter which index the data is in, then you would put an asterisk (*) in the "index" column. 

The next column is "lateSecs", this is the number of seconds that a host is late before it alerts. You can set this to zero (0) if you don't want any alerts for that host/index. 
The column after that is "suppressUntil". This allows you to temporarily suppress the alerts. If you set this to a datetime stamp, then it will not alert until that date (Note: if a host has not sent data in a month, then you will no longer receive alerts for that host.) - For example, if you want to suppress a host because it won't be fixed until a specific change window, then you set this column to be the datetime of that change window so that you don't get alerted every hour for that host.

The next column is "contact". You can specify different contacts for different hosts. The email address listed in the "set up" page is the default contact, if one isn't set for that host in the lookup table.  

The final column is "comments", which is helpful when editing the lookup table to remember why a line was set the way it was. (For example, if a suppression was set until a change window, then maybe the change ticket number can be referenced in this column).

One final thing to note is that the lookup table is searched from the top down, and splunk takes the first match. 
For example, if this is what your lookup table looks like:
index,host,latesecs,suppressUntil,contact,comments
*,*,0,,,suppress everything
firewall,fw01,600,,,alert if firewall logs are more than 10 minutes late

The fw01 host will not alert because the wildcard line is further up.
For this reason, I recommend putting all entries that have a specific index and a specific host (no wildcards) at the top of the lookup table, followed by entries with a wildcard in the index and a specific host, and put entries with a specific index and wildcard in the host field at the bottom of the lookup table.

# For support: #
================
* Send email to splunk@hurricanelabs.com
* Support will be provided on a best effort basis.


# RELEASE NOTES: #
==================
v3.1.1:
* added script to automatically create the lookup if it doens't already exist
* expanded readme information

v3.1.0:
* Added setup page with default contact and default allowable lateness

v3.0.0:
* Another major rewrite
* Added the ability to suppress an item
* Added the ability to send different items to different contacts

v2.2:
* fixed issue with the index exclusions in the search
* reversed the order of the release notes, putting new version at the top

v2.1:
* wildcard in lookup table instead of empty quoted string
* app is visible (to allow the "run" button on the saved search to work)
* initial lookup table is now named with .sample extention to not over-write any previous tuning

v2.0: complete re-write of the app from scratch
* uses dbinspect and metadata commands to make this search much faster
* uses a lookup table to make tuning a breeze

Ideas for future release:
(Not guaranteed to actually make it to any release):
* dashboard
  * results of last run
  * inputlookup to show current items on the tuning lookup

