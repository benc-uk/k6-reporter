//
// Generate HTML report from K6 summary data
// Ben Coleman, March 2021, October 2025
//

import ejs from 'ejs/ejs.min.js'
import classicTemplate from './themes/classic.ejs'
import bootstrapTemplate from './themes/bootstrap.ejs'

const version = __VERSION__

//
// Main function should be imported and wrapped with the function handleSummary
//
export function htmlReport(data, opts = {}) {
  // Default options
  opts.title = opts.title || `K6 Test Report: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`
  opts.debug = opts.debug || false
  opts.theme = opts.theme || 'classic'

  let template = ''
  switch (opts.theme) {
    case 'bootstrap':
      template = bootstrapTemplate
      break
    case 'classic':
    default:
      template = classicTemplate
  }

  console.log(`[k6-reporter v${version}] Generating HTML summary report`)
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

  const standardMetrics = [
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
    'http_req_failed',
    'http_req_duration{expected_response:true}',
  ]

  // Render the template
  const html = ejs.render(template, {
    data,
    title: opts.title,
    standardMetrics,
    otherMetrics,
    thresholdFailures,
    thresholdCount,
    checkFailures,
    checkPasses,
    version,
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
