# Youtube Comment Translator

A Chrome extension to automatically translate Youtube comments

Built by [William](https://wastadt.com/) and [Quinn](https://www.quinnha.xyz/)

## Built With

- Javascript
- Google Translate API

## Getting Started

### Code Setup

1. Follow [this link](https://cloud.google.com/apis/docs/getting-started) to create a Google project
2. Add Cloud Translation API to your project
3. Generate a API key
4. Clone this repository

```
git clone https://github.com/wastadtlander/Youtube-Comment-Translator.git
```

5. Replace the key in `content.js` with your API key

```
const key = "keyFromStep3"; // Insert Key Here
```

### Chrome Extension Setup

1. In Chrome, go to `chrome://extensions/`
2. Toggle Developer Mode to On
3. Press "Load Unpacked"
4. Select the folder where the repository is cloned (from step 4 in Code Setup)
5. Ensure the extension is enabled

## How to Use

If you have followed all the instruction above, simply load any video, and comments will be translated automatically. If a comment is not translated, simply click on the comment, and the translation will appear!

## To-do

- [x] Click to translate comment
- [x] Automatically translate all comments on page
- [x] Add translation tag
- [ ] Add pictures/demo to the readme
- [ ] Figure out a way to load in key locally
- [ ] Incorporate local storage for default language selection
- [ ] Make a file for consts for organization
- [ ] Enable translation output to user chosen target languages
- [ ] Migrate to v3 Google Translate API for extended language functionality
- [ ] Package extension and launch!
