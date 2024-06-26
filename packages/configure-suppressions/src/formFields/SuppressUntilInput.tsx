import React, { useState, useEffect } from 'react';
import { default as SplunkUIDate } from '@splunk/react-ui/Date';
import Switch from '@splunk/react-ui/Switch';

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

const SuppressUntilInput = (props: Props) => {
    const [date, setDate] = useState<string | number>('0');
    const [suppressIndefinitely, setsuppressIndefinitely] = useState<boolean>(true);

    props = { ...defaultProps, ...props };

    const { setValue: setValueProps, type, value: valueProp, index } = props;

    useEffect(() => {
        if (valueProp !== '0') {
            setsuppressIndefinitely(false);
        }
    }, [props]);

    useEffect(() => {
        console.log('suppressIndefinitely ::: ', suppressIndefinitely);
    }, [suppressIndefinitely]);

    useEffect(() => {
        console.log('>>> props.value ::: ', props.value === '0' || props.value === 0);
        console.log('>>> props.value ::: ', props.value);
        if (index !== undefined && index > -1) {
            currentDate = suppressIndefinitely ? '0' : currentDate;
            setValueProps(`${type}`, currentDate, index);
        }
        if (props.value === '0' || props.value === 0 || props.value === undefined) {
            setsuppressIndefinitely(true);
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

    const handleClick = (e, { suppress }) => {
        console.log('Checkbox value :: ', suppress);
        if (suppress) {
            setDate('0');
            if (index !== undefined && index > -1) {
                setValueProps(`${type}`, '0', index);
            } else {
                setValueProps(`${type}`, '0');
            }
            setsuppressIndefinitely(true);
        } else {
            // Set it back to default
            currentDate = `${year}-${month}-${day}`;
            console.log('set current date ::: ', currentDate);
            setDate(currentDate);
            if (index !== undefined && index > -1) {
                setValueProps(`${type}`, currentDate, index);
            } else {
                setValueProps(`${type}`, currentDate);
            }
            setsuppressIndefinitely(false);
        }
    };

    return (
        <Div $width="400px">
            {suppressIndefinitely ? (
                ''
            ) : (
                <SplunkUIDate defaultValue={date as string} value={date} onChange={handleChange} />
            )}
            <Switch
                value={suppressIndefinitely}
                onClick={(e) => handleClick(e, { suppress: !suppressIndefinitely })}
                selected={suppressIndefinitely}
                appearance="checkbox"
            >
                Suppress Indefinitely
            </Switch>
        </Div>
    );
};

export default SuppressUntilInput;
