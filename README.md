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

5. Creata a `.env` file in the root directory
6. Add the line

```
REACT_APP_GOOGLE_TRANSLATE_API_KEY=your-key-here
```

7. Run the following commands:

```
cd Youtube-Comment-Translator
npm init
npm run build
```

### Chrome Extension Setup

1. In Chrome, go to `chrome://extensions/`
2. Toggle Developer Mode to On
3. Press "Load Unpacked"
4. Select the build folder where the repository is cloned (/build)
5. Ensure the extension is enabled

## How to Use

If you have followed all the instruction above, simply load any video, and comments will be translated automatically. If a comment is not translated, simply click on the comment, and the translation will appear!

## To-do

- [x] Click to translate comment
- [x] Automatically translate all comments on page
- [x] Add translation tag
- [x] Migrate to React
- [x] Figure out a way to load in key locally
- [ ] Add pictures/demo to the readme
- [ ] Incorporate local storage for default language selection
- [ ] Make a file for consts for organization
- [ ] Enable translation output to user chosen target languages
- [ ] Migrate to v3 Google Translate API for extended language functionality
- [ ] Package extension and launch!
