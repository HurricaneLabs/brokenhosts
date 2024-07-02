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

    console.log('data??? ', data);

    if (data.length === 0) {
        return [];
    }

    return data.map((item) => item[item.type]);
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

/**
 * Capitalizes the first letter of one or more words
 *
 * @param str
 * @returns
 */
export const capitalize = function (str: string) {
    const match = /-|_/g;

    if (match.test(str)) {
        str = str.replace(match, ' ');
    }

    if (str.split(' ').length > 1) {
        const strArr = str.split(' ').map((str) => {
            return str.split('')[0].toUpperCase() + str.slice(1, str.length);
        });

        return strArr.join(' ');
    }

    return str.split('')[0].toUpperCase() + str.slice(1, str.length);
};

export const isEmptyOrUndefined = (val: string) => {
    return val === '' || val === undefined;
};

export const isValidEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const isDateInPast = (val: string) => {
    if (val === '0') return false;
    let providedDate = new Date(val);
    let now = new Date().getTime();
    let diff = now - providedDate.getTime();
    diff = diff - (diff % 86400000);
    return diff > 0;
};
