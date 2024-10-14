//
// A generic load test script provided for example purposes and testing
//

import { check, group, sleep } from 'k6'
import { Counter } from 'k6/metrics'
import http from 'k6/http'

//import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { htmlReport } from '../dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'
import { endpointList } from './endpoints.js'
import { Counters } from '../src/counter.js'

const status = ['200', '404', '500', '501', '502', '503', '504', 'otherRequestError']
const TARGET_URL = __ENV.TEST_TARGET || 'https://google.com'
const RAMP_TIME = __ENV.RAMP_TIME || '3s'
const RUN_TIME = __ENV.RUN_TIME || '2s'
const USER_COUNT = __ENV.USER_COUNT || 20
const SLEEP = __ENV.SLEEP || 0.5
const ENDPOINT_LIST = endpointList

const counters = new Counters(ENDPOINT_LIST, status)
export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data, { debug: false }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}

export let options = {
  stages: [
    { duration: RAMP_TIME, target: USER_COUNT },
    // { duration: RUN_TIME, target: USER_COUNT },
  ],
  thresholds: {
    http_req_duration: [{
      "threshold": "p(90)<60",
      "abortOnFail": false,
      "delayAbortEval": "0s"
    },
    {
      "threshold": "p(95)<50",
      "abortOnFail": false,
      "delayAbortEval": "0s"
    },
    {
      "threshold": "p(99)<500",
      "abortOnFail": false,
      "delayAbortEval": "0s"
    },
    {
      "threshold": "p(99.9)<1000",
      "abortOnFail": false,
      "delayAbortEval": "0s"
    }],
    iteration_duration: ['max<4000'],
    http_req_failed: ['rate<0.008'],
  },
  "summaryTrendStats": ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)", "count"],
  "summaryTimeUnit": "ms"
}
export default function () {
  let index = randomIntBetween(0, ENDPOINT_LIST.length - 1)
  let url = ENDPOINT_LIST[index].url
  console.log('request url is ' + url)
  let res = http.get(url)

  if(counters.counterMatrix[url][res.status.toString()]) {
    counters.counterMatrix[url][res.status.toString()].add(1)
  } else {
    counters.counterMatrix[url]['otherRequestError'].add(1)
  }

  check(res, {
    'Status is ok': (r) => r.status === 200,
  })
  // if (res.status == 200) { status200Counter.add(1); }

  sleep(SLEEP)

  // group('Example group', () => {
  //   let res = http.get(ENDPOINT_LIST[1].url)

  //   check(res, {
  //     'NOT 500': (r) => r.status !== 500,
  //   })
  //   if(counters.counterMatrix[ENDPOINT_LIST[1].url][res.status.toString()]) {
  //     counters.counterMatrix[ENDPOINT_LIST[1].url][res.status.toString()].add(1)
  //   } else {
  //     counters.counterMatrix[ENDPOINT_LIST[1].url]['otherRequestError'].add(1)
  //   }
  //   sleep(SLEEP)
  // })
}
function randomIntBetween(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
