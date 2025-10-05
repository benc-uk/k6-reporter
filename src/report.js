//
// Generate HTML report from K6 summary data
// Ben Coleman, March 2021, October 2025
//

import ejs from 'ejs/ejs.min.js'
import defaultTemplate from './themes/default.ejs'
import classicTemplate from './themes/classic.ejs'
import bootstrapTemplate from './themes/bootstrap.ejs'

const version = __VERSION__

//
// Main function should be imported and wrapped with the function handleSummary
//
export function htmlReport(data, opts = {}) {
  // Default options
  opts.title = opts.title || `Test Report: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`
  opts.debug = opts.debug || false
  opts.theme = opts.theme || 'default'

  let template = defaultTemplate
  if (opts.theme.startsWith('boot')) {
    template = bootstrapTemplate
  }
  if (opts.theme === 'classic') {
    template = classicTemplate
  }

  console.log(`[k6-reporter v${version}] Generating HTML summary report, with theme: ${opts.theme}`)
  const metricListSorted = []

  if (opts.debug) {
    console.log(JSON.stringify(data, null, 2))
  }

  // Count the thresholds and those that have failed
  let thresholdFailures = 0
  let thresholdCount = 0
  for (const metricName in data.metrics) {
    if (Object.prototype.hasOwnProperty.call(data.metrics, metricName)) {
      metricListSorted.push(metricName)
      if (data.metrics[metricName].thresholds) {
        thresholdCount++
        const thresholds = data.metrics[metricName].thresholds
        for (const thresName in thresholds) {
          if (!thresholds[thresName].ok) {
            thresholdFailures++
          }
        }
      }
    }
  }

  metricListSorted.sort()

  // Count the checks and those that have passed or failed
  let checkFailures = 0
  let checkPasses = 0

  function countChecksInGroup(group) {
    if (group.checks) {
      const { passes, fails } = countChecks(group.checks)
      checkFailures += fails
      checkPasses += passes
    }

    // Count the checks in nested groups
    for (const subGroup of group.groups) {
      countChecksInGroup(subGroup)
    }
  }

  // Start counting checks from the root group
  countChecksInGroup(data.root_group)

  // Kept for backwards compatibility with older themes classic and bootstrap
  const legacyStandardMetrics = [
    'grpc_req_duration',
    'http_req_duration',
    'http_req_waiting',
    'http_req_connecting',
    'http_req_tls_handshaking',
    'http_req_sending',
    'http_req_receiving',
    'http_req_blocked',
    'iteration_duration',
    'group_duration',
    'ws_connecting',
    'ws_msgs_received',
    'ws_msgs_sent',
    'ws_sessions',
  ]

  const otherMetrics = [
    'iterations',
    'data_sent',
    'checks',
    'http_reqs',
    'data_received',
    'vus_max',
    'vus',
    'http_req_duration{expected_response:true}',
  ]

  const trendStats = data.options.summaryTrendStats || []
  const trendMetrics = metricListSorted.filter((m) => data.metrics[m].type === 'trend' && !otherMetrics.includes(m))
  const rateMetrics = metricListSorted.filter((m) => data.metrics[m].type === 'rate' && !otherMetrics.includes(m))
  const counterMetrics = metricListSorted.filter((m) => data.metrics[m].type === 'counter' && !otherMetrics.includes(m))
  const gaugeMetrics = metricListSorted.filter((m) => data.metrics[m].type === 'gauge' && !otherMetrics.includes(m))

  console.log(trendMetrics)
  console.log(rateMetrics)
  console.log(counterMetrics)
  console.log(gaugeMetrics)

  const checkThres = (metric, valName) => {
    if (!metric.thresholds) {
      return ''
    }

    for (const thres in metric.thresholds) {
      if (thres.includes(valName)) {
        const isOK = metric.thresholds[thres].ok ?? true
        if (!isOK) {
          return 'failed'
        }
        return 'good'
      }
    }

    return ''
  }

  // Render the template
  const html = ejs.render(template, {
    data,
    title: opts.title,
    theme: opts.theme,
    trendStats,
    trendMetrics,
    rateMetrics,
    counterMetrics,
    gaugeMetrics,
    standardMetrics: legacyStandardMetrics,
    otherMetrics,
    thresholdFailures,
    thresholdCount,
    checkFailures,
    checkPasses,
    version,
    checkThres,
  })

  // Return HTML string needs wrapping in a handleSummary result object
  // See https://grafana.com/docs/k6/latest/results-output/end-of-test/custom-summary/#syntax
  return html
}

//
// Helper for counting the checks in a group
//
function countChecks(checks) {
  let passes = 0
  let fails = 0
  for (const check of checks) {
    passes += parseInt(check.passes, 10)
    fails += parseInt(check.fails, 10)
  }
  return { passes, fails }
}
