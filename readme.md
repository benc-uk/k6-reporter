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

To use, add this module to your test code.

Import the `htmlReport` function from the module hosted remotely on GitHub

```js
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/html-report.js";
```

Then outside the test's default function, wrap it with the `handleSummary(data)` function which [K6 calls at the end of any test](https://github.com/loadimpact/k6/pull/1768), as follows:

```js
export function handleSummary(data) {
  return htmlReport(data);
}
```

The **htmlReport** function accepts an optional options map as a second parameter, with the following properties

```ts
filename string  // Filename of HTML output
title    string  // Title of the report, defaults to current date
```

# Screenshots

![main report screenshot](https://user-images.githubusercontent.com/14982936/111085852-2c5a8480-8511-11eb-89dc-e6c836e6fc3d.png)

![another report screenshot](https://user-images.githubusercontent.com/14982936/111085882-5d3ab980-8511-11eb-819d-d283bd03dc88.png)
