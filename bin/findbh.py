from fnmatch import fnmatch
import logging
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lib"))

import splunklib.client as client
from splunklib.searchcommands import (
    Configuration,
    Option,
    StreamingCommand,
    dispatch,
    validators,
)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

RANK_TRUTH_TABLE = [
    # The values represented here represent the following from calculate_rank:
    # index_is_wildcard
    # sourcetype_is_wildcard
    # host_is_wildcard
    # latesecs_is_0
    # suppress_until_is_0
    [True, True, False, True, False],
    [False, True, False, True, False],
    [True, False, False, True, False],
    [False, False, True, True, False],
    [True, False, True, True, False],
    [False, True, True, True, False],
    [False, False, False, True, False],
    [True, True, False, True, True],
    [False, False, False, False, False],
    [False, True, False, False, False],
    [True, False, False, False, False],
    [False, False, True, False, False],
    [True, True, False, False, False],
    [True, False, True, False, False],
    [False, True, True, False, False],
    [False, False, False, True, True],
    [False, False, False, False, True],
    [False, False, True, True, True],
    [False, False, True, False, True],
    [False, True, True, True, True],
    [True, False, True, True, True],
    [False, True, False, True, True],
    [True, False, False, True, True],
    [False, True, False, False, True],
    [True, False, False, False, True],
    [True, True, False, False, True],
    [True, False, True, False, True],
    [False, True, True, False, True],
]


def find_matches(index: str, sourcetype: str, host: str, expectedTime: list):
    """
    Given an index, sourcetype, and hostname find all matches in expectedTime and return them.
    """
    for item in expectedTime:
        if (
            fnmatch(index.lower(), item["index"].lower())
            and fnmatch(sourcetype.lower(), item["sourcetype"].lower())
            and fnmatch(host.lower(), item["host"].lower())
        ):
            rank = calculate_rank(
                index=item["index"],
                sourcetype=item["sourcetype"],
                host=item["host"],
                late_secs=item["lateSecs"],
                suppress_until=item["suppressUntil"],
                comments=item["comments"],
            )
            yield rank, item


def calculate_rank(
    index: str,
    sourcetype: str,
    host: str,
    late_secs: str,
    suppress_until: str,
    comments: str,
):
    """
    Given a tuple of values from expectedTime, return the rank #.
    If there are two matches for a given event, the one with a lower rank # will
    win.
    """

    # Default entries are low rank
    if "default entry" in comments:
        return len(RANK_TRUTH_TABLE)

    index_is_wildcard = index == "*"
    sourcetype_is_wildcard = sourcetype == "*"
    host_is_wildcard = host == "*"
    latesecs_is_0 = late_secs == "0"
    suppress_until_is_0 = suppress_until == "0"

    truth_values = [
        index_is_wildcard,
        sourcetype_is_wildcard,
        host_is_wildcard,
        latesecs_is_0,
        suppress_until_is_0,
    ]
    if truth_values in RANK_TRUTH_TABLE:
        return RANK_TRUTH_TABLE.index(truth_values)
    else:
        # Lowest rank. I don't know if autosort was meant to do this or not, but
        # that's how it works.
        return len(RANK_TRUTH_TABLE) + 1


@Configuration(distributed=False, required_fields=["index", "sourcetype", "host"])
class StreamingCSC(StreamingCommand):
    """
    The streamingcsc command returns events with a one new field 'fahrenheit'.

    Example:

    ``| makeresults count=5 | eval celsius = random()%100 | streamingcsc``

    returns a records with one new filed 'fahrenheit'.
    """

    """
    def __init__(self):
        super().__init__()

    """

    def stream(self, records):
        # To connect with Splunk, use the instantiated service object which is created using the server-uri and
        # other meta details and can be accessed as shown below
        # Example:-
        #    service = self.service
        #    info = service.info //access the Splunk Server info
        self.headers = {"output_mode": "json", "count": 10000}
        service = client.connect(token=self._metadata.searchinfo.session_key)  # type: ignore

        collection = service.kvstore["expectedTime"]
        expectedTime = collection.data.query()

        for record in records:
            index = record["index"]
            sourcetype = record["sourcetype"]
            host = record["host"]
            highest_rank_match = None
            highest_rank = 100
            for rank, match in find_matches(index, sourcetype, host, expectedTime):
                if rank < highest_rank:
                    highest_rank_match = match

            if highest_rank_match:
                record.update(
                    {
                        "lateSecs": highest_rank_match.get("lateSecs", ""),
                        "comments": highest_rank_match.get("comments", ""),
                        "contact": highest_rank_match.get("contact", ""),
                        "suppressUntil": highest_rank_match.get("suppressUntil", ""),
                    }
                )
            yield record


dispatch(StreamingCSC, sys.argv, sys.stdin, sys.stdout, __name__)
