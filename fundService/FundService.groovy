@Grab('spring-boot-devtools')
@Grab(group='org.codehaus.groovy', module='groovy', version='[2.5.14,)')
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
            @RequestParam(name="fundDataRange") int fundDataRange,
            @RequestParam(name="fundStatisticalPeriod") int fundStatisticalPeriod) {

        def recent = [:]
        recent['fundCode'] = fundCode
        recent['fundStatisticalPeriod'] = fundStatisticalPeriod
        recent['fundDataRange'] = fundDataRange
        def token = headers['token']
        if (token) {
            fundProfile.saveRecents(token, recent)
        } else {
            // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body()
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null)
        }
        return ResponseEntity.ok(fundProcessor.process(fundCrawler.scratchFundDetail(fundCode, fundDataRange), fundStatisticalPeriod))
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

    @PostMapping("/authentication")
    @CrossOrigin
    ResponseEntity authenticate(@RequestHeader Map<String, String> headers, @RequestBody Map<String,String> body) {
        String username = credential.username
        String password = credential.password

        return ResponseEntity.ok(["result": true])
    }

    @GetMapping("/fundNameList")
    @CrossOrigin
    ResponseEntity refreshFundNameList(@RequestHeader Map<String, String> headers, @RequestParam(name="pageSize", required = false) int pageSize) {
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
