import { DATA } from "./data.js";

var CHART;
var OVERVIEW_CHART_OPTION = {
  tooltip: {
    trigger: "item",
  },
  grid: [
    {
      id: "ptmOverview",
      width: "500px",
      height: "500px",
      // bottom: "870px",
      // show: true,
      // top: "50px",

      // left: "50px",
    },
  ],
  xAxis: {
    type: "value",
  },
  yAxis: {
    type: "category",
    data: [],
  },
  series: [],
};
var CHART_OPTION = {
  grid: [
    // {
    //   id: "ptmMap",
    //   width: "700px",
    //   height: "700px",
    //   bottom: "50px",
    //   left: "50px",
    //   top: "50px",
    //   // left: "50px",
    //   // show: true,
    //   backgroundColor: "#EFEFEF",
    // },
    {
      id: "ptmStackedBar",
      width: "1000px",
      height: "100px",
      bottom: "870px",
      // show: true,
      top: "50px",

      left: "50px",
    },
  ],
  xAxis: [
    // {
    //   id: "ptmMapX",
    //   type: "category",
    //   data: [],
    //   gridIndex: 0,
    // },
    {
      id: "ptmStackedBarX",
      type: "category",
      data: [],
      show: false,
      gridIndex: 0,
    },
  ],
  yAxis: [
    // {
    //   id: "ptmMapY",
    //   type: "category",
    //   data: [],
    //   inverse: true,
    //   gridIndex: 0,
    // },
    {
      id: "ptmStackedBarY",
      type: "value",
      gridIndex: 0,
    },
  ],
  toolbox: {
    feature: {
      dataZoom: {
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
    },
  },
  dataZoom: [
    {
      type: "inside",
      show: true,
      xAxisIndex: 1,
    },
  ],
  // visualMap: {
  //   min: 0,
  //   max: 1,
  //   dimension: 2,
  //   seriesIndex: 0,
  //   hoverLink: true,
  //   inverse: false,
  //   orient: "vertical",
  //   itemHeight: 800,
  //   top: "center",
  //   right: "right",
  //   text: ["2", "1"],
  //   textStyle: {
  //     color: "#607196",
  //     fontSize: 12,
  //   },
  //   calculable: true,
  //   inRange: {
  //     color: ["#E8DAB2", "#BF545B", "#BF5483", "#9454BF", "#5474BF"],
  //   },
  //   formatter: (value) => {
  //     return Math.round(value);
  //   },
  // },
  series: [
    // {
    //   name: "PTMContactMap",
    //   type: "heatmap",
    //   data: [],
    // },
  ],
};
var DataAll = {};
var PTMStackedBars = {};
var PTMLine = {};
var PTMAreaChart = {};
var OverallPTMs = {};
var allPTMS = [];

// TODO: Get overall PTMs and show a stacked barchart.
// TODO: Histogram over the PTMs to compare ortholog genes.
// TODO filter out the artefacts class.

window.onload = (_) => {
  CHART = echarts.init(document.getElementById("chartContainer"), { renderer: "canvas" });

  document.getElementById("accSelect").onchange = (event) => {
    if (event.isTrusted && event.type == "change") {
      if (document.getElementById("accSelect").value != "Overview") {
        updateChart(document.getElementById("accSelect").value);
      } else {
        createOverviewChart();
      }
    }
  };
  CHART.on("datazoom", (event) => {
    if (event.dataZoomIndex == 0) {
      return;
    }
    let zoomFactor = -1;
    if (
      event.batch[0].dataZoomId == "\x00_ec_\x00toolbox-dataZoom_xAxis0" &&
      event.batch[1].dataZoomId == "\x00_ec_\x00toolbox-dataZoom_yAxis0"
    ) {
      if (
        event.batch[0].startValue &&
        event.batch[0].endValue //&&
        // event.batch[1].startValue &&
        // event.batch[1].endValue
      ) {
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 0,
          startValue: event.batch[0].startValue,
          endValue: event.batch[0].endValue,
        });
        zoomFactor = event.batch[0].endValue - event.batch[0].startValue;
      } else {
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 0,
          start: event.batch[0].start,
          end: event.batch[0].end,
        });
        zoomFactor =
          ((event.batch[0].end - event.batch[0].start) / 100) * CHART_OPTION.xAxis[0].data.length;
      }
    }
    if (zoomFactor <= 50) {
      addStackedBar();
    } else {
      cleanStackedBar();
    }
  });

  DataAll = preprocessData();
  console.log(DataAll);
};

function createOverviewChart() {
  OVERVIEW_CHART_OPTION.yAxis.data = [];
  // for (let acc of Object.keys(DataAll)) {
  // let protName = DataAll[acc]
  let firstPTM = true;
  for (let ptmId of allPTMS) {
    let ptmLocalCount = [];
    for (let acc of Object.keys(DataAll)) {
      if (firstPTM) {
        OVERVIEW_CHART_OPTION.yAxis.data.push(acc);
      }
      ptmLocalCount.push(DataAll[acc]["ptmAll"][ptmId] || 0);
    }
    let tempSeriesObject = {
      name: ptmId,
      type: "bar",
      stack: "total",
      label: {
        show: false,
      },
      emphasis: {
        focus: "series",
      },
      data: ptmLocalCount,
    };
    OVERVIEW_CHART_OPTION.series.push(tempSeriesObject);
    firstPTM = false;

    // }
  }
  OVERVIEW_CHART_OPTION.series.sort((a, b) => sum(a.data) - sum(b.data));
  OVERVIEW_CHART_OPTION.series = OVERVIEW_CHART_OPTION.series;
  CHART.setOption(OVERVIEW_CHART_OPTION);
  console.log(DataAll);
  console.log(OVERVIEW_CHART_OPTION);
}
function sum(array) {
  return array.reduce((a, b) => a + b, 0);
}
function preprocessData() {
  var tempData = {};
  // console.log(Object.keys(DATA));
  for (let proteinAcc of Object.keys(DATA)) {
    tempData[proteinAcc] = {};
    OverallPTMs = [];
    // console.log(proteinAcc);
    for (let residue in DATA[proteinAcc].residues) {
      DATA[proteinAcc].residues[residue].ptm.forEach((ptm) => {
        PTMStackedBars[ptm] = [];
        PTMAreaChart[ptm] = [];
      });
    }

    for (let residue in DATA[proteinAcc].residues) {
      let ptmCounts = {};
      DATA[proteinAcc].residues[residue].ptm.forEach((ptm) => {
        if (!allPTMS.includes(ptm)) {
          allPTMS.push(ptm);
        }
        if (ptmCounts[ptm]) {
          ptmCounts[ptm]++;
        } else {
          ptmCounts[ptm] = 1;
        }
        if (OverallPTMs[ptm]) {
          OverallPTMs[ptm]++;
        } else {
          OverallPTMs[ptm] = 1;
        }
      });
      for (let ptm of Object.keys(PTMStackedBars)) {
        if (ptm in ptmCounts) {
          PTMStackedBars[ptm].push(ptmCounts[ptm]);
          PTMAreaChart[ptm].push(ptmCounts[ptm]);
        } else {
          PTMStackedBars[ptm].push(0);
          PTMAreaChart[ptm].push(0);
        }
      }
    }
    Object.assign(tempData[proteinAcc], {
      ptmAll: OverallPTMs,
      StackedBars: PTMStackedBars,
      AreaChart: PTMAreaChart,
    });
    // tempData[proteinAcc] = ;
  }
  allPTMS.sort((a, b) => a.split("]")[1].localeCompare(b.split("]")[1]));
  return tempData;
}

function updateChart(proteinAcc) {
  CHART_OPTION.xAxis[0].data = [];
  CHART_OPTION.yAxis[0].data = [];
  // CHART_OPTION.series[0].data = [];
  // CHART_OPTION.xAxis[1].data = [];
  // CHART_OPTION.yAxis[1].data = [];
  // CHART_OPTION.visualMap.max = 0;
  PTMStackedBars = {};
  PTMAreaChart = {};
  // PTMLine = {
  //   name: "PTMLine",
  //   type: "line",
  //   xAxisIndex: 1,
  //   yAxisIndex: 1,
  //   data: [],
  //   showSymbol: false,
  //   smooth: true,
  //   lineStyle: {
  //     color: "#444444",
  //   },
  // };
  for (let residue in DATA[proteinAcc].residues) {
    DATA[proteinAcc].residues[residue].ptm.forEach((ptm) => {
      PTMStackedBars[ptm] = [];
      PTMAreaChart[ptm] = [];
    });
    // PTMLine.data.concat(DATA[proteinAcc].residues[residue].ptm);
  }

  for (let residue in DATA[proteinAcc].residues) {
    // CHART_OPTION.xAxis[0].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    // CHART_OPTION.yAxis[0].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    CHART_OPTION.xAxis[0].data.push(residue.split("@")[1] + " (" + residue.split("@")[0] + ")");
    let ptmCounts = {};
    DATA[proteinAcc].residues[residue].ptm.forEach((ptm) => {
      if (ptmCounts[ptm]) {
        ptmCounts[ptm]++;
      } else {
        ptmCounts[ptm] = 1;
      }
      if (OverallPTMs[ptm]) {
        OverallPTMs[ptm]++;
      } else {
        OverallPTMs[ptm] = 1;
      }
    });
    for (let ptm of Object.keys(PTMStackedBars)) {
      if (ptm in ptmCounts) {
        PTMStackedBars[ptm].push(ptmCounts[ptm]);
        PTMAreaChart[ptm].push(ptmCounts[ptm]);
      } else {
        PTMStackedBars[ptm].push(0);
        PTMAreaChart[ptm].push(0);
      }
    }
    // for (let contactResidue of DATA[proteinAcc].residues[residue].contacts) {
    //   let residueNumber = parseInt(residue.split("@")[1]);
    //   let contactResidueNumber = parseInt(contactResidue.split("@")[1]);
    //   let residuePTM = DATA[proteinAcc].residues[residue].ptm;
    //   let contactResiduePTM = DATA[proteinAcc].residues[contactResidue].ptm;
    //   if (residuePTM.length > 0 && contactResiduePTM.length > 0) {
    //     let PTMSimilarity = computePTMIntersection(residuePTM, contactResiduePTM);
    //     CHART_OPTION.series[0].data.push([residueNumber, contactResidueNumber, PTMSimilarity]);
    //   }
    // }
  }

  // addAreaChart();
  // console.log(PTMAreaChart);

  cleanStackedBar();
}

function cleanStackedBar() {
  CHART_OPTION.series = CHART_OPTION.series.filter((s) => !s.name.startsWith("PTMStackedBar"));
  // CHART_OPTION.series.push(PTMAreaChart);
  addAreaChart();
}

function cleanAreaChart() {
  CHART_OPTION.series = CHART_OPTION.series.filter((s) => !s.name.startsWith("PTMAreaChart"));
  // CHART_OPTION.series.push(PTMAreaChart);
  // CHART.setOption(CHART_OPTION, { replaceMerge: ["series"] });
}

function addStackedBar() {
  cleanAreaChart();
  for (let ptm of Object.keys(PTMStackedBars)) {
    CHART_OPTION.series.push({
      name: "PTMStackedBar_" + ptm,
      type: "bar",
      stack: "Total",
      data: PTMStackedBars[ptm],
      xAxisIndex: 0,
      yAxisIndex: 0,
      large: true,
    });
  }
  CHART.setOption(CHART_OPTION, { replaceMerge: ["series"] });
}

function addAreaChart() {
  for (let ptm of Object.keys(PTMAreaChart)) {
    CHART_OPTION.series.push({
      name: "PTMAreaChart_" + ptm,
      type: "line",
      stack: "Total",
      smooth: true,
      areaStyle: {},
      data: PTMAreaChart[ptm],
      // xAxisIndex: 1,
      // yAxisIndex: 1,
      large: true,
    });
  }
  var overallOrder = Object.keys(OverallPTMs).map((x) => [x, OverallPTMs[x]]);
  overallOrder.sort((x, y) => x[1] - y[1]);
  CHART_OPTION.series.sort(
    (x, y) => getPTMorder(x["name"], overallOrder) - getPTMorder(y["name"], overallOrder)
  );
  CHART.setOption(CHART_OPTION, { replaceMerge: ["series"] });
}

function getPTMorder(name, overallOrder) {
  return overallOrder.indexOf(name.split("_")[1]);
}

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
  let intersection = riPTM.filter((v) => rjPTM.includes(v));
  let intersectionSize = intersection.length;
  if (intersectionSize > CHART_OPTION.visualMap.max) {
    CHART_OPTION.visualMap.max = intersectionSize;
    CHART_OPTION.visualMap.text = [CHART_OPTION.visualMap.max, CHART_OPTION.visualMap.min];
  }
  return intersectionSize;
}
