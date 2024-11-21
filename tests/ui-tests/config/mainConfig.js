export const myOptions = {
    scenarios: {
        ui: {
            executor: 'shared-iterations',
            iterations: 1,
            options: {
                browser: {
                    type: 'chromium',
                },
            },
        },
    },
    thresholds: {
        // checks: ['rate==1.0'],
        // http_req_duration: ['avg<100', 'p(95)<200'],
    },
};

export const global = {
    url: __ENV.HDB_URL ? __ENV.HDB_URL : 'http://localhost:9925/',
    username: __ENV.HDB_USERNAME ? __ENV.HDB_USERNAME : 'admin',
    password: __ENV.HDB_PASSWORD ? __ENV.HDB_PASSWORD : 'admin',
    dbNamePrefix: 'myNewDB'
}