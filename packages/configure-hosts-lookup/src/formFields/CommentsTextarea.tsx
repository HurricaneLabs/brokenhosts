import React, { useEffect, useState, useReducer } from 'react';
import TextArea, { TextAreaChangeHandler } from '@splunk/react-ui/TextArea';
import { editFormReducer } from '../EditFormReducer.ts';
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
    // const [_, dispatchForm] = useReducer(editFormReducer, { comments: editValue });

    const handleChange: TextAreaChangeHandler = (_, { value }) => {
        console.log('handle comments change ::: ', value);
        setComments(value);
        setSelected(type, value);
        // dispatchForm({ type: 'comments', value });
    };

    useEffect(() => {
        if (typeof editValue !== 'undefined') {
            setComments(editValue);
        }
    }, []);

    return (
        <Div $width="400px">
            <Heading level={4}>
                {capitalize(type)}
                <Tooltip content="Be sure to include a ticket number if applicable." />
            </Heading>
            <TextArea value={comments || ''} onChange={handleChange} />
        </Div>
    );
};

export default CommentsTextarea;
