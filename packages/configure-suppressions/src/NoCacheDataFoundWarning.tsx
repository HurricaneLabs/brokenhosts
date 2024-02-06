import React from 'react';

import Message from '@splunk/react-ui/Message';
import Button from '@splunk/react-ui/Button';
import WaitSpinner from '@splunk/react-ui/WaitSpinner';

import { populateKVStoreCache } from './Search';
import { Flex, FlexItem, SmallButtonTheme } from './BHStyles';

const NoCacheDataFoundWarning = ({ type, refetchData, attempts, pullingData }) => {
    return attempts <= 2 ? (
        <>
            <Flex $width="400px" $gap="20px">
                <FlexItem>
                    <Message type="warning">No {type} data found in cache.</Message>
                </FlexItem>
                <FlexItem>
                    <Button
                        style={SmallButtonTheme}
                        label={`Populate`}
                        appearance="primary"
                        disabled={pullingData}
                        icon={pullingData ? <WaitSpinner size="small" /> : ''}
                        onClick={() => populateKVStoreCache(type).then(() => refetchData())}
                    />
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
