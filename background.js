
// On startup, this function needs to compare the current time to the last time checked of each item in values. WHY?
// if the current hour is past the time set in the box, AND it's not the same day, 
// AND the current day is in the array of days, the item is unchecked.
// It's not the same day means the day-month-year of the item is compared to the last time checked. If they are the same,
// it's the same day and the item can't be unchecked.
// This needs to be done on startup of the popup/options window.


// Every minute, this function checks everything in values. 
// If the hour minute time stored there is equal to the current hour minute time, the item is unchecked.
// setInterval(function(){
//     chrome.storage.sync.get(['values'], function(result) {
//         let values = result.values;
//         //chrome.storage.sync.set({values: [["Bicycle", "22:37", [0,1,2,3,4,5,6], true, (new Date()).getTime()]]});
//         let d = new Date();
//         let e = d.getHours() + ":" + d.getMinutes();
//         for (let i = 0; i<values.length; i++){
//                 // Have to put day of the week 
//             console.log('Value currently is ' + new Date(result.values[i][4]));
//             //console.log((values[i][1] === e));
//             //console.log((d.getDay() in values[i][2]));
//             if (values[i][1] === e && d.getDay() in values[i][2]){
//                 values[i][3] = false;
//             }
//         }
//         chrome.storage.sync.set({values: values});
//     });
//   }, 60*10);