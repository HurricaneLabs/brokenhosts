import React, { useState, useEffect } from 'react';
import { handleError, handleResponse, defaultFetchInit } from '@splunk/splunk-utils/fetch';
import Multiselect, { MultiselectChangeHandler } from '@splunk/react-ui/Multiselect';
import * as config from '@splunk/splunk-utils/config';
import { createRESTURL } from '@splunk/splunk-utils/url';
import Heading from '@splunk/react-ui/Heading';

const indexUrl = createRESTURL(`data/indexes?output_mode=json&count=1000`, {
    app: config.app,
    sharing: 'app',
});

type Index = {
    name: string;
};

const IndexMultiSelect = ({ selected, setSelected }) => {
    const [availableIndexes, setAvailableIndexes] = useState([]);

    const multiselectIndexOptions = availableIndexes.map((v) => (
        <Multiselect.Option key={v} label={v} value={v} />
    ));

    const handleMultiSelectIndexChange: MultiselectChangeHandler = (_, { values }) =>
        setSelected('update-indexes', values);

    const handleMultiSelectIndexClose = () => {
        const optionSet = new Set<string>(availableIndexes);
        availableIndexes.forEach((v) => {
            if (!optionSet.has(v)) {
                setAvailableIndexes([v, ...availableIndexes]);
            }
        });
    };

    const getAvailableIndexes = async () => {
        const fetchInit = defaultFetchInit; // from splunk-utils API
        fetchInit.method = 'GET';
        const data = await fetch(indexUrl, {
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

        console.log('Indexes ::: ', data);

        return data.entry.map((Index: Index) => Index.name);
    };

    useEffect(() => {
        getAvailableIndexes().then((data) => setAvailableIndexes(data));
    }, []);

    return (
        <form>
            <Heading level={4}>Select Indexes</Heading>
            <Multiselect
                name="indexSelect"
                values={selected}
                onChange={handleMultiSelectIndexChange}
                onClose={handleMultiSelectIndexClose}
                inline
                allowNewValues
                compact
            >
                {multiselectIndexOptions}
            </Multiselect>
        </form>
    );
};

export default IndexMultiSelect;
