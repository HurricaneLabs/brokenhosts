Advanced Configuration
======================

In addition to all of the Splunk-native configurations, the Broken Hosts app has additional
internal configuration. These items are considered "advanced" and may or may not be useful to you.
These settings can be found in ``bh.conf``.

[validation]
------------

- ``comments_must_have_ticket_number`` (boolean) - Primarily intended for Hurricane Labs managed
  Splunk customers. Enforces a restriction on the ``comment`` field of the Broken Hosts Lookup
  requiring a 5-or-more digit number to be entered for change management purposes (in the format
  ``#12345``). The default value for this setting is ``false``.
