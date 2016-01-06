Copyright 2016 Hurricane Labs

Default configuration for broken sources sanity check  
Use the expectedTime lookup table for tuning

Lookup File Editor app (https://splunkbase.splunk.com/app/1724/) is extremely helpful for tuning

Installation steps:
1. copy expectedTime.csv.sample to expectedTime.csv
2. Make sure to create a "local/savedsearches.conf" with this information:  
[Broken Log Sources Sanity Check]  
action.email.subject = <shorname> Splunk Alert: $name$  
action.email.to = <you>@hurricanelabs.com

Additional information for Hurricane Labs Splunk Admins:  
<https://zombiefood.hurricanelabs.rsoc/ops/Splunk_Troubleshooting_Alerting#Splunk_Alert:_Broken_Log_Sources_Sanity_Check>

RELEASE NOTES:
v2.0: complete re-write of the app from scratch
- uses dbinspect and metadata commands to make this search much faster
- uses a lookup table to make tuning a breeze

v2.1:
- wildcard in lookup table instead of empty quoted string
- app is visible (to allow the "run" button on the saved search to work)
- initial lookup table is now named with .sample extention to not over-write any previous tuning

Ideas for future release:
(Not guaranteed to actually make it to any release):
- dashboard
  - results of last run
  - inputlookup to show current items on the tuning lookup
- setup script to perfmorm the initial lookup table copy

