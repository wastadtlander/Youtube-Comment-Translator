const languagesAPI = "https://translation.googleapis.com/language/translate/v2/languages?key=${key}";
const languagesJSON = "../data/languages.json";

document.addEventListener("DOMContentLoaded", () => {
    loadSupportedLanguages();
});

/**
 * Loads list of supported languages into a dropdown.
 */
function loadSupportedLanguages() {
    fetch(languagesJSON)
        .then(response => response.json()) 
        .then(data => {
            // Selects the dropdown.
            const dropdown = document.getElementById("languageDropdown");

            // Selects the users local language and sets that as the default.
            const userLanguageCode = navigator.language;
            const userLanguageOption = document.createElement('option');
            userLanguageOption.value = userLanguageCode;
            const userLanguage = data.find((language) => language.code === userLanguageCode);
            userLanguageOption.text = userLanguage.name;
            dropdown.appendChild(userLanguageOption);

            // Appends each language option to the dropdown.
            data.forEach((language) => {
                if (language.code !== userLanguageCode) {
                    const option = document.createElement('option');
                    option.text = language.name;
                    option.value = language.code;
                    dropdown.appendChild(option);
                }
            });
        })
        .catch(error => console.error("Error fetching languages:", error));
}
