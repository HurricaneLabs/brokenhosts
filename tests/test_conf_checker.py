import os
import sys
import unittest
import configparser
import addonfactory_splunk_conf_parser_lib as conf_parser


class BrokenHostsConfigTest(unittest.TestCase):

    def test_confirm_all_saved_searches_exist(self):
        with open(os.path.join(os.path.abspath('..'), "broken_hosts/default/savedsearches.conf"), "r") as f:
            conf = f.read()

        expected_saved_searches = "['Broken Hosts - Auto Sort', 'Broken Hosts Alert Search', 'Broken Hosts Alert - by contact', 'bh_stats_gen', 'Broken Hosts Alert - Volume Based Alerting', 'Broken Hosts Alert Search - Volume Alerting with Seasonality', 'Lookup Gen - bh_host_cache', 'Lookup Gen - bh_index_cache', 'Lookup Gen - bh_source_cache', 'Lookup Gen - bh_sourcetype_cache']"
        parser = conf_parser.TABConfigParser()
        parser.read_string(conf)
        self.maxDiff = None
        self.assertEqual(expected_saved_searches,
                         str(list(parser.item_dict().keys())))


if __name__ == '__main__':
    unittest.main()
