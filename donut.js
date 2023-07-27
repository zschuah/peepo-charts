var chart;
var data;
var options;
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  data = google.visualization.arrayToDataTable([
    ["Equity", "Amount"],
    ["Apple", 11],
    ["Tesla", 7],
    ["Nio", 8],
    ["Intel", 2],
    ["AMD", 2],
  ]);
  options = {
    title: "Equities Owned",
    pieHole: 0.4,
  };
  chart = new google.visualization.PieChart(
    document.getElementById("donutchart")
  );
  chart.draw(data, options);
}

const app = Vue.createApp({
  data() {
    return {
      legendValue: "right",
      windowHeight: "500px",
      randomArray: [],
    };
  },
  methods: {
    resetChart() {
      let myArray = [
        ["Equity", "Amount"],
        ["Apple", this.generateRandomNum()],
        ["Tesla", this.generateRandomNum()],
        ["Nio", this.generateRandomNum()],
        ["Intel", this.generateRandomNum()],
        ["AMD", this.generateRandomNum()],
      ];
      myArray.sort((a, b) => {
        return b[1] - a[1];
      });

      data = google.visualization.arrayToDataTable(myArray);
      chart.draw(data, options);
    },
    generateRandomNum() {
      return Math.floor(Math.random() * 1000) + 1;
    },
  },
  watch: {
    legendValue(newValue, OldValue) {
      options = {
        title: "Equities Owned",
        pieHole: 0.4,
        legend: {
          position: newValue,
        },
      };
      chart.draw(data, options);
    },
  },
  mounted() {
    console.log("Donut app mounted!");

    //draw responsive charts
    if (window.innerWidth < 575) {
      this.windowHeight = "200px";
    }
    //REdraw responsive charts
    window.onresize = redrawChart;
    that = this;
    function redrawChart() {
      if (window.innerWidth < 575) {
        that.windowHeight = "200px";
      } else {
        that.windowHeight = "500px";
      }
      chart.draw(data, options);
    }

    window.addEventListener("keydown", (e) => {
      if (e.key == "r") {
        this.resetChart();
      }
    });
  },
});
app.mount("#vue-donut");
