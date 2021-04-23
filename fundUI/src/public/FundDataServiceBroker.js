const BASE_URI = "http://localhost:8080/"

const SERVICE_URI_LIST = {
    FUND_DETIAL: BASE_URI + "/funds/{fundCode}?fundStatisticalPeriod={fundStatisticalPeriod}&fundDataRange={fundDataRange}",
    RECENTS: BASE_URI + "/recents",
    DELETE_RECENT: BASE_URI + "/recents/{fundCode}"
}

class FundDataServiceBroker {

    static getFundDetail(token, fundCode, fundStatisticalPeriod, fundDataRange, responseHandler) {
        let url = FundDataServiceBroker.formatUrl(SERVICE_URI_LIST.FUND_DETIAL, fundCode, fundStatisticalPeriod, fundDataRange)
        fetch(url, { headers: { token } })
            .then(response => response.json())
            .then(responseHandler)
    }

    static getRecents(token, responseHandler) {
        let url = SERVICE_URI_LIST.RECENTS
        fetch(url, { headers: { token } })
            .then(response => response.json())
            .then(responseHandler)
    }

    static deleteRecent(token, fundCode, responseHandler) {
        let url = FundDataServiceBroker.formatUrl(SERVICE_URI_LIST.FUND_DDELETE_RECENTETIAL, fundCode)
        fetch(url, { headers: { token }, method: "DELETE" })
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

export default FundDataServiceBroker;