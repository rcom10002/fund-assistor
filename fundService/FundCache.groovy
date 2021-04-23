@Service
class FundCache {

    @Autowired
    private FundCrawler fundCrawler
    @Autowired
    private FundConfiguration fundConfiguration

    private Map cachedNameList = [:]

    def getNameList() {
        if (cachedNameList) {
            return cachedNameList
        }

        def result = new File(fundConfiguration.getFileNameOfFundNameList())
        if (!result.exists()) {
            result = fundCrawler.scratchFundNameList()
        } else {
            result = new groovy.json.JsonSlurper().parseText(result.getText())
        }
        println(['%%%%%%%%%%%', result.dump()])
        result.datas.each {
            cachedNameList[it[0]] = it[1]
        }
        return cachedNameList
    }

}
