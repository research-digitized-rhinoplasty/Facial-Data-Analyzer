/**
 * Display Landmarks and/or Measurements
 * 
 * Retrieves values from database and prints them on web page
 */

window.addEventListener("load", () => {
    // uncheck everything from previous session (autocomplete=off)
    var allCheck = document.querySelectorAll('input[type=checkbox]')
    for(var i=0; i<allCheck.length; i++) {
        allCheck[i].checked = false
    } // end for

    var sql = { // get Landmark and Measurement names
        JSON_Type:  'Landmark_And_Measurement_Tables',
        sqlM:       'SELECT Name, MeasurementAbbrv FROM measurement;',
        sqlL:       'SELECT Name, LandmarkAbbrv FROM landmark;',
    } // end sql
    postCheckbox(sql)

    function postCheckbox(zaJson) {
        // post request to db, result data sent to be displayed on web page
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8000',
            data: zaJson,
            datatype: 'application/json',
            success: function(data) { // https://www.tutorialsteacher.com/jquery/jquery-ajax-method
                showBox(data.Measurements, data.MeasurementAbbreviation, "Measurement")
                showBox(data.Landmarks, data.LandmarkAbbreviation, "Landmark")
            } // end success
        }); // end testPost
    } // end postCheckbox

    function showBox(name, abbrv, divID) { // insert db values into html div/box
        var myDiv = document.getElementById(divID)    

        for(var i=0; i<name.length; i++) {
            var checkbox = document.createElement('input')
            checkbox.type = "checkbox"
            checkbox.id = name[i]
            checkbox.value = abbrv[i]
            var label = document.createElement('label')
            label.htmlFor = name[i]
            label.appendChild(document.createTextNode(name[i]))
            var br = document.createElement('br')

            myDiv.appendChild(checkbox)
            myDiv.appendChild(label)
            myDiv.appendChild(br)
        } // end for
    } // end showBox

    // 'Select All' buttons
    let measurementButton = document.getElementById('selectAllMeasurement')
    let landmarkButton = document.getElementById('selectAllLandmark')

    measurementButton.addEventListener("click", () => {
        (selectAllLandmarkOrMeasurement('Measurement'))
    }) // end measurementButton event listener
    landmarkButton.addEventListener("click", () => {
        (selectAllLandmarkOrMeasurement('Landmark'))
    }) // end landmarkButton event listener

    function selectAllLandmarkOrMeasurement(thisId) {
        // console.log(thisId)
        let flag
        let inputs = document.querySelectorAll('#' + thisId + ' input[type=checkbox]:not(:checked)')
        if(inputs.length>0) {
            flag = false
        } else {
            inputs = document.querySelectorAll('#' + thisId + ' input[type=checkbox]:checked')
            flag = true
        }
        inputs.forEach((e) => {
            if(flag) {
                e.checked = false
            } else {
                e.checked = true
            } // end if else
        }) // end forEach
    } // end selectAllLandmarkOrMeasurement
}) // end load event listener
