Eventtype Aggregations
======================

Using eventtypes to aggregate data
----------------------------------

A common request for users of older versions of Broken Hosts was to be able to aggregate certain
types of data together. For example, if any of the ``WinEventLog`` sourcetypes are coming in from
a particular Windows host, that's usually enough to feel comfortable that things are working as
expected. While this was possible in those versions of Broken Hosts thanks to the
``search_additions`` macro, that macro would quickly become complex and hard to manage. Starting
with Broken Hosts 4.0, however, there's now an easier mechanism for defining complex aggregations.

Eventtype Aggregations provide a simple, Splunk-native way to define these complex aggregations.
Eventtype Aggregations are eventtypes named in a specific format:
``bh_aggregate-$index,$sourcetype,$host``. The ``$index``, ``$sourcetype``, and ``$host`` here can
be replaced by either a field placeholder (``%orig_index%``, for example) or with a static value.
Using a static value, such as ``WinEventLog`` for ``$sourcetype``, allows you to group matching
data sources together. It is important to note

This concept is likely best illustrated by an example: Imagine you have a pfSense firewall, along
with the pfSense TA. This means the syslog from your firewall is coming into Splunk, and is split
into several different sourcetypes. However, pfSense has one stream of syslog, and if any of these
sourcetypes is working, it is generally safe to assume that the syslog function in pfSense is
operational. To aggregate these sourcetypes together, you could use an eventtype similar to the
following:

::

    orig_sourcetype=pfsense*

You would then name this eventtype something like
``bh_aggregate-%orig_index%,pfsense,%orig_host%``. Once you have this created, you can add a single
line to the Broken Hosts Lookup, using the actual index and host, but using "pfsense" for the
sourcetype. Now, for each pfSense firewall you have, you will receive one alert if **all** of the
sourcetypes stop coming in for that firewall. Without aggregations, you would instead receive an
alert if **any** sourcetype stopped coming in for that firewall.

Suppressions
------------

In addition to setting ``lateSecs`` to ``0`` in the Broken Hosts Lookup, the Broken Hosts app also
supports an eventtype-based suppression mechanism. This allows you to access all of the fields
available in the summary data, including the ``date_*`` fields, allowing you to create some very
complex suppressions using eventtypes that would otherwise be impossible with just the lookup. The
naming scheme for these eventtypes is ``bh_suppress-label``, where label can be any arbitrary text
(assuming it produces a valid eventtype name).

For example, if you wanted to suppress events in your proxy index off-hours, you could create an
eventtype called ``bh_suppress-proxy_off_hours`` similar to the following:

::

    orig_index=proxy date_wday="saturday" OR date_wday="sunday" OR date_hour<8 OR date_hour>17
