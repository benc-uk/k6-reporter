import { htmlReport } from '../dist/bundle.js'
import fs from 'fs'
import path from 'path'

const inputFilePath = `tests/data/${process.argv[2] || 'simple.json'}`
console.log(`📂 Reading test data from: ${inputFilePath}`)

// Read the test data from the file
const testData = JSON.parse(fs.readFileSync(path.resolve(inputFilePath)), 'utf8')

// Generate the HTML report
try {
  const report = htmlReport(testData, { debug: false, theme: 'default' })

  // You can either display the report in the console
  console.log('✅ HTML Report generated successfully')

  // Or write it to a file for inspection
  fs.writeFileSync('./tests/test.html', report)
  console.log('📃 Report written to ./tests/test.html')
} catch (error) {
  console.error('❌ Error generating report:', error)
}
