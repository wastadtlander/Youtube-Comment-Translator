/** Google Translate API */
import { TranslateAPIResponse } from "../types";

const key = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY; // Insert Key Here
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
 * @param  {HTMLElement} text  text element object.
 */
function callTranslateAPI(
  text: HTMLElement | Text
): Promise<TranslateAPIResponse> {
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
          if (data.data.translations[0].detectedSourceLanguage !== "en") {
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
    }
  });
}

/**
 * Automatically translates comments on load
 *
 * @param  {object} mutationsList  text element object.
 * @param  {object} observer  observer properties.
 */
async function translateComments(
  mutationsList: MutationRecord[],
  observer: MutationObserver
) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        // Type cast node to HTMLElement to access querySelectorAll and other properties
        if (
          node.nodeName.toLowerCase() === "ytd-comment-renderer" &&
          node instanceof Element
        ) {
          let commentsList = node.querySelectorAll("#content-text");

          for (const comment of commentsList) {
            let elementList = comment.childNodes;
            let translationOccurred = false;
            let originalLanguage = "";

            let translationPromises: Promise<void>[] = [];

            for (const element of elementList) {
              if (element instanceof HTMLElement || element instanceof Text) {
                // Extract textContent and check if it's not null and not empty
                const textContent = element.textContent || "";

                if (
                  textContent.trim() !== "" &&
                  !(
                    element instanceof HTMLElement &&
                    element.className ===
                      "yt-simple-endpoint style-scope yt-formatted-string"
                  )
                ) {
                  const translatePromise = callTranslateAPI(element)
                    .then((response: TranslateAPIResponse) => {
                      if (response && response.originalLanguage !== "en") {
                        element.textContent = response.translatedText;
                        translationOccurred = true;
                        originalLanguage = response.originalLanguage;
                      }
                    })
                    .catch((error: any) => {
                      console.log(error);
                    });
                  translationPromises.push(translatePromise);
                }
              }
            }

            // Adding translation tag after entire comment has been translated
            await Promise.all(translationPromises);

            if (translationOccurred && comment.parentNode) {
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
  if (event.target && event.target instanceof Element) {
    const comment = event.target.closest("yt-formatted-string");

    if (comment && comment instanceof HTMLElement) {
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
    }
  }
});

// Observer to translate new comments on load
observer = new MutationObserver(translateComments);
observer.observe(document.body, config);
