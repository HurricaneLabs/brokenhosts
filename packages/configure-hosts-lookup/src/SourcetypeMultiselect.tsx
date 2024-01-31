import React, { useState, useEffect } from 'react';
import { handleError, handleResponse, defaultFetchInit } from '@splunk/splunk-utils/fetch';
import Multiselect, { MultiselectChangeHandler } from '@splunk/react-ui/Multiselect';
import * as config from '@splunk/splunk-utils/config';
import { createRESTURL } from '@splunk/splunk-utils/url';
import Heading from '@splunk/react-ui/Heading';

const sourcetypeUrl = createRESTURL(`saved/sourcetypes?output_mode=json&count=1000`, {
    app: config.app,
    sharing: 'app',
});

type Sourcetype = {
    name: string;
};

const SourcetypeMultiSelect = ({ selected, setSelected }) => {
    const [availableSourcetypes, setAvailableSourcetypes] = useState([]);

    const multiselectSourcetypeOptions = availableSourcetypes.map((v) => (
        <Multiselect.Option key={v} label={v} value={v} />
    ));

    const handleMultiSelectSourcetypeChange: MultiselectChangeHandler = (e, { values }) => {
        console.log('values ??? ', values);
        setSelected('update-sourcetypes', values);
    };

    const handleMultiSelectSourcetypeClose = () => {
        const optionSet = new Set<string>(availableSourcetypes);
        availableSourcetypes.forEach((v) => {
            if (!optionSet.has(v)) {
                setAvailableSourcetypes([v, ...availableSourcetypes]);
            }
        });
    };

    const getAvailableSourcetypes = async () => {
        const fetchInit = defaultFetchInit; // from splunk-utils API
        fetchInit.method = 'GET';
        const data = await fetch(sourcetypeUrl, {
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

        console.log('sourcetypes ::: ', data);

        return data.entry.map((sourcetype: Sourcetype) => sourcetype.name);
    };

    useEffect(() => {
        getAvailableSourcetypes().then((data) => setAvailableSourcetypes(data));
    }, []);

    return (
        <form>
            <Heading level={4}>Select Sourcetypes</Heading>
            <Multiselect
                name="sourcetypeSelect"
                values={selected}
                onChange={handleMultiSelectSourcetypeChange}
                onClose={handleMultiSelectSourcetypeClose}
                inline
                allowNewValues
                compact
            >
                {multiselectSourcetypeOptions}
            </Multiselect>
        </form>
    );
};

export default SourcetypeMultiSelect;
