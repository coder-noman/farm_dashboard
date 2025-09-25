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
// let fan_arr = [10, 20, 30, 40, 20];
// let fan_arr = [0, 0, 0, 0, 0];
let fan_arr = [0, 10, 0, 20, 0];

// Chart array and variable Declare
let ammonia = [10, 7, 30];
let ph = [10, 20, 5];

let barChart1;
let barChart2;

// Default Data Show Start
updateAllData(10, 20, 30, 40, 50, 60);
updateBarChart1();
updateBarChart2() 
fanDataShow();
// Default Data Show end
// Hams_HO::::GD,235,235,0,0.0,0.0,0,1,1,1,1,1,192.168.0.87,Gra,45,4.2,1,1,0

//.........websocket_client code Start..............
// var socket = new WebSocket("ws://27.147.170.162:81");
var socket = new WebSocket("ws://27.147.170.162:8");
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
  const fanIcon = ["fan1-icon", "fan2-icon", "fan3-icon", "fan4-icon", "fan5-icon"];
  const fanDisplayId = ["fan1-d", "fan2-d", "fan3-d", "fan4-d", "fan5-d"];
  const fanCardData = ["Fan1", "Fan2", "Fan3", "Fan4", "Fan5"];
  // ipdu 1 Data show
  for (i = 0; i <= 4; i++) {
    if (fan_arr[i] >= 1) {
      fanOnShowData(fanId[i], fanDisplayId[i], fan_arr[i],fanIcon[i]);
    } else {
      fanOffShowData(fanId[i], fanCardData[i],fanIcon[i]);
    }
  }
}

//Psu On Show Data Funtion
function fanOnShowData(fan_Id, fan_d_id, fan_value,fan_icon) {
  document.getElementById(fan_Id).innerText = "ON";
  document.getElementById(fan_Id).classList.add("on-btn");
  document.getElementById(fan_icon).classList.add("active-fan");
  document.getElementById(fan_d_id).innerText = `${fan_value} VA`;
  document.getElementById(fan_d_id).classList.add("show-btn");
}
//Psu Off Show Data Funtion
function fanOffShowData(fan_Id, fanCardData,fan_icon) {
  document.getElementById(fan_Id).innerText = "OFF";
  document.getElementById(fan_Id).classList.add("off-btn");
  document.getElementById(fan_icon).classList.remove("active-fan");
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
  console.log(a,b,c,d,e,f)
  // Input Voltage (0-300V)
  const temperature1 = a;
  updateGauge("temperature1", temperature1, {
    green: [0, 25],
    orange: [26, 31],
    red: [32, 55],
    max: 55,
  });

 if (temperature1 >= 26 && temperature1 <= 31) {
    gaugeAlert("Temperature-1", "high");
  } else if (temperature1 >= 32 && temperature1 <= 55) {
    gaugeAlert("Temperature-1", "very high");
  }

  // UPS1 Output Voltage (0-300V)
  const temperature2 = b;
  updateGauge("temperature2", temperature2, {
    green: [0, 25],
    orange: [26, 31],
    red: [32, 55],
    max: 55,
  });

  // Alert for Ups1
 if (temperature2 >= 26 && temperature2 <= 31) {
    gaugeAlert("Temperature-2", "high");
  } else if (temperature2 >= 32 && temperature2 <= 55) {
    gaugeAlert("Temperature-2", "very high");
  }

  // UPS2 Output Voltage (0-300V)
  const temperature3 = c;
  updateGauge("temperature3", temperature3, {
    green: [0, 25],
    orange: [26, 31],
    red: [32, 55],
    max: 55,
  });

  // Alert for Ups2
 if (temperature3 >= 26 && temperature3 <= 31) {
    gaugeAlert("Temperature-3", "high");
  } else if (temperature3 >= 32 && temperature3 <= 55) {
    gaugeAlert("Temperature-3", "very high");
  }

  // Battery Voltage (0-60V)
  const temperature4 = d;
  updateGauge("temperature4", temperature4, {
    green: [0, 25],
    orange: [26, 31],
    red: [32, 55],
    max: 55,
  });

  // Alert for Battery Voltage
 if (temperature4 >= 26 && temperature4 <= 31) {
    gaugeAlert("Temperature-4", "high");
  } else if (temperature4 >= 32 && temperature4 <= 55) {
    gaugeAlert("Temperature-4", "very high");
  }

  // Temperature (0-55°C)
  const humidity1 = e;
  updateGauge("humidity1", humidity1, {
    green: [41, 80],
    orange: [81, 100],
    red: [0, 40],
    max: 100,
  });

  // Alert for humidity1
  if (humidity1 >= 0 && humidity1 <= 40) {
    gaugeAlert("humidity 1", "low");
  } else if (humidity1 >= 81 && humidity1 <= 100) {
    gaugeAlert("humidity 1", "high");
  }

  // humidity1 (0-100%)
  const humidity2 = f;
  updateGauge("humidity2", humidity2, {
    green: [41, 80],
    orange: [81, 100],
    red: [0, 40],
    max: 100,
  });

  // Alert for humidity1
  if (humidity2 >= 0 && humidity2 <= 40) {
    gaugeAlert("humidity 2", "low");
  } else if (humidity2 >= 81 && humidity2 <= 100) {
    gaugeAlert("humidity 2", "high");
  }
}
// gauge data end

// Chart data start
let color = "white";

// Initialize charts on page load
function initializeCharts() {
  // Amonia Chart (Bar Chart)
  const amoniaChart = document.getElementById("amonia-chart").getContext("2d");
  barChart1 = new Chart(amoniaChart, {
    type: "bar",
    data: {
      labels: ["A1", "A2", "A3"],
      datasets: [
        {
          label: "Load (VA)",
          data: ammonia,
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
  // PH Chart (Bar Chart)
  const phChart = document.getElementById("ph-chart").getContext("2d");
  barChart2 = new Chart(phChart, {
    type: "bar",
    data: {
      labels: ["Ph1", "Ph2", "Ph3"],
      datasets: [
        {
          label: "Load (VA)",
          data: ph,
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

// update Bar chart 1
function updateBarChart1() {
  // Update chart
  if (barChart1) {
    barChart1.data.datasets[0].data = ammonia;
    barChart1.update("none");
  }
}
// update Bar chart 2
function updateBarChart2() {
  // Update chart
  if (barChart2) {
    barChart2.data.datasets[0].data = ph;
    barChart2.update("none");
  }
}
// Chart data end
