@Grab('org.codehaus.groovy:groovy:2.5.14')

import groovy.json.*

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//    ______                           __                 
//  .' ___  |                         [  |                
// / .'   \_| _ .--.  ,--.  _   _   __ | | .---.  _ .--.  
// | |       [ `/'`\]`'_\ :[ \ [ \ [  ]| |/ /__\\[ `/'`\] 
// \ `.___.'\ | |    // | |,\ \/\ \/ / | || \__., | |     
//  `.____ .'[___]   \'-;__/ \__/\__/ [___]'.__.'[___]    
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUND_CODE = "161725"

@Service
class FundCrawler {

    def scratch(String FUND_CODE, int pageSize = 999) {
        def request = new URL("http://api.fund.eastmoney.com/f10/lsjz?fundCode=${FUND_CODE}&pageIndex=1&pageSize=${pageSize}&startDate=&endDate=").openConnection();
        request.setRequestMethod("GET")
        request.setDoOutput(true)
        request.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Mobile Safari/537.36")
        request.setRequestProperty("Referer", "http://fundf10.eastmoney.com/")
        def requestRC = request.getResponseCode();
        if (requestRC.equals(200)) {
            def result = new groovy.json.JsonSlurper().parseText(request.getInputStream().getText())
            return result.Data.LSJZList
        }
        return null
    }

}
