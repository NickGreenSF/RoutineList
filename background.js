// There's nothing here yet.

chrome.runtime.onInstalled.addListener(() => {
    // On launch, sets color: color.
    chrome.storage.sync.set({values: (1, 2, 3)});
  });