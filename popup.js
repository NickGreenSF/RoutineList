// There is a lot of disabling the linting for no-undef here, this is because I'm in a Chrome extension
// and using multiple JS files for one page. Eslint doesn't like either of these things.

console.log('popup is going');
// eslint-disable-next-line no-undef
getAndCheckTasks();
// try {
//   // eslint-disable-next-line no-undef
//   chrome.storage.sync.get(['values'], function (result) {
//     console.log(result.values);
//     values = result.values;
//     if (values !== undefined) {
//       // values[0][3] = !values[0][3];
//       const e = new Date();
//       // console.log(e.getDate());
//       const currentTime = e.getHours() * 60 + e.getMinutes();
//       for (let i = 0; i < values.length; i += 1) {
//         if (values[i][3] === true) {
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
//           if (currentTime > storedTime) {
//             // has to be later in the day to reset the check
//             console.log(`${d.getDate()} ${e.getDate()}`);
//             let day = e.getDay() - 1;
//             if (day < 0) {
//               day = 6;
//             }
//             console.log(`${day} ${values[i][2]}`);
//             // if (e.getDay() in values[i][2]){
//             if (values[i][2].includes(day)) {
//               if (d.getDate() === e.getDate()) {
//                 const clickTime = d.getHours() * 60 + d.getMinutes();
//                 console.log(`${clickTime} ${storedTime}`);
//                 if (clickTime < storedTime) {
//                   values[i][3] = false;
//                 }
//               } else if (
//                 (e.getDate() === 1 && d.getDate() >= 30) ||
//                 e.getDate() - d.getDate() === 1
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
//       // eslint-disable-next-line no-undef
//       chrome.storage.sync.set({ values });
//       // eslint-disable-next-line no-undef
//       updateTasks(values);
//     } else {
//       // eslint-disable-next-line no-undef
//       updateTasks([]);
//     }
//   });
// } catch (error) {
//   // eslint-disable-next-line no-undef
//   taskHolder.innerText = 'There was a problem in retrieving the tasks.';
// }

function specificUpdate() {
  document.getElementById('addTask').onclick = function () {
    // eslint-disable-next-line no-undef
    chrome.runtime.openOptionsPage();
  };
}
