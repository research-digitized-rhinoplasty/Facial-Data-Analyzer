/**
 * JSON Check, Parse, and Send
 * 
 * Compilates a JSON to send to node file from HTML user choices
 */

window.addEventListener("load", () => {
  document.getElementById('submitButton').addEventListener("click", function(){
    // listen for user click submit button
    let landMeasChoice = ""
    if(document.getElementById('measChoice').checked) {
      landMeasChoice = "Measurement"
    } else {
      landMeasChoice = "Landmark"
    } // end if else
    
    // check if any user input is empty
    let emptyArr = []
    emptyArr = checkIfEmptyDriver(emptyArr, landMeasChoice)
    if(emptyArr.length>0) {
      printEmptyError(emptyArr)
      return
    } // end if

    // gets all user selected stat choices
    let stats = []
    let statCheckbox = document.querySelectorAll('#statsCheckbox input[type=checkbox]:checked')
    for(var i=0; i<statCheckbox.length; i++) {
      stats.push(statCheckbox[i].id)
    } // end for

    // gets all user selected measurement or landmark choices
    let landMeasCheckbox
    if(landMeasChoice=="Measurement") {
      landMeasCheckbox = document.querySelectorAll('#Measurement input[type=checkbox]:checked')
    } else {
      landMeasCheckbox = document.querySelectorAll('#Landmark input[type=checkbox]:checked')
    } // end if

    let landMeas = []
    let LMNames = []
    for(var i=0; i<landMeasCheckbox.length; i++) {
      landMeas.push(landMeasCheckbox[i].value)
      LMNames.push(landMeasCheckbox[i].id)
    } // end for

    // big JSON to send to node
    zaJson = {
      JSON_Type:                    'Stats_And_Participants',
      gender:                       retrieveDropdownValues('gender'),
      ethnicity:                    retrieveDropdownValues('ethnicity'),
      surgery:                      retrieveDropdownValues('surgery'),
      ageStart:                     document.getElementById('ageStart').value,
      ageEnd:                       document.getElementById('ageEnd').value,
      stats:                        stats,
      landmark_measurement_list:    landMeas,
      landmark_measurement_names:   LMNames,
      landmark_measurement_choice:  landMeasChoice
    }

    console.log(zaJson)

    testPost(zaJson)
  });

  function testPost(zaJson) { // send POST request to node server
      $.ajax({
        method: 'POST',
        url: 'http://localhost:8000',
        data: zaJson,
        datatype: 'application/json',
        success: function(data) { // https://www.tutorialsteacher.com/jquery/jquery-ajax-method
          // write output to tables, charts, and console
          console.log(data)
          $('#errorOutput').empty()
          writeStats(data.statistics)
          writeW2ui(data.participants, 'participantGrid')
          createParticipantChart(data.partChartValues)
          createStatsChart(data.statsRawData)
        } // end success
      }); // end testPost
  } // end testPost

  function retrieveDropdownValues(parent) {
    // retrieve dropdown values
    let dropCheck = parent + "Checkbox"
    var checkboxes = document.getElementById(dropCheck).querySelectorAll('input[type=checkbox]:checked:not(#' + parent + 'All)')
    var vals = []
    for(var i=0; i<checkboxes.length; i++) {
        if(parent=='gender') {
          vals.push(checkboxes[i].id)
        } else {
          vals.push(checkboxes[i].labels[0].innerText)
        } // end if else
    } // end for
    return vals
  } // end retrieveDropdownValues
}) // end onload