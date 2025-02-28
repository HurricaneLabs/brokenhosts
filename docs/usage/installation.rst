Installation
============

New Installations
-----------------

.. __: https://docs.splunk.com/Documentation/AddOns/released/Overview/Distributedinstall#Search_head_clusters

Note: If you are installing the Broken Hosts App on a search head cluster, follow
`Splunk's documentation for app installation`__

1. On the Splunk toolbar, select **Apps > Find More Apps**.
2. In the search box, search for **broken hosts**.
3. Next to the Broken Hosts App for Splunk, select the **Install** button.
4. Follow the prompts and, if necessary, restart Splunk.
5. (Optional, but recommended) - Backfill summary index by running this CLI command:

::

	cd $SPLUNK_HOME/bin && ./splunk cmd python fill_summary_index.py -app broken_hosts -name bh_stats_gen -dedup true -et -30d@d -lt now -j 10 -showprogress true


Once the app is installed, please review the :ref:`configuration` documentation.

.. _upgrading:

Upgrading
---------

1. On the Splunk toolbar, select **Apps > Manage Apps**.
2. Find the Broken Hosts App for Splunk.
3. Under the Version column, select **Update to 5.x.x**.
4. Follow the prompts and, if necessary, restart Splunk.
5. Follow any version-specific upgrade instructions below.

Upgrading to 5.x.x from 4.x.x
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Starting with Broken Hosts 5.0.0 data source alert threshold tunings and suppressions have been separated into separate lookups.

Note that the below searches use the ``| outputlookup`` command to update the lookups used by Broken Hosts. This command is labled as risky by default in Splunk,
and a warning message will be displayed if this has not been changed. Users can safely click through this warning. If you wish to permanently disable it,
Cloud customers can open a support case to remove it from the list of risky commands. Enterprise customers can add a commands.conf file to the
default/ directory in the Broken Hosts app to prevent the warning from popping up.
Existing alerting will still function until the following steps are completed, but issues may arise if the following steps are not followed.
Additionally, you will not be able to add new suppressions to expectedTime after updating.

Steps to upgrade to version 5.0.0+ from version 4.x.x:
1. Run the search ``Broken Hosts - Populate bh_suppressions from expectedTime``
2. Run the search ``Broken Hosts - Clear Permanent Suppressions expectedTime``
3. Enable the search ``Broken Hosts - Auto Sort v5``
4. Disable the search ``Broken Hosts - Auto Sort``
5. Enable the search ``Broken Hosts - Purge and Sort bh_suppressions``

The above searches will automatically populate the new bh_suppressions lookup with currently used suppression entries in expectedTime,
clear expectedTime of all permanent suppressions, enable new expectedTime sorting logic, and schedule a search to automatically remove
outdated entries from bh_suppressions.


Upgrading to 4.0.x from 3.x or below
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Starting with Broken Hosts 4.0.1, the ``Broken Hosts Sanity Check`` has been split into two
pieces, neither of which is enabled by default. To restore similar behavior to previous versions,
follow these steps:

1. (Optional, but recommended) - Backfill summary index by running this CLI command:

::

	cd $SPLUNK_HOME/bin && ./splunk cmd python fill_summary_index.py -app broken_hosts -name bh_stats_gen -dedup true -et -30d@d -lt now -j 10 -showprogress true

2. Review your ``search_additions`` macro to determine which functionality must occur in the stats
   generation phase, and which must occur in the alert generation phase.
3. Copy the stats generation parts of your existing ``search_additions`` macro to the new
   ``bh_stats_gen_additions`` macro.
4. Copy the alert generation parts of your existing ``search_additions`` macro to the new
   ``bh_alert_additions`` macro.
5. Enable the ``Broken Hosts Alert - by contact`` search.

Afterwards, we recommend reviewing the :ref:`configuration` documentation to get a feel for how
the new split searches work, and things you can do now with the standalone alerting searches that
were impossible previously with the unified search.

Upgrading to 3.3.3
~~~~~~~~~~~~~~~~~~

Starting with Broken Hosts 3.3.3, the Broken Hosts Lookup is stored in KV store rather than in a
CSV file. Once you have completed this upgrade, follow these steps to convert your lookup file to
KV Store:

1. Open a search panel and run the following search:

::

    | inputlookup expectedTime.csv

2. Confirm the results appear as expected - this should display your existing Broken Hosts Lookup.
3. Run the following search to dump the existing lookup into the new KV Store lookup.

::

    | inputlookup expectedTime.csv | outputlookup expectedTime

4. Go to the ``Configure Broken Hosts Lookup`` dashboard to confirm that the configuration is
   correct.
