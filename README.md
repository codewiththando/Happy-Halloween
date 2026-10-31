# 🎃 Happy Halloween

A tiny Halloween page for programmers: a glowing jack-o'-lantern, a code window that types itself, and a pumpkin you can tap to release bats, ghosts and candy.

**Live demo:** https://codewiththando.github.io/Happy-Halloween/

## Features

- Pumpkin drawn in SVG that glows and bobs
- Code snippet that types itself line by line
- Tap the pumpkin to turn the light on and off and send emojis floating up
- Works on phones and desktops
- Respects reduced-motion settings

## Built with

- HTML
- CSS
- JavaScript (no frameworks, no build step)

## Project structure

```
Happy-Halloween/
├── index.html   # page structure and the SVG pumpkin
├── style.css    # colors, layout and animations
└── script.js    # typing effect and pumpkin interaction
```

## Run it locally

1. Clone the repo:
   ```bash
   git clone https://github.com/codewiththando/Happy-Halloween.git
   ```
2. Open `index.html` in your browser, or use the Live Server extension in VS Code.

## Customize it

- Change the `lines` array in `script.js` to write your own code joke.
- Edit the colors in the `:root` block at the top of `style.css`.
- Swap the `emojis` array in `script.js` for your own.

## Author

Made by [@codewiththando](https://github.com/codewiththando). Happy Halloween! 👻