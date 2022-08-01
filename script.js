import { DATA } from './data.js';

var CHART;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
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
      width: HEIGHT * 0.65 + "px",
      height: HEIGHT * 0.65 + "px",
      bottom: "80px",
      left: "100px",
      show: true,
      backgroundColor: "#FAFAFA"
    },
    {
      id: "ptmBarsTop",
      width: HEIGHT * 0.65 + "px",
      height: HEIGHT * 0.15 + "px",
      bottom: HEIGHT * 0.65 + 100 + "px",
      left: '100px'
    },
    {
      id: "ptmBarsRight",
      width: HEIGHT * 0.15 + "px",
      height: HEIGHT * 0.65 + "px",
      bottom: "80px",
      left: HEIGHT * 0.65 + 120 + "px"
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
      id: "ptmBarsTopX",
      type: 'category',
      data: [],
      show: false,
      gridIndex: 1
    },
    {
      id: "ptmBarsRightX",
      type: 'value',
      gridIndex: 2,
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
      id: "ptmBarsTopY",
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
    },
    {
      id: "ptmBarsRightY",
      type: 'category',
      data: [],
      show: false,
      gridIndex: 2,
      inverse: true
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
      },
      {
        yAxisIndex: [ 0, 2 ]
      }
    ]
  },
  /*tooltip: {
    show: true,
    position: [ 900, 50 ],
    extraCssText: 'height: 800px; width: 950px'
  },*/
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
      show: false,
      xAxisIndex: 1
    },
    {
      type: 'inside',
      show: false,
      yAxisIndex: 2
    }
  ],
  visualMap: {
    min: 0,
    max: 1,
    range: [ 1, 1 ],
    dimension: 2,
    seriesIndex: [ 0 ],
    hoverLink: true,
    inverse: false,
    orient: 'horizontal',
    itemHeight: 800,
    bottom: '60px',
    right: '80px',
    textStyle: {
      color: '#607196',
      fontSize: 12
    },
    precision: 0,
    calculable: true,
    inRange: {
      color: ['#61ACDA', '#C662DA', '#DA6262']
    },
    outOfRange: {
      color: [ '#DFD9E2' ]
    },
    formatter: (value) => {
      if ( value == 0 ) {
        return "In contact (Cα↔ < 5Å); Modified, but no joint PTMs";
      } else {
        return Math.round(value);
      }
    }
  },
  series: [
    {
      name: 'PTMContactMap',
      type: 'heatmap',
      data: [],
      itemStyle: {
        borderColor: '#CCCCCC',
        borderWidth: 0.1
      },
      emphasis: {
        disabled: true
      }
    },
    {
      name: 'ContactMap',
      type: 'heatmap',
      data: [],
      itemStyle: {
        borderColor: '#CCCCCC',
        borderWidth: 0.1,
        color: '#B5ACBA'
      },
      emphasis: {
        disabled: true
      }
    }
  ]
};
var PTMCounts = {};
var PTMBarsTop = { };
var PTMBarsRight = { };
var PTMSimilarityState = 'intersection';

window.onload = _ => {
  CHART = echarts.init(document.getElementById("chartContainer"), { "renderer": "svg" });
  document.getElementById("accSelect").onchange = (event) => {
    if (event.isTrusted && event.type == 'change') {
      updateChart(document.getElementById("accSelect").value);
    }
  };
  CHART.on('datazoom', (event) => {
    if ( event.dataZoomIndex !== undefined ) {
      return;
    }
    let zoomFactorX = -1;
    let zoomFactorY = -1;
    if (event.batch[0].dataZoomId == '\x00_ec_\x00toolbox-dataZoom_xAxis0' && event.batch[1].dataZoomId == '\x00_ec_\x00toolbox-dataZoom_yAxis0') {
      if (event.batch[0].startValue && event.batch[0].endValue && event.batch[1].startValue && event.batch[1].endValue) {
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 0,
          startValue: event.batch[0].startValue,
          endValue: event.batch[0].endValue
        });
        zoomFactorX = event.batch[0].endValue - event.batch[0].startValue;
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 1,
          startValue: event.batch[1].startValue,
          endValue: event.batch[1].endValue
        });
        zoomFactorY = event.batch[1].endValue - event.batch[1].startValue;
      } else {
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 0,
          start: event.batch[0].start,
          end: event.batch[0].end
        });
        zoomFactorX = ((event.batch[0].end - event.batch[0].start) / 100) * CHART_OPTION.xAxis[0].data.length;
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 1,
          start: event.batch[1].start,
          end: event.batch[1].end
        });
        zoomFactorY = ((event.batch[1].end - event.batch[1].start) / 100) * CHART_OPTION.yAxis[2].data.length;
      }
    }
    toggleStackedBar( zoomFactorX, zoomFactorY );
  });
};

function updateChart(proteinAcc) {
  CHART_OPTION.series = [ CHART_OPTION.series[ 0 ], CHART_OPTION.series[ 1 ] ];
  CHART_OPTION.xAxis[0].data = [];
  CHART_OPTION.yAxis[0].data = [];
  CHART_OPTION.series[0].data = [];
  CHART_OPTION.xAxis[1].data = [];
  CHART_OPTION.yAxis[1].data = [];
  CHART_OPTION.xAxis[2].data = [];
  CHART_OPTION.yAxis[2].data = [];
  CHART_OPTION.visualMap.max = 1;
  PTMCounts = { };
  PTMBarsTop = {
    name: 'PTMBarsTop',
    type: 'bar',
    xAxisIndex: 1,
    yAxisIndex: 1,
    data: [ ],
    itemStyle: {
      color: '#6b6b6b'
    },
    large: true,
    emphasis: {
      disabled: true
    }
  };
  PTMBarsRight = {
    name: 'PTMBarsRight',
    type: 'bar',
    xAxisIndex: 2,
    yAxisIndex: 2,
    data: [ ],
    itemStyle: {
      color: '#6b6b6b'
    },
    large: true,
    emphasis: {
      disabled: true
    }
  };
  for (let residue in DATA[proteinAcc].residues) {
    DATA[proteinAcc].residues[residue].ptm.forEach(ptm => {
      PTMCounts[ptm] = []
    });
    PTMBarsTop.data.push( DATA[proteinAcc].residues[residue].ptm.length );
    PTMBarsRight.data.push( DATA[proteinAcc].residues[residue].ptm.length );
  }
  for (let residue in DATA[proteinAcc].residues) {
    CHART_OPTION.xAxis[0].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.yAxis[0].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.xAxis[1].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.yAxis[2].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    let ptmCounts = {};
    DATA[proteinAcc].residues[residue].ptm.forEach(ptm => {
      if (ptmCounts[ptm]) {
        ptmCounts[ptm]++;
      } else {
        ptmCounts[ptm] = 1;
      }
    });
    for (let ptm of Object.keys(PTMCounts)) {
      if (ptm in ptmCounts) {
        PTMCounts[ptm].push(ptmCounts[ptm]);
      } else {
        PTMCounts[ptm].push(0);
      }
    }
    for (let contactResidue of DATA[proteinAcc].residues[residue].contacts) {
      let residueNumber = parseInt(residue.split("@")[1]);
      let contactResidueNumber = parseInt(contactResidue.split("@")[1]);
      let residuePTM = DATA[proteinAcc].residues[residue].ptm;
      let contactResiduePTM = DATA[proteinAcc].residues[contactResidue].ptm;
      if (residuePTM.length > 0 && contactResiduePTM.length > 0 && residueNumber > contactResidueNumber) {
        let PTMSimilarity = computePTMSimilarity(residuePTM, contactResiduePTM);
        CHART_OPTION.series[0].data.push([
          residueNumber - 1,
          contactResidueNumber - 1,
          PTMSimilarity
        ])
      } else if ( residueNumber < contactResidueNumber ) {
        CHART_OPTION.series[1].data.push([
          residueNumber - 1,
          contactResidueNumber - 1,
          0
        ])
      }
    }
  }
  toggleStackedBar( -1, -1 );
}

function toggleStackedBar( zoomFactorX, zoomFactorY ) {
  CHART_OPTION.series = CHART_OPTION.series.splice( 0, 2 );
  if ( zoomFactorX !== -1 && zoomFactorX <= 30 ) {
    for (let ptm of Object.keys(PTMCounts)) {
      CHART_OPTION.series.push({
        name: "PTMStackedBarTop_" + ptm,
        type: 'bar',
        stack: 'total',
        data: PTMCounts[ptm],
        xAxisIndex: 1,
        yAxisIndex: 1,
        large: false
      });
    }
    CHART.setOption(CHART_OPTION, { replaceMerge: [ 'series' ] });
  } else {
    CHART_OPTION.series.push( PTMBarsTop );
    CHART.setOption(CHART_OPTION, { replaceMerge: [ 'series' ] } );
  }
  if ( zoomFactorY !== -1 && zoomFactorY <= 30 ) {
    for (let ptm of Object.keys(PTMCounts)) {
      CHART_OPTION.series.push({
        name: "PTMStackedBarRight_" + ptm,
        type: 'bar',
        stack: 'total',
        data: PTMCounts[ptm],
        xAxisIndex: 2,
        yAxisIndex: 2,
        large: false
      });
    }
    CHART.setOption(CHART_OPTION, { replaceMerge: [ 'series' ] });
  } else {
    CHART_OPTION.series.push( PTMBarsRight );
    CHART.setOption(CHART_OPTION, { replaceMerge: [ 'series' ] } );
  }
}

var computePTMSimilarity = (riPTM, rjPTM) => {
  return computePTMIntersection( riPTM, rjPTM );  
};

function computePTMUnion(riPTM, rjPTM) {
  let union = [...new Set([...riPTM, ...rjPTM])];
  let unionSize = union.length;
  if (unionSize > CHART_OPTION.visualMap.max) {
    CHART_OPTION.visualMap.max = unionSize;
    CHART_OPTION.visualMap.range = [ 1, CHART_OPTION.visualMap.max ];
  }
  return unionSize;
}

function computePTMIntersection(riPTM, rjPTM) {
  let intersection = riPTM.filter(v => rjPTM.includes(v));
  let intersectionSize = intersection.length;
  if (intersectionSize > CHART_OPTION.visualMap.max) {
    CHART_OPTION.visualMap.max = intersectionSize;
    CHART_OPTION.visualMap.range = [ 1, CHART_OPTION.visualMap.max ];
  }
  return intersectionSize;
}