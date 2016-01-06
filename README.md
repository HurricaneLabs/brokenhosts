Copyright 2015 Hurricane Labs

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
