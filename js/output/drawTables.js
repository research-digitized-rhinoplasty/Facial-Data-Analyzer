function writeStats(json) {
    $('#output').css("display", "block")
    $("#statsOutput").css("border", "1px solid black")

    let RecordsJSONArr = []
    let statJSON = {}
    let statIndex = 0;

    let columnsArr = []
    columnsArr.push({
      field: 'name', text: 'Name', size: '25%'
    })

    for(var key in json) {
      let colSize = 75 / Object.keys(json[key]).length
      for(var statistic in json[key]) {
        var statStr = statistic.replace("_", " ")
        columnsArr.push({
          field: statStr, text: statStr, size: colSize + '%'
        })
      } // end statistic in json[key]
      break
    } // end for key in json

    for(var key in json) { // 32168394
      if(json.hasOwnProperty(key)) {
        statJSON["name"] = key
        let keyJson = json[key]
        
        for(var statistic in keyJson) {
          statJSON["recid"] = statIndex
          statJSON[statistic.replace("_", " ")] = keyJson[statistic]
        } // end for value
        let copy = JSON.parse(JSON.stringify(statJSON))
        RecordsJSONArr.push(copy)
        statIndex += 1
      } // end if
    } // end for key
  
    writeW2ui(RecordsJSONArr, columnsArr, 'statsGrid')
} // end writeStats

function writeW2ui(jsonArr, statsColArr, grid) {
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
      columns: statsColArr,
      records: jsonArr
  });
  }
}