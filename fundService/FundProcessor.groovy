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

    Logger logger = LoggerFactory.getLogger(FundProcessor)

    def formulaMax(fundDataList, columnName, beginIndex, length) {
        int totalSize = fundDataList.size()
        int threshold = 0
        double max = 0
        while (beginIndex < totalSize && threshold < length) {
            max = Math.max(fundDataList[beginIndex][columnName] as Double, max)
            beginIndex++
            threshold++
        }
        return Math.round(max * 1000) / 1000
    }

    def formulaMin(fundDataList, columnName, beginIndex, length) {
        int totalSize = fundDataList.size()
        int threshold = 0
        double min = 999
        while (beginIndex < totalSize && threshold < length) {
            min = Math.min(fundDataList[beginIndex][columnName] as Double, min)
            beginIndex++
            threshold++
        }
        return Math.round(min * 1000) / 1000
    }

    def formulaSum(fundDataList, columnName, beginIndex, length) {
        int totalSize = fundDataList.size()
        int threshold = 0
        double sum = 0
        while (beginIndex < totalSize && threshold < length) {
            sum += fundDataList[beginIndex][columnName] as Double
            beginIndex++
            threshold++
        }
        return Math.round(sum * 1000) / 1000
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
    def process(fundDataList, fundStatisticalPeriod) {
        int fundDataLength = fundDataList.size
        if (fundDataList) {
            fundDataList.eachWithIndex { e, i ->
                if (!e['JZZZL']) {
                    e['JZZZL'] = '0'
                }
            }
            fundDataList.eachWithIndex { e, i ->
                e['JZZZL_BUCKET_RANK']                  = Math.round((e['JZZZL'] as Double) / 0.1)
                e['PERIODICAL_MAX_LJJZ']                = formulaMax(fundDataList, 'LJJZ', i, fundStatisticalPeriod)
                e['PERIODICAL_MIN_LJJZ']                = formulaMin(fundDataList, 'LJJZ', i, fundStatisticalPeriod)
                e['PERIODICAL_MAX_GROWTH']              = formulaMax(fundDataList, 'LJJZ', i, fundStatisticalPeriod)
                e['PERIODICAL_MIN_WITHDRAWAL']          = formulaMin(fundDataList, 'LJJZ', i, fundStatisticalPeriod)
                e['PERIODICAL_1W_JZZZL']                = formulaSum(fundDataList, 'JZZZL', i, 5)
                e['PERIODICAL_2W_JZZZL']                = formulaSum(fundDataList, 'JZZZL', i, 10)
                e['PERIODICAL_3W_JZZZL']                = formulaSum(fundDataList, 'JZZZL', i, 15)
            }
        }
        return fundDataList
    }

    def mockTodayData(fundDataList, todayMockPercentage) {
        if (todayMockPercentage != null &&
                'S' != new java.text.SimpleDateFormat('EEE', Locale.US).format(new Date()).charAt(0)) {
            def e = fundDataList[0]
            def todayMock = ['FSRQ': new java.text.SimpleDateFormat('yyyy-MM-dd').format(new Date())]
            todayMock['DWJZ'] = (e['DWJZ'] as Double) * (1 + todayMockPercentage / 100)
            todayMock['LJJZ'] = (e['LJJZ'] as Double) + todayMock['DWJZ'] - (e['DWJZ'] as Double)
            todayMock['JZZZL'] = todayMockPercentage
            fundDataList.add(0, todayMock)
        }
    }

}
