import React, { useState, useEffect } from 'react';
import Text, { TextChangeHandler } from '@splunk/react-ui/Text';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Tooltip from '@splunk/react-ui/Tooltip';
import MessageBar from '@splunk/react-ui/MessageBar';
import { Div } from '../BHStyles';

interface Props {
    type: string;
    setSelected: (type: string, value: string) => void;
    value?: string;
    hasError: boolean;
}

const LateSecondsInput = ({ type, setSelected, value, hasError }: Props) => {
    const [lateSeconds, setLateSeconds] = useState<string>();

    const handleChange: TextChangeHandler = (e, { value }) => {
        setLateSeconds(value);
        setSelected(type, value);
    };

    useEffect(() => {
        if (typeof value !== 'undefined') {
            setLateSeconds(value);
            setSelected(type, value);
        }
    }, [value]);

    return (
        <Div $width="400px">
            <ControlGroup
                label="Late Seconds"
                labelPosition="top"
                style={{ margin: '.5em .25em 0 0' }}
            >
                <Text canClear type="text" value={lateSeconds || ''} onChange={handleChange} />
                <Tooltip content="Use seconds or SPL relative time format. 0 means always suppress." />
            </ControlGroup>
            {hasError ? (
                <MessageBar style={{ marginTop: '.5em' }} type="error">
                    Late seconds must not be empty and must be a valid number.
                </MessageBar>
            ) : (
                ''
            )}
        </Div>
    );
};

export default LateSecondsInput;
