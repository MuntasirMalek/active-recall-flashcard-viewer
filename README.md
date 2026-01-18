# Flashcard Viewer 📚

A clean, distraction-free flashcard study app inspired by NotebookLM's flashcard interface. Import your own CSV files and study with a beautiful, modern UI.

## 🚀 Live Demo

**[Try it now on GitHub Pages →](https://MuntasirMalek.github.io/flashcard-viewer/)**

## ✨ Features

- **CSV Import/Export:**
  - Drag & drop or browse to import CSV files
  - Simple `Question,Answer` format
  - Export your deck back to CSV anytime

- **Study Interface:**
  - Click or tap to flip cards
  - Smooth 3D flip animation
  - Navigation arrows (side on desktop, bottom on mobile)
  - Progress tracking (current card / total)

- **Keyboard Shortcuts:**
  - `Space` - Flip card
  - `←` / `→` - Previous / Next card

- **Touch Support:**
  - Swipe left/right to navigate
  - Tap to flip

- **Shuffle Mode:**
  - Randomize card order for better retention

- **Mobile-First Design:**
  - Responsive layout that looks great on any device
  - Large, readable text
  - Touch-optimized controls

## 🛠️ Tech Stack

- Vanilla HTML, CSS, JavaScript
- No frameworks or dependencies
- Works offline once loaded
- Relative paths for easy deployment

## 📦 Installation

### Use Online
Simply visit the [GitHub Pages link](https://MuntasirMalek.github.io/flashcard-viewer/) and start studying!

### Self-Host
1. Clone the repository:
   ```bash
   git clone https://github.com/MuntasirMalek/flashcard-viewer.git
   ```
2. Open `index.html` in your browser, or serve with any static server:
   ```bash
   cd flashcard-viewer
   python3 -m http.server 3000
   ```
3. Open http://localhost:3000

## 📁 Project Structure

```
flashcard-viewer/
├── index.html      # Main app
├── script.js       # Card logic, CSV parsing, navigation
├── styles.css      # Styling and animations
├── demo.csv        # Example flashcard deck
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

1. **Import** - Drop a CSV file or click to browse
2. **Study** - Cards appear with question side up
3. **Flip** - Click/tap or press Space to see the answer
4. **Navigate** - Use arrows, keyboard, or swipe
5. **Shuffle** - Randomize order for spaced repetition
6. **Export** - Save your deck back to CSV

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use in your own projects!

---

Made with ❤️ for focused learning
