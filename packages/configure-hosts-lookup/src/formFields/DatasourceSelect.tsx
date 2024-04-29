import React, { useState, useEffect } from 'react';
import Select, { SelectChangeHandler } from '@splunk/react-ui/Select';
import Text from '@splunk/react-ui/Text';
import { sleep, getAvailableData } from '../Helpers';
import WaitSpinner from '@splunk/react-ui/WaitSpinner';

type Props = {
    type: string;
    url: string;
    value?: string;
    setValue: (type: string, value: string, index?: number) => void;
    index?: number;
    inline?: boolean;
};

const defaultProps = {
    index: -1,
};

const DatasourceSelect = (props: Props) => {
    props = { ...defaultProps, ...props };

    const { type, url, value: valueProps, setValue: setValueProps, index } = props;

    const [availableData, setAvailableData] = useState<string[]>([]);
    const [dataEmpty, setDataEmpty] = useState<boolean>(true);
    const [attempts, setAttempts] = useState<number>(0);
    const [pullingData, setPullingData] = useState<boolean>(false);
    const [value, setValue] = useState<string | unknown>('');

    const selectOptions = availableData.map((v) => <Select.Option key={v} label={v} value={v} />);

    useEffect(() => {
        setValue(valueProps);
    }, [valueProps]);

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
        setValue(value);
        if (index !== undefined && index > -1) {
            setValueProps(`${type}`, value, index);
        } else {
            setValueProps(`${type}`, value);
        }
    };

    // Handle value change when its a select input
    const handleSelectChange = (_, { value }) => {
        setValue(value);
        setValueProps(`${type}`, value, index);
    };
    const inputView = () => {
        if (attempts === 0 && dataEmpty) {
            return <WaitSpinner size="medium" />;
        } else if (!dataEmpty) {
            return (
                <>
                    <Select
                        style={{ width: '99%' }}
                        name="indexSelect"
                        value={value}
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
                    value={value}
                    onChange={(e) => {
                        handleInputChange((e.target as HTMLInputElement).value);
                    }}
                />
            );
        }
    };

    return <>{inputView()}</>;
};

export default DatasourceSelect;
