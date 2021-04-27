const BASE_URI = "http://localhost:8080/"

const SERVICE_URI_LIST = {
    FUND_DETIAL: BASE_URI + "/funds/{fundCode}?fundStatisticalPeriod={fundStatisticalPeriod}&fundDataLength={fundDataLength}&todayMockPercentage={todayMockPercentage}",
    RECENTS: BASE_URI + "/recents",
    DELETE_RECENT: BASE_URI + "/recents?fundCode={fundCode}"
}

class FundDataServiceBroker {

    static async getFundDetail(
            token,
            fundCode,
            fundStatisticalPeriod,
            fundDataLength,
            todayMockPercentage,
            responseHandler) {
        let url = FundDataServiceBroker.formatUrl(SERVICE_URI_LIST.FUND_DETIAL,
            fundCode, fundStatisticalPeriod, fundDataLength, todayMockPercentage)
        console.log(['getFundDetail', url])
        let response = await fetch(url, { headers: { token } })
        response = await response.json()
        responseHandler(response)
    }

    static async getRecents(token, responseHandler) {
        let url = SERVICE_URI_LIST.RECENTS
        let response = await fetch(url, { headers: { token } })
        response = await response.json()
        responseHandler(response)
    }

    static async deleteRecent(token, fundCode, responseHandler) {
        let url = FundDataServiceBroker.formatUrl(SERVICE_URI_LIST.DELETE_RECENT, fundCode)
        let response = await fetch(url, { headers: { token }, method: "DELETE" })
        responseHandler(response)
    }

    static formatUrl(template, ...values) {
        console.log(['formatUrl', ...values])
        if (values && values.length) {
            values.forEach(e => { template = template.replace(/[{].+?[}]/, e ? e : "") })
        }
        return template
    }
}

export default FundDataServiceBroker;