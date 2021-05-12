

// ADD LISTENERS FOR THE EDIT TASK MODAL

// Get the modal1
let modal1 = document.getElementById("addModal");
let modal2 = document.getElementById("editModal");
let btn = document.getElementById("addTask");
//let span = document.getElementById("close");
let closes = document.getElementsByClassName("close");
let taskHolder = document.getElementById("taskHolder");

btn.onclick = function() {
  modal1.style.display = "block";
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
}

try {
  chrome.storage.sync.get(['values'], function(result){
      console.log(result.values);
      values = result.values;
      if(values != undefined){
        //values[0][3] = !values[0][3];
        let e = new Date();
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
                  if (e.getDay() in values[i][2]){
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