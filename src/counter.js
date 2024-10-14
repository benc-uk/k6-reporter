import {Counter} from 'k6/metrics'

export class Counters {
    counterMatrix = {}
    constructor(endpoints, status) {
        this.addNewCounters(endpoints, status);
    }

    addNewCounters(endpoints, status) {
        for (const endpoint of endpoints) {
            this.counterMatrix[endpoint['url']] = {};
            for (const statusCode of status) {
                this.counterMatrix[endpoint['url']][statusCode] = this.counterInit(endpoint['url'], statusCode);
            }
        }
    }

    counterInit(endpoint, status) {
        return new Counter('Status_' + status + "_counter_" + this.formatUrl(endpoint.replace('https://', '')));
    }

    formatUrl = str =>
        str.toLowerCase().replace(/([\/\-_.=?%&][a-zA-Z0-9])/g, group =>
            group
                .toUpperCase()
                .replace('-', '')
                .replace('/', '')
                .replace('_', '')
                .replace('.', '')
                .replace('=', '')
                .replace('?', '')
                .replace('%', '')
                .replace('&', '')
        ).substring(0, 94);
    get counterMatrix() {
        return this.counterMatrix
    }
}