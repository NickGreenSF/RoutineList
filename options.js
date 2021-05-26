

// ADD LISTENERS FOR THE EDIT TASK MODAL

// Get the modal1
let modal1 = document.getElementById("addModal");
let modal2 = document.getElementById("editModal");
let modal3 = document.getElementById("calendarModal");
let btn = document.getElementById("addTask");
let calendarButton = document.getElementById("calendarButton");
//let span = document.getElementById("close");
let closes = document.getElementsByClassName("close");
let taskHolder = document.getElementById("taskHolder");
let calendar = document.getElementById("calendar");

btn.onclick = function() {
  modal1.style.display = "block";
}
calendarButton.onclick = function() {
  modal3.style.display = "block";
}

// The date is initialized here because the calendar needs it. In popup, it's initialized in the checkbox checker because that's
// all that needs it.
let e = new Date();
let day = e.getDay()-1;
if (day<0){
  day = 6;
}

function populateCalendar(values){
  // This block of code initializes the calendar. The calendar doesn't have any function beyond being seen.
  calendar.innerHTML = ``;
  const days = function(month,year) {
    return new Date(year, month, 0).getDate();
  };
  calendar.innerHTML += `<div class="dayLabel">Monday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Tuesday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Wednesday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Thursday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Friday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Saturday</div>`;
  calendar.innerHTML += `<div class="dayLabel">Sunday</div>`;
  for(let i = 0; i<day; i++){
    calendar.innerHTML += `<div class="day"></div>`;
  }
  let month = e.getMonth()+1;
  let date = e.getDate();
  let today = day;
  let numDays = days(month, e.getFullYear());
  for (let i = 0; i<28; i++){
    let v = getDayValues(values, today);
    let htmladd = `<div class="day"><div class="date">${month}/${date}</div>`
    for (let z = 0; z<v.length; z++){
      let time = v[z][1];
      let hoursMinutes = time.split(":");
      let hours = parseInt(hoursMinutes[0]);
      let mTime = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      htmladd += `<span class="note">${hours}:${hoursMinutes[1]} ${mTime} ${v[z][0]}</span><br>`;
    }
    htmladd += `</div>`;
    calendar.innerHTML += htmladd;
    date++;
    if (date > numDays){
      date = 1;
      month++;
      numDays = days(month, e.getFullYear());
    }
    today++;
    if (today == 7){
      today = 0;
    }
  }
  //textFit(document.querySelector(".dayLabel"));
}

function getDayValues(values, weekDay){
  let retVals = [];
  for (let k = 0; k<values.length; k++){
    if (values[k][2].includes(weekDay)){
      retVals.push(values[k]);
    }
  }
  // Once we have the values we then need to sort the array so they display properly.
  let n = retVals.length;
  for (let l = 0; l < n-1; l++){
    for (let m = 0; m < n-l-1; m++){
      let time = retVals[m][1];
      let hoursMinutes = time.split(":");
      let hours = parseInt(hoursMinutes[0]);
      let minutes = parseInt(hoursMinutes[1]);
      let overallTime = hours*24 + minutes;
      let time2 = retVals[m+1][1];
      let hoursMinutes2 = time2.split(":");
      let hours2 = parseInt(hoursMinutes2[0]);
      let minutes2 = parseInt(hoursMinutes2[1]);
      let overallTime2 = hours2*24 + minutes2;
      if (overallTime > overallTime2){
        let temp = retVals[m];
        retVals[m] = retVals[m+1];
        retVals[m+1] = temp;
      }
    }
  }
  //console.log(retVals);
  return retVals;
}

closes[2].onclick = function(){
  modal3.style.display = "none";
}
closes[1].onclick = function() {
  modal2.style.display = "none";
}
closes[0].onclick = function(){
  modal1.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal1) {
    modal1.style.display = "none";
  }
  else if (event.target == modal2){
    modal2.style.display = "none";
  }
  else if (event.target == modal3){
    modal3.style.display = "none";
  }
}

try {
  chrome.storage.sync.get(['values'], function(result){
      console.log(result.values);
      values = result.values;
      if(values != undefined){
        //values[0][3] = !values[0][3];
        //console.log(e.getDate());
        let currentTime = (e.getHours()*60) + e.getMinutes();
        for (let i = 0; i<values.length; i++){
            if (values[i][3] == true){
                // Checks:
                // if current hour current minute >= stored hour stored minute and current date > stored date
                // and current day is in the accepted days of the week
                // current date > stored date OR current date is 0 and stored date is 6
                // OR if it's the same day AND current hour current minute < stored hour stored minute
                let f = values[i][1].split(":");
                let storedHour = parseInt(f[0]);
                let storedMinute = parseInt(f[1]);
                let storedTime = storedMinute+(storedHour*60);
                //console.log(storedTime+" "+currentTime);
                let d = new Date(values[i][4]);
                if (currentTime>storedTime || (d.getDate()<e.getDate() || (d.getDate() > 1 && e.getDate() == 1))){
                  // has to be later in the day to reset the check
                  console.log(d.getDate()+" "+e.getDate());
                  if (values[i][2].includes(day)){
                    if ((d.getDate() == e.getDate())){
                      let clickTime = (d.getHours()*60)+d.getMinutes();
                      console.log(clickTime+" "+storedTime);
                      if (clickTime < storedTime){
                          values[i][3] = false;
                      }
                    }
                    else if ((e.getDate() == 1 && d.getDate() >= 30) || e.getDate()-d.getDate() == 1){
                        let clickTime = (d.getHours()*60)+d.getMinutes();
                        console.log(clickTime+" "+storedTime);
                        if (clickTime > storedTime){
                            values[i][3] = false;
                        }
                    }
                    else{
                        values[i][3] = false;
                    }
                  }
              }
            }
            
        }
        chrome.storage.sync.set({values: values});
        updateTasks(values);
        populateCalendar(values);
    }
  })
} catch (error) {
  taskHolder.innerText = "There was a problem in retrieving the tasks.";
}

function updateTasks(values){
  //This function fills out the task holder.
  taskHolder.innerHTML = ``;
  for (i = 0; i<values.length; i++){
    const isTrue = values[i][3];
    taskHolder.innerHTML = taskHolder.innerHTML + 
    `<div class="task" id=${i}>
        <input type="checkbox" class="check" id="checkbox${i}" ${isTrue ? `checked` : ``}>
        <span class="checkmark"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden="true" focusable="false">
        <path fill='none' stroke='currentColor' stroke-width='3' d='M1.73 12.91l6.37 6.37L22.79 4.59' /></svg></span>
        <span class="taskText">
            ${values[i][0]}
        </span>
    </div>`;
  }
  taskHolder.innerHTML = taskHolder.innerHTML + `<div id="addTask" class="task">+ Add Task</div>`;
  for (i = 0; i<values.length; i++){
    console.log("checkbox"+i);
    document.getElementById("checkbox"+i).addEventListener("click", function(){
        checkBoxClick(this.id);
    });
  }
  // We have to add the click listener again.
  let tasks = document.getElementsByClassName("task");
  for (i = 0; i<tasks.length-1; i++){
    tasks[i].onclick = function(event){
      if (event.target.className == "check"){
        return;
      }
      editTaskModal(this.id);
    }
  }
  btn = document.getElementById("addTask");
  btn.onclick = function() {
    modal1.style.display = "block";
  }
}

function checkBoxClick(id){
  let value = parseInt(id.substring(8));
  console.log(value);
  //taskHolder.innerHTML = `<div>Updating...</div>`
  chrome.storage.sync.get(['values'], function(result){
    console.log(result.values);
    values = result.values;
    values[value][3] = !values[value][3];
    if (values[value][3] == true){
      values[value][4] = (new Date()).getTime();
    }
    chrome.storage.sync.set({values: values});
    if(values != undefined){
        updateTasks(values);
    }
  })
}

let taskForm = document.getElementById("taskForm");
taskForm.onsubmit = function(){
  changeTask(-1, taskForm);
}

function editTaskModal(id){
  console.log(id);
  modal2.style.display = "block";
  let form = document.getElementById("editTaskForm");
  console.log(form.querySelectorAll("input"));
  let inputs = form.querySelectorAll("input");
  chrome.storage.sync.get(['values'], function(result){
    let current = result.values[id];
    console.log(current);
    let j = 0;
    for (let i = 0; i<inputs.length; i++){
      console.log(inputs[i].className);
      if (inputs[i].className == "name"){
        inputs[i].value = current[0];
      }
      else if (inputs[i].className == "time"){
        inputs[i].value = current[1];
      }
      else if (inputs[i].className == "check"){
        inputs[i].checked = current[2].includes(j);
        //console.log(i+" "+j+" "+current[2]+" "+inputs[i].checked+" "+(j in current[2])+" "+j+" "+current[2].includes(j));
        j++;
      }
    }
    let buttons = form.querySelectorAll("button");
    console.log(buttons);
    buttons[0].onclick = function(){
      changeTask(id, form);
    }
    buttons[1].onclick = function(){
      deleteTask(id);
    }
  })
}

function changeTask(id, form){
  // if id is -1, a new task is created, if not, the task at that ID is updated to reflect the values in the form.
  let inputs = form.querySelectorAll("input");
  if (id == -1){
    let weekdays = [];
    console.log(inputs[0].value);
    chrome.storage.sync.get(['values'], function(result){
      let values = result.values;
      let current = ["", "", [], false, (new Date()).getTime()];
      console.log(current);
      let j = 0;
      for (let i = 0; i<inputs.length; i++){
        console.log(inputs[i].className);
        if (inputs[i].className == "name"){
          console.log(inputs[i].value);
          current[0] = inputs[i].value;
        }
        else if (inputs[i].className == "time"){
          current[1] = inputs[i].value;
        }
        else if (inputs[i].className == "check"){
          if (inputs[i].checked){
            console.log(weekdays);
            weekdays.push(i-2);
          }
          j++;
        }
      }
      current[2] = weekdays;
      console.log(current);
      if (values == undefined){
        console.log("trying to add task");
        values = [current];
      }
      else{
        values.push(current);
      }
      chrome.storage.sync.set({values: values});
    })
    alert("Your task has been submitted.");
  }
  else{
    let weekdays = [];
    console.log(inputs[0].value);
    chrome.storage.sync.get(['values'], function(result){
      let values = result.values;
      let current = values[id];
      console.log(current);
      let j = 0;
      for (let i = 0; i<inputs.length; i++){
        console.log(inputs[i].className);
        if (inputs[i].className == "name"){
          console.log(inputs[i].value);
          current[0] = inputs[i].value;
        }
        else if (inputs[i].className == "time"){
          current[1] = inputs[i].value;
        }
        else if (inputs[i].className == "check"){
          if (inputs[i].checked){
            console.log(weekdays);
            weekdays.push(i-2);
          }
          j++;
        }
      }
      current[2] = weekdays;
      console.log(current);
      chrome.storage.sync.set({values: values});
    })
    alert("Your task has been changed.");
  }
}

function deleteTask(id){
  chrome.storage.sync.get(['values'], function(result){
    let values = result.values;
    values[id] = values[0];
    values.shift();
    chrome.storage.sync.set({values: values});
  })
}