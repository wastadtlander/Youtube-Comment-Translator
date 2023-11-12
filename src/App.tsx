import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [divIds, setDivIds] = useState<string[]>([]);

  const fetchDivIds = () => {
    // Message to send
    const message = { type: "fetchDivIds" };

    // Querying the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Safety check if the active tab is accessible
      if (!tabs[0].id) return;

      // Sending a message to the content script
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        if (chrome.runtime.lastError) {
          // Handle any errors that occur during message passing
          console.error(chrome.runtime.lastError.message);
          return;
        }
        // Setting the state with the response
        if (response && response.response && response.response.divIds) {
          setDivIds(response.response.divIds);
        } else {
          console.error("Invalid response structure:", response);
        }
      });
    });
  };

  const getUILanguage = () => {
    // not really needed when everything is done since itll autoupdate
    const defaultLanguage: string = chrome.i18n.getUILanguage();

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0].id) return;

      chrome.tabs.sendMessage(tabs[0].id, defaultLanguage, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
        }
        // Do stuff here with the response
      });
    });
  };

  return (
    <div>
      <button onClick={getUILanguage}>console log language</button>
    </div>
  );
};

export default App;
