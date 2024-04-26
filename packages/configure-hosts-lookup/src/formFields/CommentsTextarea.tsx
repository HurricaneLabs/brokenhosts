import React, { useEffect, useState, useReducer } from 'react';
import TextArea, { TextAreaChangeHandler } from '@splunk/react-ui/TextArea';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import { capitalize } from '../Helpers';
import { Div } from '../BHStyles';

interface Props {
    type: string;
    editValue?: string;
    setSelected: (type: string, value: string) => void;
}

const CommentsTextarea = ({ type, editValue, setSelected }: Props) => {
    const [comments, setComments] = useState<string>();

    const handleChange: TextAreaChangeHandler = (_, { value }) => {
        console.log('handle comments change ::: ', value);
        setComments(value);
        setSelected(type, value);
    };

    useEffect(() => {
        if (typeof editValue !== 'undefined') {
            setSelected(type, editValue);
            setComments(editValue);
        }
    }, []);

    return (
        <Div $width="400px">
            <ControlGroup
                label={capitalize(type)}
                labelPosition="top"
                style={{ margin: '.5em .25em 0 0' }}
            >
                <TextArea value={comments || ''} onChange={handleChange} />
                <Tooltip content="Be sure to include a ticket number if applicable." />
            </ControlGroup>
        </Div>
    );
};

export default CommentsTextarea;
