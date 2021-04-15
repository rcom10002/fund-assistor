const BASE_URI = "http://localhost:8080/"

const SERVICE_URI_LIST = {
    FUND_DETIAL: BASE_URI + "/funds/{fundCode}?fundDataSize={fundDataSize}"
}

class ServiceBroker {

    static getFundDetail(fundCode, fundDataSize, responseHandler) {
        let url = ServiceBroker.formatUrl(SERVICE_URI_LIST.FUND_DETIAL, fundCode, fundDataSize)
        console.log(['fundDataSize', fundDataSize])
        fetch(url)
            .then(response => response.json())
            .then(responseHandler)
    }

    static formatUrl(template, ...values) {
        if (values && values.length) {
            values.forEach(e => { template = template.replace(/[{].+?[}]/, e) })
        }
        return template
    }
}

export default ServiceBroker;