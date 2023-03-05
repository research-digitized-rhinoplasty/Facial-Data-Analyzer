window.addEventListener("load", () => {
    function selectAll(parent, dropCheck) {
        let allButton = document.getElementById(parent + 'All')
        allButton.addEventListener("click", () => {
            let inputs = document.querySelectorAll('#' + dropCheck + ' input[type=checkbox]:not(#' + parent + 'All)')
            inputs.forEach((e) => {
                if(!e.checked) {
                    e.checked = true
                } // end if
            }) // end forEach
        }) // end eventListener
    } // end selectAll

    function deselectAllButton(parent, dropCheck) {
        let inputs = document.querySelectorAll('#' + dropCheck + ' input[type=checkbox]:not(#All)')
        inputs.forEach((e) => {
            e.addEventListener("click", () => {
                if(!e.checked) {
                    document.getElementById(parent + 'All').checked = false
                } // end if
            }) // end eventListener
        }) // end forEach
    } // end deselectAllButton

    var expanded = false;

    let elements = document.getElementsByClassName('multiSelect')
    for(var i=0; i<elements.length; i++) {
        elements[i].addEventListener("click", showCheckboxes)
    } // end for

    function showCheckboxes() {
        var dropCheck = this.id + "Checkbox"
        deselectAllButton(this.id, dropCheck)
        selectAll(this.id, dropCheck)
        var checkboxes = document.getElementById(dropCheck);
        if (!expanded) {
            checkboxes.style.display = "block";
            expanded = true;
        } else {
            checkboxes.style.display = "none";
            expanded = false;
        }
        updateField(this.id)
    }

    function updateField(parent) {
        let dropCheck = parent + "Checkbox"
        var checkboxesCt = document.getElementById(dropCheck).querySelectorAll('input[type=checkbox]:not(#' + parent + 'All)')
        var checkboxes = document.getElementById(dropCheck).querySelectorAll('input[type=checkbox]:checked:not(#' + parent + 'All)')
        var values = []
        for(var i=0; i<checkboxes.length; i++) {
            values.push(checkboxes[i].labels[0].innerText)
        }

        let label = parent + "OptionLabel"
        if(checkboxes.length==0) {
            document.getElementById(label).innerHTML = document.getElementById(parent + 'Label').innerHTML
        } else if(checkboxes.length==checkboxesCt.length) {
            if(parent=='surgery') {
                document.getElementById(label).innerHTML = "Any"
            }  else {
                document.getElementById(label).innerHTML = "All"
            }// end if
        } else {
            document.getElementById(label).innerHTML = values.join(', ')
        }
    }
})