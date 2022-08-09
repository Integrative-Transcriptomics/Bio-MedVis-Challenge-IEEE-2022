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
var STRUCTURE_LABELS = {
  "unstructured": "Unstructured",
  "HELX": "Helix",
  "BEND": "Bend",
  "TURN": "Turn",
  "STRN": "Sheet"
};
var STRUCTURE_COLOR_ENCODING = {
  0: 'rgba(94, 80, 63, 1.0)',
  1: 'rgba(220, 73, 58, 1.0)',
  2: 'rgba(76, 35, 10, 1.0)',
  3: 'rgba(169, 146, 125, 1.0)',
  4: 'rgba(67, 146, 241, 1.0)'
};
var CHART_OPTION = {
  title: [
    {
      show: true,
      top: '2px',
      left: '200px',
      text: 'Common PTM Fraction:',
      textStyle: {
        fontSize: 12
      },
      textAlign: 'left'
    },
    {
      show: true,
      top: '2px',
      left: HEIGHT * 0.65 + 300 + "px",
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
      left: "200px",
      show: true,
      backgroundColor: "#FAFAFA"
    },
    {
      id: "ptmBarsTop",
      width: HEIGHT * 0.65 + "px",
      height: HEIGHT * 0.12 + "px",
      bottom: HEIGHT * 0.65 + 100 + "px",
      left: '200px'
    },
    {
      id: "ptmBarsRight",
      width: HEIGHT * 0.15 + "px",
      height: HEIGHT * 0.65 + "px",
      bottom: "80px",
      left: 2 * ( HEIGHT * 0.65 ) + 220 + "px"
    },
    {
      id: "presenceAbsenceMap",
      width: HEIGHT * 0.65 + "px",
      height: HEIGHT * 0.65 + "px",
      bottom: "80px",
      // right: "100px",
      // left: HEIGHT * 0.15 + HEIGHT * 0.65 + 180 + "px",
      left: HEIGHT * 0.65 + 220 + "px",
      show: true,
      backgroundColor: "#FAFAFA"
    },
    {
      id: "structureTop",
      width: HEIGHT * 0.65 + "px",
      height: "18px",
      left: "200px",
      bottom: HEIGHT * 0.65 + 80 + "px"
    },
    {
      id: "structureRight",
      width: "18px",
      height: HEIGHT * 0.65 + "px",
      left: HEIGHT * 0.65 + 200 + "px",
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
      splitArea: {
        show: true,
        interval: 0
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
        rotate: -40,
        interval: 0,
        show: false
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
      splitArea: {
        show: true,
        interval: 0
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
      show: true,
      axisLabel: {
        show: false
      },
      splitArea: {
        show: true,
        interval: ( index, value ) => {
          return true;
        },
        areaStyle: {
          color: [ '#FAFAFA', '#F5F5F5' ]
        }
      }
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
        xAxisIndex: [ 0, 1, 4 ]
      },
      {
        yAxisIndex: [ 0, 2, 3 ]
      }
    ],
    label: {
      formatter: ( params ) => {
        try {
          let residueAcc = params.value.split( "(" )[1].split( ")" )[0] + "@" + params.value.split( "(" )[0].trim( );
          if ( params.axisDimension == "y" && params.axisIndex == 0 ) {
            return params.value;
          }  else if ( params.axisDimension == "y" && params.axisIndex == 2 ) {
            return "No. PTMs: " + DATA[ selectedAcc ].residues[ residueAcc ].ptm.length;
          } else if ( params.axisDimension == "y" && params.axisIndex == 3 ) {
            return STRUCTURE_LABELS[ DATA[ selectedAcc ].residues[ residueAcc ].structureInformation.structure_group ];
          } else if ( params.axisDimension == "x" && params.axisIndex == 0 ) {
            return params.value;
          } else if ( params.axisDimension == "x" && params.axisIndex == 1 ) {
            return "No. PTMs: " + DATA[ selectedAcc ].residues[ residueAcc ].ptm.length;
          } else if ( params.axisDimension == "x" && params.axisIndex == 4 ) {
            return STRUCTURE_LABELS[ DATA[ selectedAcc ].residues[ residueAcc ].structureInformation.structure_group ];
          }
        } catch ( e ) {
          return params.value;
        }
      }
    }
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
      left: HEIGHT * 0.65 + 220 + "px",
      bottom: "60px",
      height: "20px",
      width: HEIGHT * 0.65 + "px",
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
      left: '350px',
      textStyle: {
        color: '#607196',
        fontSize: 11
      },
      precision: 4,
      calculable: true,
      realtime: false,
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
          return Math.round( value * 100 ) + "%";
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
      left: HEIGHT * 0.65 + 480 + "px",
      orient: 'horizontal',
      selectMode: false
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
var selectedAcc = null;

window.onload = _ => {
  CHART = echarts.init(document.getElementById("chartContainer"), { "renderer": "canvas" });
  document.getElementById("accSelect").onchange = (event) => {
    if (event.isTrusted && event.type == 'change') {
      updateChart(document.getElementById("accSelect").value);
    }
  };
  CHART.on('datazoom', (event) => {
    console.log( event );
    if ( event.dataZoomId == '\x00series\x005\x000' ) {
      if ( event.end - event.start <= 10.0 ) {
        CHART_OPTION.xAxis[ 3 ].axisLabel.show = true;
      } else {
        CHART_OPTION.xAxis[ 3 ].axisLabel.show = false;
      }
      CHART.setOption(CHART_OPTION, { replaceMerge: [ 'xAxis' ] } );
    } else if (  event.dataZoomIndex !== undefined ) {
      return;
    } else if (event.batch[0].dataZoomId == '\x00_ec_\x00toolbox-dataZoom_xAxis0' && event.batch[1].dataZoomId == '\x00_ec_\x00toolbox-dataZoom_yAxis0') {
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
  CHART.on('datarangeselected', (event) => {
    if ( event.visualMapId === "\u0000series\u00000\u00000" ) {
      CHART.dispatchAction({
        type: 'selectDataRange',
        visualMapIndex: 0,
        selected: [ Math.max( ...[ event.selected[ 0 ], CHART_OPTION.visualMap[ 0 ].range[ 0 ] ] ), event.selected[ 1 ] ]
      });
    }
  });
};

function updateChart(proteinAcc) {
  selectedAcc = proteinAcc;
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
  CHART_OPTION.yAxis[ 3 ].splitArea.areaStyle.color = [ ];
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
      let ptmKey = ptm.split( "]" )[ 1 ];
      PTMCounts[ptmKey] = [ ];
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
      let ptmKey = ptm.split( "]" )[ 1 ];
      if (residuePTMCounts[ ptmKey ]) {
        residuePTMCounts[ptmKey ]++;
      } else {
        residuePTMCounts[ptmKey] = 1;
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
    let residuePTM = DATA[proteinAcc].residues[residue].ptm;
    CHART_OPTION.series[ 3 ].data.push( [ residueNumber - 1, 0, STRUCTURE_ENCODING[ DATA[proteinAcc].residues[residue].structureInformation.structure_group ] ] );
    CHART_OPTION.series[ 4 ].data.push( [ 0, residueNumber - 1, STRUCTURE_ENCODING[ DATA[proteinAcc].residues[residue].structureInformation.structure_group ] ] );
    CHART_OPTION.yAxis[ 3 ].splitArea.areaStyle.color.push( STRUCTURE_COLOR_ENCODING[ STRUCTURE_ENCODING[ DATA[proteinAcc].residues[residue].structureInformation.structure_group ] ].replace( ", 1.0)", ", 0.1)" ) );
    /*for(let residue2 in  DATA[proteinAcc].residues) {
      let residue2Number = parseInt(residue2.split("@")[1]);
      let residue2PTM = DATA[proteinAcc].residues[residue2].ptm;
      if ( residuePTM.length > 0 && residue2PTM.length > 0 && residueNumber > residue2Number) {
        let PTMSimilarity = computePTMSimilarity(residuePTM, residue2PTM);
        CHART_OPTION.series[0].data.push([
          residueNumber - 1,
          residue2Number - 1,
          PTMSimilarity
        ])
      }
    }*/
    for (let contactResidue of DATA[proteinAcc].residues[residue].contacts) {
      let contactResidueNumber = parseInt(contactResidue.split("@")[1]);
      let contactResiduePTM = DATA[proteinAcc].residues[contactResidue].ptm;
      if ( residuePTM.length > 0 && contactResiduePTM.length > 0 && residueNumber > contactResidueNumber) {
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
  /*
  // Sorts PTMs by number of occurences:
  PTMNames.sort( ( ptm1, ptm2 ) => {
    let ptm1Sum = PTMCounts[ ptm1 ].reduce( ( a, c ) => a + c );
    let ptm2Sum = PTMCounts[ ptm2 ].reduce( ( a, c ) => a + c );
    return ptm2Sum - ptm1Sum;
  } );
  */
  PTMNames.sort( );
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
  CHART.setOption(CHART_OPTION, { replaceMerge: [ 'series' ] } );
}

var computePTMSimilarity = (riPTM, rjPTM) => {
  let intersectionSize = computePTMIntersection( riPTM, rjPTM );
  let unionSize = computePTMUnion( riPTM, rjPTM );
  let similarity = intersectionSize / unionSize;
  if ( similarity != 0 && similarity < CHART_OPTION.visualMap[ 0 ].range[ 0 ] ) {
    CHART_OPTION.visualMap[ 0 ].range = [ similarity, 1 ];
  }
  return similarity;  
};

function computePTMIntersection(riPTM, rjPTM) {
  let intersection = riPTM.filter(v => rjPTM.includes(v));
  return intersection.length;
}

function computePTMUnion(riPTM, rjPTM) {
  let union = [...new Set([...riPTM, ...rjPTM])];
  return union.length;
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