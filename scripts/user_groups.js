import http from "k6/http";
import {sleep, check, group} from "k6";
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"

const BASE_URL = __ENV.BASE_URL || "https://test.k6.io";

const TRAFFIC_SPLIT = {
    home: 0.6, // 60%
    news: 0.2, // 20%
    blog: 0.2 // 20%
};

export const options = {
    stages: [
        {duration: "1m", target: 100}, // ramp up
        {duration: "2m", target: 300}, // ramp up more
        {duration: "2m", target: 300}, // stay constant
        {duration: "1m", target: 0} // ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95) < 500'], // 95% of the req's should get their response's with 500ms
        http_req_failed: ['rate <= 0.05'], // http request failure rate should be <= 5%
        checks: ['rate >= 0.9'] // more than 90% of the checks written should pass
    }
}

export default function(){

    const random = Math.random(); 

    if(random < TRAFFIC_SPLIT.home){ // There is 60% chance (0.0 to 0.59)
        group('Open Home Page', () => {
            const response = http.get(BASE_URL);
            check(response,{
                'status should be 200': (r) => r.status === 200
            })
        })
        sleep(1);
    }
    else if(random < (TRAFFIC_SPLIT.home + TRAFFIC_SPLIT.news)){ // There is 20% of chance (0.60 to 0.79)
        group('Open News Page', () => {
            const response = http.get(`${BASE_URL}/news.php`);
            check(response,{
                'news page status should be 200': (r) => r.status === 200
            })
        })
        sleep(1);
    }
    else{ // There is 20% of chance (0.80 to 1.0)
        group('Open Blog Page', () => {
            const response = http.get(`${BASE_URL}/blog`);
            check(response,{
                'blog page status should be 200': (r) => r.status === 200
            })
        })
        sleep(1);
    }
}

export function handleSummary(data){
    return {
        "report2.html": htmlReport(data)
    }
}