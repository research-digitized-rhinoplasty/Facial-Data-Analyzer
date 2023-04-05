/*
Chart Listeners

Listen for user clicks for chart choices (statistics, participant features)
*/

window.addEventListener("load", () => {
    // listen for choice between table (statistics) and chart (participant feature) choice
    let table = document.getElementById('tableRadio')
    let chart = document.getElementById('chartRadio')
    // hide participant side when statistics table is selected
    table.addEventListener("click", () => {
        $('#participantChartOutput').css('display', 'none')
        $('#participantChartChoices').css('display', 'none')
        $('#tableOutput').css('display', 'block')
        w2ui.participantGrid.refresh()
        w2ui.statsGrid.refresh()
    }) // end table event listener
    // hide statistics table side when participant chart is selected
    chart.addEventListener("click", () => {
        $('#tableOutput').css('display', 'none')
        $('#participantChartChoices').css('display', 'block')
        $('#participantChartOutput').css('display', 'block')
    }) // end chart table listener

    let participantChartChoices = document.getElementById('participantChartChoices')
    participantChartChoices.addEventListener("click", () => {
        // listen for participant chart feature option choices
        let chartFeature = document.querySelectorAll('input[name="partChartFeatureGroup"]:checked')[0].value
        let chartStyle = document.querySelectorAll('input[name="partChartStyleGroup"]:checked')[0].value

        if(chartFeature=='age') { // age is only displayed as histogram
            $('#participantChartStyleChoices').css('display', 'none')
            chartStyle = 'histogram'
        } else {
            $('#participantChartStyleChoices').css('display', 'block')
        } // end age if else
        // refresh charts based on participant feature(s) clicked
        refreshParticipantChart(chartFeature, chartStyle, 'participant')
    }) // end participantChartChoices event listener
    
    let statsChartChoices = document.getElementById('statsChartChoices')
    statsChartChoices.addEventListener("click", () => {
        // listen for statistics chart option choices
        let chartStyle = document.querySelectorAll('input[name=statsChartStyleGroup]:checked')[0].value
        // refresh based on statistic choice clicked
        refreshStatsChart(chartStyle)
    }) // end statsChartChoices event listener
}) // end load event listener