class FundScheduler {
    static def getUsername(token) {
        token.replaceAll(/^.+[-]/, '')
    }
}