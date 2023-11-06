/** Google Translate API */

const key = "";
const url = `https://translation.googleapis.com/language/translate/v2?key=${key}`;
const commentWrapper = document.body;

commentWrapper.addEventListener("click", (event) => {
  const comment = event.target.closest("yt-formatted-string");
  if (comment) {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: comment.textContent,
        target: "en",
      }),
    })
    .then(response => response.json())
    .then(data => {
      const translatedComment = data.data.translations[0].translatedText;
      console.log(translatedComment);
      comment.textContent = translatedComment;
    })
    .catch(error => {
      console.log("Error: ", error);
    })
  }
});

/** DeepL API */

// const key = "";
// const url = "https://api-free.deepl.com/v2/translate";

// const commentWrapper = document.body;
// commentWrapper.addEventListener("click", (event) => {
//   const comment = event.target.closest("yt-formatted-string");
  
//   if (comment) {
//     fetch(url, {
//       method: "POST",
//       headers: {
//         "Authorization": "DeepL-Auth-Key ${key}",
//         "Content-Type": "application/json",
//       },
//       body: {
//         "text": comment.textContent,
//         "target_lang": "EN",
//       }
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//     })
//     .catch(error => {
//       console.log("Erorr: ", error);
//     })
//   }
// })