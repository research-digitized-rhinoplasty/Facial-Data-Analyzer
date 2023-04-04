/* Node server for connecting to MySQL database and (further) parsing JSON data to MySQL commands */

const express = require('express')
var cors = require('cors')
const { stat } = require('fs')
const app = express()
const port = 8000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // 25471856

var sqlFunc1 = require('./sqlFunctions')
var sqlFuncMisc = require('./miscSQLFunctions')

async function stats(zaJson) { // 18361930
  let genderSql = ""
  let ethnicitySql = ""
  let surgerySql = ""
  let result = ""

  // parse json for participant features
  genderSql = sqlFuncMisc.sqlCombiner('Gender', zaJson.gender)
  ethnicitySql = sqlFuncMisc.sqlCombiner('Ethnicity', zaJson.ethnicity)
  surgerySql = sqlFuncMisc.sqlCombiner('FacialSurgery', zaJson.surgery)
  // convert result strings into sql statement
  let partFeatures = "(Par.Age BETWEEN " + zaJson.ageStart + " AND " + zaJson.ageEnd + ") " + genderSql + ethnicitySql + surgerySql
  // sql to retrieve participant rows
  let sql = "SELECT ParticipantID, Gender, Ethnicity, FacialSurgery, Age FROM participant as Par WHERE " + partFeatures

  let participants = await sqlFunc1.getRows(sql)
  let resultStats = {}
  let statistics = {}
  let statsArrayRawData = []
  let statsRawData = {}

  var statsList = zaJson.stats
  var landmarkMeasurementList = zaJson.landmark_measurement_list

  var sqlMeasurement = ""
  var sqlLandmark = ""

  for(var j=0; j<landmarkMeasurementList.length; j++) {
    // iterate through selected landmarks/measurements
    if(zaJson.landmark_measurement_choice=="Measurement") {
      // create general sql statement for measurement
      sqlMeasurement = "FROM participant_measurement as ParM " +
      "JOIN participant as Par ON ParM.ParticipantID=Par.participantID " +
      "WHERE " +
      "(ParM.MeasurementAbbrv='" + landmarkMeasurementList[j] + "') " +
      "AND " +
      partFeatures
    } else if(zaJson.landmark_measurement_choice=="Landmark") {
      // create general sql statement for landmark
      sqlLandmark = "FROM participant_landmark as ParL " +
      "JOIN participant as Par ON ParL.ParticipantID=Par.participantID " +
      "WHERE " +
      "(ParL.LandmarkAbbrv='" + landmarkMeasurementList[j] + "') " +
      "AND " +
      partFeatures
    } // end if else

    for(var i=0; i<statsList.length; i++) { // iterate through user selected statistic choices
      var theOtherStat = ""
      var xyz = ""
      switch(statsList[i]) {
        case "Average":
          theOtherStat = "AVG"
          break
        case "Standard_Deviation":
          theOtherStat = "STDDEV"
          break
        case "Minimum":
          theOtherStat = "MIN"
          break
        case "Maximum":
          theOtherStat = "MAX"
          break
        case "Median":
          // special case for median
          // median is calculated in js files
          if(zaJson.landmark_measurement_choice=="Measurement") {
            sql = "SELECT Value as \'result\' " + sqlMeasurement
            
            result = await sqlFunc1.getRows(sql)
            var medianVals = []
            for(var k=0; k<result.length; k++) {
              medianVals.push(result[k].result)
            } // end for
            var median = sqlFuncMisc.calculateMedian(medianVals)

            resultStats[statsList[i]] = median
          } else {
            xyz = "x"
            let sql1 = "SELECT "
            let sql2 = "Val as \'result\' " + sqlLandmark
            sql = sql1 + xyz + sql2
            var medianVals = []
            var median = 0

            result = await sqlFunc1.getRows(sql)
            for(var k=0; k<result.length; k++) {
              medianVals.push(result[k].result)
            } // end for
            median = sqlFuncMisc.calculateMedian(medianVals)
            resultStats[statsList[i] + " X"] = median
            medianVals = []

            xyz = "y"
            sql = sql1 + xyz + sql2
            result = await sqlFunc1.getRows(sql)
            for(var k=0; k<result.length; k++) {
              medianVals.push(result[k].result)
            } // end for
            median = sqlFuncMisc.calculateMedian(medianVals)
            resultStats[statsList[i] + " Y"] = median
            medianVals = []
            
            xyz = "z"
            sql = sql1 + xyz + sql2
            result = await sqlFunc1.getRows(sql)
            for(var k=0; k<result.length; k++) {
              medianVals.push(result[k].result)
            } // end for
            median = sqlFuncMisc.calculateMedian(medianVals)
            resultStats[statsList[i] + " Z"] = median
            medianVals = []
          } // end if else
          continue
        default:
          break
      } // end switch case

      // create sql statement to calculate stats
      if(zaJson.landmark_measurement_choice=="Measurement") {
        sql = "SELECT ROUND(" + theOtherStat + "(ParM.Value),2) as \"result\" " + sqlMeasurement

        result = await sqlFunc1.getStats(sql, 0)
        resultStats[statsList[i]] = JSON.parse(JSON.stringify(result))
      } else {
        xyz = "x"
        let sql1 = "SELECT ROUND(" + theOtherStat + "(ParL."
        let sql2 = "Val),2) as \"result\" " + sqlLandmark
        sql = sql1 + xyz + sql2
        result = await sqlFunc1.getStats(sql, 0)
        resultStats[statsList[i] + " X"] = JSON.parse(JSON.stringify(result))

        xyz = "y"
        sql = sql1 + xyz + sql2
        result = await sqlFunc1.getStats(sql, 0)
        resultStats[statsList[i] + " Y"] = JSON.parse(JSON.stringify(result))

        xyz = "z"
        sql = sql1 + xyz + sql2
        result = await sqlFunc1.getStats(sql, 0)
        resultStats[statsList[i] + " Z"] = JSON.parse(JSON.stringify(result))
      } // end if else
    } // end i for
    statistics[zaJson.landmark_measurement_names[j]] = JSON.parse(JSON.stringify(resultStats))

    // get all values of measurement/landmark for html statistics chart output
    if(zaJson.landmark_measurement_choice=="Measurement") {
      sql = "SELECT ParM.Value as \'result\' " + sqlMeasurement
      result = await sqlFunc1.getRows(sql)
      for(var k=0; k<result.length; k++) {
        statsArrayRawData.push(result[k].result)          
      } // end for
      statsRawData[zaJson.landmark_measurement_names[j]] = JSON.parse(JSON.stringify(statsArrayRawData))
    } else {
      xyz = "x"
      let sql3 = "SELECT ParL."
      let sql4 = "Val as \'result\' " + sqlLandmark

      sql = sql3 + xyz + sql4
      result = await sqlFunc1.getRows(sql)
      for(var k=0; k<result.length; k++) {
        statsArrayRawData.push(result[k].result)          
      } // end for
      statsRawData[zaJson.landmark_measurement_names[j] + " " + xyz] = JSON.parse(JSON.stringify(statsArrayRawData))
      statsArrayRawData = []

      xyz = "y"
      sql = sql3 + xyz + sql4
      result = await sqlFunc1.getRows(sql)
      for(var k=0; k<result.length; k++) {
        statsArrayRawData.push(result[k].result)          
      } // end for
      statsRawData[zaJson.landmark_measurement_names[j] + " " + xyz] = JSON.parse(JSON.stringify(statsArrayRawData))
      statsArrayRawData = []

      xyz = "z"
      sql = sql3 + xyz + sql4
      result = await sqlFunc1.getRows(sql)
      for(var k=0; k<result.length; k++) {
        statsArrayRawData.push(result[k].result)          
      } // end for
      statsRawData[zaJson.landmark_measurement_names[j] + " " + xyz] = JSON.parse(JSON.stringify(statsArrayRawData))
      statsArrayRawData = []
    } // end if else
  } // end j for

  // get participant statistics values for html participant chart output
  let partChartValues = await sqlFuncMisc.getPartChartValues(sql, partFeatures)

  // consolidate results into json
  let combinedResults = {
    participants,
    statistics,
    partChartValues,
    statsRawData
  } // combinedResults

  app.post
  return combinedResults
} // end stats

app.post('/', async (req, res) => { // listen for POST requests
	res.setHeader('content-type', 'application/json') // 51000009, 51661744
  let result = ""
  if(req.body.JSON_Type=='Stats_And_Participants') {
    console.log(req.body)
    result = await stats(req.body) // 48404592
  } else if(req.body.JSON_Type=='Landmark_And_Measurement_Tables') {
    result = await sqlFuncMisc.getLandmarkMeasurementList(req.body)
  } // end if else
  
	// console.log(req.body) // 71966685
  if(req.body.JSON_Type=='Stats_And_Participants') {
    // console.log(result)
    res.send(result)
  } else if(req.body.JSON_Type=='Landmark_And_Measurement_Tables') {
    // console.log(result)
    res.send(result)
  } else {
    res.send(req.body) // 44692048
  }	 // end if else
}) // end post

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
}) // end listen