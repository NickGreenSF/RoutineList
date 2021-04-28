

// ADD LISTENERS FOR THE EDIT TASK MODAL

// Get the modal1
let modal1 = document.getElementById("addModal");
let btn = document.getElementById("addTask");
let span = document.getElementById("close");
let taskHolder = document.getElementById("taskHolder");

btn.onclick = function() {
  modal1.style.display = "block";
}

span.onclick = function() {
  modal1.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal1) {
    modal1.style.display = "none";
  }
}

try {
  chrome.storage.sync.get(['values'], function(result){
      //console.log(result.values);
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
                if (currentTime>storedTime){
                    // has to be later in the day to reset the check
                    let d = new Date(values[i][4]);
                    if (d.getDay() in values[i][2]){
                        if (d.getDate()>e.getDate() || (d.getDate() == 31 && e.getDate() == 1)){
                            values[i][3] = false;
                        }
                        else if (d.getDate() == e.getDate()){
                            // if clicktime < storedtime
                            let clickTime = (d.getHours()*60)+d.getMinutes();
                            if (clickTime < storedTime){
                                values[i][3] = false;
                            }
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
    `<div class="task">
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
  console.log("submit");
}