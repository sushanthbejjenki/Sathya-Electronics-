# Sathya Electronics website

Website for Sathya Electronics: COF bonding, TV screen repair and sales.

## Run in VS Code
1. Open VS Code, choose **File > Open Folder** and select this folder.
2. When VS Code suggests the **Live Server** extension, click Install.
3. Right-click `index.html` and choose **Open with Live Server**.

You can also just double-click `index.html` to open it in a browser.
Fonts load from Google Fonts, so an internet connection is needed to see them.

## Files
- `index.html`: the page content
- `css/style.css`: colours, fonts and layout
- `js/main.js`: the photo upload preview and the WhatsApp booking form
- `images/`: workshop photos

## Things to edit
- **Phone numbers:** search `9177638337` and `9963909181` in `index.html` and `js/main.js`.
- **Shop timings:** the contact section says "Call to confirm shop timings".
- **Panels in stock photo:** find `Photo: panels in stock` in `index.html` and replace that block with
  `<figure class="fig"><img src="images/panels.jpg" alt="New panels in stock"></figure>`.
- **Colours:** change the values at the top of `css/style.css` (`--yellow`, `--blue`, `--red`).

## Publishing
Upload the whole folder to any web host (Netlify, GitHub Pages, or your hosting provider).
