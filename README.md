Copyright 2016 Hurricane Labs

Default configuration for broken hosts sanity check  
Use the expectedTime lookup table for tuning

Lookup File Editor app (https://splunkbase.splunk.com/app/1724/) is extremely helpful for tuning

Installation steps:
1. install app on your splunk search head
2. run app setup

For support:
- Send email to splunk@hurricanelabs.com
- Support will be provided on a best effort basis.


RELEASE NOTES:
v3.1.1:
- added script to automatically create the lookup if it doens't already exist

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

Ideas for future release:
(Not guaranteed to actually make it to any release):
- dashboard
  - results of last run
  - inputlookup to show current items on the tuning lookup

