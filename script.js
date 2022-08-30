import { DATA } from "./data.js";

var CHART;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var PROGRESSIVE_RENDERING_VALUE = 0;
var PTM_MAP_CONTACT_RESTRICTION = true;
var PTM_SIMILARITY_MODE = "fraction";
var STRUCTURE_ENCODING = {
  unstructured: 0,
  HELX: 1,
  BEND: 2,
  TURN: 3,
  STRN: 4,
};
var STRUCTURE_LABELS = {
  unstructured: "Unstructured",
  HELX: "Helix",
  BEND: "Bend",
  TURN: "Turn",
  STRN: "Sheet",
};
var STRUCTURE_COLOR_ENCODING = {
  0: "rgba(94, 80, 63, 1.0)",
  1: "rgba(220, 73, 58, 1.0)",
  2: "rgba(76, 35, 10, 1.0)",
  3: "rgba(169, 146, 125, 1.0)",
  4: "rgba(67, 146, 241, 1.0)",
};
var CHART_OPTION = {
  title: [
    {
      show: true,
      top: "2px",
      left: "160px",
      text: "Common PTM Fraction:",
      textStyle: {
        fontSize: 12,
      },
      textAlign: "left",
    },
    {
      show: true,
      top: "2px",
      left: HEIGHT * 0.65 + 140 + "px",
      text: "Secondary Structure Type:",
      textStyle: {
        fontSize: 12,
      },
      textAlign: "left",
    },
    {
      show: true,
      top: "2px",
      left: HEIGHT * 0.65 + 720 + "px",
      text: "No. PTMs:",
      textStyle: {
        fontSize: 12,
      },
      textAlign: "left",
    },
  ],
  grid: [
    {
      id: "ptmMap",
      width: HEIGHT * 0.65 + "px",
      height: HEIGHT * 0.65 + "px",
      bottom: "80px",
      left: "200px",
      show: true,
      backgroundColor: "#FAFAFA",
    },
    {
      id: "ptmBarsTop",
      width: HEIGHT * 0.65 + "px",
      height: HEIGHT * 0.12 + "px",
      bottom: HEIGHT * 0.65 + 100 + "px",
      left: "200px",
    },
    {
      id: "ptmBarsRight",
      width: HEIGHT * 0.15 + "px",
      height: HEIGHT * 0.65 + "px",
      bottom: "80px",
      left: 2 * (HEIGHT * 0.65) + 220 + "px",
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
      backgroundColor: "#FAFAFA",
    },
    {
      id: "structureTop",
      width: HEIGHT * 0.65 + "px",
      height: "18px",
      left: "200px",
      bottom: HEIGHT * 0.65 + 80 + "px",
    },
    {
      id: "structureRight",
      width: "18px",
      height: HEIGHT * 0.65 + "px",
      left: HEIGHT * 0.65 + 200 + "px",
      bottom: "80px",
    },
  ],
  xAxis: [
    {
      id: "ptmMapX",
      type: "category",
      data: [],
      gridIndex: 0,
      name: "Residue Index (Residue Type)",
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        fontWeight: "bold",
        fontSize: 14,
      },
      axisLabel: {
        fontSize: 11,
      },
      splitArea: {
        show: true,
        interval: 0,
        color: [ "#FAFAFA", "#E5E5E5" ]
      },
      hideOverlap: true,
    },
    {
      id: "ptmBarsTopX",
      type: "category",
      data: [],
      show: false,
      gridIndex: 1,
    },
    {
      id: "ptmBarsRightX",
      type: "value",
      gridIndex: 2,
      name: "No. PTMs",
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        fontWeight: "bold",
        fontSize: 14,
      },
      axisLabel: {
        fontSize: 11,
      },
      hideOverlap: true,
      minInterval: 1,
      max: 0
    },
    {
      id: "presenceAbsenceMapX",
      type: "category",
      data: [],
      gridIndex: 3,
      name: "Individual PTM Presence (Per Residue)",
      nameLocation: "middle",
      nameGap: -1 * HEIGHT * 0.7,
      nameTextStyle: {
        fontWeight: "bold",
        fontSize: 14,
      },
      position: "top",
      axisLabel: {
        rotate: -40,
        interval: 0,
        show: true,
        margin: 25,
        fontSize: 11,
      },
      axisTick: {
        length: 15,
        lineStyle: { width: "1" },
        alignWithLabel: true,
        interval: 0
      },
      splitArea: {
        show: false,
        interval: 0,
        /*areaStyle: {
          color: [ "#FAFAFA", "#E5E5E5" ],
          opacity: 0.5,
          borderColor: "black",
          borderWidth: 2
        }*/
      },
      hideOverlap: true,
    },
    {
      id: "structureTopX",
      type: "category",
      data: [],
      gridIndex: 4,
      show: false,
    },
    {
      id: "structureRightX",
      type: "category",
      data: [0],
      gridIndex: 5,
      show: false,
    },
  ],
  yAxis: [
    {
      id: "ptmMapY",
      type: "category",
      data: [],
      inverse: true,
      gridIndex: 0,
      name: "Residue Index (Residue Type)",
      nameLocation: "middle",
      nameGap: 60,
      nameTextStyle: {
        fontWeight: "bold",
        fontSize: 14,
      },
      axisLabel: {
        fontSize: 11,
      },
      splitArea: {
        show: true,
        interval: 0,
        color: [ "#FAFAFA", "#E5E5E5" ]
      },
      hideOverlap: true,
    },
    {
      id: "ptmBarsTopY",
      type: "value",
      gridIndex: 1,
      name: "No. PTMs",
      nameLocation: "middle",
      nameGap: 60,
      nameTextStyle: {
        fontWeight: "bold",
        fontSize: 14,
      },
      axisLabel: {
        fontSize: 11,
      },
      hideOverlap: true,
      minInterval: 1,
      max: 0
    },
    {
      id: "ptmBarsRightY",
      type: "category",
      data: [],
      show: false,
      gridIndex: 2,
      inverse: true,
    },
    {
      id: "presenceAbsenceMapY",
      type: "category",
      data: [],
      inverse: true,
      gridIndex: 3,
      show: true,
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitArea: {
        show: true,
        interval: (index, value) => {
          return true;
        },
        areaStyle: {
          color: ["#FAFAFA", "#F5F5F5"],
        },
      },
      hideOverlap: true,
    },
    {
      id: "structureTopY",
      type: "category",
      data: [0],
      gridIndex: 4,
      show: false,
    },
    {
      id: "structureRightY",
      type: "category",
      data: [],
      gridIndex: 5,
      show: false,
      inverse: true,
    },
  ],
  axisPointer: {
    show: true,
    triggerOn: "click",
    z: 5,
    triggerTooltip: false,
    link: [
      {
        xAxisIndex: [0, 1, 4],
      },
      {
        yAxisIndex: [0, 2, 3],
      },
    ],
    label: {
      formatter: (params) => {
        try {
          let residueAcc =
            params.value.split("(")[1].split(")")[0] + "@" + params.value.split("(")[0].trim();
          if (params.axisDimension == "y" && params.axisIndex == 0) {
            return params.value;
          } else if (params.axisDimension == "y" && params.axisIndex == 2) {
            return "No. PTMs: " + DATA[selectedAcc].residues[residueAcc].ptm.length;
          } else if (params.axisDimension == "y" && params.axisIndex == 3) {
            return STRUCTURE_LABELS[
              DATA[selectedAcc].residues[residueAcc].structureInformation.structure_group
            ];
          } else if (params.axisDimension == "x" && params.axisIndex == 0) {
            return params.value;
          } else if (params.axisDimension == "x" && params.axisIndex == 1) {
            return "No. PTMs: " + DATA[selectedAcc].residues[residueAcc].ptm.length;
          } else if (params.axisDimension == "x" && params.axisIndex == 4) {
            return STRUCTURE_LABELS[
              DATA[selectedAcc].residues[residueAcc].structureInformation.structure_group
            ];
          }
        } catch (e) {
          return params.value;
        }
      },
    },
  },
  tooltip: {
    show: false,
  },
  toolbox: {
    left: "left",
    feature: {
      dataZoom: {
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      myTool1: {
        show: true,
        title: "Contact Restriction: True",
        icon: "path://M0 224C0 188.7 28.65 160 64 160H128V288C128 341 170.1 384 224 384H352V448C352 483.3 323.3 512 288 512H64C28.65 512 0 483.3 0 448V224zM224 352C188.7 352 160 323.3 160 288V64C160 28.65 188.7 0 224 0H448C483.3 0 512 28.65 512 64V288C512 323.3 483.3 352 448 352H224z",
        onclick: () => {
          if (PTM_MAP_CONTACT_RESTRICTION) {
            PTM_MAP_CONTACT_RESTRICTION = false;
            CHART_OPTION.toolbox.feature.myTool1.icon =
              "path://M0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96z";
            CHART_OPTION.toolbox.feature.myTool1.title = "Contact Restriction: False";
            updateChart(selectedAcc);
          } else {
            PTM_MAP_CONTACT_RESTRICTION = true;
            CHART_OPTION.toolbox.feature.myTool1.icon =
              "path://M0 224C0 188.7 28.65 160 64 160H128V288C128 341 170.1 384 224 384H352V448C352 483.3 323.3 512 288 512H64C28.65 512 0 483.3 0 448V224zM224 352C188.7 352 160 323.3 160 288V64C160 28.65 188.7 0 224 0H448C483.3 0 512 28.65 512 64V288C512 323.3 483.3 352 448 352H224z";
            CHART_OPTION.toolbox.feature.myTool1.title = "Contact Restriction: True";
            updateChart(selectedAcc);
          }
        },
      },
      myTool2: {
        show: true,
        title: "Similarity Mode: Fraction",
        icon: "path://M177.9 494.1C159.2 512.8 128.8 512.8 110.1 494.1L17.94 401.9C-.8054 383.2-.8054 352.8 17.94 334.1L68.69 283.3L116.7 331.3C122.9 337.6 133.1 337.6 139.3 331.3C145.6 325.1 145.6 314.9 139.3 308.7L91.31 260.7L132.7 219.3L180.7 267.3C186.9 273.6 197.1 273.6 203.3 267.3C209.6 261.1 209.6 250.9 203.3 244.7L155.3 196.7L196.7 155.3L244.7 203.3C250.9 209.6 261.1 209.6 267.3 203.3C273.6 197.1 273.6 186.9 267.3 180.7L219.3 132.7L260.7 91.31L308.7 139.3C314.9 145.6 325.1 145.6 331.3 139.3C337.6 133.1 337.6 122.9 331.3 116.7L283.3 68.69L334.1 17.94C352.8-.8055 383.2-.8055 401.9 17.94L494.1 110.1C512.8 128.8 512.8 159.2 494.1 177.9L177.9 494.1z",
        onclick: () => {
          if (PTM_SIMILARITY_MODE == "fraction") {
            PTM_SIMILARITY_MODE = "total";
            CHART_OPTION.toolbox.feature.myTool2.title = "Similarity Mode: Total";
            CHART_OPTION.visualMap[0] = {
              max: 1,
              min: 0,
              calculable: true,
              text: ["MAX", "0"],
              padding: [5, 20, 5, 0],
              textGap: 5,
              range: [1, 1],
            };
            CHART_OPTION.visualMap[0].formatter = (value) => {
              if (value == 0) {
                return "In contact (Cα↔ ≤ 6Å)\nModified, but no joint PTMs";
              } else {
                return Math.round(value);
              }
            };
            CHART_OPTION.title[0].text = "Common PTM Total: ";
            computePTMSimilarity = (riPTM, rjPTM) => {
              let similarity = computePTMIntersection(riPTM, rjPTM);
              if (similarity != 0 && similarity > CHART_OPTION.visualMap[0].max) {
                CHART_OPTION.visualMap[0].text[0] = similarity;
                CHART_OPTION.visualMap[0].max = similarity;
                CHART_OPTION.visualMap[0].range = [1, similarity];
              }
              return similarity;
            };
            updateChart(selectedAcc);
          } else {
            PTM_SIMILARITY_MODE = "fraction";
            CHART_OPTION.toolbox.feature.myTool2.title = "Similarity Mode: Fraction";
            CHART_OPTION.visualMap[0] = {
              max: 1,
              min: 0,
              calculable: true,
              text: ["100%", "0%"],
              padding: [5, 20, 5, 0],
              textGap: 5,
              range: [1, 1],
            };
            CHART_OPTION.visualMap[0].formatter = (value) => {
              if (value == 0) {
                return "In contact (Cα↔ ≤ 6Å)\nModified, but no joint PTMs";
              } else {
                return Math.round(value * 100) + "%";
              }
            };
            CHART_OPTION.title[0].text = "Common PTM Fraction: ";
            computePTMSimilarity = (riPTM, rjPTM) => {
              let intersectionSize = computePTMIntersection(riPTM, rjPTM);
              let unionSize = computePTMUnion(riPTM, rjPTM);
              let similarity = intersectionSize / unionSize;
              if (similarity != 0 && similarity < CHART_OPTION.visualMap[0].range[0]) {
                CHART_OPTION.visualMap[0].range = [similarity, 1];
              }
              return similarity;
            };
            updateChart(selectedAcc);
          }
        },
      },
      saveAsImage: {
        title: "Save as PNG",
      },
    },
  },
  dataZoom: [
    {
      type: "inside",
      show: false,
      xAxisIndex: 1,
      zoomOnMouseWheel: false
    },
    {
      type: "inside",
      show: false,
      yAxisIndex: 2,
      zoomOnMouseWheel: false
    },
    {
      type: "inside",
      show: false,
      yAxisIndex: 3,
      zoomOnMouseWheel: false
    },
    {
      type: "inside",
      show: false,
      xAxisIndex: 4,
      zoomOnMouseWheel: false
    },
    {
      type: "inside",
      show: false,
      yAxisIndex: 5,
      zoomOnMouseWheel: false
    },
    {
      type: "slider",
      show: true,
      xAxisIndex: 3,
      left: HEIGHT * 0.65 + 220 + "px",
      bottom: HEIGHT * 0.65 + 80 + "px",
      height: "18px", // HEIGHT * 0.12 + 18 + "px",
      width: HEIGHT * 0.65 + "px",
      fillerColor: "rgba(204, 204, 204, 0.5)",
      handleStyle: {
        color: "rgba(153, 153, 153, 0.8)",
      },
      moveHandleSize: 2,
      moveHandleStyle: {
        color: "#999999",
      },
      emphasis: {
        moveHandleStyle: {
          color: "#666666",
        },
      },
    },
  ],
  visualMap: [
    {
      min: 0,
      max: 1,
      range: [1, 1],
      dimension: 2,
      seriesIndex: 0,
      text: ["100%", "0%"],
      padding: [5, 20, 5, 0],
      textGap: 5,
      hoverLink: true,
      inverse: false,
      orient: "horizontal",
      itemHeight: HEIGHT * 0.65 - 260,
      itemWidth: 12,
      top: "0px",
      left: "320px",
      textStyle: {
        color: "#607196",
        fontSize: 11,
      },
      precision: 4,
      calculable: true,
      realtime: false,
      inRange: {
        color: ["#10E0C5", "#FF6200"],
        // Gray scale: '#cccccc', '#000000'
        // CyBuPl1: '#edf8b1', '#7fcdbb', '#2c7fb8'
        // CyBuPl2: '#10E0C5', '#293BE1', '#8C08C4'
      },
      outOfRange: {
        color: ["#DFD9E2"],
      },
      formatter: (value) => {
        if (value == 0) {
          return "In contact (Cα↔ ≤ 6Å)\nModified, but no joint PTMs";
        } else {
          return Math.round(value * 100) + "%";
        }
      },
    },
    {
      type: "piecewise",
      dimension: 2,
      seriesIndex: [3, 4],
      pieces: [
        {
          value: STRUCTURE_ENCODING["unstructured"],
          label: "Unstructured",
          color: STRUCTURE_COLOR_ENCODING[STRUCTURE_ENCODING["unstructured"]],
        },
        {
          value: STRUCTURE_ENCODING["BEND"],
          label: "Bend",
          color: STRUCTURE_COLOR_ENCODING[STRUCTURE_ENCODING["BEND"]],
        },
        {
          value: STRUCTURE_ENCODING["TURN"],
          label: "Turn",
          color: STRUCTURE_COLOR_ENCODING[STRUCTURE_ENCODING["TURN"]],
        },
        {
          value: STRUCTURE_ENCODING["HELX"],
          label: "Helix",
          color: STRUCTURE_COLOR_ENCODING[STRUCTURE_ENCODING["HELX"]],
        },
        {
          value: STRUCTURE_ENCODING["STRN"],
          label: "Sheet",
          color: STRUCTURE_COLOR_ENCODING[STRUCTURE_ENCODING["STRN"]],
        },
      ],
      top: "0px",
      left: HEIGHT * 0.65 + 320 + "px",
      orient: "horizontal",
      selectMode: false,
    },
    {
      type: "piecewise",
      dimension: 0,
      seriesIndex: [],
      pieces: [
        { value: 0, label: "Unique", color: "#08519c" },
        { value: 1, label: "Shared", color: "#89BD9E" },
        { value: 2, label: "Total", color: "#000000" },
      ],
      top: "0px",
      left: HEIGHT * 0.65 + 800 + "px",
      orient: "horizontal",
      selectMode: false,
    },
  ],
  series: [
    {
      name: "PTMContactMap",
      type: "heatmap",
      data: [],
      itemStyle: {
        borderColor: "#CCCCCC",
        borderWidth: 0.5
      },
      progressive: PROGRESSIVE_RENDERING_VALUE,
      emphasis: {
        disabled: true,
      },
      animation: false,
      silent: true,
    },
    {
      name: "ContactMap",
      type: "heatmap",
      data: [],
      itemStyle: {
        borderColor: "#CCCCCC",
        borderWidth: 0.5,
        color: "#999999"
      },
      progressive: PROGRESSIVE_RENDERING_VALUE,
      emphasis: {
        disabled: true,
      },
      animation: false,
      silent: true,
    },
    {
      name: "PresenceAbsenceMap",
      type: "heatmap",
      data: [],
      itemStyle: {
        borderColor: "#CCCCCC",
        borderWidth: 0.5,
        color: "#030303"
      },
      xAxisIndex: 3,
      yAxisIndex: 3,
      progressive: PROGRESSIVE_RENDERING_VALUE,
      emphasis: {
        disabled: true,
      },
      animation: false,
      silent: true,
    },
    {
      name: "StructureTop",
      type: "heatmap",
      data: [],
      xAxisIndex: 4,
      yAxisIndex: 4,
      progressive: PROGRESSIVE_RENDERING_VALUE,
      emphasis: {
        disabled: true,
      },
      animation: false,
      silent: true,
    },
    {
      name: "StructureRight",
      type: "heatmap",
      data: [],
      xAxisIndex: 5,
      yAxisIndex: 5,
      progressive: PROGRESSIVE_RENDERING_VALUE,
      emphasis: {
        disabled: true,
      },
      animation: false,
      silent: true,
    },
  ],
};
var PTMCounts = {};
var PTMBarsTopUnique = {};
var PTMBarsTopJoint = {};
var PTMBarsRightUnique = {};
var PTMBarsRightJoint = {};
var selectedAcc = null;

window.onload = (_) => {
  CHART = echarts.init(document.getElementById("chartContainer"), { renderer: "canvas" });
  document.getElementById("accSelect").onchange = (event) => {
    if (event.isTrusted && event.type == "change") {
      updateChart(document.getElementById("accSelect").value);
    }
  };
  CHART.on("datazoom", (event) => {
    if (event.dataZoomId == "\x00series\x005\x000") {
      if (CHART_OPTION.xAxis[3].data.length * ((event.end - event.start) / 100) <= 20.0) {
        CHART_OPTION.xAxis[3].axisLabel.interval = 0;
      } else {
        CHART_OPTION.xAxis[3].axisLabel.interval = Math.round(
          (CHART_OPTION.xAxis[3].data.length * ((event.end - event.start) / 100)) / 20
        );
      }
      CHART.setOption(CHART_OPTION, { replaceMerge: ["xAxis"] });
    } else if (event.dataZoomIndex !== undefined) {
      return;
    } else if ( event.batch[0].dataZoomId == "\x00_ec_\x00toolbox-dataZoom_xAxis0" && event.batch[1].dataZoomId == "\x00_ec_\x00toolbox-dataZoom_yAxis0" ) {
      if (
        event.batch[0].startValue &&
        event.batch[0].endValue &&
        event.batch[1].startValue &&
        event.batch[1].endValue
      ) {
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 0,
          startValue: event.batch[0].startValue,
          endValue: event.batch[0].endValue,
        });
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 1,
          startValue: event.batch[1].startValue,
          endValue: event.batch[1].endValue,
        });
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 2,
          startValue: event.batch[1].startValue,
          endValue: event.batch[1].endValue,
        });
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 3,
          startValue: event.batch[0].startValue,
          endValue: event.batch[0].endValue,
        });
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 4,
          startValue: event.batch[1].startValue,
          endValue: event.batch[1].endValue,
        });
      } else {
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 0,
          start: event.batch[0].start,
          end: event.batch[0].end,
        });
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 1,
          start: event.batch[1].start,
          end: event.batch[1].end,
        });
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 2,
          start: event.batch[1].start,
          end: event.batch[1].end,
        });
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 3,
          start: event.batch[0].start,
          end: event.batch[0].end,
        });
        CHART.dispatchAction({
          type: "dataZoom",
          dataZoomIndex: 4,
          start: event.batch[1].start,
          end: event.batch[1].end,
        });
      }
    }
  });
  CHART.on("datarangeselected", (event) => {
    if (event.visualMapId === "\u0000series\u00000\u00000") {
      CHART.dispatchAction({
        type: "selectDataRange",
        visualMapIndex: 0,
        selected: [
          Math.max(...[event.selected[0], CHART_OPTION.visualMap[0].range[0]]),
          event.selected[1],
        ],
      });
    }
  });
};

function updateChart(proteinAcc) {
  selectedAcc = proteinAcc;
  CHART_OPTION.series = [
    CHART_OPTION.series[0],
    CHART_OPTION.series[1],
    CHART_OPTION.series[2],
    CHART_OPTION.series[3],
    CHART_OPTION.series[4],
  ];
  CHART_OPTION.series[0].data = [];
  CHART_OPTION.series[1].data = [];
  CHART_OPTION.series[2].data = [];
  CHART_OPTION.series[3].data = [];
  CHART_OPTION.series[4].data = [];
  CHART_OPTION.xAxis[0].data = [];
  CHART_OPTION.yAxis[0].data = [];
  CHART_OPTION.xAxis[1].data = [];
  CHART_OPTION.yAxis[1].data = [];
  CHART_OPTION.yAxis[1].max = 0;
  CHART_OPTION.xAxis[2].data = [];
  CHART_OPTION.xAxis[2].max = 0;
  CHART_OPTION.yAxis[2].data = [];
  CHART_OPTION.xAxis[3].data = [];
  CHART_OPTION.yAxis[3].data = [];
  CHART_OPTION.xAxis[4].data = [];
  CHART_OPTION.yAxis[5].data = [];
  CHART_OPTION.visualMap[0].max = 1;

  CHART_OPTION.yAxis[3].splitArea.areaStyle.color = [];
  PTMCounts = {};
  PTMBarsTopJoint = {
    name: "PTMBarsTopJoint",
    type: "bar",
    xAxisIndex: 1,
    yAxisIndex: 1,
    data: [],
    itemStyle: {
      color: "#89BD9E",
    },
    large: false,
    emphasis: {
      disabled: true,
    },
    stack: "stackTop",
    sampling: "average",
    animation: false,
    silent: true,
  };
  PTMBarsTopUnique = {
    name: "PTMBarsTopUnique",
    type: "bar",
    xAxisIndex: 1,
    yAxisIndex: 1,
    data: [],
    itemStyle: {
      color: "#08519c",
    },
    large: false,
    emphasis: {
      disabled: true,
    },
    stack: "stackTop",
    sampling: "average",
    animation: false,
    silent: true,
  };
  PTMBarsRightJoint = {
    name: "PTMBarsRightJoint",
    type: "bar",
    xAxisIndex: 2,
    yAxisIndex: 2,
    data: [],
    itemStyle: {
      color: "black",
    },
    large: false,
    emphasis: {
      disabled: true,
    },
    stack: "stackRight",
    sampling: "average",
    animation: false,
    silent: true,
  };
  PTMBarsRightUnique = {
    name: "PTMBarsRightUnique",
    type: "bar",
    xAxisIndex: 2,
    yAxisIndex: 2,
    data: [],
    itemStyle: {
      color: "black",
    },
    large: false,
    emphasis: {
      disabled: true,
    },
    stack: "stackRight",
    sampling: "average",
    animation: false,
    silent: true,
  };
  for (let residue in DATA[proteinAcc].residues) {
    DATA[proteinAcc].residues[residue].ptm.forEach((ptm) => {
      let ptmKey = ptm.split("]")[1];
      PTMCounts[ptmKey] = [];
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
    let residuePTMCounts = {};
    DATA[proteinAcc].residues[residue].ptm.forEach((ptm) => {
      let ptmKey = ptm.split("]")[1];
      if (residuePTMCounts[ptmKey]) {
        residuePTMCounts[ptmKey]++;
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
    CHART_OPTION.series[3].data.push([
      residueNumber - 1,
      0,
      STRUCTURE_ENCODING[DATA[proteinAcc].residues[residue].structureInformation.structure_group],
    ]);
    CHART_OPTION.series[4].data.push([
      0,
      residueNumber - 1,
      STRUCTURE_ENCODING[DATA[proteinAcc].residues[residue].structureInformation.structure_group],
    ]);
    CHART_OPTION.yAxis[3].splitArea.areaStyle.color.push(
      STRUCTURE_COLOR_ENCODING[
        STRUCTURE_ENCODING[DATA[proteinAcc].residues[residue].structureInformation.structure_group]
      ].replace(", 1.0)", ", 0.1)")
    );
    let pairResidues;
    if (PTM_MAP_CONTACT_RESTRICTION) {
      pairResidues = DATA[proteinAcc].residues[residue].contacts;
    } else {
      pairResidues = Object.keys(DATA[proteinAcc].residues);
    }
    let uniquePTMs = new Set(DATA[proteinAcc].residues[residue].ptm);
    let noJointPTMs = 0;
    for (let pairResidue of pairResidues) {
      let pairResidueNumber = parseInt(pairResidue.split("@")[1]);
      let pairResiduePTM = DATA[proteinAcc].residues[pairResidue].ptm;
      pairResiduePTM.forEach((ptm) => {
        if (uniquePTMs.has(ptm)) {
          noJointPTMs += 1;
          uniquePTMs.delete(ptm);
        }
      });
      if (residuePTM.length > 0 && pairResiduePTM.length > 0 && residueNumber > pairResidueNumber) {
        let PTMSimilarity = computePTMSimilarity(residuePTM, pairResiduePTM);
        CHART_OPTION.series[0].data.push([residueNumber - 1, pairResidueNumber - 1, PTMSimilarity]);
      } else if (
        residueNumber < pairResidueNumber &&
        DATA[proteinAcc].residues[residue].contacts.includes(pairResidue)
      ) {
        CHART_OPTION.series[1].data.push([residueNumber - 1, pairResidueNumber - 1, 0]);
      }
    }
    let barHeight = noJointPTMs + uniquePTMs.size;
    if ( barHeight > CHART_OPTION.xAxis[ 2 ].max  ) {
      console.log( residue + " " + barHeight );
      CHART_OPTION.xAxis[ 2 ].max = barHeight;
    }
    if ( barHeight > CHART_OPTION.yAxis[ 1 ].max ) {
      CHART_OPTION.yAxis[ 1 ].max = barHeight;
    }
    PTMBarsTopJoint.data.push(noJointPTMs);
    PTMBarsTopUnique.data.push(uniquePTMs.size);
    PTMBarsRightJoint.data.push(noJointPTMs);
    PTMBarsRightUnique.data.push(uniquePTMs.size);
  }
  CHART_OPTION.series.push(PTMBarsTopJoint);
  CHART_OPTION.series.push(PTMBarsTopUnique);
  CHART_OPTION.series.push(PTMBarsRightJoint);
  CHART_OPTION.series.push(PTMBarsRightUnique);
  let PTMNames = Object.keys(PTMCounts);
  /*
  // Sorts PTMs by number of occurences:
  PTMNames.sort( ( ptm1, ptm2 ) => {
    let ptm1Sum = PTMCounts[ ptm1 ].reduce( ( a, c ) => a + c );
    let ptm2Sum = PTMCounts[ ptm2 ].reduce( ( a, c ) => a + c );
    return ptm2Sum - ptm1Sum;
  } );
  */
  PTMNames.sort();
  CHART_OPTION.xAxis[3].data = PTMNames;
  CHART_OPTION.xAxis[3].axisLabel.interval = Math.round(CHART_OPTION.xAxis[3].data.length / 20);
  for (
    let residueIndex = 0;
    residueIndex < Object.keys(DATA[proteinAcc].residues).length;
    residueIndex++
  ) {
    for (let PTMIndex = 0; PTMIndex < PTMNames.length; PTMIndex++) {
      let PTMCount = PTMCounts[PTMNames[PTMIndex]][residueIndex];
      if (PTMCount > 0) {
        CHART_OPTION.series[2].data.push([PTMIndex, residueIndex, PTMCount]);
      }
    }
  }
  CHART.setOption(CHART_OPTION, { replaceMerge: ["series"] });
}

var computePTMSimilarity = (riPTM, rjPTM) => {
  let intersectionSize = computePTMIntersection(riPTM, rjPTM);
  let unionSize = computePTMUnion(riPTM, rjPTM);
  let similarity = intersectionSize / unionSize;
  if (similarity != 0 && similarity < CHART_OPTION.visualMap[0].range[0]) {
    CHART_OPTION.visualMap[0].range = [similarity, 1];
  }
  return similarity;
};

function computePTMIntersection(riPTM, rjPTM) {
  let intersection = riPTM.filter((v) => rjPTM.includes(v));
  return intersection.length;
}

function computePTMUnion(riPTM, rjPTM) {
  let union = [...new Set([...riPTM, ...rjPTM])];
  return union.length;
}

function toggleStackedBar(zoomFactorX, zoomFactorY) {
  CHART_OPTION.series = CHART_OPTION.series.splice(0, 3);
  if (zoomFactorX !== -1 && zoomFactorX <= 0) {
    for (let ptm of Object.keys(PTMCounts)) {
      CHART_OPTION.series.push({
        name: "PTMStackedBarTop_" + ptm,
        type: "bar",
        stack: "total",
        data: PTMCounts[ptm],
        xAxisIndex: 1,
        yAxisIndex: 1,
        large: false,
      });
    }
    CHART.setOption(CHART_OPTION, { replaceMerge: ["series"] });
  } else {
    CHART_OPTION.series.push(PTMBarsTopUnique);
    CHART.setOption(CHART_OPTION, { replaceMerge: ["series"] });
  }
  if (zoomFactorY !== -1 && zoomFactorY <= 0) {
    for (let ptm of Object.keys(PTMCounts)) {
      CHART_OPTION.series.push({
        name: "PTMStackedBarRight_" + ptm,
        type: "bar",
        stack: "total",
        data: PTMCounts[ptm],
        xAxisIndex: 2,
        yAxisIndex: 2,
        large: false,
      });
    }
    CHART.setOption(CHART_OPTION, { replaceMerge: ["series"] });
  } else {
    CHART_OPTION.series.push(PTMBarsRightUnique);
    CHART.setOption(CHART_OPTION, { replaceMerge: ["series"] });
  }
}
