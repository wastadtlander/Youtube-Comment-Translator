import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const getUILanguage = () => {
    const defaultLanguage: string = chrome.i18n.getUILanguage();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, defaultLanguage, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }
        });
      }
    });
  };

  return (
    <div>
      <button onClick={getUILanguage}>console log language</button>
    </div>
  );
};

export default App;
