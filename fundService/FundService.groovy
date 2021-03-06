@Grab('spring-boot-devtools')
@Grab(group='org.codehaus.groovy', module='groovy', version='[2.5.14,)')
@Grab(group='org.codehaus.groovy', module='groovy-json', version='[2.5.14,)')
@RestController
class WebApplication {

    @Autowired
    private FundProcessor fundProcessor;
    @Autowired
    private FundCrawler fundCrawler;
    @Autowired
    private FundProfile fundProfile;

    @RequestMapping("/")
    String home() {
        this.dump()
    }

    @GetMapping("/funds/{fundCode}")
    @CrossOrigin
    ResponseEntity showFundProduct(
            @RequestHeader Map<String, String> headers,
            @PathVariable("fundCode") String fundCode,
            @RequestParam(name="fundDataLength") int fundDataLength,
            @RequestParam(name="fundStatisticalPeriod") int fundStatisticalPeriod,
            @RequestParam(name="todayMockPercentage", required = false) Double todayMockPercentage) {

        def recent = [:]
        recent['fundCode'] = fundCode
        recent['fundDataLength'] = fundDataLength
        recent['fundStatisticalPeriod'] = fundStatisticalPeriod
        recent['todayMockPercentage'] = todayMockPercentage

        def token = headers['token']
        if (token) {
            fundProfile.saveRecent(token, recent)
        } else {
            // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body()
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null)
        }
        def fundDataList = fundCrawler.scratchFundDetail(fundCode, fundDataLength)
        fundProcessor.mockTodayData(fundDataList, todayMockPercentage)
        return ResponseEntity.ok(fundProcessor.process(fundDataList, fundStatisticalPeriod))
    }

    @GetMapping("/recents")
    @CrossOrigin
    ResponseEntity listRecents(@RequestHeader Map<String, String> headers) {
        def token = headers['token']
        if (token) {
            return ResponseEntity.ok(fundProfile.loadRecents(token))
        } else {
            // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body()
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null)
        }
        
    }

    @DeleteMapping("/recents")
    @CrossOrigin
    ResponseEntity deleteRecent(
            @RequestHeader Map<String, String> headers,
            @RequestParam("fundCode") String fundCode) {
        def token = headers['token']
        if (token) {
            return ResponseEntity.ok(fundProfile.deleteRecent(token, fundCode))
        } else {
            // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body()
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null)
        }
        
    }

    @PostMapping("/authentication")
    @CrossOrigin
    ResponseEntity authenticate(@RequestHeader Map<String, String> headers, @RequestBody Map<String,String> body) {
        String username = credential.username
        String password = credential.password

        return ResponseEntity.ok(["result": true])
    }

    @GetMapping("/fundNameList")
    @CrossOrigin
    ResponseEntity refreshFundNameList(
            @RequestHeader Map<String, String> headers,
            @RequestParam(name="pageSize", required = false) int pageSize) {
        // def token = headers['token']
        // if (token) {
        //     return ResponseEntity.ok(fundProcessor.loadRecents(token))
        // } else {
        //     // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body()
        //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null)
        // }
        return ResponseEntity.ok(fundCrawler.scratchFundNameList(pageSize))
    }

}
