/** Google Translate API */

const key = "AIzaSyAffFHGY4Q4URrju5AXeLlu7XQJrijLF8M"; // Insert Key Here
const translateURL = `https://translation.googleapis.com/language/translate/v2?key=${key}`;
const commentWrapper = document.body;

/**
 * Observer to translate new comments on load
 */
const config = {
  childList: true,
  subtree: true,
};
let observer;

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
          if (data.data.translations[0].detectedSourceLanguage != "en") {
            console.log(
              data.data.translations[0].translatedText.replace(/&#39;/g, "'")
            );
            console.log(data.data.translations[0].detectedSourceLanguage);
          }
          resolve({
            translatedText: data.data.translations[0].translatedText.replace(
              /&#39;/g,
              "'"
            ),
            originalLanguage: data.data.translations[0].detectedSourceLanguage,
          });
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
async function translateComments(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type == "childList") {
      for (const node of mutation.addedNodes) {
        if (node.nodeName.toLowerCase() == "ytd-comment-renderer") {
          let commentsList = node.querySelectorAll("#content-text");

          for (const comment of commentsList) {
            let elementList = comment.childNodes;
            let translationOccurred = false;
            let originalLanguage = "";

            let translationPromises = [];

            elementList.forEach((element, index) => {
              if (element) {
                if (
                  element.textContent.trim() != "" &&
                  element.className !=
                    "yt-simple-endpoint style-scope yt-formatted-string"
                ) {
                  const translatePromise = callTranslateAPI(element)
                    .then((response) => {
                      if (response && response.originalLanguage != "en") {
                        element.textContent = response.translatedText;
                        translationOccurred = true;
                        originalLanguage = response.originalLanguage;
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                  translationPromises.push(translatePromise);
                } else if (
                  element.className ==
                  "yt-simple-endpoint style-scope yt-formatted-string"
                ) {
                  element.textContent = element.textContent + "";
                }
              }
            });

            // Adding translation tag after entire comment has been translated
            await Promise.all(translationPromises);

            if (translationOccurred) {
              let newSpan = document.createElement("span");
              newSpan.setAttribute("dir", "auto");
              newSpan.className = "style-scope yt-formatted-string";
              newSpan.style.display = "block";
              newSpan.textContent =
                "\n (translated from " + originalLanguage + ")";

              // Add new tag directly into the DOM
              comment.parentNode.insertBefore(newSpan, comment.nextSibling);
            }
          }
        }
      }
    }
  }
}

/**
 * Translates comments on click
 */
commentWrapper.addEventListener("click", (event) => {
  const comment = event.target.closest("yt-formatted-string");

  callTranslateAPI(comment)
    .then((response) => {
      if (response) {
        comment.textContent =
          response.translatedText +
          " (translated from " +
          response.originalLanguage +
          ")";
        console.log("Translated text:", response.translatedText);
        console.log("Original language:", response.originalLanguage);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

// Observer Setup
observer = new MutationObserver(translateComments);
observer.observe(document.body, config);
