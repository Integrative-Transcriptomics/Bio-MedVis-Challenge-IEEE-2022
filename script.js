import { DATA } from './data.js';

var CHART;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var PROGRESSIVE_RENDERING_VALUE = 0;
var CHART_OPTION = {
  title: [
    {
      show: true,
      top: '20px',
      left: '100px',
      text: 'PTM Set Intersection Size',
      textStyle: {
        fontSize: 12
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
    },
    {
      id: "presenceAbsenceMap",
      // width: HEIGHT * 0.65 + "px",
      height: HEIGHT * 0.65 + "px",
      bottom: "80px",
      right: "100px",
      left: HEIGHT * 0.15 + HEIGHT * 0.65 + 180 + "px",
      show: true,
      backgroundColor: "#FAFAFA"
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
      nameGap: 40,
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 14
      },
      minInterval: 1
    },
    {
      id: "presenceAbsenceMapX",
      type: 'category',
      data: [],
      gridIndex: 3,
      name: 'PTM',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 14
      }
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
    },
    {
      id: "presenceAbsenceMapY",
      type: 'category',
      data: [],
      inverse: true,
      gridIndex: 3,
      show: false
    }
  ],
  axisPointer: {
    show: true,
    triggerOn: 'click',
    z: 5,
    triggerTooltip: false,
    link: [
      {
        xAxisIndex: [ 0, 1 ]
      },
      {
        yAxisIndex: [ 0, 2 ]
      }
    ]
  },
  tooltip: {
    show: false
  },
  toolbox: {
    left: 'left',
    feature: {
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
    },
    {
      type: 'inside',
      show: false,
      yAxisIndex: 3
    }
  ],
  visualMap: [
    {
      min: 0,
      max: 1,
      range: [ 1, 1 ],
      dimension: 2,
      seriesIndex: 0,
      hoverLink: true,
      inverse: false,
      orient: 'horizontal',
      itemHeight: HEIGHT * 0.65 - 180,
      itemWidth: 15,
      top: '15px',
      left: '280px',
      textStyle: {
        color: '#607196',
        fontSize: 11
      },
      precision: 0,
      calculable: true,
      inRange: {
        color: [ '#5A0FFD', '#FF2A00' ]
      },
      outOfRange: {
        color: [ '#DFD9E2' ]
      },
      formatter: (value) => {
        if ( value == 0 ) {
          return "In contact (Cα↔ < 5Å)\nModified, but no joint PTMs";
        } else {
          return Math.round(value);
        }
      }
    }
  ],
  series: [
    {
      name: 'PTMContactMap',
      type: 'heatmap',
      data: [],
      itemStyle: {
        borderColor: '#CCCCCC',
        borderWidth: 0.1
      },
      progressive: PROGRESSIVE_RENDERING_VALUE,
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
      progressive: PROGRESSIVE_RENDERING_VALUE,
      emphasis: {
        disabled: true
      }
    },
    {
      name: 'PresenceAbsenceMap',
      type: 'heatmap',
      data: [ ],
      itemStyle: {
        borderColor: '#CCCCCC',
        borderWidth: 0.1,
        color: '#6b6b6b'
      },
      xAxisIndex: 3,
      yAxisIndex: 3,
      progressive: PROGRESSIVE_RENDERING_VALUE,
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
    if (event.batch[0].dataZoomId == '\x00_ec_\x00toolbox-dataZoom_xAxis0' && event.batch[1].dataZoomId == '\x00_ec_\x00toolbox-dataZoom_yAxis0') {
      if (event.batch[0].startValue && event.batch[0].endValue && event.batch[1].startValue && event.batch[1].endValue) {
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 0,
          startValue: event.batch[0].startValue,
          endValue: event.batch[0].endValue
        });
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 1,
          startValue: event.batch[1].startValue,
          endValue: event.batch[1].endValue
        });
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 2,
          startValue: event.batch[1].startValue,
          endValue: event.batch[1].endValue
        });
      } else {
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 0,
          start: event.batch[0].start,
          end: event.batch[0].end
        });
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 1,
          start: event.batch[1].start,
          end: event.batch[1].end
        });
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 2,
          start: event.batch[1].start,
          end: event.batch[1].end
        });
      }
    }
  });
};

function updateChart(proteinAcc) {
  CHART_OPTION.series = [ CHART_OPTION.series[ 0 ], CHART_OPTION.series[ 1 ], CHART_OPTION.series[ 2 ] ];
  CHART_OPTION.xAxis[0].data = [];
  CHART_OPTION.yAxis[0].data = [];
  CHART_OPTION.series[0].data = [];
  CHART_OPTION.series[1].data = [];
  CHART_OPTION.series[2].data = [];
  CHART_OPTION.xAxis[1].data = [];
  CHART_OPTION.yAxis[1].data = [];
  CHART_OPTION.xAxis[2].data = [];
  CHART_OPTION.yAxis[2].data = [];
  CHART_OPTION.xAxis[3].data = [];
  CHART_OPTION.yAxis[3].data = [];
  CHART_OPTION.visualMap[ 0 ].max = 1;
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
    //progressive: PROGRESSIVE_RENDERING_VALUE,
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
    //progressive: PROGRESSIVE_RENDERING_VALUE,
    emphasis: {
      disabled: true
    }
  };
  for (let residue in DATA[proteinAcc].residues) {
    DATA[proteinAcc].residues[residue].ptm.forEach(ptm => {
      PTMCounts[ptm] = [ ];
    });
    PTMBarsTop.data.push( DATA[proteinAcc].residues[residue].ptm.length );
    PTMBarsRight.data.push( DATA[proteinAcc].residues[residue].ptm.length );
  }
  for (let residue in DATA[proteinAcc].residues) {
    CHART_OPTION.xAxis[0].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.xAxis[1].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.yAxis[0].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.yAxis[2].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.yAxis[3].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
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
  let PTMNames = Object.keys( PTMCounts );
  CHART_OPTION.xAxis[3].data = PTMNames;
  for (let residueIndex = 0; residueIndex < Object.keys( DATA[proteinAcc].residues ).length; residueIndex++ ) {
    for( let PTMIndex = 0; PTMIndex < PTMNames.length; PTMIndex++ ) {
      let PTMCount = PTMCounts[ PTMNames[ PTMIndex ] ][ residueIndex ];
      if ( PTMCount > 0 ) {
        CHART_OPTION.series[2].data.push([
          PTMIndex,
          residueIndex,
          PTMCount
        ])
      }
    }
  }
  CHART_OPTION.series.push( PTMBarsTop );
  CHART_OPTION.series.push( PTMBarsRight );
  CHART.setOption(CHART_OPTION, { replaceMerge: [ 'series' ] } );
}

var computePTMSimilarity = (riPTM, rjPTM) => {
  return computePTMIntersection( riPTM, rjPTM );  
};

function computePTMIntersection(riPTM, rjPTM) {
  let intersection = riPTM.filter(v => rjPTM.includes(v));
  let intersectionSize = intersection.length;
  if (intersectionSize > CHART_OPTION.visualMap[ 0 ].max) {
    CHART_OPTION.visualMap[ 0 ].max = intersectionSize;
    CHART_OPTION.visualMap[ 0 ].range = [ 1, CHART_OPTION.visualMap[ 0 ].max ];
  }
  return intersectionSize;
}

function toggleStackedBar( zoomFactorX, zoomFactorY ) {
  CHART_OPTION.series = CHART_OPTION.series.splice( 0, 3 );
  if ( zoomFactorX !== -1 && zoomFactorX <= 0 ) {
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
  if ( zoomFactorY !== -1 && zoomFactorY <= 0 ) {
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