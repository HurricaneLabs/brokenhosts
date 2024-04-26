import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import Text, { TextChangeHandler } from '@splunk/react-ui/Text';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Heading from '@splunk/react-ui/Heading';
import { capitalize } from '../Helpers';
import Tooltip from '@splunk/react-ui/Tooltip';
import { Div } from '../BHStyles';

interface Props {
    type: string;
    setSelected: (type: string, value: string) => void;
    editValue?: string;
}

const LateSecondsInput = ({ type, setSelected, editValue }: Props) => {
    const [lateSeconds, setLateSeconds] = useState<string>();

    const handleChange: TextChangeHandler = (e, { value }) => {
        setLateSeconds(value);
        setSelected(type, value);
    };

    useEffect(() => {
        if (typeof editValue !== 'undefined') {
            setLateSeconds(editValue);
            setSelected(type, editValue);
        }
    }, []);

    return (
        <Div $width="400px">
            <ControlGroup
                label={capitalize(type)}
                labelPosition="top"
                style={{ margin: '.5em .25em 0 0' }}
            >
                <Text canClear type="text" value={lateSeconds || ''} onChange={handleChange} />
                <Tooltip content="Use seconds or SPL relative time format. 0 means always suppress." />
            </ControlGroup>
        </Div>
    );
};

export default LateSecondsInput;
