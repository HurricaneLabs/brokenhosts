import React, { useState, useEffect } from 'react';
import { handleError, handleResponse, defaultFetchInit } from '@splunk/splunk-utils/fetch';
import Multiselect, { MultiselectChangeHandler } from '@splunk/react-ui/Multiselect';
import * as config from '@splunk/splunk-utils/config';
import { createRESTURL } from '@splunk/splunk-utils/url';
import Heading from '@splunk/react-ui/Heading';

const hostUrl = createRESTURL(
    `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${Date.now() - 86400}}}`,
    {
        app: config.app,
        sharing: 'app',
    }
);

type Host = {
    name: string;
};

const HostMultiSelect = ({ selected, setSelected }) => {
    const [availableHosts, setAvailableHosts] = useState([]);

    const multiselectHostOptions = availableHosts.map((v) => (
        <Multiselect.Option key={v} label={v} value={v} />
    ));

    const handleMultiSelectHostChange: MultiselectChangeHandler = (e, { values }) =>
        setSelected('update-hosts', values);

    const handleMultiSelectHostClose = () => {
        const optionSet = new Set<string>(availableHosts);
        availableHosts.forEach((v) => {
            if (!optionSet.has(v)) {
                setAvailableHosts([v, ...availableHosts]);
            }
        });
    };

    const getAvailableHosts = async () => {
        const fetchInit = defaultFetchInit; // from splunk-utils API
        fetchInit.method = 'GET';
        const data = await fetch(hostUrl, {
            ...fetchInit,
            headers: {
                'X-Splunk-Form-Key': config.CSRFToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
            },
        })
            .then(handleResponse(200))
            .catch((e) => {
                console.error(e);
                handleError('error');
            })
            .catch((err) => (err instanceof Object ? 'error' : err)); // handleError sometimes returns an Object;

        console.log('Hosts ::: ', data);

        return data.entry.map((host: Host) => host.name);
    };

    useEffect(() => {
        getAvailableHosts().then((data) => setAvailableHosts(data));
    }, []);

    return (
        <form>
            <Heading level={4}>Select Hosts</Heading>
            <Multiselect
                name="hostSelect"
                values={selected}
                onChange={handleMultiSelectHostChange}
                onClose={handleMultiSelectHostClose}
                inline
                allowNewValues
                compact
            >
                {multiselectHostOptions}
            </Multiselect>
        </form>
    );
};

export default HostMultiSelect;
