import React, { useState, useEffect } from 'react';
import Text, { TextChangeHandler } from '@splunk/react-ui/Text';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import { capitalize } from '../Helpers';
import { Div } from '../BHStyles';

interface Props {
    type: string;
    setSelected: (type: string, value: string) => void;
    editValue?: string;
}

const ContactInput = ({ type, setSelected, editValue }: Props) => {
    const [contact, setContacts] = useState<string>();

    const handleChange: TextChangeHandler = (_, { value }) => {
        setSelected(`${type}`, value);
    };

    useEffect(() => {
        if (typeof editValue !== 'undefined') {
            setContacts(editValue);
        }
    }, []);

    return (
        <Div $width="400px">
            <Heading level={4}>
                {capitalize(type)} <Tooltip content="Comma delimited list of emails" />
            </Heading>
            <Text canClear type="text" value={contact || ''} onChange={handleChange} />
        </Div>
    );
};

export default ContactInput;
