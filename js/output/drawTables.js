function writeStats(json) {
    $('#output').css("display", "block")
    $('#output').css("display", "block")
    $("#statsOutput").css("border", "1px solid black")

    let RecordsJSONArr = []
    let statJSON = {}
    let statIndex = 0;

    for(var key in json) { // 32168394
      if(json.hasOwnProperty(key)) {
        var values = json[key]
        statJSON["name"] = key
        for(var value in values) {
          statJSON["recid"] = statIndex
          statJSON["statistic"] = value
          statJSON["value"] = values[value]
          let copy = JSON.parse(JSON.stringify(statJSON))
          RecordsJSONArr.push(copy)
          statIndex += 1
        } // end for value
      } // end if
    } // end for key
  
    writeW2ui(RecordsJSONArr, 'statsGrid')

} // end writeStats

function writeW2ui(jsonArr, grid) {
  $().w2destroy(grid)
  if(grid=='participantGrid') {
    $('#participantOutput').w2grid({
      name   : grid,
      recid  : 'ParticipantID',
      columns: [
          { field: 'ParticipantID', text: 'Participant ID', size: '7%'},
          { field: 'Age', text: 'Age', size: '7%' },
          { field: 'Gender', text: 'Gender', size: '6%' },
          { field: 'Ethnicity', text: 'Ethnicity', size: '40%' },
          { field: 'FacialSurgery', text: 'Facial Surgery', size: '40%' },
      ],
      records: jsonArr
  });
  } else {
    $('#statsOutput').w2grid({
      name   : grid,
      recid  : 'recid',
      columns: [
          { field: 'name', text: 'Name', size: '40%'},
          { field: 'statistic', text: 'Statistic', size: '40%'},
          { field: 'value', text: 'Value', size: '20%'}
      ],
      records: jsonArr
  });
  }
}