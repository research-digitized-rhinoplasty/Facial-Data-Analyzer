window.addEventListener("load", () => {
    var allCheck = document.querySelectorAll('input[type=checkbox]')
    for(var i=0; i<allCheck.length; i++) {
        allCheck[i].checked = false
    }

    var sql = {
        JSON_Type:  'Landmark_And_Measurement_Tables',
        sqlM:       'SELECT Name, MeasurementAbbrv FROM measurement;',
        sqlL:       'SELECT Name, LandmarkAbbrv FROM landmark;',
    } // end sql
    postCheckbox(sql)

    function postCheckbox(zaJson) {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080',
            data: zaJson,
            datatype: 'application/json',
            success: function(data) { // https://www.tutorialsteacher.com/jquery/jquery-ajax-method
                showBox(data.Measurements, data.MeasurementAbbreviation, "Measurement")
                showBox(data.Landmarks, data.LandmarkAbbreviation, "Landmark")
            } // end success
        }); // end testPost
    } // end postCheckbox

    function showBox(name, abbrv, divID) {
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
})