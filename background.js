// background code to be loaded when the browser action icon is clicked
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript(tab.id, {
    file: 'mo.min.js'
  });
  chrome.tabs.executeScript(tab.id, {
    file: 'inject.js'
  });
});