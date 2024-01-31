import React, { useState, useEffect } from 'react';
import Multiselect, { MultiselectChangeHandler } from '@splunk/react-ui/Multiselect';
import Heading from '@splunk/react-ui/Heading';
import NoCacheDataFoundWarning from './NoCacheDataFoundWarning';
import { epochNow, getAvailableData } from './Helpers';

const hostUrl = `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${epochNow}}}`;

const HostMultiSelect = ({ selected, setSelected }) => {
    const [availableHosts, setAvailableHosts] = useState([]);
    const [dataEmpty, setDataEmpty] = useState(false);
    const [getHostAttempts, setGetHostAttempts] = useState(1);

    const multiselectHostOptions = availableHosts.map((v) => (
        <Multiselect.Option key={v} label={v} value={v} />
    ));

    const pullData = () => {
        getAvailableData(hostUrl).then((data) => {
            if (data.length === 0) {
                console.log('no data!!!!');
                setDataEmpty(true);
                setGetHostAttempts((attempts) => attempts + 1);
            }
            setAvailableHosts(data);
        });
    };

    useEffect(() => {
        pullData();
    }, []);

    const handleMultiSelectHostChange: MultiselectChangeHandler = (_, { values }) =>
        setSelected('update-hosts', values);

    const handleMultiSelectHostClose = () => {
        const optionSet = new Set<string>(availableHosts);
        availableHosts.forEach((v) => {
            if (!optionSet.has(v)) {
                setAvailableHosts([v, ...availableHosts]);
            }
        });
    };

    return (
        <form>
            <Heading level={4}>Select Hosts</Heading>
            {dataEmpty ? (
                <NoCacheDataFoundWarning
                    type="host"
                    refetchData={pullData}
                    attempts={getHostAttempts}
                />
            ) : (
                ''
            )}
            <div>
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
            </div>
        </form>
    );
};

export default HostMultiSelect;
