@Service
class FundConfiguration {
    def getFileNameOfFundNameList() {
        def today = new java.text.SimpleDateFormat("yyyyMMdd").format(new Date())
        "FundNameList${today}.txt"
    }
}
