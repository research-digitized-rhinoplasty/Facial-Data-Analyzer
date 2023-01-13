const express = require('express')
var cors = require('cors')
var mysql = require('mysql')

const app = express()
const port = 8080

const con = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "password",
  database: "rhinodb"
})

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // 25471856

function sendToDB(zaJson) {
  // if (err) throw err
  console.log("Connected!")

  var insertStr = zaJson.Gender + zaJson.Age
  if(insertStr.length===0){
    insertStr = "null, null"
  }
  var sql = "INSERT INTO participant (Gender, Age) VALUES (" + insertStr + ")"
  con.query(sql, function(err, result) {
    if(err) throw err
  }) // end query

  sql = "SELECT ParticipantID FROM Participant ORDER BY ParticipantID DESC LIMIT 1;"
  con.query(sql, function(err, result){
    if (err) throw err
    ParticipantID = result[0].ParticipantID
    
    for(var i=0; i<zaJson.Landmarks.length; i++) {
      sql = "INSERT INTO participant_landmark (ParticipantID, LandmarkAbbrv, xVal, yVal, zVal) VALUES ('" + ParticipantID + "', '" + zaJson.Landmarks[i].LandmarkID + "', '" + zaJson.Landmarks[i].xVal + "', '" + zaJson.Landmarks[i].yVal + "', '" + zaJson.Landmarks[i].zVal + "')"

      con.query(sql, function(err) {
        if(err) throw err
      }) // end child query
    } // end for

    for(var i=0; i<zaJson.Measurements.length; i++) {
      sql = "INSERT INTO participant_measurement (ParticipantID, MeasurementAbbrv, Value) VALUES ('" + ParticipantID + "', '" + zaJson.Measurements[i].MeasurementID + "', '" + zaJson.Measurements[i].Value + "')"

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

app.post('/', (req, res) => {
	res.setHeader('content-type', 'application/json') // 51000009, 51661744
  console.log(req.body)
  sendToDB(req.body)
	// console.log(req.body.name) // 71966685
	res.send(req.body) // 44692048
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})