// POPUP.JS
// Check each of the user's tasks to see if they're done for the day or not.

let taskHolder = document.getElementById("taskHolder");
let values = undefined;
console.log("popup is going");
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
                    console.log(storedTime+" "+currentTime);
                    let d = new Date(values[i][4]);
                    // This conditional is not well organized but I think it does what it's supposed to do.
                    if (currentTime>storedTime || (d.getDate()<e.getDate() || (d.getDate() > 1 && e.getDate() == 1))){
                        // has to be later in the day to reset the check
                        console.log(d.getDate()+" "+e.getDate());
                        if (e.getDay() in values[i][2]){
                            if ((d.getDate()-e.getDate() == -1 || (d.getDate() == 31 && e.getDate() == 1))){
                                let clickTime = (d.getHours()*60)+d.getMinutes();
                                console.log(clickTime+" "+storedTime);
                                // If the click was YESTERDAY, time needs to be GREATER than stored time
                                if (clickTime > storedTime){
                                    values[i][3] = false;
                                }
                            }
                            else if (d.getDate() == e.getDate()){
                                let clickTime = (d.getHours()*60)+d.getMinutes();
                                console.log(clickTime+" "+storedTime);
                                // If it was TODAY, time needs to be LESS than stored time
                                if (clickTime < storedTime){
                                    values[i][3] = false;
                                }
                            }
                            else{
                                // If it was earlier than that, the time is irrelevant.
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
    //console.log(values.length);
    let i;
    taskHolder.innerHTML = ``;
    // This function uses two separate for loops to initalize the checkboxes and to add listeners to them.
    // Doing both in one for loop produced a problem where the first checkbox would not receive its click listener.
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
    taskHolder.innerHTML = taskHolder.innerHTML + `<div id="addTask" class="task">+ Add/Edit Tasks</div>`;
    document.getElementById("addTask").onclick = function() {
        chrome.runtime.openOptionsPage();
    }
    for (i = 0; i<values.length; i++){
        //console.log("checkbox"+i);
        document.getElementById("checkbox"+i).addEventListener("click", function(){
            checkBoxClick(this.id);
        });
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