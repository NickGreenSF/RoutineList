// Get the modal1
const modal1 = document.getElementById('addModal');
const modal2 = document.getElementById('editModal');
const modal3 = document.getElementById('calendarModal');
let btn = document.getElementById('addTask');
const calendarButton = document.getElementById('calendarButton');
// let span = document.getElementById("close");
const closes = document.getElementsByClassName('close');
const calendar = document.getElementById('calendar');

btn.onclick = function () {
  modal1.style.display = 'block';
};
calendarButton.onclick = function () {
  modal3.style.display = 'block';
};

// eslint-disable-next-line no-undef
getAndCheckTasks();

// The date is initialized here because the calendar needs it. In popup, it's initialized in the checkbox checker because that's
// all that needs it.

function populateCalendar(values) {
  // This block of code initializes the calendar. The calendar doesn't have any function beyond being seen.
  calendar.innerHTML = ``;
  const days = function (m, year) {
    return new Date(year, m, 0).getDate();
  };
  calendar.innerHTML += `<div class="dayLabel">Monday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Tuesday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Wednesday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Thursday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Friday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Saturday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Sunday</div>`;
  // eslint-disable-next-line no-undef
  for (let i = 0; i < day; i += 1) {
    calendar.innerHTML += `<div class="day"></div>`;
  }
  // eslint-disable-next-line no-undef
  let month = e.getMonth() + 1;
  // eslint-disable-next-line no-undef
  let date = e.getDate();
  // eslint-disable-next-line no-undef
  let today = day;
  // eslint-disable-next-line no-undef
  let numDays = days(month, e.getFullYear());
  for (let i = 0; i < 28; i += 1) {
    // eslint-disable-next-line no-use-before-define
    const v = getDayValues(values, today);
    let htmladd = `<div class="day"><div class="date">${month}/${date}</div>`;
    for (let z = 0; z < v.length; z += 1) {
      const time = v[z][1];
      const hoursMinutes = time.split(':');
      let hours = parseInt(hoursMinutes[0]);
      const mTime = hours >= 12 ? 'PM' : 'AM';
      hours %= 12;
      if (hours === 0){
        hours = 12;
      }
      htmladd += `<span class="note">${hours}:${hoursMinutes[1]} ${mTime} ${v[z][0]}</span><br>`;
    }
    htmladd += `</div>`;
    calendar.innerHTML += htmladd;
    date += 1;
    if (date > numDays) {
      date = 1;
      month += 1;
      // eslint-disable-next-line no-undef
      numDays = days(month, e.getFullYear());
    }
    today += 1;
    if (today === 7) {
      today = 0;
    }
  }
  // textFit(document.querySelector(".dayLabel"));
}

function getDayValues(values, weekDay) {
  const retVals = [];
  for (let k = 0; k < values.length; k += 1) {
    if (values[k][2].includes(weekDay)) {
      retVals.push(values[k]);
    }
  }
  // Once we have the values we then need to sort the array so they display properly.
  const n = retVals.length;
  for (let l = 0; l < n - 1; l += 1) {
    for (let m = 0; m < n - l - 1; m += 1) {
      const time = retVals[m][1];
      const hoursMinutes = time.split(':');
      const hours = parseInt(hoursMinutes[0]);
      const minutes = parseInt(hoursMinutes[1]);
      const overallTime = hours * 24 + minutes;
      const time2 = retVals[m + 1][1];
      const hoursMinutes2 = time2.split(':');
      const hours2 = parseInt(hoursMinutes2[0]);
      const minutes2 = parseInt(hoursMinutes2[1]);
      const overallTime2 = hours2 * 24 + minutes2;
      if (overallTime > overallTime2) {
        const temp = retVals[m];
        retVals[m] = retVals[m + 1];
        retVals[m + 1] = temp;
      }
    }
  }
  // console.log(retVals);
  return retVals;
}

closes[2].onclick = function () {
  modal3.style.display = 'none';
};
closes[1].onclick = function () {
  modal2.style.display = 'none';
};
closes[0].onclick = function () {
  modal1.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target === modal1) {
    modal1.style.display = 'none';
  } else if (event.target === modal2) {
    modal2.style.display = 'none';
  } else if (event.target === modal3) {
    modal3.style.display = 'none';
  }
};

// try {
//   chrome.storage.sync.get(['values'], function (result) {
//     console.log(result.values);
//     const { values } = result;
//     if (values != undefined) {
//       // values[0][3] = !values[0][3];
//       // console.log(e.getDate());
//       const currentTime = e.getHours() * 60 + e.getMinutes();
//       for (let i = 0; i < values.length; i++) {
//         if (values[i][3] == true) {
//           // Checks:
//           // if current hour current minute >= stored hour stored minute and current date > stored date
//           // and current day is in the accepted days of the week
//           // current date > stored date OR current date is 0 and stored date is 6
//           // OR if it's the same day AND current hour current minute < stored hour stored minute
//           const f = values[i][1].split(':');
//           const storedHour = parseInt(f[0]);
//           const storedMinute = parseInt(f[1]);
//           const storedTime = storedMinute + storedHour * 60;
//           // console.log(storedTime+" "+currentTime);
//           const d = new Date(values[i][4]);
//           if (
//             currentTime > storedTime ||
//             d.getDate() < e.getDate() ||
//             (d.getDate() > 1 && e.getDate() == 1)
//           ) {
//             // has to be later in the day to reset the check
//             console.log(`${d.getDate()} ${e.getDate()}`);
//             if (values[i][2].includes(day)) {
//               if (d.getDate() == e.getDate()) {
//                 const clickTime = d.getHours() * 60 + d.getMinutes();
//                 console.log(`${clickTime} ${storedTime}`);
//                 if (clickTime < storedTime) {
//                   values[i][3] = false;
//                 }
//               } else if (
//                 (e.getDate() == 1 && d.getDate() >= 30) ||
//                 e.getDate() - d.getDate() == 1
//               ) {
//                 const clickTime = d.getHours() * 60 + d.getMinutes();
//                 console.log(`${clickTime} ${storedTime}`);
//                 if (clickTime > storedTime) {
//                   values[i][3] = false;
//                 }
//               } else {
//                 values[i][3] = false;
//               }
//             }
//           }
//         }
//       }
//       chrome.storage.sync.set({ values });
//       updateTasks(values);
//       populateCalendar(values);
//     }
//   });
// } catch (error) {
//   taskHolder.innerText = 'There was a problem in retrieving the tasks.';
// }

// We need to populate the calendar!

function specificUpdate() {
  // We have to add the click listener again.
  console.log("hey i've been called!");
  const tasks = document.getElementsByClassName('task');
  for (let i = 0; i < tasks.length - 1; i += 1) {
    tasks[i].onclick = function (event) {
      if (event.target.className === 'check') {
        return;
      }
      // eslint-disable-next-line no-use-before-define
      editTaskModal(this.id);
    };
  }
  btn = document.getElementById('addTask');
  btn.onclick = function () {
    modal1.style.display = 'block';
  };
}

const taskForm = document.getElementById('taskForm');
taskForm.onsubmit = function () {
  // eslint-disable-next-line no-use-before-define
  changeTask(-1, taskForm);
};

function editTaskModal(id) {
  console.log(id);
  modal2.style.display = 'block';
  const form = document.getElementById('editTaskForm');
  console.log(form.querySelectorAll('input'));
  const inputs = form.querySelectorAll('input');
  // eslint-disable-next-line no-undef
  chrome.storage.sync.get(['values'], function (result) {
    const current = result.values[id];
    console.log(current);
    let j = 0;
    for (let i = 0; i < inputs.length; i += 1) {
      console.log(inputs[i].className);
      if (inputs[i].className === 'name') {
        [inputs[i].value] = current;
      } else if (inputs[i].className === 'time') {
        [, inputs[i].value] = current;
      } else if (inputs[i].className === 'check') {
        inputs[i].checked = current[2].includes(j);
        // console.log(i+" "+j+" "+current[2]+" "+inputs[i].checked+" "+(j in current[2])+" "+j+" "+current[2].includes(j));
        j += 1;
      }
    }
    const buttons = form.querySelectorAll('button');
    console.log(buttons);
    buttons[0].onclick = function () {
      // eslint-disable-next-line no-use-before-define
      changeTask(id, form);
    };
    buttons[1].onclick = function () {
      // eslint-disable-next-line no-use-before-define
      deleteTask(id);
    };
  });
}

function changeTask(id, form) {
  // if id is -1, a new task is created, if not, the task at that ID is updated to reflect the values in the form.
  const inputs = form.querySelectorAll('input');
  // We first have to check the form for null inputs.
  console.log(inputs[1].value);
  if (inputs[0].value === '' || inputs[1].value === '') {
    alert('Please fill out all fields. Your task has not been submitted.');
    return;
  }
  if (id === -1) {
    const weekdays = [];
    // console.log(inputs[0].value);
    // eslint-disable-next-line no-undef
    chrome.storage.sync.get(['values'], function (result) {
      let { values } = result;
      const current = ['', '', [], false, new Date().getTime()];
      console.log(current);
      let j = 0;
      for (let i = 0; i < inputs.length; i += 1) {
        console.log(inputs[i].className);
        if (inputs[i].className === 'name') {
          console.log(inputs[i].value);
          current[0] = inputs[i].value;
        } else if (inputs[i].className === 'time') {
          current[1] = inputs[i].value;
        } else if (inputs[i].className === 'check') {
          if (inputs[i].checked) {
            console.log(weekdays);
            weekdays.push(i - 2);
          }
          j += 1;
        }
      }
      current[2] = weekdays;
      console.log(current);
      if (values === undefined) {
        console.log('trying to add task');
        values = [current];
      } else {
        values.push(current);
      }
      // eslint-disable-next-line no-undef
      chrome.storage.sync.set({ values });
    });
    alert('Your task has been submitted.');
  } else {
    const weekdays = [];
    console.log(inputs[0].value);
    // eslint-disable-next-line no-undef
    chrome.storage.sync.get(['values'], function (result) {
      const { values } = result;
      const current = values[id];
      console.log(current);
      let j = 0;
      for (let i = 0; i < inputs.length; i += 1) {
        console.log(inputs[i].className);
        if (inputs[i].className === 'name') {
          console.log(inputs[i].value);
          current[0] = inputs[i].value;
        } else if (inputs[i].className === 'time') {
          current[1] = inputs[i].value;
        } else if (inputs[i].className === 'check') {
          if (inputs[i].checked) {
            console.log(weekdays);
            weekdays.push(i - 2);
          }
          j += 1;
        }
      }
      current[2] = weekdays;
      console.log(current);
      // eslint-disable-next-line no-undef
      chrome.storage.sync.set({ values });
    });
    alert('Your task has been changed.');
  }
}

function deleteTask(id) {
  // eslint-disable-next-line no-undef
  chrome.storage.sync.get(['values'], function (result) {
    const { values } = result;
    [values[id]] = values;
    values.shift();
    // eslint-disable-next-line no-undef
    chrome.storage.sync.set({ values });
  });
  alert('Your task has been deleted');
}
