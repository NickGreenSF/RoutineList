console.log('popup is going');
// eslint-disable-next-line no-undef
getAndCheckTasks();

function specificUpdate() {
  document.getElementById('addTask').onclick = function () {
    // eslint-disable-next-line no-undef
    chrome.runtime.openOptionsPage();
  };
}
