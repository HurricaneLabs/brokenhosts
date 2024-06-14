import React from 'react';

import Message from '@splunk/react-ui/Message';
import Button from '@splunk/react-ui/Button';
import WaitSpinner from '@splunk/react-ui/WaitSpinner';

import { populateKVStoreCache } from './Search';
import { Flex, FlexItem, SmallButtonTheme } from './BHStyles';

const NoCacheDataFoundWarning = ({ type, refetchData, attempts, pullingData }) => {
    return attempts <= 1 ? (
        <>
            <Flex $width="400px" $gap="20px">
                <FlexItem>
                    <Message type="warning">
                        <p style={{ color: '#4d4d4d', margin: 0 }}>
                            No {type} data found in cache. <a href="#">Configure</a> or manually
                            enter in data.
                        </p>
                    </Message>
                </FlexItem>
            </Flex>
        </>
    ) : (
        <Message type="warning">
            No results when pulling {type} data. You may manually add one or more {type} below.
        </Message>
    );
};

export default NoCacheDataFoundWarning;
