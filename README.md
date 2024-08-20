# Broken Hosts App for Splunk

The Broken Hosts App for Splunk is a useful tool for monitoring data going into Splunk. It has the ability to alert when hosts stop sending data into Splunk, as well as inspect the last time the final combination of data was received by Splunk.

If the arrival of the final log for the index/sourcetype/host combination is later than expected, the Broken Hosts App will send an alert. This allows for quick status detection of the hosts and fast issue resolution.

The Broken Hosts App for Splunk is the app for monitoring missing data in Splunk. The app’s three main objectives include:
1. Alerting when data has stopped sending to Splunk.
2. Utilizing saved searches to facilitate rapid detection of the missing data.
3. Creating dashboards for visualization to help with further investigations.

## Features
- Detects gaps in data being collected into Splunk
- Detects unexpected latency in data being collected into Splunk
- Generates statistics about data being collected into Splunk for other uses
- Includes dashboards for investigating broken data sources
- Use Splunk modular alert actions for sending alerts
- Lookup and Eventtype-based configuration

## IMPORTANT - Upgrading from pre-5.0 Broken Hosts
Starting with Broken Hosts 5.0.0 data source alert threshold tunings and suppressions have been separated into separate lookups.

Existing alerting will still function until the following steps are completed, but issues may arise if the following steps are not followed.
Additionally, you will not be able to add new suppressions to expectedTime after updating.

Steps to upgrade to version 5.0.0:
1. Run the search `Broken Hosts - Populate bh_suppressions from expectedTime`
2. Run the search `Broken Hosts - Clear Permanent Suppressions expectedTime`
3. Enable the search `Broken Hosts - Auto Sort v5`
4. Disable the search `Broken Hosts - Auto Sort`
5. Enable the search `Broken Hosts - Purge and Sort bh_suppressions`

The above searches will automatically populate the new bh_suppressions lookup with currently used suppression entries in expectedTime,
clear expectedTime of all permanent suppressions, enable new expectedTime sorting logic, and schedule a search to automatically remove
outddated entries from bh_suppressions.

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

## Cloud Configuration
- By default this app is configured and all configuration options are optional. The following macros are available to configure:
- `default_contact`
- `default_expected_time`
- `ignore_after`		
- `linuxoslog_index`		
- `min_count`		
- `search_additions`	
- `wineventlog_index`
- `bh_volume_alerting_indexes`
- You can also configure the requirement of a ticket number being in comments when updating the table on the Configure Broken Hosts Lookup page. This configuration is availabe on the Setup page in the app.