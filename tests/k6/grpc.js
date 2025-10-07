import grpc from 'k6/net/grpc'
import { check } from 'k6'
import { Counter, Trend, Rate, Gauge } from 'k6/metrics'

//import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/3.0.1/dist/bundle.js'
import { htmlReport } from '../../dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js'

const client = new grpc.Client()
client.load(['.'], 'hello.proto')

const grpcReqCounter = new Counter('grpc_reqs')
const fakeTrend = new Trend('fake_trend')
const fakeRate = new Rate('fake_rate')
const fakeGauge = new Gauge('fake_gauge')

export const options = {
  stages: [{ duration: '5s', target: 10 }],
  thresholds: {
    grpc_req_duration: ['med <= 2'],
    fake_rate: ['rate >= 0.8'],
  },
}

export function handleSummary(data) {
  return {
    'summary-grpc.html': htmlReport(data, { debug: false, title: 'gRPC Test Report' }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}

export default () => {
  fakeGauge.add(Math.random() * 100)

  client.connect('localhost:50051', { plaintext: true })
  const data = { name: 'Bert' }

  grpcReqCounter.add(1)
  fakeTrend.add(Math.random() * 1000)
  fakeRate.add(Math.random() > 0.5)

  const response = client.invoke('Hello/SayHello', data)

  check(response, {
    'status is OK': (r) => r && r.status === grpc.StatusOK,
  })

  client.close()
}
