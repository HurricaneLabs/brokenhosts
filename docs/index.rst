Broken Hosts App for Splunk
===========================

The Broken Hosts App for Splunk is a useful tool for monitoring data going into Splunk. It has the
ability to alert when hosts stop sending data into Splunk, as well as inspect the last time the
final combination of data was received by Splunk.

If the arrival of the final log for the index/sourcetype/host combination is later than expected,
the Broken Hosts App will send an alert. This allows for quick status detection of the hosts and
fast issue resolution.

The Broken Hosts App for Splunk is the app for monitoring missing data in Splunk. The app’s three
main objectives include:

1. Alerting when data is missing from Splunk in order to determine the cause.
2. Utilizing saved searches to facilitate rapid detection of the missing data.
3. Creating dashboards for visualization to help with further investigations.

Features
--------

- Detects gaps in data being collected into Splunk
- Detects unexpected latency in data being collected into Splunk
- Generates statistics about data being collected into Splunk for other uses
- Includes dashboards for investigating broken data sources
- Use Splunk modular alert actions for sending alerts
- Lookup- and Eventtype-based configuration

Quickstart
----------

.. __: https://splunkbase.splunk.com/app/3247/

If you're an existing Broken Hosts user, please be sure to review our :ref:`upgrading`
documentation.

1. Install the `Broken Hosts App for Splunk`__ on your ad-hoc search head.
2. Use the ``Broken Hosts`` dashboard to determine appropriate baselines for all of your critical
   data.
3. Use the ``Configure Broken Hosts Lookup`` dashboard to configure your baselines and create
   suppressions.
4. Configure alert actions on the ``Broken Hosts Alert Search`` saved search in the Broken Hosts
   App for Splunk.
5. Enable the ``Broken Hosts Alert Search`` saved search in the Broken Hosts App for Splunk.

Known Issues
------------

- Future hosts in the ``Broken Hosts Alert Search`` may not match the future hosts displayed on the
  ``Broken Hosts`` dashboard. Future host detection will be moved to a separate search in a
  future release of the Broken Hosts App.
- search-time renaming of sourcetypes is not taken into account

Documentation
-------------

.. toctree::
   :maxdepth: 2

   usage/index
   architecture/index

Changelog
---------

Version 4.3.1 (2024-03-25)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Fixed an issue causing main dashboard not to display some panels

Version 4.2.5 (2023-12-29)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Fixes JS security issue and restores bh_stats_gen source tracking

Version 4.2.3 (2023-09-14)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Fixed search logic issues that were opened by ew426 on Github (Thank you!)

Version 4.1.5 (2023-06-07)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Fix for broken configuration page on Splunk Cloud

Version 4.1.4 (2022-08-31)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Fix app.manifest version number
- Fix bug in Configure Broken Hosts Lookup dashboard where dropdowns for index, sourcetype, and host were not populating
- Moved JS dependency into local appserver folder to fix AppInspect issue

Version 4.1.3 (2022-07-15)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- This update removes the default suppression of Splunk Cloud hosts to reflect changes made to Splunk inputs as part of the Victoria experience.

Version 4.1.2 (2022-01-25)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- outputlookup removed from configure_lookup.xml dashboard
- Removed all use of outputlookup command to meet Splunk Cloud requirements. Replaced with API requests.
- Bug fix on batch update - incorrect increment could cause limit to be hit when updating causing loss of data in KV
- Better error handling - shows errors in UI if failure to edit or delete

Version 4.1.1 (2022-01-13)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Updated app manifest to specify installation only on search heads in Cloud

Version 4.1.0 (2021-12-15)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Improvements to the “Configure Broken Hosts Lookup” page
- Bug fix: when results hit over 1k entries, it hits the default 1k limit in limits.conf resulting in the kv store being emptied out. The results are now batched to prevent this issue.

Version 4.0.9 (2021-09-20)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Fix setup page not loading

Version 4.0.8 (2021-09-17)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Setup page added for app configuration

Version 4.0.6 (2021-09-07)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Updated dashboards to XML version 1.1 for jQuery 3.5 compatibility
- Trigger stanza added to app.conf for bh.conf file

Version 4.0.5 (2020-06-19)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- update bh_stats_gen to use a more meaningful time for the summary events
- update the alert searches to no longer look into the future for summary events, since that's not possible
- include wineventlog aggregation
- make pfsense aggregation work with splunk web validation
- make pfsense aggregation more generic to apply more broadly
- dropdowns on Configure Broken Hosts lookup now paginate to help prevent against browser crashing when loading extremely large data-sets

Version 4.0.4 (2018-12-12)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- updated bh_stats_gen search to fix a bug that might cause false positives
- set eventtypes to be local to the app instead of global

Version 4.0.3 (2018-12-10)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- updated AutoSort to allow for arbitrary fields
- update investigation panel to have a more useful graph
- fixed type in app.conf that was preventing successful vetting

Version 4.0.2 (2018-11-14)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- Revamped architecture

  - Decouple stats generation from alert generation
  - Eventtype-based aggregations and suppressions

- Additional investigation dashboards
- KV Store auto-sort functionality (enabled by default) to prevent false positive matches
- Fixed an issue when using Chrome v70 that caused loss of data in the ``expectedTime`` lookup

Version 3.3.6 (2018-03-18)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- Row reordering feature added to 'Configure Broken Hosts Lookup' page. Can drag rows using the
  'Comments' column.
- 'Add New Suppression' button added to top right to make more visible.
- Ability to Copy formatted row data to clipboard
- Added expectedTime_tmp for backup purposes.

  - In edge cases where KV Store is being updated after a row-reorder on Configure page and user
    refreshes, KV Store data could be lost. For this reason, every change made backs up the current
    version to a expectedTime_tmp KV Store first
  - On initial load of the table it will check if expectedTime is empty, if it is it will then
    check expectedTime_tmp for data and use that as a backup in case the KV Store was emptied. If
    both are empty then it is assumed this is a new install and the user has an option to add
    default values to the KV Store.

Version 3.3.5 (2018-01-04)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- updated the savedsearch to account for sourcetype rewrites

Version 3.3.4 (2017-12-13)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- Removed unnecessary inputs.conf

Version 3.3.3 (2017-12-12)
~~~~~~~~~~~~~~~~~~~~~~~~~~

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

Version 3.3.2 (2017-08-29)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- fixed a bug where the the broken hosts dashboard would show the wrong value for "Time Since
  Last Event"
- updated the app to work if the app directory is renamed
- updated the order of fields in the broken hosts dashboard
- reordered default expectedTime lookup table to be alphabetical
- added "cim_modactions" index to the default suppressions
- added cisco:ios default suppression
- added pan_config and pan:config default suppressions

Version 3.3.1 (2017-06-12)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- bug fixes for splunk certification
- scale icon sizes down to splunk approved sizes

Version 3.3.0 (2017-06-02)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- updated savedsearch to include any hosts that are sending logs from the future
- added the ability to add custom search additions to make the search more flexible
- added dashboard panel to show suppressed items
- updated dashboard panels to show currently broken items, and all items from the future
- added sparkline to the dashboard panels

Version 3.2.1 (2016-11-14)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- updated suppression so that alerts are triggered properly
- added a link to 'setup' in the nav menu

Version 3.2.0 (2016-11-14)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- modified the savedsearch to use 'tstats' instead of 'metadata' to allow use of sourcetype for tuning
- updated the savedsearch schedule to run every 30 minutes (because tstats takes longer than metadata)
- updated the savedsearch suppression to suppress for 2 hours instead of 1
- updated the savedsearch suppression to include sourcetype
- updated expectedTime lookup table to add a 'sourcetype' column
- updated first_time script to add 'sourcetype' column to lookup table
- added Broken Hosts dashboard
- updated documentation to include Broken Hosts dashboard information
- added app nav color

Version 3.1.1 (2016-08-09)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- added script to automatically create the lookup if it doens't already exist
- expanded readme information

Version 3.1.0 (2016-06-29)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- Added setup page with default contact and default allowable lateness

Version 3.0.0 (2016-06-24)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- Another major rewrite
- Added the ability to suppress an item
- Added the ability to send different items to different contacts

Version 2.2.1 (2016-04-14)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- force host to lowercase for comparisons

Version 2.2 (2016-04-14)
~~~~~~~~~~~~~~~~~~~~~~~~

- fixed issue with the index exclusions in the search
- reversed the order of the release notes, putting new version at the top

Version 2.1 (2016-01-05)
~~~~~~~~~~~~~~~~~~~~~~~~

- wildcard in lookup table instead of empty quoted string
- app is visible (to allow the "run" button on the saved search to work)
- initial lookup table is now named with .sample extention to not over-write any previous tuning

Version 2.0 (2015-10-20)
~~~~~~~~~~~~~~~~~~~~~~~~

- complete re-write of the app from scratch
- uses dbinspect and metadata commands to make this search much faster
- uses a lookup table to make tuning a breeze

License
-------

.. highlight:: none
.. include:: LICENSE
   :literal:
