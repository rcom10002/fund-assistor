@Grab('spring-boot-devtools')
@Grab(group='org.codehaus.groovy', module='groovy', version='[2.5.14,)')
@RestController
class WebApplication {

    @Autowired
    private FundProcessor fundProcessor;
    @Autowired
    private FundCrawler fundCrawler;

    @RequestMapping("/")
    String home() {
        this.dump()
    }

    @RequestMapping("/funds/{fundCode}")
    @CrossOrigin
    ResponseEntity fundProduct(@PathVariable("fundCode") String fundCode, @RequestParam(name="fundDataSize") int fundDataSize) {
        return ResponseEntity.ok(fundProcessor.process(fundCrawler.scratch(fundCode, fundDataSize), 22))
    }

}
