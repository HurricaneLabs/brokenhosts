import React, { useState, useEffect } from 'react';
import Text, { TextChangeHandler } from '@splunk/react-ui/Text';
import Heading from '@splunk/react-ui/Heading';
import { default as SplunkUIDate } from '@splunk/react-ui/Date';
import Tooltip from '@splunk/react-ui/Tooltip';
import { Div } from '../BHStyles';

type Props = {
    setValue: (type: string, value: string, index?: number) => void;
    index?: number;
    type: string;
    value: string | number;
};

const defaultProps = {
    index: -1,
};

const date: Date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;

// let currentDate = '';

const SuppressUntilInput = (props: Props) => {
    const [date, setDate] = useState<string | number>();

    props = { ...defaultProps, ...props };

    const { setValue: setValueProps, type, index } = props;

    useEffect(() => {
        console.log('>>> props.value ::: ', props.value === '0' || props.value === 0);
        console.log('>>> props.value ::: ', props.value);
        if (index !== undefined && index > -1) {
            setValueProps(`${type}`, currentDate, index);
        }
        if (props.value === '0' || props.value === 0 || props.value === undefined) {
            setDate(currentDate);
        } else {
            setDate(props.value);
        }
    }, [props.value]);

    const handleChange = (e, { value }) => {
        // Index is passed in if we are dealing with a batch update
        setDate(value);
        if (index !== undefined && index > -1) {
            setValueProps(`${type}`, value, index);
        } else {
            setValueProps(`${type}`, value);
        }
    };

    return (
        <Div $width="400px">
            <SplunkUIDate defaultValue={date as string} value={date} onChange={handleChange} />
        </Div>
    );
};

export default SuppressUntilInput;
