import groovy.json.*
import org.slf4j.Logger
import org.slf4j.LoggerFactory

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//  ________                                     __          
// |_   __  |                                   [  |         
//   | |_ \_|.--.   _ .--.  _ .--..--.  __   _   | |  ,--.   
//   |  _| / .'`\ \[ `/'`\][ `.-. .-. |[  | | |  | | `'_\ :  
//  _| |_  | \__. | | |     | | | | | | | \_/ |, | | // | |, 
// |_____|  '.__.' [___]   [___||__||__]'.__.'_/[___]\'-;__/ 
///////////////////////////////////////////////////////////////////////////////////////////////////////////

@Service
class FundProcessor {

    Logger logger = LoggerFactory.getLogger(FundProcessor);

    def formulaMax(fundList, columnName, beginIndex, length) {
        int totalSize = fundList.size()
        int threshold = 0
        double max = 0
        while (beginIndex < totalSize && threshold < length) {
            max = Math.max(fundList[beginIndex][columnName] as Double, max)
            beginIndex++
            threshold++
        }
        return max
    }

    def formulaMin(fundList, columnName, beginIndex, length) {
        int totalSize = fundList.size()
        int threshold = 0
        double min = 999
        while (beginIndex < totalSize && threshold < length) {
            min = Math.min(fundList[beginIndex][columnName] as Double, min)
            beginIndex++
            threshold++
        }
        return min
    }

    def formulaSum(fundList, columnName, beginIndex, length) {
        int totalSize = fundList.size()
        int threshold = 0
        double sum = 0
        while (beginIndex < totalSize && threshold < length) {
            sum += fundList[beginIndex][columnName] as Double
            beginIndex++
            threshold++
        }
        return sum
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  ______                                          _           ________  _         __        __         
    // |_   _ `.                                       (_)         |_   __  |(_)       [  |      |  ]        
    //   | | `. \ _   __  _ .--.   ,--.   _ .--..--.   __   .---.    | |_ \_|__  .---.  | |  .--.| |  .--.   
    //   | |  | |[ \ [  ][ `.-. | `'_\ : [ `.-. .-. | [  | / /'`\]   |  _|  [  |/ /__\\ | |/ /'`\' | ( (`\]  
    //  _| |_.' / \ '/ /  | | | | // | |, | | | | | |  | | | \__.   _| |_    | || \__., | || \__/  |  `'.'.  
    // |______.'[\_:  /  [___||__]\'-;__/[___||__||__][___]'.___.' |_____|  [___]'.__.'[___]'.__.;__][\__) ) 
    //           \__.'                                                                                       
    // 单位周期内最大累计净值与最小累计净值
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    def process(fundList, fundStatisticalPeriod) {
        String jsonString = ""
        int fundDataRange = fundList.size
        if (fundList) {
            fundList.eachWithIndex { e, i ->
                if (!e["JZZZL"].length()) {
                    e["JZZZL"] = "0"
                }
            }
            fundList.eachWithIndex { e, i ->
                e["PERIODICAL_MAX_LJJZ"]    = formulaMax(fundList, "LJJZ", i, fundStatisticalPeriod)
                e["PERIODICAL_MIN_LJJZ"]    = formulaMin(fundList, "LJJZ", i, fundStatisticalPeriod)
                e["PERIODICAL_1W_JZZZL"]    = formulaSum(fundList, "JZZZL", i, 5)
                e["PERIODICAL_2W_JZZZL"]    = formulaSum(fundList, "JZZZL", i, 10)
                e["PERIODICAL_3W_JZZZL"]    = formulaSum(fundList, "JZZZL", i, 15)
            }
        }
        return fundList
    }
}
