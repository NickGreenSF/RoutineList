const taskHolder = document.getElementById('taskHolder');
const e = new Date();
let day = e.getDay() - 1;
if (day < 0) {
  day = 6;
}
function getAndCheckTasks() {
  try {
    // eslint-disable-next-line no-undef
    chrome.storage.sync.get(['values'], function (result) {
      console.log(result.values);
      const { values } = result;
      if (values !== undefined) {
        // values[0][3] = !values[0][3];
        // console.log(e.getDate());
        const currentTime = e.getHours() * 60 + e.getMinutes();
        for (let i = 0; i < values.length; i += 1) {
          if (values[i][3] === true) {
            // Checks:
            // if current hour current minute >= stored hour stored minute and current date > stored date
            // and current day is in the accepted days of the week
            // current date > stored date OR current date is 0 and stored date is 6
            // OR if it's the same day AND current hour current minute < stored hour stored minute
            const f = values[i][1].split(':');
            const storedHour = parseInt(f[0]);
            const storedMinute = parseInt(f[1]);
            const storedTime = storedMinute + storedHour * 60;
            // console.log(storedTime+" "+currentTime);
            const d = new Date(values[i][4]);
            if (
              currentTime > storedTime ||
              d.getDate() < e.getDate() ||
              (d.getDate() > 1 && e.getDate() === 1)
            ) {
              // has to be later in the day to reset the check
              console.log(`${d.getDate()} ${e.getDate()}`);
              if (values[i][2].includes(day)) {
                if (d.getDate() === e.getDate()) {
                  const clickTime = d.getHours() * 60 + d.getMinutes();
                  console.log(`${clickTime} ${storedTime}`);
                  if (clickTime < storedTime) {
                    values[i][3] = false;
                  }
                } else if (
                  (e.getDate() === 1 && d.getDate() >= 30) ||
                  e.getDate() - d.getDate() === 1
                ) {
                  const clickTime = d.getHours() * 60 + d.getMinutes();
                  console.log(`${clickTime} ${storedTime}`);
                  if (clickTime > storedTime) {
                    values[i][3] = false;
                  }
                } else {
                  values[i][3] = false;
                }
              }
            }
          }
        }
        // eslint-disable-next-line no-undef
        chrome.storage.sync.set({ values });
        // eslint-disable-next-line no-use-before-define
        updateTasks(values);
        // The options page has a populate calendar function. The popup does not. This will cause an error in the popup,
        // but not in options.
        try {
          // eslint-disable-next-line no-undef
          populateCalendar(values);
        } catch (error) {
          console.log('this should display in the popup');
        }
      }
    });
  } catch (error) {
    taskHolder.innerText = 'There was a problem in retrieving the tasks.';
  }
}

function updateTasks(values) {
  // This function fills out the task holder.
  taskHolder.innerHTML = ``;
  for (let i = 0; i < values.length; i += 1) {
    const isTrue = values[i][3];
    taskHolder.innerHTML += `<div class="task" id=${i}>
        <input type="checkbox" class="check" id="checkbox${i}" ${
      isTrue ? `checked` : ``
    }>
        <span class="checkmark"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden="true" focusable="false">
        <path fill='none' stroke='currentColor' stroke-width='3' d='M1.73 12.91l6.37 6.37L22.79 4.59' /></svg></span>
        <span class="taskText">
            ${values[i][0]}
        </span>
    </div>`;
  }
  taskHolder.innerHTML += `<div id="addTask" class="task">+ Add Task</div>`;
  for (let i = 0; i < values.length; i += 1) {
    console.log(`checkbox${i}`);
    document
      .getElementById(`checkbox${i}`)
      .addEventListener('click', function () {
        // eslint-disable-next-line no-use-before-define
        checkBoxClick(this.id);
      });
  }
  // eslint-disable-next-line no-undef
  specificUpdate();
}

function checkBoxClick(id) {
  const value = parseInt(id.substring(8));
  console.log(value);
  // eslint-disable-next-line no-undef
  chrome.storage.sync.get(['values'], function (result) {
    console.log(result.values);
    const { values } = result;
    values[value][3] = !values[value][3];
    if (values[value][3] === true) {
      values[value][4] = new Date().getTime();
    }
    // eslint-disable-next-line no-undef
    chrome.storage.sync.set({ values });
    if (values !== undefined) {
      updateTasks(values);
    }
  });
}
