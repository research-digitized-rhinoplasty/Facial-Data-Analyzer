function createParticipantChart(chartValues) {
    var elementExists = document.getElementById('participantChartOutput')
  
    let chartFeature = document.querySelectorAll('input[name="partChartFeatureGroup"]:checked')[0].value
    let chartStyle = document.querySelectorAll('input[name="partChartStyleGroup"]:checked')[0].value
  
    if(elementExists==null) {
      sessionStorage.setItem('participantChartData', JSON.stringify(chartValues))
      var data = generateParticipantChartData(chartValues.ethnicity, chartStyle)
  
      var outputDiv = document.getElementById('participantChartChoices')
      var chartDiv = document.createElement('div')
      chartDiv.id = 'participantChartOutput'
      chartDiv.style.display = "none"
      chartDiv.style.margin = "auto"
      chartDiv.style.width = "50%"
      outputDiv.appendChild(chartDiv)
  
      let arrayWrapper = [data[0]]
  
      Plotly.newPlot('participantChartOutput', arrayWrapper, data[1]);
    } else {
      sessionStorage.setItem('participantChartData', JSON.stringify(chartValues))
      refreshParticipantChart(chartFeature, chartStyle)
    } // end if else
} // end createParticipantChart

function refreshParticipantChart(chartFeature, chartType) {
    let dataCopy = JSON.parse(sessionStorage.getItem('participantChartData'))
    switch(chartFeature) {
      case "ethnicity":
        dataCopy = dataCopy.ethnicity
        break
      case "gender":
        dataCopy = dataCopy.gender
        break
      case "facialSurgery":
        dataCopy = dataCopy.facialsurgery
        break
      case "age":
        dataCopy = dataCopy.age
        break
      default:
        break
    } // end switch case
  
    let data = generateParticipantChartData(dataCopy, chartType)
    let arrayWrapper = [data[0]]
  
    Plotly.newPlot('participantChartOutput', arrayWrapper, data[1])
  } // end refreshChart
  
function generateParticipantChartData(chartValues, chartType) {
  var valueArray = []
  var labelArray = []
  var jsonWrapper = {}

  switch(chartType) {
    case 'pie':
    case 'bar':
      for(var i=0; i<chartValues.length; i++) {
        valueArray.push(chartValues[i].count)
        labelArray.push(chartValues[i].label)
      } // end for
      break
    case 'histogram':
      for(var i=0; i<chartValues.length; i++) {
        valueArray.push(chartValues[i].age)
      } // end for
      break
    default:
      break
  } // end switch case
  
  switch(chartType) {
    case 'pie':
      jsonWrapper["values"] = valueArray
      jsonWrapper["labels"] = labelArray
      break
    case 'bar':
      jsonWrapper["y"] = valueArray
      jsonWrapper["x"] = labelArray
      break
    case 'histogram':
      jsonWrapper["x"] = valueArray
      break
    default:
      break
  } // end chartType switch

  jsonWrapper["type"] = chartType

  var layout = {
    height: 600,
    width: 750,
    yaxis: {
      automargin: true
    }
  };

  return [jsonWrapper, layout]
} // end generateParticipantChartData