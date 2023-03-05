window.addEventListener("load", () => {
  document.getElementById('submitButton').addEventListener("click", function(){
    let landMeasChoice = ""
    if(document.getElementById('measChoice').checked) {
      landMeasChoice = "Measurement"
    } else {
      landMeasChoice = "Landmark"
    } // end if else
    
    let empty = []
    if(checkIfEmpty('genderCheckbox')) empty.push('Gender')
    if(checkIfEmpty('ethnicityCheckbox')) empty.push('Ethnicity')
    if(checkIfEmpty('surgeryCheckbox')) empty.push('Facial Surgery')
    if(checkIfEmpty(landMeasChoice)) empty.push(landMeasChoice)
    if(checkIfEmpty('statsCheckbox')) empty.push('Statistics')
    if(empty.length>0) {
      let output = document.getElementById('output')
      output.innerHTML = "Input required:<br>"
      output.append(empty.join(', '))
      output.style.color = "red"
      return
    }

    let stats = []
    let statCheckbox = document.querySelectorAll('#statsCheckbox input[type=checkbox]:checked')
    for(var i=0; i<statCheckbox.length; i++) {
      stats.push(statCheckbox[i].id)
    } // end for

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

    // document.getElementById('output').textContent = stats

    zaJson = {
      JSON_Type:                    'Stats_And_Participants',
      gender:                       retrDropVals('gender'),
      ethnicity:                    retrDropVals('ethnicity'),
      surgery:                      retrDropVals('surgery'),
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
        url: 'http://localhost:8080',
        data: zaJson,
        datatype: 'application/json',
        success: function(data) { // https://www.tutorialsteacher.com/jquery/jquery-ajax-method
          console.log(data)
          $("#output").css("color", "black")
          $("#output").text("");
          for(var key in data.statistics) { // 32168394
            if(data.statistics.hasOwnProperty(key)) {
              var values = data.statistics[key]
              $("#output").append(key + "<br>");
              for(var value in values) {
                $("#output").append(value + " : "+ values[value] + "<br>");
              } // end for value
            } // end if
            $("#output").append("<br>");
          } // end for key
        } // end success
      }); // end testPost
  } // end testPost

  function retrDropVals(parent) {
    let dropCheck = parent + "Checkbox"
    var checkboxes = document.getElementById(dropCheck).querySelectorAll('input[type=checkbox]:checked:not(#' + parent + 'All)')
    var vals = []
    for(var i=0; i<checkboxes.length; i++) {
        if(parent=='gender') {
          vals.push(checkboxes[i].id)
        } else {
          vals.push(checkboxes[i].labels[0].innerText)
        }
    } // end for
    return vals
  } // end retrDropVals

  function checkIfEmpty(parentId) {
    let flag
    let inputs = document.querySelectorAll('#' + parentId + ' input[type=checkbox]')
    for(var i=0; i<inputs.length; i++) {
      if(!inputs[i].checked) {
        flag = true
      } else {
        return false
      } // end if else
    } // end for
    return flag
  } // end checkIfEmpty
}) // end onload