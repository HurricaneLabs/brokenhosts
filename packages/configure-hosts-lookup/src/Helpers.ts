import { handleError, handleResponse, defaultFetchInit } from '@splunk/splunk-utils/fetch';
import * as config from '@splunk/splunk-utils/config';
import { createRESTURL } from '@splunk/splunk-utils/url';

export const epochNow = Math.floor(Date.now() / 1000 - 86400);

export const getAvailableData = async (url: string) => {
    console.log('url ??? ', url);
    const restURL = createRESTURL(url, {
        app: config.app,
        sharing: 'app',
    });

    console.log('restURL ??? ', restURL);
    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'GET';
    const data = await fetch(restURL, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
    })
        .then(handleResponse(200))
        .catch((e) => {
            console.error(e);
            handleError('error');
        })
        .catch((err) => (err instanceof Object ? 'error' : err)); // handleError sometimes returns an Object;

    if (data.length === 0) {
        return [];
    }

    return data.entry.map((item) => item.name);
};

export const handleMultiSelectClose = (state, stateSetter) => {
    return function () {
        const optionSet = new Set<string>(state);
        state.forEach((v) => {
            if (!optionSet.has(v)) {
                stateSetter([v, ...state]);
            }
        });

        return state;
    };
};

// simpler than wrapping in setTimeout()
// i.e. await sleep(1000);
export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const capitalize = (str: string) =>
    str.split('')[0].toUpperCase() + str.slice(1, str.length);
