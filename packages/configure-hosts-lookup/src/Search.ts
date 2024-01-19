import { createSearchJob, getData } from '@splunk/splunk-utils/search';

export const createJob = async (search: string, earliest: string, latest: string) => {
    const n = createSearchJob(
        {
            search: search,
            earliest_time: earliest,
            latest_time: latest,
        },
        {},
        { app: 'search', owner: 'nobody' }
    )
        .then((response) => response)
        .then((data) => data.sid);
    return n;
};

export const fetchData = async (sidJob: string) => {
    const n = await getData(sidJob, 'results', { output_mode: 'json_cols' })
        .then((response) => response)
        .then((data) => {
            console.log('got some data ::: ', data);
        });

    return n;
};
