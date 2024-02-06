import React, { useEffect, useState } from 'react';
import TextArea, { TextAreaChangeHandler } from '@splunk/react-ui/TextArea';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import { capitalize } from '../Helpers';
import { Div } from '../BHStyles';

interface Props {
    type: string;
    setSelected: (type: string, value: string) => void;
    editValue?: string;
}

const CommentsTextarea = ({ type, setSelected, editValue }: Props) => {
    const [comments, setComments] = useState<string>();

    const handleChange: TextAreaChangeHandler = (_, { value }) => {
        setSelected(`${type}`, value);
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
