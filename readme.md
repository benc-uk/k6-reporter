# K6 HTML Summary Report

K6 HTML Summary Report is a plugin extension that transforms [k6](https://k6.io/) test results into HTML reports.

This helps visualize load test results in an easy-to-read format, enabling better analysis and sharing of performance test results. Simply import the module into your k6 test scripts to generate comprehensive HTML reports with charts and tables showing response times, request rates, and other critical performance indicators.

Any checks or thresolds defined in your test will be highlighted, with indications of pass/fail status.

![](https://img.shields.io/github/last-commit/benc-uk/k6-reporter)
![](https://img.shields.io/github/release/benc-uk/k6-reporter)
[![CI Checks & Build](https://github.com/benc-uk/k6-reporter/actions/workflows/ci.yaml/badge.svg)](https://github.com/benc-uk/k6-reporter/actions/workflows/ci.yaml)

NOTE: Since v0.49.0 k6 has provided both a realtime web dashboard and end of test HTML reports. See the [k6 documentation](https://grafana.com/docs/k6/latest/results-output/web-dashboard/) for more details. The graphs are much more detailed, but info like thresholds and checks are not shown or color coded. I'll let people decide which they prefer!

# Basic Usage

This extension needs to be added into your K6 test code and utilizes the _handleSummary_ callback hook. When your test completes, a HTML file will be written to the filesystem, containing the report.

To use, add this module to your test code.

### Import

Import the `htmlReport` function from the bundled module hosted remotely on GitHub

```js
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js'
```

- Replace `latest` with a version tag (e.g. `3.0.1`) to pin to a specific version, see [releases](https://github.com/benc-uk/k6-reporter/releases/) for available versions
- Or use `main` to always get the latest development version, which may be unstable or even broken

### Invoke

Outside of the main test function, export a call to `handleSummary(data)`, this is a function which [K6 calls at the end of any test](https://grafana.com/docs/k6/latest/results-output/end-of-test/custom-summary/). Inside this function, call `htmlReport(data)` and return the result in an object, as follows:

```js
export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
  }
}
```

The key used in the returned object is used as the filename of the output, and can be any valid filename or path

## Options

The **htmlReport** function accepts an optional options object/map as a second parameter, with the following properties

| Property | Type    | Default                 | Description                                                                     |
| -------- | ------- | ----------------------- | ------------------------------------------------------------------------------- |
| theme    | string  | 'default'               | The theme to use for the report. See below                                      |
| title    | string  | 'K6 Test Report {date}' | The title to use for the report                                                 |
| debug    | boolean | false                   | If true, will output the raw JSON data input, you probably will never need this |

## Themes

Version 3 introduced themes support for styling the look of the output. There are now several themes to choose from:

- The `default` theme was revised in v3 to be modern and cleaner, you can thank AI Claude Sonnet for the design work! It's also smarter in what values and columns it shows and is generally the best choice.
- The `classic` theme is the original theme, and is still available if you prefer the chunky old style.
- The `bootstrap` theme uses vanilla [Bootstrap 5](https://getbootstrap.com/) for styling and layout.
  - You can also use [Bootswatch](https://bootswatch.com/) themes for a different look and feel. To use a Bootswatch theme, set the theme option to `bootswatch:<name>`, where `<name>` is one of the available Bootswatch themes, e.g. `cerulean`, `cyborg`, `darkly`, etc. If no name is provided, it will default to `cerulean`.

> NOTE: All themes other than `default` are considered legacy and will not be supported or get new features in future releases. They are provided for backwards compatibility only.

## Multiple outputs

If you want more control over the output produced or to output the summary into multiple places (including stdout), just combine the result of htmlReport with other summary generators, as follows:

```js
// This will export to HTML as filename "result.html" AND also stdout using the text summary

import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js'

export function handleSummary(data) {
  return {
    'result.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}
```

# Screenshots

![main report screenshot](./assets/2025-10-05%2023%2034%2021.png)

![another report screenshot](./assets/2025-10-05%2023%2036%2004.png)
