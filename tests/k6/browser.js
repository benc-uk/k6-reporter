import http from 'k6/http'
import { browser } from 'k6/browser'
import { sleep, fail, check } from 'k6'
import { expect } from 'https://jslib.k6.io/k6-testing/0.5.0/index.js'
import { htmlReport } from '../../dist/bundle.cjs'

const BASE_URL = 'https://quickpizza.grafana.com'

export function handleSummary(data) {
  return {
    'summary-browser.html': htmlReport(data, { debug: false, title: 'Browser Test Report' }),
  }
}

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      vus: 5,
      maxDuration: '10s',
      iterations: 5,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    iteration_duration: ['avg<4000', 'p(95)<4000', 'max<4000'],
  },
}

export function setup() {
  let res = http.get(BASE_URL)
  expect(res.status, `Got unexpected status code ${res.status} when trying to setup. Exiting.`).toBe(200)
}

export default async function () {
  const page = await browser.newPage()

  try {
    await page.goto(BASE_URL)
    await expect.soft(page.locator('h1')).toHaveText('Looking to break out of your pizza routine?')

    await page.locator('//button[. = "Pizza, Please!"]').click()
    await page.waitForTimeout(500)

    const textHits = await page.getByText('QuickPizza').count()
    const recommendationsContent = await page.locator('div#recommendations').textContent()

    check(textHits, {
      'found some QuickPizza text': (t) => t > 0,
    })

    check(recommendationsContent, {
      'recommendations not empty': (c) => c && c.trim().length > 0,
    })
  } catch (error) {
    fail(`Browser iteration failed: ${error.message}`)
  } finally {
    await page.close()
  }

  sleep(1)
}
