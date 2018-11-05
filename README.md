Copyright 2017 Hurricane Labs

Default configuration for broken hosts sanity check  
Use the expectedTime lookup table for tuning

Lookup File Editor app (https://splunkbase.splunk.com/app/1724/) is extremely helpful for tuning

Additional information can be found here: https://www.hurricanelabs.com/blog/broken-hosts-app-for-splunk-part-1

# Installation steps: #
=======================

1. install app on your splunk search head
2. run app setup

# Update Instructions [IMPORTANT]: #
====================================

v4.0.0 might require a splunk restart for javascript changes to take effect

# How to use this app? #
==========================

We will fill in this section with more details instructions in a later version.
In the mean time, take a look at the SplunkBase page for this app for usage instructions

# Dashboard #
-------------

Broken Hosts Dashboard
- Can be used to get a visual picture of the current status of hosts.

Configure Broken Hosts Lookup [New in v3.3.3]
- Allows users to CRUD the expectedTime KV Store.
- Validation is applied to specific fields to help ensure appropriate values are provided



# For support: #
================

- Send email to splunk@hurricanelabs.com
- Support is not guaranteed and will be provided on a best effort basis.


# RELEASE NOTES: #
==================

v4.0.0
- fixed a bug in Google Chrome 70 that can cause the app to completely lose its configuration
- changed how the app works for increased flexibility and performance
- Added investigation dashbaord

v3.3.6 
- Row reordering feature added to 'Configure Broken Hosts Lookup' page. Can drag rows using the 'Comments' column.
- 'Add New Suppression' button added to top right to make more visible.
- Ability to Copy formatted row data to clipboard
- Added expectedTime_tmp for backup purposes. 
  - In edge cases where KV Store is being updated after a row-reorder on Configure page and user refreshes, KV Store data could be lost.
For this reason, every change made backs up the current version to a expectedTime_tmp KV Store first
  - On initial load of the table it will check if expectedTime is empty, if it is it will then check expectedTime_tmp for data and use
that as a backup in case the KV Store was emptied. If both are empty then it is assumed this is a new install and the user has an option
to add default values to the KV Store.

v3.3.5
- updated the savedsearch to account for sourcetype rewrites

v3.3.4
- Removed unnecessary inputs.conf

v3.3.3:

- The expectedTime lookup definition now references a KV Store instead of a lookup file
- Removed bin/ directory - Python script for generating lookup is no longer needed
- Removed lookups directory as it is now using a KV Store [expectedTime]
- lateSecs field now accepts Splunk's relative time format e.g. -1d@d OR 0 for 'Always Suppress'
- New dashboard: "Configure Broken Hosts Lookup" allows for CRUDing expectedTime KV Store
   - Applies validation to help ensure proper values are added into the lookup
   - Table highlights when two conditions are met:
       - If lateSecs is set to 'Always Suppress' and but a suppressUntil date has been provided.
       - If suppressUntil has a date that is in the past.
- New alert: "Broken Hosts – Suppress Until Is Set Past Date"
   - Runs nightly at 12:01am to check if any suppressUntil values are in the past
   - Alerts pre-defined contact

v3.3.2:

- fixed a bug where the the broken hosts dashboard would show the wrong value for "Time Since Last Event"
- updated the app to work if the app directory is renamed
- updated the order of fields in the broken hosts dashboard
- reordered default expectedTime lookup table to be alphabetical
- added "cim_modactions" index to the default suppressions
- added cisco:ios default suppression
- added pan_config and pan:config default suppressions

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

