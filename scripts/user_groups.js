import http from "k6/http";
import {sleep, check, group} from "k6";
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"

const BASE_URL = __ENV.BASE_URL || "https://test.k6.io";

export const options = {

}

export default function(){

    // create the group - to write user journey
    // Group = a label for a set of related actions in your test.
    group('Open Home Page', () => {
        const response = http.get(BASE_URL);
        check(response,{
            'status should be 200': (r) => r.status === 200
        })
    })

    sleep(1); // one flow completed, now create other journey of user

    group('Open News Page', () => {
        const response = http.get(`${BASE_URL}/news.php`);
        check(response,{
            'news page status should be 200': (r) => r.status === 200
        })
    })

    sleep(1);

    group('Open Blog Page', () => {
        const response = http.get(`${BASE_URL}/blog`);
        check(response,{
            'blog page status should be 200': (r) => r.status === 200
        })
    })

    sleep(1)
}

export function handleSummary(data){
    return {
        "report2.html": htmlReport(data)
    }
}