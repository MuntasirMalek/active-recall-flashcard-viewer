# Active Recall Flashcard Viewer 📚

A clean, distraction-free flashcard study app inspired by NotebookLM's flashcard interface. Import your own CSV files and study with a beautiful, modern UI.

## 🚀 Live Demo

**[Try it now on GitHub Pages →](https://MuntasirMalek.github.io/active-recall-flashcard-viewer/)**

## ✨ Features

- **📱 Installable PWA:**
  - Install on Chrome/Android as a standalone app
  - Works offline once installed
  - App icon with flashcard theme

- **⭐ Favorites System:**
  - Star cards you struggle with during review
  - Filter to show only favorites for focused practice
  - Reddish theme when in favorites mode
  - Favorites persist across sessions

- **CSV Import/Export:**
  - Drag & drop or browse to import CSV files
  - Simple `Question,Answer` format
  - Smart export: exports favorites-only when in filter mode
  - Custom filename prompt on export

- **Study Interface:**
  - Click or tap to flip cards
  - Smooth 3D flip animation
  - Card deck shadow effect
  - Navigation arrows (side on desktop, bottom on mobile)
  - Progress tracking (current card / total)

- **Keyboard Shortcuts:**
  - `Space` - Flip card
  - `←` / `→` - Previous / Next card

- **Touch Support:**
  - Swipe left/right to navigate (won't trigger during scroll)
  - Tap to flip

- **Shuffle Mode:**
  - Randomize card order for better retention
  - Always shows a new card after shuffle

- **Mobile-First Design:**
  - Responsive layout that looks great on any device
  - Large, readable text
  - Touch-optimized controls

## 🛠️ Tech Stack

- Vanilla HTML, CSS, JavaScript
- No frameworks or dependencies
- Progressive Web App (PWA) with Service Worker
- LocalStorage for favorites persistence
- Relative paths for easy deployment

## 📦 Installation

### Install as App (Recommended)
1. Visit the [GitHub Pages link](https://MuntasirMalek.github.io/active-recall-flashcard-viewer/)
2. Click "Install" in your browser's address bar (Chrome/Edge) or "Add to Home Screen" (mobile)

### Use Online
Simply visit the link and start studying - no installation required!

### Self-Host
1. Clone the repository:
   ```bash
   git clone https://github.com/MuntasirMalek/active-recall-flashcard-viewer.git
   ```
2. Serve with any static server:
   ```bash
   cd active-recall-flashcard-viewer
   python3 -m http.server 8000
   ```
3. Open http://localhost:8000

## 📁 Project Structure

```
active-recall-flashcard-viewer/
├── index.html      # Main app
├── script.js       # Card logic, favorites, CSV parsing
├── styles.css      # Styling and animations
├── sw.js           # Service Worker for PWA
├── manifest.json   # PWA manifest
├── logo.svg        # App icon
└── README.md       # This file
```

## 📝 CSV Format

Create your own flashcards using this simple format:

```csv
Question,Answer
What is the capital of France?,Paris
What year did WW2 end?,1945
"What is 2+2?","4"
```

**Notes:**
- First row can be a header (optional, will be skipped if it looks like one)
- Use quotes around fields containing commas
- Supports multiple lines per field when quoted

## 🎯 How It Works

1. **Try Demo** - Click "Try Demo" to see example cards instantly
2. **Import** - Drop a CSV file or click the import button
3. **Study** - Cards appear with question side up
4. **Flip** - Click/tap or press Space to see the answer
5. **Star** - Tap the ⭐ on cards you struggle with
6. **Filter** - Tap the star button in footer to review only favorites
7. **Navigate** - Use arrows, keyboard, or swipe
8. **Shuffle** - Randomize order for spaced repetition
9. **Export** - Save your deck (or just favorites) back to CSV

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use in your own projects!

---

Made with ❤️ for focused learning
