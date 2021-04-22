@Service
class FundConfiguration {
    def getFileNameOfFundNameList() {
        def today = new Date().formmat("yyyyMMdd")
        "FundNameList${today}.txt"
    }
}
