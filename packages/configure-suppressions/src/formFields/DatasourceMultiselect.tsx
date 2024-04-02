import React, { useState, useEffect } from 'react';
import Multiselect, { MultiselectChangeHandler } from '@splunk/react-ui/Multiselect';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import NoCacheDataFoundWarning from '../NoCacheDataFoundWarning';
import { capitalize, sleep, getAvailableData } from '../Helpers';
import WaitSpinner from '@splunk/react-ui/WaitSpinner';

const DatasourceMultiSelect = ({ type, url, selected, setSelected }) => {
    const [availableSourcetypes, setAvailableSourcetypes] = useState<string[]>([]);
    const [dataEmpty, setDataEmpty] = useState<boolean>(false);
    const [attempts, setAttempts] = useState<number>(1);
    const [pullingData, setPullingData] = useState<boolean>(false);

    const multiselectOptions = availableSourcetypes.map((v) => (
        <Multiselect.Option key={v} label={v} value={v} />
    ));

    useEffect(() => {
        pullData();
    }, []);

    const pullData = () => {
        getAvailableData(url).then(async (data) => {
            setPullingData(true);
            await sleep(1500);
            if (data.length === 0) {
                setDataEmpty(true);
                setAttempts((attempts) => attempts + 1);
            }
            setAvailableSourcetypes(data);
            setPullingData(false);
        });
    };

    const handleMultiSelectChange: MultiselectChangeHandler = (_, { values }) =>
        setSelected(`${type}`, values);

    return (
        <>
            <Heading level={4}>
                Select {capitalize(type)} <Tooltip content="Add one or more value." />
            </Heading>
            {attempts === 1 ? (
                <WaitSpinner size="medium" />
            ) : (
                <div>
                    <Multiselect
                        name="indexSelect"
                        values={selected}
                        onChange={handleMultiSelectChange}
                        inline
                        allowNewValues
                        compact
                    >
                        {multiselectOptions}
                    </Multiselect>
                </div>
            )}
            {dataEmpty ? (
                <NoCacheDataFoundWarning
                    type={type}
                    refetchData={pullData}
                    pullingData={pullingData}
                    attempts={attempts}
                />
            ) : (
                ''
            )}
        </>
    );
};

export default DatasourceMultiSelect;
