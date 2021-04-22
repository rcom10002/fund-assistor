
@Service
class FundCache {

    @Autowired
    private FundCrawler fundCrawler 

    private Map cachedNameList = [:]

    def getNameList() {
        if (cachedNameList) {
            return cachedNameList
        }
        def today = new Date().format("yyyyMMdd")
        def result = new File("FundNameList${today}.txt").exists()
        if (!result) {
            result = fundCrawler.scratchFundNameList()
        } else {
            result = new groovy.json.JsonSlurper().parseText(result.getText())
        }
        result.datas.each {
            cachedNameList[it[0]] = it[1]
        }
        return cachedNameList
    }

}
