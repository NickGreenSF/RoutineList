// POPUP.JS
// Check each of the user's tasks to see if they're done for the day or not.

let taskHolder = document.getElementById("taskDiv");
let values = undefined;
try {
    values = chrome.storage.sync.get(values);
} catch (error) {
    taskHolder.innerText = "There was a problem in retrieving the tasks."
}
if(values != undefined){
    taskHolder.innerText = values;
}
