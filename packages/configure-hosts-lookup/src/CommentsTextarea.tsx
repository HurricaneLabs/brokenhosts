import React, { useState } from 'react';
import TextArea, { TextAreaChangeHandler } from '@splunk/react-ui/TextArea';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import { capitalize } from './Helpers';
import { Div } from './BHStyles';

const CommentsTextarea = ({ type, setSelected }) => {
    const [comments] = useState<string>();

    const handleChange: TextAreaChangeHandler = (_, { value }) => {
        setSelected(`update-${type}`, value);
    };

    return (
        <Div $width="400px">
            <Heading level={4}>
                {capitalize(type)}
                <Tooltip content="Be sure to include a ticket number if applicable." />
            </Heading>
            <TextArea value={comments} onChange={handleChange} />
        </Div>
    );
};

export default CommentsTextarea;
