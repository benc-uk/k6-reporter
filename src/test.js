import { htmlReport } from '../dist/bundle.js'
import fs from 'fs'
import path from 'path'

// Read the test data from the file
const testData = JSON.parse(fs.readFileSync(path.resolve('./tests/test-data.json'), 'utf8'))

// Generate the HTML report
try {
  const report = htmlReport(testData, { title: 'Test Report', debug: false, theme: 'default' })

  // You can either display the report in the console
  console.log('✅ HTML Report generated successfully')

  // Or write it to a file for inspection
  fs.writeFileSync('test-report.html', report)
  console.log('📃 Report written to test-report.html')
} catch (error) {
  console.error('❌ Error generating report:', error)
}
