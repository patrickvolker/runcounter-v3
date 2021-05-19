//bring in DOM elements
const title = document.getElementById('title');
const bigTotal = document.getElementById('bigTotal');
const userMiles = document.getElementById('userMiles');
const submit = document.getElementById('submit');
const lastRun = document.getElementById('lastRun');
const milesRemaining = document.getElementById('milesRemaining');
const reqDailyAvgDiv = document.getElementById('reqDailyAvgDiv');
const reqDailyAvg = document.getElementById('reqDailyAvg');
const icon = document.getElementById('icon');
const message = document.getElementById('message');
const lastRunDiv = document.getElementById('lastRunDiv');
const milesRemainingDiv = document.getElementById('milesRemainingDiv');
const progressBar = document.getElementById('progressBar');
const percentageDiv = document.getElementById('percentageDiv');

//font awesome
const runIcon = `fas fa-running mx-2`;
const heartIcon = `far fa-heart mx-2`;
message.innerHTML = 'submit';

//datedif
let today = new Date();
let from_date = new Date('2021/12/31');
let difference = from_date > today ? from_date - today : today - from_date;
let datedif = Math.floor(difference / (1000 * 3600 * 24));

// api FETCH all stats
fetch('https://runcounter-v3.herokuapp.com/stats')
  .then((response) => response.json())
  .then(function (json) {
    // get the value out of the JSON
    let lastID = json[json.length - 1];
    let run_length = userMiles.value;
    let runTotal = parseFloat(json[0]['SUM(run_length)']).toFixed(2);
    console.log(runTotal);
    let run_date = Date();
    let stats = json;
    let getStats = function (stats) {
      console.log(stats);
    };
    getStats(stats);
  });

// api FETCH run_total
fetch('https://runcounter-v3.herokuapp.com/stats/run_total')
  .then((response) => response.json())
  .then(function (json) {
    // get the value out of the JSON
    let runTotal = json[0]['SUM(run_length)'];
    console.log(runTotal);
    //push stats into DOM
    //set total
    let setTotal = function (runTotal) {
      bigTotal.innerHTML = runTotal;
    };
    setTotal(runTotal);
    //set milesRemaining
    let setMilesRemaining = function (runTotal) {
      milesRemaining.innerHTML = 2000 - runTotal;
      milesRemainingDiv.classList.remove('hidden');
    };
    setMilesRemaining(runTotal);
    //set reqDailyAvg
    let setReqDailyAvg = function (runTotal, datedif) {
      let reqDaily = (2000 - runTotal) / datedif;
      let roundDown = reqDaily.toFixed(2);
      reqDailyAvg.innerHTML = roundDown;
      reqDailyAvgDiv.classList.remove('hidden');
    };
    setReqDailyAvg(runTotal, datedif);
    let setPercentage = function (bigTotal) {
      let percentage =
        (bigTotal.innerHTML / 2000 / Math.pow(10, -2)).toFixed(2) + '%';
      progressBar.setAttribute('style', 'width: ' + percentage);
      progressBar.setAttribute('aria-valuenow', percentage);
      percentageDiv.innerHTML = percentage;
    };
    setPercentage(bigTotal);
  });
//date for mySQL
let date = new Date();
let year = date.getFullYear().toString();
let month = (date.getMonth() + 1).toString().padStart(2, '0');
let day = date.getDate().toString();
let dateString = year + '-' + month + '-' + day;

//NEW RUN function
const newRun = function () {
  let run_date = dateString;
  let run_length = parseFloat(lastRun.innerHTML);
  fetch('https://runcounter-v3.herokuapp.com/stats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      run_date: dateString,
      run_length: run_length,
    }),
  });
  updateDisplay();
};

const updateDisplay = function () {
  icon.className = heartIcon;
  lastRun.innerHTML = userMiles.value;
  lastRunDiv.classList.remove('hidden');
};

//button switcher
submit.addEventListener('click', function () {
  lastRunDiv.classList.remove('hidden');
  milesRemainingDiv.classList.remove('hidden');
  reqDailyAvgDiv.classList.remove('hidden');
  if (userMiles.value == 0) {
    message.innerHTML = 'maybe tomorrow?';
  } else if (userMiles.value >= 1 && userMiles.value <= 5) {
    message.innerHTML = 'okok!';
  } else if (userMiles.value >= 6 && userMiles.value <= 9) {
    message.innerHTML = 'respect!';
  } else if (userMiles.value >= 10) {
    message.innerHTML = 'oh nice!!';
  }
  newRun();
  updateDisplay();
});

//countup animation
// import { CountUp } from './js/countUp.min.js';

// const options = {
//   duration: 2,
//   suffix: 'miles',
// };
// window.onload = function () {
//   var countUp = new CountUp('bigTotal', runTotal, options);
//   countUp.start();
// };
