import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  // Need to rewrite this with messaging system spooky.
  // const [isOnYouTubeVideo, setIsOnYouTubeVideo] = useState(false);

  // const checkYouTubePage = () => {
  //   const isYouTubeVideoPage = window.location.hostname === "www.youtube.com" && window.location.pathname.startsWith("/watch");
  //   console.log(window.location);
  //   setIsOnYouTubeVideo(isYouTubeVideoPage);
  // }

  // useEffect(() => {
  //   checkYouTubePage();
  //   const hashChangeListener = () => checkYouTubePage();
  //   window.addEventListener("hashchange", hashChangeListener);
  //   return () => window.removeEventListener("hashchange", hashChangeListener);
  // })

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
      {/* {isOnYouTubeVideo ? (
        <button onClick={getUILanguage}>console log language</button>
      ) : (
        <p>This is not a YouTube video page.</p>
      )} */}
    </div>
  );
};

export default App;
