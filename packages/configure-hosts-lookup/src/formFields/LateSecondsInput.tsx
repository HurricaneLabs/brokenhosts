import React, { useState, useEffect } from 'react';
import Text, { TextChangeHandler } from '@splunk/react-ui/Text';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Tooltip from '@splunk/react-ui/Tooltip';
import MessageBar from '@splunk/react-ui/MessageBar';
import { Div } from '../BHStyles';

interface Props {
    type: string;
    setSelected: (type: string, value: string, index?: number) => void;
    value?: string;
    index?: number;
}

const defaultProps = {
    index: -1,
};

const LateSecondsInput = (props: Props) => {
    const [lateSeconds, setLateSeconds] = useState<string>();

    props = { ...defaultProps, ...props };

    const { type, setSelected: setValueProps, value, index } = props;

    const handleChange: TextChangeHandler = (e, { value }) => {
        setLateSeconds(value);

        // Index is passed in if we are dealing with a batch update
        if (index !== undefined && index > -1) {
            setValueProps(`${type}`, value, index);
        } else {
            setValueProps(`${type}`, value);
        }
    };

    useEffect(() => {
        console.log('VALUE CHANGED ::: ', value);
        let checkedValue = '0';
        if (value !== '' && value !== undefined && value !== null) checkedValue = value;

        handleChange(_, checkedValue);
        setLateSeconds(checkedValue);
        setValueProps(type, checkedValue);
    }, [value]);

    return (
        <Div $width="400px">
            {lateSeconds !== null && lateSeconds !== undefined ? (
                <ControlGroup
                    label="Late Seconds"
                    labelPosition="top"
                    style={{ margin: '.5em .25em 0 0' }}
                >
                    <Text canClear type="text" value={lateSeconds} onChange={handleChange} />
                    <Tooltip content="Use seconds or SPL relative time format. 0 means always suppress." />
                </ControlGroup>
            ) : (
                ''
            )}
        </Div>
    );
};

export default LateSecondsInput;
