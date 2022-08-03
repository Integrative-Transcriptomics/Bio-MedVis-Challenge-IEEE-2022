import { DATA } from './data.js';

var CHART;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var PROGRESSIVE_RENDERING_VALUE = 0;
var STRUCTURE_ENCODING = {
  "unstructured": 0,
  "HELX": 1,
  "BEND": 2,
  "TURN": 3,
  "STRN": 4
};
var STRUCTURE_COLOR_ENCODING = {
  0: '#5E503F',
  1: '#DC493A',
  2: '#4C230A',
  3: '#A9927D',
  4: '#4392F1'
};
var CHART_OPTION = {
  title: [
    {
      show: true,
      top: '2px',
      left: '100px',
      text: 'PTM Set Intersection Size:',
      textStyle: {
        fontSize: 12
      },
      textAlign: 'left'
    },
    {
      show: true,
      top: '2px',
      left: HEIGHT * 0.65 + 150 + "px",
      text: 'Secondary Structure Type:',
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
    },
    {
      id: "structureTop",
      width: HEIGHT * 0.65 + "px",
      height: "18px",
      left: "100px",
      bottom: HEIGHT * 0.65 + 80 + "px"
    },
    {
      id: "structureRight",
      width: "18px",
      height: HEIGHT * 0.65 + "px",
      left: HEIGHT * 0.65 + 100 + "px",
      bottom: "80px"
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
      },
      splitNumber: 10
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
      minInterval: 25,
      splitNumber: 4
    },
    {
      id: "presenceAbsenceMapX",
      type: 'category',
      data: [],
      gridIndex: 3,
      name: 'PTM',
      nameLocation: 'middle',
      nameGap: 120,
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 14
      },
      position: "top",
      axisLabel: {
        rotate: -40
      }
    },
    {
      id: "structureTopX",
      type: "category",
      data: [ ],
      gridIndex: 4,
      show: false
    },
    {
      id: "structureRightX",
      type: "category",
      data: [ 0 ],
      gridIndex: 5,
      show: false
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
      },
      splitNumber: 10
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
      minInterval: 25,
      splitNumber: 4
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
    },
    {
      id: "structureTopY",
      type: "category",
      data: [ 0 ],
      gridIndex: 4,
      show: false
    },
    {
      id: "structureRightY",
      type: "category",
      data: [ ],
      gridIndex: 5,
      show: false,
      inverse: true
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
    },
    {
      type: 'inside',
      show: false,
      xAxisIndex: 4
    },
    {
      type: 'inside',
      show: false,
      yAxisIndex: 5
    },
    {
      type: 'slider',
      show: true,
      xAxisIndex: 3,
      left: HEIGHT * 0.15 + HEIGHT * 0.65 + 180 + "px",
      right: "100px",
      bottom: "60px",
      height: "20px",
      fillerColor: 'rgba(28, 48, 65, 0.5)',
      handleIcon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
      handleStyle: {
        color: 'rgba(28, 48, 65, 1.0)'
      },
      moveHandleSize: 2,
      moveHandleStyle: {
        color: 'rgba(28, 48, 65, 1.0)'
      },
      emphasis: {
        moveHandleStyle: {
          color: 'rgba(37, 71, 101, 0.8)'
        }
      }
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
      itemWidth: 12,
      top: '0px',
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
    },
    {
      type: 'piecewise',
      dimension: 2,
      seriesIndex: [ 3, 4 ],
      pieces: [
        { value: STRUCTURE_ENCODING[ "unstructured" ], label: "Unstructured", color: STRUCTURE_COLOR_ENCODING[ STRUCTURE_ENCODING[ "unstructured" ] ] },
        { value: STRUCTURE_ENCODING[ "BEND" ], label: "Bend", color: STRUCTURE_COLOR_ENCODING[ STRUCTURE_ENCODING[ "BEND" ] ] },
        { value: STRUCTURE_ENCODING[ "TURN" ], label: "Turn", color: STRUCTURE_COLOR_ENCODING[ STRUCTURE_ENCODING[ "TURN" ] ] },
        { value: STRUCTURE_ENCODING[ "HELX" ], label: "Helix", color: STRUCTURE_COLOR_ENCODING[ STRUCTURE_ENCODING[ "HELX" ] ] },
        { value: STRUCTURE_ENCODING[ "STRN" ], label: "Sheet", color: STRUCTURE_COLOR_ENCODING[ STRUCTURE_ENCODING[ "STRN" ] ] } 
      ],
      top: '0px',
      left: HEIGHT * 0.65 + 330 + "px",
      orient: 'horizontal'
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
    },
    {
      name: 'StructureTop',
      type: 'heatmap',
      data: [ ],
      xAxisIndex: 4,
      yAxisIndex: 4,
      progressive: PROGRESSIVE_RENDERING_VALUE,
      emphasis: {
        disabled: true
      }
    },
    {
      name: 'StructureRight',
      type: 'heatmap',
      data: [ ],
      xAxisIndex: 5,
      yAxisIndex: 5,
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
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 3,
          startValue: event.batch[0].startValue,
          endValue: event.batch[0].endValue
        });
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 4,
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
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 3,
          start: event.batch[0].start,
          end: event.batch[0].end
        });
        CHART.dispatchAction({
          type: 'dataZoom',
          dataZoomIndex: 4,
          start: event.batch[1].start,
          end: event.batch[1].end
        });
      }
    }
  });
};

function updateChart(proteinAcc) {
  CHART_OPTION.series = [ CHART_OPTION.series[ 0 ], CHART_OPTION.series[ 1 ], CHART_OPTION.series[ 2 ], CHART_OPTION.series[ 3 ], CHART_OPTION.series[ 4 ] ];
  CHART_OPTION.series[0].data = [];
  CHART_OPTION.series[1].data = [];
  CHART_OPTION.series[2].data = [];
  CHART_OPTION.series[3].data = [];
  CHART_OPTION.series[4].data = [];
  CHART_OPTION.xAxis[0].data = [];
  CHART_OPTION.yAxis[0].data = [];
  CHART_OPTION.xAxis[1].data = [];
  CHART_OPTION.yAxis[1].data = [];
  CHART_OPTION.xAxis[2].data = [];
  CHART_OPTION.yAxis[2].data = [];
  CHART_OPTION.xAxis[3].data = [];
  CHART_OPTION.yAxis[3].data = [];
  CHART_OPTION.xAxis[4].data = [];
  CHART_OPTION.yAxis[5].data = [];
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
  }

  for (let residue in DATA[proteinAcc].residues) {
    CHART_OPTION.xAxis[0].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.xAxis[1].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.yAxis[0].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.yAxis[2].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.yAxis[3].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.xAxis[4].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.yAxis[5].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    PTMBarsTop.data.push( DATA[proteinAcc].residues[residue].ptm.length );
    PTMBarsRight.data.push( DATA[proteinAcc].residues[residue].ptm.length );
    let residuePTMCounts = {};
    DATA[proteinAcc].residues[residue].ptm.forEach(ptm => {
      if (residuePTMCounts[ptm]) {
        residuePTMCounts[ptm]++;
      } else {
        residuePTMCounts[ptm] = 1;
      }
    });
    for (let ptm of Object.keys(PTMCounts)) {
      if (ptm in residuePTMCounts) {
        PTMCounts[ptm].push(residuePTMCounts[ptm]);
      } else {
        PTMCounts[ptm].push(0);
      }
    }
    let residueNumber = parseInt(residue.split("@")[1]);
    CHART_OPTION.series[ 3 ].data.push( [ residueNumber - 1, 0, STRUCTURE_ENCODING[ DATA[proteinAcc].residues[residue].structureInformation.structure_group ] ] );
    CHART_OPTION.series[ 4 ].data.push( [ 0, residueNumber - 1, STRUCTURE_ENCODING[ DATA[proteinAcc].residues[residue].structureInformation.structure_group ] ] );
    for (let contactResidue of DATA[proteinAcc].residues[residue].contacts) {
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
  CHART_OPTION.series.push( PTMBarsTop );
  CHART_OPTION.series.push( PTMBarsRight );

  let PTMNames = Object.keys( PTMCounts );
  CHART_OPTION.xAxis[3].data = PTMNames.map( s => s.split( "]" )[ 1 ] );
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