//
// A generic load test script provided for example purposes and testing
//

import { check, group, sleep } from 'k6'
import http from 'k6/http'

//import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { htmlReport } from '../dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

const TARGET_URL = __ENV.TEST_TARGET || 'https://benc.dev'
const RAMP_TIME = __ENV.RAMP_TIME || '1s'
const RUN_TIME = __ENV.RUN_TIME || '2s'
const USER_COUNT = __ENV.USER_COUNT || 20
const SLEEP = __ENV.SLEEP || 0.5

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
    http_req_duration: ['p(95)<1000'],
    iteration_duration: ['max<4000'],
  },
}

export default function () {
  let url = Math.random() > 0.8 ? TARGET_URL : TARGET_URL + '/gibberish'
  let res = http.get(url)

  check(res, {
    'Status is ok': (r) => r.status === 200,
  })

  sleep(SLEEP)

  group('Example group', () => {
    let res = http.get(TARGET_URL)

    check(res, {
      'NOT 500': (r) => r.status !== 500,
    })

    sleep(SLEEP)
  })
}
