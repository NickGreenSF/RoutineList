
chrome.storage.sync.set({values: [["Bicycle", "11:30", "MTWUFSN", true], ["Have sex", "21:00", "MTWUFSN", false]]});

setInterval(function(){
  chrome.storage.sync.get(['values'], function(result) {
    console.log('Value currently is ' + result.values[0]);
  });
}, 60*1000);