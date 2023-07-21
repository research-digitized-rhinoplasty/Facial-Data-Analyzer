/**
 * Dropdown Checkboxes
 * 
 * For special 'dropdown checkbox' implementation, it requires some javascript/html magic
 * Inspiration: https://stackoverflow.com/a/19207528
 */

window.addEventListener("load", () => {
    function selectAll(parent, dropCheck) {
        let allButton = document.getElementById(parent + 'All')
        allButton.addEventListener("click", () => {
            let inputs = document.querySelectorAll('#' + dropCheck + ' input[type=checkbox]:not(#' + parent + 'All)')
            inputs.forEach((e) => {
                if(allButton.checked) {
                    e.checked = true
                } else {
                    e.checked = false
                }// end if
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
    var alreadyExpanded = "";

    let elements = document.getElementsByClassName('multiSelect')
    // let checkboxInputs = document.querySelectorAll('[id$=ParentLabel]')
    for(var i=0; i<elements.length; i++) {
        elements[i].addEventListener("click", showCheckboxes)
    } // end for

    function showCheckboxes() {
        var dropCheck = this.id + "CheckboxDropdown"
        var checkboxes = document.getElementById(dropCheck)
        var otherCheckboxes = document.querySelectorAll('[id$=CheckboxDropdown]:not(#'+ dropCheck +')')

        deselectAllButton(this.id, dropCheck)
        selectAll(this.id, dropCheck)

        if (!expanded) {
            checkboxes.style.display = "flex"
            checkboxes.style.flexDirection = "column"
            
            expanded = true
            alreadyExpanded = dropCheck
        } else if(expanded && dropCheck!=alreadyExpanded) {
            otherCheckboxes.forEach((e) => {
                e.style.display = "none"
            })
            checkboxes.style.display = "flex"
            checkboxes.style.flexDirection = "column"
            alreadyExpanded = dropCheck
        } else if(expanded) {
            checkboxes.style.display = "none"
            expanded = false
        }
        updateField(this.id)
    }

    function updateField(parent) {
        let dropCheck = parent + "CheckboxDropdown"
        var checkboxesCt = document.getElementById(dropCheck).querySelectorAll('input[type=checkbox]:not(#' + parent + 'All)')
        var checkboxes = document.getElementById(dropCheck).querySelectorAll('input[type=checkbox]:checked:not(#' + parent + 'All)')
        var values = []
        for(var i=0; i<checkboxes.length; i++) {
            values.push(checkboxes[i].labels[0].innerText)
        } // end for

        let label = parent + "OptionLabel"
        if(checkboxes.length==0) {
            document.getElementById(label).innerHTML = document.getElementById(parent + 'ParentLabel').innerHTML
        } else if(checkboxes.length==checkboxesCt.length) {
            if(parent=='surgery') {
                document.getElementById(label).innerHTML = "Any"
            }  else {
                document.getElementById(label).innerHTML = "All"
            }// end if
        } else {
            document.getElementById(label).innerHTML = values.join(', ')
        } // end if else
    } // end updateField
}) // end load event listener