/**
 * Profile Data Structure:
 * {
 *     "token": "cbabca3e-ca05-4953-bc65-124db8c839dd-woody",
 *     "recents": {
 *         "161725": {
 *             "fundStatisticalPeriod": 22,
 *             "fundDataRange": 240
 *         },
 *         "512690": {
 *             "fundStatisticalPeriod": 11,
 *             "fundDataRange": 120
 *         }
 *     }
 * }
 */
@Service
class FundProfile {

    @Autowired
    private FundCache fundCache

    static def getUsername(token) {
        token.replaceAll(/^.+[-]/, '')
    }

    def saveRecent(token, recent) {
        def profile = loadProfile(token)
        println([token, recent, profile.dump()])
        profile['recents'][recent.fundCode] = ["fundStatisticalPeriod": recent.fundStatisticalPeriod, "fundDataRange": recent.fundDataRange]
        def username = FundProfile.getUsername(token)
        new File(".", "${username}.txt").write(new groovy.json.JsonBuilder(profile).toString())
    }

    def deleteRecent(token, fundCode) {
        def username = FundProfile.getUsername(token)
        def profile = loadProfile(username)
        profile.recents.remove(fundCode)
        saveProfile(token, profile)
    }

    def loadRecents(token) {
        def username = FundProfile.getUsername(token)
        def recents = loadProfile(username).recents
        def nameList = fundCache.getNameList()
        recents.each {
            it.value['name'] = nameList[it.key]
        }
    }

    private loadProfile(token) {
        def username = FundProfile.getUsername(token)
        new groovy.json.JsonSlurper().parseText(new File(".", "${username}.txt").getText())
    }

    private saveProfile(token, profile) {
        def username = FundProfile.getUsername(token)
        new File(".", "${username}.txt").write(new groovy.json.JsonBuilder(profile).toString())
    }
}