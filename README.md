# Broken Hosts App for Splunk
The Broken Hosts App for Splunk is a useful tool for monitoring data going into Splunk. It has the ability to alert when hosts stop sending data into Splunk, as well as inspect the last time the final combination of data was received by Splunk.

If the arrival of the final log for the index/sourcetype/host combination is later than expected, the Broken Hosts App will send an alert. This allows for quick status detection of the hosts and fast issue resolution.

The Broken Hosts App for Splunk is the app for monitoring missing data in Splunk. The app’s three main objectives include:
1. Alerting when data is missing from Splunk in order to determine the cause.
2. Utilizing saved searches to facilitate rapid detection of the missing data.
3. Creating dashboards for visualization to help with further investigations.

## Features
- Detects gaps in data being collected into Splunk
- Detects unexpected latency in data being collected into Splunk
- Generates statistics about data being collected into Splunk for other uses
- Includes dashboards for investigating broken data sources
- Use Splunk modular alert actions for sending alerts
- Lookup- and Eventtype-based configuration

## Quickstart

1. Install the `Broken Hosts App for Splunk` on your ad-hoc search head.
2. Use the `Broken Hosts` dashboard to determine appropriate baselines for all of your critical
   data.
3. Use the `Configure Broken Hosts Lookup` dashboard to configure your baselines and create
   suppressions.
4. Configure alert actions on the `Broken Hosts Alert Search` saved search in the Broken Hosts
   App for Splunk.
5. Enable the `Broken Hosts Alert Search` saved search in the Broken Hosts App for Splunk.

## Documentation
https://brokenhosts.hurricanelabs.com

