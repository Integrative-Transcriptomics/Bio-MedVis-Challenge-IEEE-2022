import { DATA } from './data.js';

var CHART;
var CHART_OPTION = {
  grid: [
    {
      id: "ptmMap",
      width: "800px",
      height: "800px",
      bottom: "5%",
      left: "center",
      show: true,
      backgroundColor: "#EFEFEF"
    }
  ],
  xAxis: [
    {
      id: "proteinResiduesX",
      type: 'category',
      data: []
    }
  ],
  yAxis: [
    {
      if: "proteinResiduesY",
      type: 'category',
      data: [],
      inverse: true
    }
  ],
  visualMap: {
    min: 1,
    max: 2,
    dimension: 2,
    seriesIndex: 0,
    hoverLink: true,
    inverse: false,
    orient: 'vertical',
    itemHeight: 800,
    top: 'center',
    right: 'right',
    text: ['2', '1'],
    textStyle: {
        color: '#607196',
        fontSize: 12
    },
    calculable: false,
    inRange: {
      color: ['#D9D3EE', '#5941A9', '#F3CA40']
    },
    formatter: (value) => {
      return Math.round(value);
    }
  },
  series: [
    {
      name: 'PTMContactMap',
      type: 'heatmap',
      data: [ ]
    }
  ]
};

window.onload = _ => {
  CHART = echarts.init(document.getElementById("chartContainer"), { "renderer": "canvas" });
  document.getElementById("accSelect").onchange = (event) => {
    if (event.isTrusted && event.type == 'change') {
      updateChart(document.getElementById("accSelect").value);
    }
  };
  CHART.setOption(CHART_OPTION);
};

function updateChart(proteinAcc) {
  CHART_OPTION.xAxis.data = [];
  CHART_OPTION.yAxis.data = [];
  CHART_OPTION.series[0].data = [];
  CHART_OPTION.visualMap.max = 0;
  for (let residue in DATA[proteinAcc].residues) {
    CHART_OPTION.xAxis.data.push(residue);
    CHART_OPTION.yAxis.data.push(residue);
    for (let contactResidue of DATA[proteinAcc].residues[residue].contacts) {
      let residueNumber = parseInt(residue.split("@")[1]);
      let contactResidueNumber = parseInt(contactResidue.split("@")[1]);
      let residuePTM = DATA[proteinAcc].residues[residue].ptm;
      let contactResiduePTM = DATA[proteinAcc].residues[contactResidue].ptm;
    
      // console.log( residuePTM, contactResiduePTM );

      if (residuePTM.length > 0 && contactResiduePTM.length > 0) {
        let PTMSimilarity = computePTMIntersection( residuePTM, contactResiduePTM );
        if ( PTMSimilarity != 0 ) {
          CHART_OPTION.series[0].data.push([
            residueNumber,
            contactResidueNumber,
            PTMSimilarity
          ])
        }
      }
    }
  }
  // console.log( CHART_OPTION.series[ 0 ].data );
  CHART.setOption(CHART_OPTION);
}

function computePTMUnion(riPTM, rjPTM) {
  let union = [...new Set([...riPTM, ...rjPTM])];
  let unionSize = union.length;
  if (unionSize > CHART_OPTION.visualMap.max) {
    CHART_OPTION.visualMap.max = unionSize;
    CHART_OPTION.visualMap.text = [ CHART_OPTION.visualMap.max, CHART_OPTION.visualMap.min ];
  }
  return unionSize;
}

function computePTMIntersection(riPTM, rjPTM) {
  let intersection = riPTM.filter( v => rjPTM.includes( v ) );
  let intersectionSize = intersection.length;
  console.log( intersectionSize );
  if (intersectionSize > CHART_OPTION.visualMap.max) {
    CHART_OPTION.visualMap.max = intersectionSize;
    CHART_OPTION.visualMap.text = [ CHART_OPTION.visualMap.max, CHART_OPTION.visualMap.min ];
  }
  return intersectionSize;
}