//
// A generic load test script provided for example purposes and testing
//

import { check, group, sleep } from "k6";
import http from "k6/http";
import { htmlReport } from "./html-report.js";
//import { htmlReport } from "https://benc.z6.web.core.windows.net/html-report.js";

const TARGET_URL = __ENV.TEST_TARGET || "https://benc.dev";
const RAMP_TIME = __ENV.RAMP_TIME || "1s";
const RUN_TIME = __ENV.RUN_TIME || "1s";
const USER_COUNT = __ENV.USER_COUNT || 20;
const SLEEP = __ENV.SLEEP || 1;

export function handleSummary(data) {
  return htmlReport(data);
}

// Very simple ramp up from zero to VUS_MAX over RAMP_TIME, then runs for further RUN_TIME
export let options = {
  stages: [
    { duration: RAMP_TIME, target: USER_COUNT },
    { duration: RUN_TIME, target: USER_COUNT },
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000"], // threshold on a standard metric
    iteration_duration: ["max<4000"], // threshold on a standard metric
  },
};

// Totally generic HTTP check
export default function () {
  let res = http.get(TARGET_URL);

  check(res, {
    "Status is ok": (r) => r.status === 201,
  });

  sleep(SLEEP);

  group("testgrp", () => {
    let res = http.get(TARGET_URL);

    check(res, {
      "NOT 500": (r) => r.status !== 500,
    });

    sleep(SLEEP);
  });
}
