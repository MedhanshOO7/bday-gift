# 💝 For You, Lily — A Romantic Interactive Website

A beautiful, animated, single-page romantic experience built with pure HTML, CSS, and JavaScript. No frameworks needed.

---

## 🌸 Features

- **Interactive Question Page** — Playful "No" button that dodges clicks
- **Celebration Animation** — Hearts, sparkles, blooming lilies, typing effect
- **Memory Book** — Polaroid-style photo gallery with scroll animations
- **Background Music** — Easy to add your own romantic track
- **Fully Responsive** — Works beautifully on desktop, tablet, and mobile
- **Offline Ready** — No external dependencies besides Google Fonts

---

## 📁 Project Structure

```
bday/
├── index.html              ← Main HTML file
├── style.css               ← All styles and animations
├── script.js               ← All interactions and effects
├── assets/
│   ├── images/             ← Place your photos here
│   │   ├── photo1.jpg
│   │   ├── photo2.jpg
│   │   ├── photo3.jpg
│   │   ├── photo4.jpg
│   │   ├── photo5.jpg
│   │   └── photo6.jpg
│   └── music/
│       └── romantic.mp3    ← Place your music here
└── README.md
```

---

## 🎨 How to Customize

### 1. Change the Name
In `script.js`, edit the `CONFIG` object at the top:
```javascript
const CONFIG = {
  partnerName: "Lily",  // ← Change this
```

In `index.html`, find:
```html
<h1 class="heading-name">Hey Lily ❤️</h1>  <!-- ← Change this -->
```

### 2. Change the Question
In `index.html`, find:
```html
<p id="question-text" class="question hidden-text">
    Will you stay with me forever?  <!-- ← Change this -->
</p>
```

### 3. Change the Celebration Messages
In `script.js`, edit:
```javascript
celebrationMessages: [
    "You just made me the happiest person alive ❤️",  // ← Change these
    "For you, Lily 🌸",
],
```

### 4. Add Your Paragraph
In `index.html`, find and replace:
```html
<p id="custom-paragraph">
    {{CUSTOM_PARAGRAPH}}  <!-- ← Replace with your message -->
</p>
```

### 5. Add Your Photos
Place your photos in `assets/images/` named:
- `photo1.jpg`
- `photo2.jpg`
- `photo3.jpg`
- `photo4.jpg`
- `photo5.jpg`
- `photo6.jpg`

You can use any image format (`.jpg`, `.png`, `.webp`) — just update the `src` in `index.html`.

### 6. Add Your Music
Place your `.mp3` file in `assets/music/` and name it `romantic.mp3`.

Or update the path in both:
- `index.html`: `<source src="assets/music/romantic.mp3">`
- `script.js`: `musicFilePath: "assets/music/romantic.mp3"`

### 7. Change Colors
In `style.css`, edit the CSS variables at the top:
```css
:root {
  --pink-soft:       #ffc2d1;
  --pink-medium:     #ff85a1;
  --pink-vivid:      #ff6b9d;
  --lavender-light:  #e8b4f8;
  /* ... etc */
}
```

### 8. Change Funny Messages
In `script.js`, edit:
```javascript
funnyMessages: [
    "Are you sure? 🥺",
    "Think again ❤️",
    // ... add or change messages
],
```

---

## 🚀 How to Run

Simply open `index.html` in any modern browser:

```bash
# Option 1: Direct open
open index.html

# Option 2: Python local server (for music to work in some browsers)
python3 -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Node local server
npx serve .
```

> **Note:** Background music requires a local server in some browsers due to CORS restrictions.

---

## 📱 Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+
- Mobile Chrome & Safari

---

## 💕 Made with love.
