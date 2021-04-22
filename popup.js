// POPUP.JS
// Check each of the user's tasks to see if they're done for the day or not.

let taskHolder = document.getElementById("taskDiv");
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

function insertValues(taskHolder, values){
    console.log(values.length);
    let i;
    taskHolder.innerHTML = ``;
    for (i = 0; i<values.length; i++){
        taskHolder.innerHTML = taskHolder.innerHTML + `<div>${values[i]}</div>`;
    }
}