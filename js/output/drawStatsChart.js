function createStatsChart(chartValues) {
    var elementExists = document.getElementById('statsChartOutput')

    let chartStyle = document.querySelectorAll('input[name="statsChartStyleGroup"]:checked')[0].value

    if(elementExists==null) {
        sessionStorage.setItem('statsChartData', JSON.stringify(chartValues))
        var plotList = generateStatsChartData(chartValues, chartStyle)

        var outputDiv = document.getElementById('statsChartBox')
        var chartDiv = document.createElement('div')
        chartDiv.id = 'statsChartOutput'
        outputDiv.appendChild(chartDiv)

        var layout = {
            title: 'Statistics',
            yaxis: {
                automargin: true
            }
        }
        Plotly.newPlot('statsChartOutput', plotList, layout)
    } else {
        sessionStorage.setItem('statsChartData', JSON.stringify(chartValues))
        refreshStatsChart(chartStyle)
    } // end if else
} // end createStatsChart

function generateStatsChartData(chartValues, chartStyle) {
    var plotList = []
    for(key in chartValues) {
    var trace = {
        x: chartValues[key],
        type: chartStyle,
        name: key,
        nbinsx: 10,
        yaxis: {
            automargin: true
        }
    } // end trace json
    plotList.push(JSON.parse(JSON.stringify(trace)))
    } // end for
    return plotList
} // end generateStatsChartData
  
function refreshStatsChart(chartStyle) {
    let dataCopy = JSON.parse(sessionStorage.getItem('statsChartData'))
    var plotList = generateStatsChartData(dataCopy, chartStyle)
    var layout = {
        title: 'Statistics',
        yaxis: {
            automargin: true
        }
    }
    Plotly.newPlot('statsChartOutput', plotList, layout)
} // end refreshStatsChart