import React, { useState, useEffect } from 'react';
import Select, { SelectChangeHandler } from '@splunk/react-ui/Select';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import Text from '@splunk/react-ui/Text';
import NoCacheDataFoundWarning from '../NoCacheDataFoundWarning';
import { capitalize, sleep, getAvailableData } from '../Helpers';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import WaitSpinner from '@splunk/react-ui/WaitSpinner';

type Props = {
    type: string;
    url: string;
    value: string;
    setValue: (type: string, value: string, index?: number) => void;
    index?: number;
    inline?: boolean;
};

const defaultProps = {
    index: -1,
};

const DatasourceMultiSelect = (props: Props) => {
    props = { ...defaultProps, ...props };

    const { type, url, value, setValue, index } = props;

    const [availableData, setAvailableData] = useState<string[]>([]);
    const [dataEmpty, setDataEmpty] = useState<boolean>(true);
    const [attempts, setAttempts] = useState<number>(0);
    const [pullingData, setPullingData] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState<string>('');

    const selectOptions = availableData.map((v) => <Select.Option key={v} label={v} value={v} />);

    useEffect(() => {
        pullData();
    }, []);

    const pullData = () => {
        getAvailableData(url).then(async (data) => {
            setPullingData(true);
            await sleep(1500);
            if (data.length > 0) {
                setDataEmpty(false);
            } else if (attempts < 1) {
                setAttempts((attempts) => attempts + 1);
            }
            console.log('data???? ', data);
            setAvailableData(data);
            setPullingData(false);
        });
    };

    // Handle value change when its a text input
    const handleInputChange = (value: string) => {
        // Index is passed in if we are dealing with a batch update
        console.log('handleInputChange type ::: ', type);
        console.log('handleInputChange value ::: ', value);
        console.log('handleInputChange index ::: ', index);
        setCurrentValue(value);
        if (index !== undefined && index > -1) {
            setValue(`${type}`, value, index);
        } else {
            setValue(`${type}`, value);
        }
    };

    // Handle value change when its a select input
    const handleSelectChange = (_, { value }) => {
        setCurrentValue(value);
        setValue(`${type}`, value, index);
    };
    const inputView = () => {
        if (attempts === 0 && dataEmpty) {
            return <WaitSpinner size="medium" />;
        } else if (!dataEmpty) {
            return (
                <>
                    <Select
                        style={{ width: '100%' }}
                        name="indexSelect"
                        value={currentValue}
                        onChange={handleSelectChange}
                    >
                        {selectOptions}
                    </Select>
                </>
            );
        } else if (dataEmpty) {
            return (
                <Text
                    style={{ margin: '0 .25em 0 0' }}
                    value={currentValue}
                    onChange={(e) => {
                        handleInputChange((e.target as HTMLInputElement).value);
                    }}
                />
            );
        }
    };

    return <>{inputView()}</>;
};

export default DatasourceMultiSelect;
