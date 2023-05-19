.. _configuration:

Configuration
=============

Enabling the saved search(es)
-----------------------------

Prior to Broken Hosts 4.0, the majority of the app was contained in a search called "Broken Hosts
Sanity Check." This search was a slow, monolithic search that made customized alerting difficult.
Beginning in Broken Hosts 4.0, the search has been broken into two pieces (for more details, see
the :ref:`searches` documentation). The ``bh_stats_gen`` search is enabled by default and does
not require configuration. Alerting, however, is done through a separate search.

Broken Hosts 4.2 ships with four example alerting searches, ``Broken Hosts Alert Search``,
``Broken Hosts Alert - by contact``, ``Broken Hosts Alert - Volume Alerting``, 
and ``Broken Hosts Alert - Volume Alerting with Seasonality``. These searches are meant 
primarily to be examples of how to build alerting using the Broken Hosts data, and can easily 
be duplicated, tweaked, or replaced altogether depending on your requirements. 
If you're new to Broken Hosts, we suggest starting with ``Broken Hosts Alert Search`` and customizing from there.
If you're upgrading from an older version of Broken Hosts and want to continue getting the alerts you're used to, 
you can use ``Broken Hosts Alert - by contact``.

``Broken Hosts Alert - Volume Alerting`` and ``Broken Hosts Alert - Volume Alerting with Seasonality``
provide new options for alerting on indexes that may have ceased proper logging in a way that wouldn't be detected
with traditional alerting. Both of these searches use stastical tests on the existing data from
``bh_stats_gen``. The values set as thresholds for these statistical methods are meant to be a base to work off of,
and may need to be adjusted to work correctly with your data.

Modifying the macros
--------------------

There are a number of macros defined within the Broken Hosts app to allow users to customize the
behavior of the stock searches without significant effort. Some of the macros apply to the stats
collection search, while others are used within the alert searches.

For more information on the macros available for fine-tuning the Broken Hosts app, see the
:ref:`macros` documentation.
