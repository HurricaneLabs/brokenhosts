import React, { useState } from 'react';
import Text, { TextChangeHandler } from '@splunk/react-ui/Text';
import Heading from '@splunk/react-ui/Heading';
import { capitalize } from './Helpers';
import Tooltip from '@splunk/react-ui/Tooltip';
import { Div } from './BHStyles';

const LateSecondsInput = ({ type, setSelected }) => {
    const [lateSeconds] = useState<string>();

    const handleChange: TextChangeHandler = (e, { value }) => {
        setSelected(`update-${type}`, value);
    };

    return (
        <Div $width="400px">
            <Heading level={4}>
                {capitalize(type)}
                <Tooltip content="Use seconds or SPL relative time format. 0 means always suppress." />
            </Heading>
            <Text canClear type="text" value={lateSeconds} onChange={handleChange} />
        </Div>
    );
};

export default LateSecondsInput;
