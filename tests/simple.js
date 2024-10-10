//
// A generic load test script provided for example purposes and testing
//

import { check, group, sleep } from 'k6'
import {Counter} from 'k6/metrics'
import http from 'k6/http'

//import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { htmlReport } from '../dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

const TARGET_URL = __ENV.TEST_TARGET || 'https://google.com'
const RAMP_TIME = __ENV.RAMP_TIME || '1s'
const RUN_TIME = __ENV.RUN_TIME || '2s'
const USER_COUNT = __ENV.USER_COUNT || 20
const SLEEP = __ENV.SLEEP || 0.5

const status200Counter = new Counter('status_200_counter');

export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data, { debug: false }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}

export let options = {
  stages: [
    { duration: RAMP_TIME, target: USER_COUNT },
    { duration: RUN_TIME, target: USER_COUNT },
  ],
  thresholds: {
    http_req_duration: [      {
      "threshold": "p(90)<500",
      "abortOnFail": false,
      "delayAbortEval": "0s"
  },
  {
      "threshold": "p(95)<500",
      "abortOnFail": false,
      "delayAbortEval": "0s"
  },
  {
      "threshold": "p(99.9)<500",
      "abortOnFail": false,
      "delayAbortEval": "0s"
  }],
    iteration_duration: ['max<4000'],
  },
}

export default function () {
  let url = Math.random() > 0.4 ? TARGET_URL : 'https://nothing.ejvejf'
  let res = http.get(url)

  check(res, {
    'Status is ok': (r) => r.status === 200,
  })
  if(res.status == 200) {status200Counter.add(1);}

  sleep(SLEEP)

  group('Example group', () => {
    let res = http.get(TARGET_URL)

    check(res, {
      'NOT 500': (r) => r.status !== 500,
    })

    sleep(SLEEP)
  })
}
