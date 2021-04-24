// POPUP.JS
// Check each of the user's tasks to see if they're done for the day or not.

let taskHolder = document.getElementById("taskTable");
let values = undefined;
try {
    chrome.storage.sync.get(['values'], function(result){
        console.log(result.values);
        values = result.values;
        if(values != undefined){
            insertValues(taskHolder, values);
        }
    })
} catch (error) {
    taskHolder.innerText = "There was a problem in retrieving the tasks.";
}

setInterval(function(){
    chrome.storage.sync.get(['values'], function(result) {
      console.log('Value currently is ' + result.values[0]);
    });
  }, 60*1000);

function insertValues(taskHolder, values){
    console.log(values.length);
    let i;
    taskHolder.innerHTML = ``;
    // This function uses two separate for loops to initalize the checkboxes and to add listeners to them.
    // Doing both in one for loop produced a problem where the first checkbox would not receive its click listener.
    for (i = 0; i<values.length; i++){
        const isTrue = values[i][3];
        taskHolder.innerHTML = taskHolder.innerHTML + 
        `<tr>
            <td>
                <input type="checkbox" id="checkbox${i}" ${isTrue ? `checked` : ``}>
            </td>
            <td>
                ${values[i][0]}
            </td>
            <td>
                ${values[i][1]}
            </td>
        </tr>`;
    }
    for (i = 0; i<values.length; i++){
        console.log("checkbox"+i);
        document.getElementById("checkbox"+i).addEventListener("click", function(){
            checkBoxClick(this.id);
        });
    }
}

function checkBoxClick(id){
    console.log(id);
}