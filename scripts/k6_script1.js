import http from "k6/http";
import {sleep, check} from "k6"; 
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"

const BASE_URL = __ENV.BASE_URL || "https://test.k6.io"

export default function() { 
    const response =  http.get(BASE_URL);

    check(response,{
        "is status 200 ?": (r) => r.status === 200,
    });

    sleep(1); 
}

export const options = {
    stages: [
        {duration: "1m", target: 100}, // ramp up - 0 to 1min
        {duration: "2m", target: 300}, // ramp up more - 1 to 3min
        {duration: "2m", target: 300}, // stay constant - 3 to 5min
        {duration: "1m", target: 0} // ramp down - 5 to 6min
    ],
    thresholds: {
        http_req_duration: ['p(95) < 500'], // 95% of the req's should get their response's with 500ms
        http_req_failed: ['rate <= 0.05'], // http request failure rate should be <= 5%
        checks: ['rate >= 0.9'] // more than 90% of the checks written should pass
    }
}

export function handleSummary(data){
    return{
        "report1.html": htmlReport(data)
    }
} 