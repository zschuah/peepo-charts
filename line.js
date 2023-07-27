var chart;
var data;
var options;
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  data = google.visualization.arrayToDataTable([
    ["Year", "Stock Price"],
    ["2004", 1000],
    ["2005", 1170],
    ["2006", 660],
    ["2007", 1030],
  ]);
  options = {
    title: "Company Performance",
    // curveType: "function",
    legend: { position: "bottom" },
    // hAxis: {
    //   title: "Year",
    // },
    vAxis: {
      title: "SGD(S$)",
    },
  };
  chart = new google.visualization.LineChart(
    document.getElementById("curve_chart")
  );
  chart.draw(data, options);
}

//VUE STARTS HERE
const app = Vue.createApp({
  data() {
    return {
      algoArray: [],
      sortedAlgoArray: [],
      startPrice: 42,
      oldPrice: 0,
      year: 2001,
      volatility: 0.02,
      //stable stock volatility is 0.02
      //unstable stock volatility is 0.1
      currentPrice: 0,
      high: 0,
      highYear: 2000,
      low: 0,
      lowYear: 2000,

      windowHeight: "500px",
      insertFlag: false,

      dataInterval: "",
      playFlag: true,
    };
  },
  computed: {
    oldPriceRounded() {
      return Math.round(this.oldPrice * 1000) / 1000;
    },
    highRounded() {
      return Math.round(this.high * 1000) / 1000;
    },
    lowRounded() {
      return Math.round(this.low * 1000) / 1000;
    },
  },
  methods: {
    resetChart() {
      this.insertFlag = true;
      this.algoArray = [];
      this.oldPrice = this.startPrice;
      this.year = 2001;
      this.high = 0;
      this.highYear = 2000;
      this.low = 0;
      this.lowYear = 2000;
      data = google.visualization.arrayToDataTable([
        ["Year", "Stock Price"],
        [2000, this.oldPrice],
      ]);
      chart.draw(data, options);
    },
    populateChart(num) {
      this.resetChart();

      for (let i = 0; i < num; i++) {
        let newPrice = this.runStockAlgo(this.oldPrice);
        this.algoArray.push([this.year, newPrice]);
        this.currentPrice = newPrice;

        this.oldPrice = newPrice;
        this.year++;
      }
      // console.log(this.algoArray.length);
      this.sortAlgoArray();

      //insert data
      // data.insertRows(1, [
      //   ["2001", 43],
      //   ["2002", 45],
      //   ["2003", 49],
      // ]);
      data.insertRows(1, this.algoArray);
      chart.draw(data, options);
    },
    runStockAlgo(oldPrice) {
      let rnd = Math.random(); // generate number, 0 <= x < 1.0
      let changePercent = 2 * this.volatility * rnd;
      if (changePercent > this.volatility) {
        changePercent = changePercent - 2 * this.volatility;
      }
      let changeAmount = oldPrice * changePercent;
      let newPrice = oldPrice + changeAmount;

      return newPrice;
    },
    sortAlgoArray() {
      this.sortedAlgoArray = this.algoArray.slice();
      this.sortedAlgoArray.sort((a, b) => {
        return b[1] - a[1];
      });
      this.high = this.sortedAlgoArray[0][1];
      this.highYear = this.sortedAlgoArray[0][0];
      this.low = this.sortedAlgoArray[this.sortedAlgoArray.length - 1][1];
      this.lowYear = this.sortedAlgoArray[this.sortedAlgoArray.length - 1][0];
    },
    insertData() {
      let newPrice = this.runStockAlgo(this.oldPrice);
      this.currentPrice = newPrice;

      // console.log([this.year, newPrice]);
      data.addRow([this.year, newPrice]);
      this.algoArray.push([this.year, newPrice]);

      this.oldPrice = newPrice;
      this.year++;
      this.sortAlgoArray();

      chart.draw(data, options);
    },
    playData() {
      this.playFlag = false;
      console.log("PLAY clicked");
      this.dataInterval = setInterval(() => {
        this.insertData();
      }, 200);
    },
    stopData() {
      this.playFlag = true;
      console.log("STOP clicked");
      clearInterval(this.dataInterval);
    },
  },
  mounted() {
    console.log("App mounted!");

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
      if (e.key == "ArrowRight") {
        this.insertData();
      }
      if (e.key == "ArrowUp") {
        e.preventDefault();
        this.volatility = 0.02;
      }
      if (e.key == "ArrowDown") {
        e.preventDefault();
        this.volatility = 0.1;
      }
      if (e.key == "r") {
        this.resetChart();
      }
      if (e.key == "q") {
        this.populateChart(20);
      }
      if (e.key == "w") {
        this.populateChart(50);
      }
      if (e.key == "e") {
        this.populateChart(100);
      }
    });
  },
});
app.mount("#vue-mount");
