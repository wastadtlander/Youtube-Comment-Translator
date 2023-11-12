import { DOMMessage, DOMMessageResponse } from "../types";

// Example listener function that console logs language
const getUILanguage = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  console.log("[DomEvaluator]. Message received, language is ", msg);

  // Prepare the response object
  const response: DOMMessageResponse = {
    success: true, // Indicate successful processing
  };

  sendResponse(response);
};

// Fired when a message is sent from either an extension process or a content script.
chrome.runtime.onMessage.addListener(getUILanguage);
