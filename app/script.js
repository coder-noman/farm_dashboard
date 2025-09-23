//Handle Logout Button Start
const role = sessionStorage.getItem("userRole");

if (window.location.pathname.includes("./app/index.html") && role !== "admin") {
  window.location.href = "../registration.html";
}

if (
  window.location.pathname.includes("./app/client.html") &&
  role !== "rakesh"
) {
  window.location.href = "../registration.html";
}

const logoutBtn = document.getElementById("log-out");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem("userRole");
    window.location.href = "../registration.html";
  });
}

//Handle Logout Button End

//Declare psu array and variable
let fan_arr = [0, 0, 0, 0, 0, 0, 0, 0];

// Chart array and variable Declare
let temp = [0, 0, 0, 0, 0, 0, 0, 0];
let hum = [0, 0, 0, 0, 0, 0, 0, 0];

let barChart;
let lineChart;

// Default Data Show Start
updateAllData(0, 0, 0, 0, 0, 0);
updateBarChart();
fanDataShow();
// Default Data Show end

//.........websocket_client code Start..............
var socket = new WebSocket("ws://27.147.170.162:81");
socket.onmessage = function (event) {
  const data = event.data.split(":");
  const data_catagory = data[0] || "";
  const msg = data[1] || "";

  // checking data is coming or not start
  if (data_catagory == "Hams_HO") {
    // dataReceived = true;
    // clearTimeout(timeout);
  } else {
    return;
  }
  clearAllData();

  console.log(data[1]);
  console.log(data[2]);
  console.log(data[3]);
  console.log(data[4]);

  var splited_data = data[4].split(",");

  // Main Gauge
  updateAllData(
    splited_data[1],
    splited_data[2],
    splited_data[3],
    splited_data[4],
    splited_data[5],
    splited_data[6]
  );

  // Line chart Data
  updateLineChart(splited_data[5], splited_data[6]);

  // Device Inforfation
  deviceInformation(
    splited_data[12],
    splited_data[13],
    splited_data[14],
    splited_data[15],
    splited_data[16],
    splited_data[17],
    splited_data[18]
  );

  // power supply unit
  psuDataInsert(data[1], data[2], data[3]);
};
//.........websocket_client code end..............

// Psu data start
function psuDataInsert(x, y, z) {
  // fan Data Insert
  if (x != "") {
    var fan_data = x.split(",");
    for (i = 2, k = 0; i <= 9; i++, k++) {
      fan_arr[k] = parseInt(fan_data[i]);
    }
  }
  fanDataShow();
}
function fanDataShow() {
  const fanId = ["fan1", "fan2", "fan3", "fan4", "fan5"];
  const fanDisplayId = ["fan1-d", "fan2-d", "fan3-d", "fan4-d", "fan5-d"];
  const fanCardData = ["Fan1", "Fan2", "Fan3", "Fan4", "Fan5"];
  // ipdu 1 Data show
  for (i = 0, j = 0; i <= 7; i++, j++) {
    if (fan_arr[i] >= 1) {
      fanOnShowData(fanId[j], fanDisplayId[j], fan_arr[i]);
    } else {
      fanOffShowData(fanId[j], fanCardData[j]);
    }
  }
}

//Psu On Show Data Funtion
function fanOnShowData(fan_Id, fan_d_id, fan_value) {
  document.getElementById(fan_Id).innerText = "ON";
  document.getElementById(fan_Id).classList.add("on-btn");
  document.getElementById(fan_d_id).innerText = `${fan_value} VA`;
  document.getElementById(fan_d_id).classList.add("show-btn");
}
//Psu Off Show Data Funtion
function fanOffShowData(fan_Id, fanCardData) {
  document.getElementById(fan_Id).innerText = "OFF";
  document.getElementById(fan_Id).classList.add("off-btn");
  let ul = document.getElementById("alert-list");
  let li = document.createElement("li");
  li.classList.add("alert-list-card");
  li.textContent = `${fanCardData} Failed.`;
  ul.appendChild(li);
}
// Psu data end

//Gauge alert start
function gaugeAlert(data, status) {
  let ul = document.getElementById("alert-list");
  let li = document.createElement("li");
  li.classList.add("alert-list-card");
  li.textContent = `${data} is ${status}.`;
  ul.appendChild(li);
}

//Gauge alert end

// device Information start
function deviceInformation(lan, gsmOp, gsmSig, ib, psu1, psu2, ds) {
  const lanIp = document.getElementById("device-lan");
  const gsmOperator = document.getElementById("gsm-operator");
  const gsmSignal = document.getElementById("gsm-signal");
  const internalBattery = document.getElementById("internal-battery");
  const devicePsu1 = document.getElementById("device-psu1");
  const devicePsu2 = document.getElementById("device-psu2");
  const dataSource = document.getElementById("data-source");

  // Lan IP
  lanIp.innerHTML = `: ${lan}`;

  // Gsm Operator
  gsmOperator.innerText = `: ${gsmOp}`;

  // if(gsmOp == 0){
  //   gsmOperator.innerText = ': Not Found';
  // }else if(gsmOp == 1){
  //   gsmOperator.innerText = ': GP';
  // }else if(gsmOp == 2){
  //   gsmOperator.innerText = ': Robi';
  // }else if(gsmOp == 3){
  //   gsmOperator.innerText = ': Banglalink';
  // }else if(gsmOp == 4){
  //   gsmOperator.innerText = ': Airtel';
  // }else if(gsmOp == 5){
  //   gsmOperator.innerText = ': Teletalk';
  // }

  // Gsm Signal
  gsmSignal.innerText = `: ${gsmSig} %`;

  // Internal Battery
  internalBattery.innerText = `: ${ib} V`;

  // Psu Stutus 1
  if (psu1 == 1) {
    devicePsu1.innerText = `: OK`;
  } else {
    devicePsu1.innerText = `: Failed`;
  }

  // Psu Stutus 2
  if (psu2 == 1) {
    devicePsu2.innerText = `: OK`;
  } else {
    devicePsu2.innerText = `: Failed`;
  }

  // Data Source
  if (ds == 0) {
    dataSource.innerText = `: LAN`;
  } else if (ds == 1) {
    dataSource.innerText = `: WIFI`;
  } else if (ds == 2) {
    dataSource.innerText = `: GPRS`;
  }
}
// device Information end

// clear all data function start
function clearAllData() {
  document.getElementById("alert-list").innerHTML = "";

  const fanId = ["fan1", "fan2", "fan3", "fan4", "fan5"];
  const fanDisplayId = ["fan1-d", "fan2-d", "fan3-d", "fan4-d", "fan5-d"];

  for (let j = 0; j < fanId.length; j++) {
    const fanElement = document.getElementById(fanId[j]);
    const fanDisplayElem = document.getElementById(fanDisplayId[j]);

    if (fanElement) {
      fanElement.innerText = "";
      fanElement.className = "";
    }
    if (fanDisplayElem) {
      fanDisplayElem.innerText = "";
      fanDisplayElem.className = "";
    }
  }
}
// clear all data function end

// gauge data start
//getting color
function getColor(value, ranges) {
  if (value >= ranges.green[0] && value <= ranges.green[1]) {
    return "#4ECDC4"; // Green
  } else if (value >= ranges.orange[0] && value <= ranges.orange[1]) {
    return "#FE9B13"; // Orange
  } else {
    return "#FC5C65"; // Red
  }
}

// get status
function getStatus(value, ranges) {
  if (value >= ranges.green[0] && value <= ranges.green[1]) {
    return { text: "Normal", class: "status-normal" };
  } else if (value >= ranges.orange[0] && value <= ranges.orange[1]) {
    return { text: "Warning", class: "status-warning" };
  } else {
    return { text: "Danger", class: "status-danger" };
  }
}

// update circular gauge
function updateGauge(elementId, value, ranges) {
  const fillElement = document.getElementById(`${elementId}-fill`);
  const valueElement = document.getElementById(`${elementId}-value`);
  const statusElement = document.getElementById(`${elementId}-status`);

  // Calculate rotation based on value (0 to 360 degrees for 0 to max value)
  const rotation = (value / ranges.max) * 360;

  // Get color and status
  const color = getColor(value, ranges);
  const status = getStatus(value, ranges);

  // Update gauge fill
  fillElement.style.background = `conic-gradient(${color} 0deg ${rotation}deg, transparent ${rotation}deg 360deg)`;
  fillElement.style.color = color;

  // Update value (keep the unit span)
  const unit = valueElement.querySelector(".gauge-unit")?.textContent || "";
  valueElement.innerHTML = `${value} <span class="gauge-unit">${unit}</span>`;

  // Update status
  statusElement.textContent = status.text;
  statusElement.className = `status ${status.class}`;

  // Add pulse animation for warning and danger statuses
  if (status.class !== "status-normal") {
    statusElement.classList.add("pulse");
  } else {
    statusElement.classList.remove("pulse");
  }
}

//update all gauge data
function updateAllData(a, b, c, d, e, f) {
  // Input Voltage (0-300V)
  const inputVoltage = a;
  updateGauge("input-voltage", inputVoltage, {
    green: [191, 245],
    orange: [0, 190],
    red: [246, 300],
    max: 300,
  });

  // Alert for inputVoltage
  if (inputVoltage >= 0 && inputVoltage <= 190) {
    gaugeAlert("Input Voltage", "low");
  } else if (inputVoltage >= 246 && inputVoltage <= 300) {
    gaugeAlert("Input Voltage", "high");
  }

  // UPS1 Output Voltage (0-300V)
  const ups1Voltage = b;
  updateGauge("ups1-voltage", ups1Voltage, {
    green: [211, 230],
    orange: [0, 210],
    red: [231, 300],
    max: 300,
  });

  // Alert for Ups1
  if (ups1Voltage >= 0 && ups1Voltage <= 210) {
    gaugeAlert("UPS1 Voltage", "low");
  } else if (ups1Voltage >= 231 && ups1Voltage <= 300) {
    gaugeAlert("UPS1 Voltage", "high");
  }

  // UPS2 Output Voltage (0-300V)
  const ups2Voltage = c;
  updateGauge("ups2-voltage", ups2Voltage, {
    green: [211, 230],
    orange: [0, 210],
    red: [231, 300],
    max: 300,
  });

  // Alert for Ups2
  if (ups2Voltage >= 0 && ups2Voltage <= 210) {
    gaugeAlert("UPS2 Voltage", "low");
  } else if (ups2Voltage >= 231 && ups2Voltage <= 300) {
    gaugeAlert("UPS2 Voltage", "high");
  }

  // Battery Voltage (0-60V)
  const batteryVoltage = d;
  updateGauge("battery-voltage", batteryVoltage, {
    green: [241, 280],
    orange: [221, 240],
    red: [0, 220],
    max: 280,
  });

  // Alert for Battery Voltage
  if (batteryVoltage >= 221 && batteryVoltage <= 240) {
    gaugeAlert("Battery Voltage", "low");
  } else if (batteryVoltage >= 0 && batteryVoltage <= 220) {
    gaugeAlert("Battery Voltage", "very Low");
  }

  // Temperature (0-55°C)
  const temperature = e;
  updateGauge("temperature", temperature, {
    green: [0, 25],
    orange: [26, 31],
    red: [32, 55],
    max: 55,
  });

  // Alert for Temperature
  if (temperature >= 26 && temperature <= 31) {
    gaugeAlert("Temperature", "high");
  } else if (temperature >= 32 && temperature <= 55) {
    gaugeAlert("Temperature", "very high");
  }

  // Humidity (0-100%)
  const humidity = f;
  updateGauge("humidity", humidity, {
    green: [41, 80],
    orange: [81, 100],
    red: [0, 40],
    max: 100,
  });

  // Alert for Humidity
  if (humidity >= 0 && humidity <= 40) {
    gaugeAlert("Humidity", "low");
  } else if (humidity >= 81 && humidity <= 100) {
    gaugeAlert("Humidity", "high");
  }
}
// gauge data end

// Chart data start
let color = "white";

// Initialize charts on page load
function initializeCharts() {
  // Voltage Chart (Bar Chart)
  const voltageCtx = document.getElementById("voltage-chart").getContext("2d");
  barChart = new Chart(voltageCtx, {
    type: "bar",
    data: {
      labels: ["Ipdu1", "Ipdu2", "Ipdu3"],
      datasets: [
        {
          label: "Load (VA)",
          data: ipduSum_arr,
          backgroundColor: [
            "rgba(78, 205, 196, 0.7)",
            "#fc5c6491",
            "#3a67d1af",
          ],
          borderRadius: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(160, 174, 192, 0.1)",
          },
          ticks: {
            color: `${color}`,
            font: {
              size: 12,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: `${color}`,
            font: {
              size: 12,
            },
          },
        },
      },
    },
  });
}

// Initialize charts when the page loads
window.addEventListener("load", initializeCharts);

// update Bar chart
function updateBarChart() {
  console.log("ipduSum_arr update= ", ipduSum_arr);
  // Update chart
  if (barChart) {
    barChart.data.datasets[0].data = ipduSum_arr;
    barChart.update("none");
  }
}
// Chart data end
