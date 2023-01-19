/* Node server for connecting to MySQL database and (further) parsing JSON data to MySQL commands */

const express = require('express')
var cors = require('cors')
var mysql = require('mysql')
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

function sendToDB(zaJson) { // send JSON values to DB
  // if (err) throw err
  console.log("Connected!")

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
  con.query(sql, function(err, result) {
    if(err) throw err
  }) // end query

  // get participantID (auto-incremented) from participant table
  sql = "SELECT ParticipantID FROM participant ORDER BY ParticipantID DESC LIMIT 1;"
  con.query(sql, function(err, result){ // contained inside a query to maintain ParticipantID variable value
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

/////////// create landmarks from file
// function sendToDB(zaJson) {
//   for(var i=0; i<zaJson.LandmarkID.length; i++){
//       // Insert landmark values
//       var sql = "INSERT INTO landmark (LandmarkAbbrv, ID_Name, Name) VALUES ('" + zaJson.LandmarkID[i] + "', '" + zaJson.LandmarkID_Name[i] + "', '" + zaJson.Name[i] +"')"
//       con.query(sql, function(err, result, fields) {
//         if(err) throw err
//       }) // end query
//       console.log("Successfully inserted into the database")
//   } // end for
// }

//////// create measurements from file
// function sendToDB(zaJson) {
//   for(var i=0; i<zaJson.MeasurementID.length; i++) {
//       // Insert measurement values
//       var landmarkNum = ""
//       switch(zaJson.Landmarks[i].length) {
//         case 2:
//           landmarkNum = "LandmarkID_1, LandmarkID_2"
//           break
//         case 3:
//           landmarkNum = "LandmarkID_1, LandmarkID_2, LandmarkID_3"
//           break
//         case 4:
//           landmarkNum = "LandmarkID_1, LandmarkID_2, LandmarkID_3, LandmarkID_4"
//           break
//         default:
//           break
//       } // end switch
//       var landmarkInsList = "";
//       for(var j=0; j<zaJson.Landmarks[i].length; j++) {
//         var temp = zaJson.Landmarks[i][j];
//         landmarkInsList += "'" + temp + "'";
//         if(j==zaJson.Landmarks[i].length-1) {
//           continue;
//         } // end if
//         landmarkInsList += ", ";
//       } // end for
//       var sql = "INSERT INTO measurement (MeasurementAbbrv, Name, Type, Metric, " + landmarkNum + ") VALUES ('" + zaJson.MeasurementID[i] + "', '" + zaJson.Name[i] + "', '"
//         + zaJson.Type[i] + "', 'mm', " + landmarkInsList + ")"
//       con.query(sql, function(err, result, fields) {
//         if(err) throw err
//       }) // end query
//     } // end for
//   console.log("Successfully inserted into the database")
// } // end sendToDB

app.post('/', (req, res) => { // listen for POST requests
	res.setHeader('content-type', 'application/json') // 51000009, 51661744
  console.log(req.body)
  sendToDB(req.body)
	// console.log(req.body.name) // 71966685
	res.send(req.body) // 44692048
}) // end post

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
}) // end listen