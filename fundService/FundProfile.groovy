class FundProfile {
    static def getUsername(token) {
        token.replaceAll(/^.+[-]/, '')
    }
}