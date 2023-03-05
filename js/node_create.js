///////// create landmarks from file
function sendToDB(zaJson) {
  for(var i=0; i<zaJson.LandmarkID.length; i++){
      // Insert landmark values
      var sql = "INSERT INTO landmark (LandmarkAbbrv, ID_Name, Name) VALUES ('" + zaJson.LandmarkID[i] + "', '" + zaJson.LandmarkID_Name[i] + "', '" + zaJson.Name[i] +"')"
      con.query(sql, function(err, result, fields) {
        if(err) throw err
      }) // end query
      console.log("Successfully inserted into the database")
  } // end for
}

////// create measurements from file
function sendToDB(zaJson) {
  for(var i=0; i<zaJson.MeasurementID.length; i++) {
      // Insert measurement values
      var landmarkNum = ""
      switch(zaJson.Landmarks[i].length) {
        case 2:
          landmarkNum = "LandmarkID_1, LandmarkID_2"
          break
        case 3:
          landmarkNum = "LandmarkID_1, LandmarkID_2, LandmarkID_3"
          break
        case 4:
          landmarkNum = "LandmarkID_1, LandmarkID_2, LandmarkID_3, LandmarkID_4"
          break
        default:
          break
      } // end switch
      var landmarkInsList = "";
      for(var j=0; j<zaJson.Landmarks[i].length; j++) {
        var temp = zaJson.Landmarks[i][j];
        landmarkInsList += "'" + temp + "'";
        if(j==zaJson.Landmarks[i].length-1) {
          continue;
        } // end if
        landmarkInsList += ", ";
      } // end for
      var sql = "INSERT INTO measurement (MeasurementAbbrv, Name, Type, Metric, " + landmarkNum + ") VALUES ('" + zaJson.MeasurementID[i] + "', '" + zaJson.Name[i] + "', '"
        + zaJson.Type[i] + "', 'mm', " + landmarkInsList + ")"
      con.query(sql, function(err, result, fields) {
        if(err) throw err
      }) // end query
    } // end for
  console.log("Successfully inserted into the database")
} // end sendToDB