import React, { useState, useEffect } from 'react';
import Text, { TextChangeHandler } from '@splunk/react-ui/Text';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import MessageBar from '@splunk/react-ui/MessageBar';
import { capitalize } from '../Helpers';
import { Div } from '../BHStyles';

interface Props {
    type: string;
    setSelected: (type: string, value: string) => void;
    value?: string;
    hasError: boolean;
}

const ContactInput = ({ type, setSelected, value, hasError }: Props) => {
    const [contact, setContacts] = useState<string>();

    const handleChange: TextChangeHandler = (_, { value }) => {
        setContacts(value);
        setSelected(type, value);
    };

    useEffect(() => {
        if (typeof value !== 'undefined') {
            let v = value;
            // Remove any uneccessary spaces
            // Handle comma delimited list of emails or single email
            if (value.includes(',')) {
                v = value
                    .split(',')
                    .map((email) => email.trim())
                    .join(',');
            } else {
                v = value.trim();
            }
            setContacts(v);
            setSelected(type, v);
        }
    }, [value]);

    return (
        <Div $width="400px">
            <ControlGroup
                label={capitalize(type)}
                labelPosition="top"
                style={{ margin: '.5em .25em 0 0' }}
            >
                <Text canClear type="text" value={contact || ''} onChange={handleChange} />
                <Tooltip content="Comma delimited list of emails" />
            </ControlGroup>
            {hasError ? (
                <MessageBar type="error">
                    Contacts must be a valid email, or a comma-delimited list of emails.
                </MessageBar>
            ) : (
                ''
            )}
        </Div>
    );
};

export default ContactInput;
