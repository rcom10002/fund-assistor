import groovy.json.*

@Service
class FundProfile {

    @Autowired
    private FundCache fundCache

    static def getUsername(token) {
        token.replaceAll(/^.+[-]/, '')
    }

    def saveRecents(token, recent) {
        def profile = loadProfile(token)
        println([token, recent, profile.dump()])
        profile['recents'][recent.fundCode] = ["fundStatisticalPeriod": recent.fundStatisticalPeriod, "fundDataRange": recent.fundDataRange]
        def username = FundProfile.getUsername(token)
        new File(".", "${username}.txt").write(new JsonBuilder(profile).toString())
    }

    def loadRecents(token) {
        def username = FundProfile.getUsername(token)
        def recents = loadProfile(username).recents
        def nameList = fundCache.getNameList()
        recents.each {
            it.value['name'] = fundCache.getNameList[it.key]
        }
    }

    private loadProfile(token) {
        def username = FundProfile.getUsername(token)
        new JsonSlurper().parseText(new File(".", "${username}.txt").getText())
    }
}