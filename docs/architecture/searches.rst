.. _searches:

Saved Searches
==============

bh_stats_gen
------------

The ``bh_stats_gen`` search is responsible for generating statistics about data coming into Splunk.
The results are written to the ``summary`` index, to be picked up and read by other searches for
alerting purposes. It can be fine-tuned using the ``bh_stats_gen_contraints`` and
``bh_stats_gen_additions`` macros. By default, it will look over all data sources that have sent
logs over the past 36 hours. If you have a data source that is regularly delayed longer that you
wish to monitor, this time range will need to be adjusted.

Broken Hosts - Auto Sort
------------------------

The ``Broken Hosts - Auto Sort`` search was implemented in order to optimize the ordering of the
Broken Hosts Lookup. Because the lookup is evaluated in a first-match fashion, the ordering of the
lookup is critical to preventing incorrect matches. You can view more information about the
ordering of the lookup in the :ref:`searches` documentation.

This search modifies the Broken Hosts Lookup in the following ways:

1. Entries are reordered based on the ordering rules defined in the :ref:`searches` documentation.
2. All fields are converted to lower case, as the lookup is case insensitive.

Broken Hosts Alert Search
-------------------------

``Broken Hosts Alert Search`` is the recommended way to get started building your own custom
alerting search. This search produces a single output row for each broken item, and ignores the
``contact`` field from the lookup completely. There are no alert actions defined on this search,
so you are free to configure them as needed. A few examples include:

- Add an email alert action to send a tuning report to your Splunk admins
- Add a webhook alert action to create tickets in your ticketing system

You can also create clones of this search to enable different alerting for different types of data.
For example, you may want to send email notifications to your Windows server admins when a server
stops sending ``WinEventLog:Security`` but want to trigger a ticket to your helpdesk when your
anti-virus system stops sending logs. You can even run a version of this search on your
``Enterprise Security`` search head to generate notable events.

Broken Hosts Alert - by contact
-------------------------------

``Broken Hosts Alert - by contact`` is primarily intended for anyone upgrading from an older
version of Broken Hosts. This search groups the alert lines by the ``contact`` field from the
lookup, and each contact will receive one email (the email action is configured by default on this
search). This search also relies on the ``default_contact`` macro to populate the contact when
none is defined in the lookup table.

If you're coming from an older version of Broken Hosts and choose to implement this search, we'd
still recommend you review the new ``Broken Hosts Alert Search`` as you may find additional uses
from it that were difficult or impossible in previous versions of the app.

Broken Hosts Alert - Volume Alerting
------------------------------------

``Broken Hosts Alert - Volume Alerting`` and 
``Broken Hosts Alert - Volume Alerting with Seasonality`` are two example searches that can be used
to generate alerts on indexes that may have stopped ingesting data properly while still generating
some amount of logs. Both searches use a combination of standard score (z-score), moving averages,
and percentiles to determine whether or not log volume is anamalously low for that index. 
``Broken Hosts Alert - Volume Alerting with Seasonality`` additionally factors in the time of day,
day of the week, and whether the day is a holiday to determine normal logging activity for indexes
whose volume may be sensitive to user activity.

The macro ``bh_volume_alerting_indexes`` is used to designate which indexes should be alerted on.
If both ``Broken Hosts Alert - Volume Alerting`` and 
``Broken Hosts Alert - Volume Alerting with Seasonality`` are needed, a new macro can be created 
and used to designate the indexes that should be used for each search.
