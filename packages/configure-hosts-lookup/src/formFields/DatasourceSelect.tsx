import React, { useState, useEffect } from 'react';
import Select, { SelectChangeHandler } from '@splunk/react-ui/Select';
import Text, { TextChangeHandler } from '@splunk/react-ui/Text';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import NoCacheDataFoundWarning from '../NoCacheDataFoundWarning';
import { capitalize, sleep, getAvailableData } from '../Helpers';
import WaitSpinner from '@splunk/react-ui/WaitSpinner';

interface Props {
    type: string;
    url: string;
    selected: string;
    setSelected: (type: string, value: any[] | string | number | boolean) => void;
    editValue?: string;
}

const DatasourceSelect = ({ type, url, selected, setSelected, editValue }: Props) => {
    const [availableSourcetypes, setAvailableSourcetypes] = useState<string[]>([]);
    const [dataEmpty, setDataEmpty] = useState<boolean>(false);
    const [attempts, setAttempts] = useState<number>(1);
    const [pullingData, setPullingData] = useState<boolean>(false);

    const SelectOptions = availableSourcetypes.map((v) => (
        <Select.Option key={v} label={v} value={v} />
    ));

    useEffect(() => {
        console.log('what is selected ::: ', selected);
        pullData();
    }, []);

    useEffect(() => {
        if (typeof editValue !== 'undefined') {
            setSelected(type, editValue);
        }
    }, []);

    const pullData = () => {
        getAvailableData(url).then(async (data) => {
            setPullingData(true);
            // Artificial delay otherwise users wont see any load state which may be confusing
            await sleep(1500);
            if (data.length === 0) {
                setDataEmpty(true);
                setAttempts((attempts) => attempts + 1);
            }
            setAvailableSourcetypes(data);
            setPullingData(false);
        });
    };

    const handleSelectChange: SelectChangeHandler = (_, { value }) => setSelected(`${type}`, value);
    const handleInputChange: TextChangeHandler = (_, { value }) => setSelected(`${type}`, value);

    const inputView = () => {
        if (attempts === 1) {
            return <WaitSpinner size="medium" />;
        }
        if (!editValue) {
            return (
                <div>
                    <Select
                        name="indexSelect"
                        value={editValue}
                        onChange={handleSelectChange}
                        inline
                    >
                        {SelectOptions}
                    </Select>
                </div>
            );
        }
        if (dataEmpty && editValue) {
            return (
                <div>
                    <Text canClear defaultValue={editValue} onChange={handleInputChange} />
                    <small>Manually enter a comma delimited list.</small>
                </div>
            );
        }
    };

    return (
        <>
            <Heading level={4}>
                Select {capitalize(type)} <Tooltip content="Add one or more value." />
            </Heading>
            {inputView()}
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

export default DatasourceSelect;
