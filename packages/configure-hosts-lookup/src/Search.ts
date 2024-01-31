import { createSearchJob, getData } from '@splunk/splunk-utils/search';
import type { DataType } from './types';
import { createRESTURL } from '@splunk/splunk-utils/url';
import * as config from '@splunk/splunk-utils/config';
import { defaultFetchInit, handleResponse, handleError } from '@splunk/splunk-utils/fetch';
import { epochNow } from './Helpers';

export const populateKVStoreCache = async (type: DataType | string) => {
    // let savedSearchName: string = '';
    let url: string = '';

    switch (type as unknown) {
        case 'host':
            // savedSearchName = 'Lookup Gen - bh_host_cache';
            url = `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${epochNow}}}`;
            break;
        case 'sourcetype':
            url = `storage/collections/data/bh_sourcetype_cache?query={"last_seen":{"$gt":${epochNow}}}`;
            // savedSearchName = 'Lookup Gen - bh_sourcetype_cache';
            break;
        case 'index':
            url = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
            // savedSearchName = 'Lookup Gen - bh_index_cache';
            break;
        default:
            throw new Error('Unknown cache type provided. Expected host, sourcetype, or index.');
    }

    const preparedSplunkURL = createRESTURL(url, {
        app: config.app,
        sharing: 'app',
    });

    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'GET';
    await fetch(preparedSplunkURL, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
    }).then((data) => {
        console.log('Fetching cache ::: ', data);
        if (data.status === 404) {
            // We don't care about an actual error message we just want it thrown so we can catch it
            handleError();
        }
        handleResponse(200);
    });
};
