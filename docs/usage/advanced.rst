Advanced Examples
=================

Custom stats gen searches
-------------------------

::

    multiple check point firewalls, one management server
    "firewall" isn't tracked by index/sourcetype/host
    use stats gen search to output stats gen data w/ extra field ("firewall")
    use eventtype aggregation
        eventtype: orig_index=checkpoint orig_host=management
        name: bh_aggregate-%orig_index%,%orig_sourcetype%,%firewall%
    entries in lookup are index=firewall, sourcetype=checkpoint\*, host=firewall
