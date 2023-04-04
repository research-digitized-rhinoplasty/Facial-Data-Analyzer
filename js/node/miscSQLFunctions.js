var sqlFunc = require('./sqlFunctions')

module.exports = {
    getLandmarkMeasurementList: async function getLandmarkMeasurementList(theJSON) {
        // retrieves landmark and measurement names for website onload
        let measResult = await sqlFunc.getStats(theJSON.sqlM, 2)
        let landResult = await sqlFunc.getStats(theJSON.sqlL, 2)
        let measName = []
        let landName = []
        let measAbbrv = []
        let landAbbrv = []
        for(var i=0; i<measResult.length; i++) {
        measName.push(measResult[i].Name)
        measAbbrv.push(measResult[i].MeasurementAbbrv)
        } // end for
        for(var i=0; i<landResult.length; i++) {
        landName.push(landResult[i].Name)
        landAbbrv.push(landResult[i].LandmarkAbbrv)
        } // end for
        
        return measJSON = {
        "Measurements":measName,
        "Landmarks":landName,
        "MeasurementAbbreviation":measAbbrv,
        "LandmarkAbbreviation":landAbbrv
        } // end return measJSON
    }, // end getMeasurements

    sqlCombiner: function sqlCombiner(parent, json) {
        // combines participant feature strings for sql statements used in parentNode.js
        let sql = ""
        if(json.length>1) {
          sql = "AND (Par." + parent + "='" + json[0] + "'"
          for(var i=0; i<json.length; i++) {
            if(i==0) continue
            let orSql = " OR Par." + parent + "='" + json[i] + "'"
            sql = sql.concat(orSql)
          } // end for
          sql = sql.concat(") ")
          return sql
        } else {
          sql = "AND (Par." + parent + "='" + json[0] + "') "
          return sql
        } // end if else
      }, // end sqlCombiner

      getPartChartValues: async function getPartChartValues(sql, partFeatures) {
        // retrieves participant statistics for html participant chart output
        var json = {}

        sql = 'SELECT Ethnicity as \'label\', COUNT(*) as \'count\' ' +
          'FROM participant as Par ' +
          'WHERE ' +
          partFeatures +
          'GROUP BY Ethnicity;'
        json["ethnicity"] = await sqlFunc.getRows(sql)

        sql = 'SELECT Gender as \'label\', COUNT(*) as \'count\' ' +
          'FROM participant as Par ' +
          'WHERE ' +
          partFeatures +
          'GROUP BY Gender;'
        json["gender"] = await sqlFunc.getRows(sql)

        sql = 'SELECT FacialSurgery as \'label\', COUNT(*) as \'count\' ' +
          'FROM participant as Par ' +
          'WHERE ' +
          partFeatures +
          'GROUP BY FacialSurgery;'
        json["facialsurgery"] = await sqlFunc.getRows(sql)

        sql = 'SELECT age ' +
          'FROM participant as Par ' +
          'WHERE ' +
          partFeatures
        json["age"] = await sqlFunc.getRows(sql)

        return json
      }, // end getPartChartValues

      calculateMedian: function calculateMedian(numArr) {
        // calculates median
        var sorted = numArr.sort((a, b) => {return a-b})
        var middle = Math.floor(sorted.length / 2)

        if(sorted.length % 2 === 0) {
          return (sorted[middle-1] + sorted[middle]) / 2
        } // end if

        return sorted[middle]
      } // end calculateMedian
} // end export