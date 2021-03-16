# K6 HTML Report Exporter v2

### 🔥 Note.

> This a complete rewrite/overhaul of the existing report converter, now written in JavaScript to be integrated into the test. This is a more elegant method than the offline conversation process. The previous code has been moved to the 'archive' folder.

The report will show all request groups, checks, HTTP metrics and other statistics

Any HTTP metrics which have failed thresholds will be highlighted in red. Any group checks with more than 0 failures will also be shown in red.

![](https://img.shields.io/github/license/benc-uk/k6-reporter)
![](https://img.shields.io/github/last-commit/benc-uk/k6-reporter)
![](https://img.shields.io/github/release/benc-uk/k6-reporter)
![](https://img.shields.io/github/checks-status/benc-uk/k6-reporter/main)

# Usage

This extension to K6 is intended to be used by adding into your K6 test code (JavaScript) and utilizes the _handleSummary_ callback hook, added to K6 v0.30.0. When your test completes a HTML file will be written to the filesystem, containing a formatted and easy to consume version of the test summary data

To use, add this module to your test code.

Import the `htmlReport` function from the bundled module hosted remotely on GitHub

```js
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
```

> Note. Replace `main` with a version tag (e.g. `2.2.0`) to use a specific version

Then outside the test's default function, wrap it with the `handleSummary(data)` function which [K6 calls at the end of any test](https://github.com/loadimpact/k6/pull/1768), as follows:

```js
export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
```

The key used in the returned object is the filename that will be written to, and can be any valid filename or path  
**Note. This is a change in the v2.1.1 release**

The **htmlReport** function accepts an optional options map as a second parameter, with the following properties

```ts
title    string  // Title of the report, defaults to current date
```

## Multiple outputs

If you want more control over the output produced or to output the summary into multiple places (including stdout), just combine the result of htmlReport with other summary generators, as follows:

```js
// This will export to HTML as filename "result.html" AND also stdout using the text summary
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
```

# Screenshots

![main report screenshot](https://user-images.githubusercontent.com/14982936/111346520-32b64100-8676-11eb-9b35-df32ef1982b1.png)

![another report screenshot](https://user-images.githubusercontent.com/14982936/111085882-5d3ab980-8511-11eb-819d-d283bd03dc88.png)
