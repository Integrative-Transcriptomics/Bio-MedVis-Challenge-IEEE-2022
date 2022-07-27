import { DATA } from './data.js';

var CHART;
var CHART_OPTION = {
  title: [
    {
      show: true,
      bottom: '20px',
      left: '980px',
      text: 'Set Intersection Size of PTMs',
      textStyle: {
        fontSize: 14
      },
      textAlign: 'left'
    }
  ],
  grid: [
    {
      id: "ptmMap",
      width: "750px",
      height: "750px",
      bottom: "80px",
      left: "100px",
      show: true,
      backgroundColor: "#EFEFEF"
    },
    {
      id: "ptmStackedBar",
      width: "750px",
      height: "100px",
      bottom: "870px",
      left: '100px'
    }
  ],
  xAxis: [
    {
      id: "ptmMapX",
      type: 'category',
      data: [],
      gridIndex: 0,
      name: 'Residue Index (Residue Type)',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 14
      }
    },
    {
      id: "ptmStackedBarX",
      type: 'category',
      data: [],
      show: false,
      gridIndex: 1
    }
  ],
  yAxis: [
    {
      id: "ptmMapY",
      type: 'category',
      data: [],
      inverse: true,
      gridIndex: 0,
      name: 'Residue Index (Residue Type)',
      nameLocation: 'middle',
      nameGap: 60,
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 14
      }
    },
    {
      id: "ptmStackedBarY",
      type: 'value',
      gridIndex: 1,
      name: 'No. PTMs',
      nameLocation: 'middle',
      nameGap: 60,
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 14
      },
      minInterval: 1
    }
  ],
  axisPointer: {
    show: true,
    triggerOn: 'click',
    z: 5,
    triggerTooltip: true,
    link: [
      {
        xAxisIndex: [ 0, 1 ]
      }
    ]
  },
  tooltip: {
    show: true,
    position: [ 900, 50 ],
    extraCssText: 'height: 800px; width: 950px'
  },
  toolbox: {
    feature: {
      myTool1: {
        show: true,
        title: 'Display Mode: Intersection',
        icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
        onclick: function( ) {
          if ( PTMSimilarityState == 'intersection' ) {
            PTMSimilarityState = 'union';
            computePTMSimilarity = (riPTM, rjPTM) => {
              return computePTMUnion( riPTM, rjPTM );  
            };
            CHART_OPTION.toolbox.feature.myTool1.title = 'Mode: Union';
            CHART_OPTION.title[ 0 ].text = 'Set Union Size of PTMs';
            updateChart(document.getElementById("accSelect").value);
          } else if ( PTMSimilarityState == 'union' ) {
            PTMSimilarityState = 'intersection';
            computePTMSimilarity = (riPTM, rjPTM) => {
              return computePTMIntersection( riPTM, rjPTM );  
            };
            CHART_OPTION.toolbox.feature.myTool1.title = 'Mode: Intersection';
            CHART_OPTION.title[ 0 ].text = 'Set Intersection Size of PTMs';
            updateChart(document.getElementById("accSelect").value);
          }

        }
      },
      dataZoom: {
        xAxisIndex: 0,
        yAxisIndex: 0
      }
    }
  },
  dataZoom: [
    {
      type: 'inside',
      show: true,
      xAxisIndex: 1
    }
  ],
  visualMap: {
    min: 0,
    max: 1,
    dimension: 2,
    seriesIndex: 0,
    hoverLink: true,
    inverse: false,
    orient: 'horizontal',
    itemHeight: 800,
    bottom: '60px',
    right: '80px',
    text: ['2', '1'],
    textStyle: {
      color: '#607196',
      fontSize: 12
    },
    calculable: true,
    inRange: {
      color: ['#E8DAB2', '#BF545B', '#BF5483', '#9454BF', '#5474BF']
    },
    formatter: (value) => {
      return Math.round(value);
    }
  },
  series: [
    {
      name: 'PTMContactMap',
      type: 'heatmap',
      data: [],
      itemStyle: {
        borderColor: '#CCCCCC',
        borderWidth: 0.3
      }
    }
  ]
};
var PTMStackedBars = {};
var PTMLine = { };
var PTMSimilarityState = 'intersection';

window.onload = _ => {
  CHART = echarts.init(document.getElementById("chartContainer"), { "renderer": "canvas" });
  document.getElementById("accSelect").onchange = (event) => {
    if (event.isTrusted && event.type == 'change') {
      updateChart(document.getElementById("accSelect").value);
    }
  };
  CHART.on('datazoom', (event) => {
    if (event.dataZoomIndex == 0) {
      return;
    }
    let zoomFactor = -1;
    if (event.batch[0].dataZoomId == '\x00_ec_\x00toolbox-dataZoom_xAxis0' && event.batch[1].dataZoomId == '\x00_ec_\x00toolbox-dataZoom_yAxis0') {
      if (event.batch[0].startValue && event.batch[0].endValue && event.batch[1].startValue && event.batch[1].endValue) {
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 0,
          startValue: event.batch[0].startValue,
          endValue: event.batch[0].endValue
        });
        zoomFactor = event.batch[0].endValue - event.batch[0].startValue;
      } else {
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 0,
          start: event.batch[0].start,
          end: event.batch[0].end
        });
        zoomFactor = ((event.batch[0].end - event.batch[0].start) / 100) * CHART_OPTION.xAxis[0].data.length;
      }
    }
    if ( zoomFactor <= 30 ) {
      addStackedBar( );
    } else {
      cleanStackedBar();
    }
  });
};

function updateChart(proteinAcc) {
  CHART_OPTION.series = [ CHART_OPTION.series[ 0 ] ];
  CHART_OPTION.xAxis[0].data = [];
  CHART_OPTION.yAxis[0].data = [];
  CHART_OPTION.series[0].data = [];
  CHART_OPTION.xAxis[1].data = [];
  CHART_OPTION.yAxis[1].data = [];
  CHART_OPTION.visualMap.max = 0;
  PTMStackedBars = {};
  PTMLine = {
    name: 'PTMLine',
    type: 'line',
    xAxisIndex: 1,
    yAxisIndex: 1,
    data: [ ],
    showSymbol: false,
    smooth: 1,
    smoothMonotone: 'x',
    lineStyle: {
      color: '#666666',
      width: 1
    },
    areaStyle: {
      color: '#999999',
      opacity: 0.5
    }
  };
  for (let residue in DATA[proteinAcc].residues) {
    DATA[proteinAcc].residues[residue].ptm.forEach(ptm => {
      PTMStackedBars[ptm] = []
    });
    PTMLine.data.push( DATA[proteinAcc].residues[residue].ptm.length );
  }
  for (let residue in DATA[proteinAcc].residues) {
    CHART_OPTION.xAxis[0].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.yAxis[0].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.xAxis[1].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    let ptmCounts = {};
    DATA[proteinAcc].residues[residue].ptm.forEach(ptm => {
      if (ptmCounts[ptm]) {
        ptmCounts[ptm]++;
      } else {
        ptmCounts[ptm] = 1;
      }
    });
    for (let ptm of Object.keys(PTMStackedBars)) {
      if (ptm in ptmCounts) {
        PTMStackedBars[ptm].push(ptmCounts[ptm]);
      } else {
        PTMStackedBars[ptm].push(0)
      }
    }
    for (let contactResidue of DATA[proteinAcc].residues[residue].contacts) {
      let residueNumber = parseInt(residue.split("@")[1]);
      let contactResidueNumber = parseInt(contactResidue.split("@")[1]);
      let residuePTM = DATA[proteinAcc].residues[residue].ptm;
      let contactResiduePTM = DATA[proteinAcc].residues[contactResidue].ptm;
      if (residuePTM.length > 0 && contactResiduePTM.length > 0) {
        let PTMSimilarity = computePTMSimilarity(residuePTM, contactResiduePTM);
        CHART_OPTION.series[0].data.push([
          residueNumber,
          contactResidueNumber,
          PTMSimilarity
        ])
      }
    }
  }
  cleanStackedBar();
}

function cleanStackedBar() {
  CHART_OPTION.series = CHART_OPTION.series.filter(s => !s.name.startsWith("PTMStackedBar"));
  CHART_OPTION.series.push( PTMLine );
  CHART.setOption(CHART_OPTION, { replaceMerge: [ 'series' ] } );
}

function addStackedBar() {
  CHART_OPTION.series.splice( 1, 1 );
  for (let ptm of Object.keys(PTMStackedBars)) {
    CHART_OPTION.series.push({
      name: "PTMStackedBar_" + ptm,
      type: 'bar',
      stack: 'total',
      data: PTMStackedBars[ptm],
      xAxisIndex: 1,
      yAxisIndex: 1,
      large: true
    });
  }
  CHART.setOption(CHART_OPTION, { replaceMerge: [ 'series' ] });
}

var computePTMSimilarity = (riPTM, rjPTM) => {
  return computePTMIntersection( riPTM, rjPTM );  
};

function computePTMUnion(riPTM, rjPTM) {
  let union = [...new Set([...riPTM, ...rjPTM])];
  let unionSize = union.length;
  if (unionSize > CHART_OPTION.visualMap.max) {
    CHART_OPTION.visualMap.max = unionSize;
    CHART_OPTION.visualMap.text = [CHART_OPTION.visualMap.max, CHART_OPTION.visualMap.min];
  }
  return unionSize;
}

function computePTMIntersection(riPTM, rjPTM) {
  let intersection = riPTM.filter(v => rjPTM.includes(v));
  let intersectionSize = intersection.length;
  if (intersectionSize > CHART_OPTION.visualMap.max) {
    CHART_OPTION.visualMap.max = intersectionSize;
    CHART_OPTION.visualMap.text = [CHART_OPTION.visualMap.max, CHART_OPTION.visualMap.min];
  }
  return intersectionSize;
}