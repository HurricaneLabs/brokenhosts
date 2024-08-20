expectedTime
============

Using expectedTime
------------------

The easiest way to update expectedTime is via the ``Configure Tunings`` dashboard.
There are six fields used in this lookup table (all fields are case *insensitive*):

- ``index`` - The index for the data that you would like to match - this field does accept
  wildcards - this field is required
- ``sourcetype`` - The sourcetype for the data that you would like to match - this field does
  accept wildcards - this field is required
- ``host`` - The host for the data that you would like to match - this field does accept
  wildcards - this field is required
- ``lateSecs`` - The amount of time (in seconds) that the index/sourcetype/host combination is
  allowed to be late before it alerts - this field is required
- ``contact`` - The email address where you would like the alert to be sent - if this is blank,
  the email address from the default_contact macro will be used - this field is optional
- ``comments`` - Any comments that you would like to add for that line of the lookup table. This
  information is not used in the alert. This field is typically used to record information about
  why the entry is needed, when it was added, who added it, or any other details. This field is
  optional

Ordering
--------

Ordering of entries in the Broken Hosts Lookup is important, but the Broken Hosts App ships with
a saved search that will re-order the lookup table in a logical way. As a result of several years
analyzing expected behavior across our customers. \* means wildcard

For Version 5 and above:

1. index!=\* AND sourcetype!=\* AND host!=\*
2. index!=\* AND sourcetype!=\* AND host==\*
3. index!=\* AND sourcetype==\* AND host!=\*
4. index==\* AND sourcetype!=\* AND host!=\*
5. index==\* AND sourcetype==\* AND host!=\*
6. index==\* AND sourcetype!=\* AND host==\*
7. index!=\* AND sourcetype==\* AND host==\*
8. Comments field starts with "default entry"
9. index==\* AND sourcetype==\* AND host==\*

For Versions below 5:

1. Entries where index=\* AND sourcetype=\* AND alerting is temporarily suppressed
2. Entries where sourcetype=\* AND alerting is temporarily suppressed
3. Entries where index=\* AND alerting is temporarily suppressed
4. Entries where host=\* AND alerting is temporarily suppressed
5. Entries where index=\* AND host=\* AND alerting is temporarily suppressed
6. Entries where sourcetype=\* AND host=\* AND alerting is temporarily suppressed
7. Entries where alerting is temporarily suppressed
8. Entries where index=\* AND sourcetype=\* AND alerting is permanently suppressed
9. Entries where lateSecs is temporarily modified
10. Entries where sourcetype=\* AND lateSecs is temporarily modified
11. Entries where index=\* AND lateSecs is temporarily modified
12. Entries where host=\* AND lateSecs is temporarily modified
13. Entries where index=\* AND sourcetype=\* AND lateSecs is temporarily modified
14. Entries where index=\* AND host=\* AND lateSecs is temporarily modified
15. Entries where sourcetype=\* AND host=\* AND lateSecs is temporarily modified
16. Entries where alerting is permanently suppressed
17. Entries where lateSecs is permanently modified, or host=\* AND alerting is permanently
    suppressed, or host=\* AND lateSecs is permanently modified, or sourcetype=\* AND host=\* AND
    alerting is permanently suppressed
18. Entries where index=\* AND host=\* AND alerting is permanently suppressed
19. Entries where sourcetype=\* AND alerting is permanently suppressed
20. Entries where index=\* AND alerting is permanently suppressed
21. Entries where sourcetype=\* AND lateSecs is permanently modified
22. Entries where index=\* AND lateSecs is permanently modified
23. Entries where index=\* AND sourcetype=\* AND lateSecs is permanently modified
24. Entries where index=\* AND host=\* AND lateSecs is permanently modified
25. Entries where sourcetype=\* AND host=\* AND lateSecs is permanently modified
26. Default entries


bh_suppressions
===============

Using bh_suppressions
---------------------

The easiest way to update bh_suppressions is via the ``Configure Suppressions`` dashboard.
There are six fields used in this lookup table (all fields are case *insensitive*):

- ``index`` - The index for the data that you would like to match - this field does accept
  wildcards - this field is required
- ``sourcetype`` - The sourcetype for the data that you would like to match - this field does
  accept wildcards - this field is required
- ``host`` - The host for the data that you would like to match - this field does accept
  wildcards - this field is required
- ``suppressUnil`` - The date which the suppression should expire, in the format YYYY-MM-DD.
  An entry of 0 means the data source is permanently suppressed
- ``contact`` - The email address where you would like the alert to be sent - if this is blank,
  the email address from the default_contact macro will be used - this field is optional
- ``comments`` - Any comments that you would like to add for that line of the lookup table. This
  information is not used in the alert. This field is typically used to record information about
  why the entry is needed, when it was added, who added it, or any other details. This field is
  optional.