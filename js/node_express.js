/* Node server for connecting to MySQL database and (further) parsing JSON data to MySQL commands */

const express = require('express')
var cors = require('cors')
var mysql = require('mysql')
const { stat } = require('fs')
const app = express()
const port = 8080

// server connection details
const con = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "password",
  database: "rhinodb"
}) // end con

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // 25471856

async function getLandmarkMeasurementList(theJSON) {
  let measResult = await getStats(theJSON.sqlM, 2)
  let landResult = await getStats(theJSON.sqlL, 2)
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
  }
} // end getMeasurements

function getStats(sql, flag) {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) reject(err)
      if(flag==0) {
        resolve(result[0].result)
      } else if(flag==1) {
        resolve(result[0][0].result)
      } else if(flag==2) {
        resolve(result)
      } // end flag if else
    }) // end query
  }) // end promise
} // end getStats

function getRows(sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if(err) reject(err)
      var data = JSON.parse(JSON.stringify(result))
      resolve(data)
    }) // end query
  }) // end promise
} // end getRows

function sqlCombiner(parent, json) {
  let sql = ""
  if(json.length>1) {
    sql = "AND (Par." + parent + "='" + json[0] + "'"
    for(var i=0; i<json.length; i++) {
      if(i==0) continue
      let orSql = " OR Par." + parent + "='" + json[i] + "'"
      sql = sql.concat(orSql)
    }
    sql = sql.concat(") ")
    return sql
  } else {
    sql = "AND (Par." + parent + "='" + json[0] + "') "
    return sql
  } // end if else
} // end sqlCombiner

async function stats(zaJson) { // 18361930
  let genderSql = ""
  let ethnicitySql = ""
  let surgerySql = ""
  let result = ""

  genderSql = sqlCombiner('Gender', zaJson.gender)
  ethnicitySql = sqlCombiner('Ethnicity', zaJson.ethnicity)
  surgerySql = sqlCombiner('FacialSurgery', zaJson.surgery)

  let sql = "SELECT Gender, Ethnicity, FacialSurgery, Age FROM participant as Par " +
    "WHERE " +
    "(Par.Age BETWEEN " + zaJson.ageStart + " AND " + zaJson.ageEnd + ") " +
    genderSql +
    ethnicitySql +
    surgerySql

  let participants = await getRows(sql)
  let resultStats = {}
  let statistics = {}

  var statsList = zaJson.stats
  var landmarkMeasurementList = zaJson.landmark_measurement_list
  for(var j=0; j<landmarkMeasurementList.length; j++) {
    for(var i=0; i<statsList.length; i++) {
      var theOtherStat = ""
      var statIndex = -1
      var xyz = ""
      switch(statsList[i]) {
        case "Average":
          theOtherStat = "AVG"
          statIndex = 0
          break
        case "Standard_Deviation":
          theOtherStat = "STDDEV"
          statIndex = 1
          break
        case "Minimum":
          theOtherStat = "MIN"
          statIndex = 2
          break
        case "Maximum":
          theOtherStat = "MAX"
          statIndex = 3
          break
        case "Median":
          if(zaJson.landmark_measurement_choice=="meas") {
            sql = "CALL median_meas('" + list[j] + "', '" + zaJson.gender + "', '" + zaJson.ethnicity + "', '" + zaJson.surgery + "', " + zaJson.ageStart + ", " + zaJson.ageEnd + ");"
            result = await getStats(sql, 1)
            resultStats[statsList[i] + " " + xyz] = result
          } else {
            xyz = "x"
            let sql1 = "CALL median_land('" + list[j] + "', '"
            let sql2 = "', '" + zaJson.gender + "', '" + zaJson.ethnicity + "', '" + zaJson.surgery + "', " + zaJson.ageStart + ", " + zaJson.ageEnd + ");"
            sql = sql1 + xyz + sql2
            result = await getStats(sql, 1)
            resultStats[statsList[i] + " X"] = result

            xyz = "y"
            sql = sql1 + xyz + sql2
            result = await getStats(sql, 1)
            resultStats[statsList[i] + " Y"] = result
            
            xyz = "z"
            sql = sql1 + xyz + sql2
            result = await getStats(sql, 1)
            resultStats[statsList[i] + " Z"] = result
          } // end if else
          
          continue
        // case "Z_Score":
        //   if(zaJson.landmark_measurement_choice=="meas") {
        //     sql = "CALL zscore_meas('" + list[j] + "', '42');"
        //     result = await getStats(sql, 1)
        //     resultStats[statsList[i]] = result
        //   } else {
        //     xyz = "x"
        //     let sql1 = "CALL zscore_land('" + list[j] + "', '42', '"
        //     let sql2 = "');"
        //     sql = sql1 + xyz + sql2
        //     result = await getStats(sql, 1)
        //     resultStats[statsList[i] + " X"] = result

        //     xyz = "y"
        //     sql = sql1 + xyz + sql2
        //     result = await getStats(sql, 1)
        //     resultStats[statsList[i] + " Y"] = result

        //     xyz = "z"
        //     sql = sql1 + xyz + sql2
        //     result = await getStats(sql, 1)
        //     resultStats[statsList[i] + " Z"] = result
        //   } // end if else          
        //   continue
        default:
          break
      } // end switch case

      if(zaJson.landmark_measurement_choice=="Measurement") {
        sql = "SELECT ROUND(" + theOtherStat + "(ParM.Value),2) as \"result\" " + 
        "FROM participant_measurement as ParM " +
        "JOIN participant as Par ON ParM.ParticipantID=Par.participantID " +
        "WHERE " +
        "(ParM.MeasurementAbbrv='" + landmarkMeasurementList[j] + "') " +
        "AND (Par.Age BETWEEN " + zaJson.ageStart + " AND " + zaJson.ageEnd + ")" +
        genderSql +
        ethnicitySql +
        surgerySql +
        ";"

        result = await getStats(sql, 0)
        resultStats[statsList[i]] = result
      } else {
        xyz = "x"
        let sql1 = "SELECT ROUND(" + theOtherStat + "(ParL."
        let sql2 = "Val),2) as \"result\" " + 
          "FROM participant_landmark as ParL " +
          "JOIN participant as Par ON ParL.ParticipantID=Par.participantID " +
          "WHERE " +
          "(ParL.LandmarkAbbrv='" + landmarkMeasurementList[j] + "') " +
          "AND (Par.Age BETWEEN " + zaJson.ageStart + " AND " + zaJson.ageEnd + ")" +
          genderSql +
          ethnicitySql +
          surgerySql +
          ";"
        sql = sql1 + xyz + sql2
        result = await getStats(sql, 0)
        resultStats[statsList[i] + " X"] = result

        xyz = "y"
        sql = sql1 + xyz + sql2
        result = await getStats(sql, 0)
        resultStats[statsList[i] + " Y"] = result

        xyz = "z"
        sql = sql1 + xyz + sql2
        result = await getStats(sql, 0)
        resultStats[statsList[i] + " Z"] = result
      } // end if else
    } // end i for
    statistics[zaJson.landmark_measurement_names[j]] = JSON.parse(JSON.stringify(resultStats))
  } // end j for

  let combinedResults = {
    participants,
    statistics
  } // combinedResults

  app.post
  return combinedResults
} // end stats

function sendToDB(zaJson) { // send JSON values to DB
  // if (err) throw err
  // console.log("Connected!")

  // if any participant elements are not null (gender, ethnicity, facial surgery, age), then prepare them for insert statement
  if(zaJson.Gender!=="null") {
    zaJson.Gender = "'" + zaJson.Gender + "'"
  } // end if gender
  if(zaJson.Ethnicity!=="null") {
    zaJson.Ethnicity = "'" + zaJson.Ethnicity + "'"
  } // end if gender
  if(zaJson.FacialSurgery!=="null") {
    zaJson.FacialSurgery = "'" + zaJson.FacialSurgery + "'"
  } // end if gender
  if(zaJson.Age!=="null") {
    zaJson.Age = "'" + zaJson.Age + "'"
  } // end if gender

  // insert participant elements into database
  var sql = "INSERT INTO participant (Gender, Ethnicity, FacialSurgery, Age) VALUES (" + zaJson.Gender + ", " + zaJson.Ethnicity + ", " + zaJson.FacialSurgery + ", " + zaJson.Age + ");"
  con.query(sql, (err) => {
    if(err) throw err
  }) // end query

  // get participantID (auto-incremented) from participant table
  sql = "SELECT ParticipantID FROM participant ORDER BY ParticipantID DESC LIMIT 1;"
  con.query(sql, function(err, result){ // contained inside a query to maintain ParticipantID variable value AKA callback hell
    // prepare for inserting participant landmarks
    if (err) throw err
    // participant landmarks each have a corresponding participantID
    ParticipantID = result[0].ParticipantID
    // insert all landmarks from the JSON
    for(var i=0; i<zaJson.Landmarks.length; i++) {
      sql = "INSERT INTO participant_landmark (ParticipantID, LandmarkAbbrv, xVal, yVal, zVal) VALUES ('" + ParticipantID + "', '" + zaJson.Landmarks[i].LandmarkID + "', '" + zaJson.Landmarks[i].xVal + "', '" + zaJson.Landmarks[i].yVal + "', '" + zaJson.Landmarks[i].zVal + "');"

      con.query(sql, function(err) {
        if(err) throw err
      }) // end child query
    } // end for

    // repeat and insert all measurements
    for(var i=0; i<zaJson.Measurements.length; i++) {
      sql = "INSERT INTO participant_measurement (ParticipantID, MeasurementAbbrv, Value) VALUES ('" + ParticipantID + "', '" + zaJson.Measurements[i].MeasurementID + "', '" + zaJson.Measurements[i].Value + "');"

      con.query(sql, function(err) {
        if(err) throw err
      }) // end child query
    } // end for
  }) // end parent query

  console.log("Successfully inserted into the database")
} // end sendToDB

app.post('/', async (req, res) => { // listen for POST requests
	res.setHeader('content-type', 'application/json') // 51000009, 51661744
  let result = ""
  if(req.body.Type==0) {
    console.log(req.body)
    sendToDB(req.body)
  } else if(req.body.JSON_Type=='Stats_And_Participants') {
    console.log(req.body)
    result = await stats(req.body) // 48404592
  } else if(req.body.JSON_Type=='Landmark_And_Measurement_Tables') {
    result = await getLandmarkMeasurementList(req.body)
  }
  
	// console.log(req.body) // 71966685
  if(req.body.JSON_Type=='Stats_And_Participants') {
    // console.log(result)
    res.send(result)
  } else if(req.body.JSON_Type=='Landmark_And_Measurement_Tables') {
    // console.log(result)
    res.send(result)
  } else {
    res.send(req.body) // 44692048
  }	
}) // end post

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
}) // end listen