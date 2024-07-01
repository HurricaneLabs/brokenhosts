.. _macros:

Macros
======

bh_stats_gen_constraints
------------------------

The ``bh_stats_gen_constraints`` macro is used to control what data is examined by the
``bh_stats_gen`` search when generating the metrics used by the alerting searches. The default
behavior is to exclude all data in the summary index, and all data from the stash sourcetype, but
include all other data.

**NOTE**: This macro is used within a ``tstats`` command, and therefore the macro's must be valid
``tstats`` syntax.

bh_stats_gen_additions
----------------------

The ``bh_stats_gen_additions`` macro is used to insert arbitrary SPL into the ``bh_stats_gen``
search in order to transform data before it is written to the summary index.

Example: use ``eventstats`` and ``eval`` statements to calculate custom metrics to be stored in
the summary data.

bh_alert_additions
------------------

The ``bh_alert_additions`` macro is used to insert arbitrary SPL into the alerting searches, in
order to transform data before it is written to the summary index.

Example: Apply subsearch logic from a monitoring system to automatically exclude hosts that are
known to be offline

default_contact
---------------

The ``default_contact`` macro is used only for the ``Broken Hosts Alert - by contact`` search. It
is used to set the default email address for items that don’t have a separate contact listed in
the ``contact`` column of the lookup table.

default_expected_time
---------------------

The ``default_expected_time`` macro is used to set a default ``lateSecs`` value for things not
defined in the lookup. The ``lateSecs`` value tells Broken Hosts how long a specific source of data
is allowed to go without sending data before an alert should be triggered. This setting is in
seconds, and defaults to 14400 (4 hours).

bh_linuxoslog_index
-------------------
Sets the default index for Linux OS logs for the Tuning/Investigation Dashboard. Defaults to index=os

bh_wineventlog_index
--------------------
Sets the default index for Windows for the Tuning/Investigation Dashboard. Defaults to index=wineventlog

bh_volume_alerting_indexes
--------------------------

The ``bh_volume_alerting_indexes`` macro is used in the searches 
``Broken Hosts Alert - Volume Alerting`` and 
``Broken Hosts Alert - Volume Alerting with Seasonality``. It contains a comma separated list of
indexes.
