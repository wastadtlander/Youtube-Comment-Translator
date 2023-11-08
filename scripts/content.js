/** Google Translate API */

const key = ""; // Insert Key Here
const translateURL = `https://translation.googleapis.com/language/translate/v2?key=${key}`;
const detectURL = `https://translation.googleapis.com/language/translate/v2/detect?key=${key}`;
const regexEmoji =
  /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;
const commentWrapper = document.body;

/**
 * Calls the Google Translate API
 * @param  {object} text  text element object.
 */
function callTranslateAPI(text) {
  return new Promise((resolve, reject) => {
    if (text) {
      fetch(translateURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text.textContent,
          target: "en",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(
            data.data.translations[0].translatedText.replace(/&#39;/g, "'")
          );
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      resolve(null);
    }
  });
}

/**
 * Automatically translates comments on load
 *
 * @param  {object} mutationsList  text element object.
 * @param  {object} observer  observer properties.
 */
function translateComments(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type == "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName.toLowerCase() == "ytd-comment-renderer") {
          let bodyElement = node.querySelectorAll(
            "#body #main #comment-content #expander #content #content-text .style-scope.yt-formatted-string"
          );

          if (bodyElement) {
            bodyElement.forEach((element) => {
              const spellcheckValue = element.getAttribute("spellcheck");
              if (
                element.textContent.trim() != "" &&
                spellcheckValue != "false" &&
                element.textContent != " " &&
                !element.textContent.match(regexEmoji)
              ) {
                fetch(detectURL, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    q: element.textContent,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    language = data.data.detections[0][0].language;
                    if (language != "en") {
                      callTranslateAPI(element)
                        .then((translatedText) => {
                          if (translatedText) {
                            element.textContent =
                              translatedText + " (translated)";
                            console.log("Translated text:", translatedText);
                          }
                        })
                        .catch((error) => {});
                    }
                  })
                  .catch((error) => {
                    console.log("Error: ", error);
                  });
              }
            });
          }
        }
      });
    }
  }
}

/**
 * Translates comments on click
 */
commentWrapper.addEventListener("click", (event) => {
  const comment = event.target.closest("yt-formatted-string");

  callTranslateAPI(comment)
    .then((translatedText) => {
      if (translatedText) {
        comment.textContent = translatedText;
        console.log("Translated text:", translatedText);
      }
    })
    .catch((error) => {});
});

/**
 * Observer to translate new comments on load
 */
const observer = new MutationObserver(translateComments);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
