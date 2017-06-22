Copyright 2017 Hurricane Labs

Default configuration for broken hosts sanity check  
Use the expectedTime lookup table for tuning

Lookup File Editor app (https://splunkbase.splunk.com/app/1724/) is extremely helpful for tuning

# Installation steps: #
=======================

1. install app on your splunk search head
2. run app setup

# How does the app work? #
==========================

The main part of this app is a saved search that looks at the last time that a log was received for each index/sourcetype/host and alerts if that is later than "expected".

There are macros to define a few defaults: (App setup will configure these macros)

- "default_contact" - Default contact (email address) - Default contact to send alert emails to [default is a dummy email]
- "default_expected_time" - Default expected time (in seconds) - Default number of "late seconds" (amount of time that a host can be late before alerting) [default is 4 hours]
- "ignore_after" - Ignore host after time (seconds) - Maximum number of seconds that the app will look at (anything that has not sent logs longer than this setting will NOT trigger alerts) [default is 30 days]
- "search_additions" - added near the beginning of the search to allow for custom actions - One example for this is two hosts that are a failover-pair can be combined with: "eval host=if(searchmatch(host=hostA OR host=hostB),"hostPair",host)"

The contact and "late seconds" can be configured for different indexes/sourcetypes/hosts in the "expectedTime" lookup table (the Lookup Editor app is really helpful, since it allows you to edit the lookup table from within Splunk).

The search runs every 30 minutes, and will wait 1 hour before re-alerting for the same items.

Each line of the lookup table has several columns. The first three (index, sourcetype, host) are used to select which data you are adjusting settings for. These are case-insensitive and wildcard enabled fields.

- These fields are all required
- For example, if you want to specify late seconds for all hosts in an index, then you would specify the index and put an asterisk in the "sourcetype" and "host" columns.

The next column is "lateSecs", this is the number of "late seconds" for this host (amount of time that a host can be late before alerting).

- This field is requred
- You can set this to zero (0) if you don't want any alerts for that host/index.

The fifth column is "suppressUntil". This allows you to temporarily suppress the alerts.

- This field is optional
- Format is MM/DD/YYYY HH:MM:SS
- A host will not alert until the given date
- For example, if you want to suppress a host because it won't be fixed until a specific change window, then you set this column to be the datetime of that change window so that you don't get alerted every hour for that host.
- NOTE: If this date is more than the "Ignore host after time" (see above), then this host might not alert after the "suppressUntil" time is up.

The next column is "contact". This allows you to send the alerts for different items to different email addresses

- This field is optional
- This will allow you to route alerts to the most appropriate group for remediation

The final column is "comments". This is a non-functional column that is intended to help remember why a line was set a certain way.

- This field is optional
- For example, if a suppression was set until a change window, then maybe the change ticket number can be referenced in this column.

Because the lookup table is searched from the top down and splunk takes the first match, it is recommended to put the lookup table entries in the following order:

- All entries that have a specific index, specific sourcetype, AND specific host (no wildcards- or partial wildcard matching) at the top
- All entries with a wildcard ONLY in the index field
- All entries with a wildcard ONLY in the sourcetype field
- All entries with a wildcard ONLY in the host field
- All with only a specific host
- All with only a specific sourcetype
- All with only a specific index

# Dashboard #
-------------

Broken Hosts dashboard can be used to get a visual picture of the current status of hosts.

"Broken Hosts" panel will show all hosts that are not reporting in time.
"Future Hosts" panel will show all hosts that are reporting timestamps from the future.

These panels will allow you to quickly update expectedTime lookup table to suppress a host from monitoring. Clicking on "Suppress" next to an item will remove it from the dashboard and alerts by adding it to the tuning spreadsheet.

"Suppressed Items" will show you the current contents of the "expectedTime" lookup table.

# For support: #
================

- Send email to splunk@hurricanelabs.com
- Support is not guaranteed and will be provided on a best effort basis.


# RELEASE NOTES: #
==================

v3.3.2:

- added "cim_modactions" index to the default suppressions
- updated the order of fields in the broken hosts dashboard
- reordered expectedTime lookup table to be in alphabetical order

v3.3.1:

- bug fixes for splunk certification
 - scale icon sizes down to splunk approved sizes

v3.3.0:

- updated savedsearch to include any hosts that are sending logs from the future
- added the ability to add custom search additions to make the search more flexible
- added dashboard panel to show suppressed items
- updated dashboard panels to show currently broken items, and all items from the future
- added sparkline to the dashboard panels

v3.2.1:

- updated suppression so that alerts are triggered properly
- added a link to 'setup' in the nav menu

v3.2.0:

- modified the savedsearch to use 'tstats' instead of 'metadata' to allow use of sourcetype for tuning
- updated the savedsearch schedule to run every 30 minutes (because tstats takes longer than metadata)
- updated the savedsearch suppression to suppress for 2 hours instead of 1
- updated the savedsearch suppression to include sourcetype
- updated expectedTime lookup table to add a 'sourcetype' column
- updated first_time script to add 'sourcetype' column to lookup table
- added Broken Hosts dashboard
- updated documentation to include Broken Hosts dashboard information
- added app nav color

v3.1.1:

- added script to automatically create the lookup if it doens't already exist
- expanded readme information

v3.1.0:

- Added setup page with default contact and default allowable lateness

v3.0.0:

- Another major rewrite
- Added the ability to suppress an item
- Added the ability to send different items to different contacts

v2.2:

- fixed issue with the index exclusions in the search
- reversed the order of the release notes, putting new version at the top

v2.1:

- wildcard in lookup table instead of empty quoted string
- app is visible (to allow the "run" button on the saved search to work)
- initial lookup table is now named with .sample extention to not over-write any previous tuning

v2.0: complete re-write of the app from scratch

- uses dbinspect and metadata commands to make this search much faster
- uses a lookup table to make tuning a breeze
