// ===== State =====
let cards = [];
let currentIndex = 0;
let isFlipped = false;

// ===== DOM Elements =====
const welcomeScreen = document.getElementById('welcome-screen');
const flashcardView = document.getElementById('flashcard-view');
// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

const dropzone = document.getElementById('dropzone');
const browseBtn = document.getElementById('browse-btn');
const fileInput = document.getElementById('file-input');
const fileInputHeader = document.getElementById('file-input-header');

const flashcard = document.getElementById('flashcard');
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtnDesktop = document.getElementById('prev-btn-desktop');
const nextBtnDesktop = document.getElementById('next-btn-desktop');
const shuffleBtn = document.getElementById('shuffle-btn');
const importBtn = document.getElementById('import-btn');
const exportBtn = document.getElementById('export-btn');

const currentIndexEl = document.getElementById('current-index');
const totalCardsEl = document.getElementById('total-cards');
const currentIndexDesktopEl = document.getElementById('current-index-desktop');
const totalCardsDesktopEl = document.getElementById('total-cards-desktop');
const demoBtn = document.getElementById('demo-btn');

// ===== Demo Cards =====
const DEMO_CARDS = [
    {
        question: "In the field of deep learning, what is the name of the specific neural network architecture introduced in 2017 that relies entirely on a mechanism called \"self-attention\" to weigh the significance of different input data, famously enabling modern Large Language Models?",
        answer: "The Transformer"
    },
    {
        question: "What does HTML stand for?",
        answer: "HyperText Markup Language"
    },
    {
        question: "Who wrote Romeo and Juliet?",
        answer: "William Shakespeare"
    }
];

// ===== CSV Parser =====
function parseCSV(text) {
    const lines = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (current.trim()) {
                lines.push(current);
            }
            current = '';
            if (char === '\r' && nextChar === '\n') {
                i++;
            }
        } else {
            current += char;
        }
    }

    if (current.trim()) {
        lines.push(current);
    }

    return lines.map(line => {
        const result = [];
        let field = '';
        let inFieldQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inFieldQuotes && nextChar === '"') {
                    field += '"';
                    i++;
                } else {
                    inFieldQuotes = !inFieldQuotes;
                }
            } else if (char === ',' && !inFieldQuotes) {
                result.push(field.trim());
                field = '';
            } else {
                field += char;
            }
        }

        result.push(field.trim());
        return result;
    }).filter(row => row.length >= 2 && row[0] && row[1]);
}

// ===== CSV Generator =====
function generateCSV(cards) {
    return cards.map(card => {
        const question = card.question.includes(',') || card.question.includes('"') || card.question.includes('\n')
            ? `"${card.question.replace(/"/g, '""')}"`
            : card.question;
        const answer = card.answer.includes(',') || card.answer.includes('"') || card.answer.includes('\n')
            ? `"${card.answer.replace(/"/g, '""')}"`
            : card.answer;
        return `${question},${answer}`;
    }).join('\n');
}

// ===== File Handling =====
function handleFile(file) {
    if (!file || !file.name.endsWith('.csv')) {
        alert('Please select a valid CSV file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const parsed = parseCSV(text);

        if (parsed.length === 0) {
            alert('No valid flashcards found in the CSV file.');
            return;
        }

        cards = parsed.map(row => ({
            question: row[0],
            answer: row[1]
        }));

        currentIndex = 0;
        isFlipped = false;

        showFlashcardView();
        updateCard();
    };
    reader.readAsText(file);
}

// ===== UI Updates =====
function showFlashcardView() {
    welcomeScreen.classList.add('hidden');
    flashcardView.classList.remove('hidden');
}

function showWelcomeScreen() {
    flashcardView.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
}

function updateCard() {
    if (cards.length === 0) return;

    const card = cards[currentIndex];
    questionText.textContent = card.question;
    answerText.textContent = card.answer;

    // Reset flip state
    isFlipped = false;
    flashcard.classList.remove('flipped');

    // Update progress (both mobile and desktop)
    currentIndexEl.textContent = currentIndex + 1;
    totalCardsEl.textContent = cards.length;
    if (currentIndexDesktopEl) currentIndexDesktopEl.textContent = currentIndex + 1;
    if (totalCardsDesktopEl) totalCardsDesktopEl.textContent = cards.length;

    // Update button states
    updateNavigationButtons();

    // Check for overflow after render
    setTimeout(checkOverflow, 50);
}

// Check if card content overflows and add indicator class
function checkOverflow() {
    const contents = document.querySelectorAll('.card-content');
    contents.forEach(el => {
        const hasOverflow = el.scrollHeight > el.clientHeight + 10;

        if (hasOverflow) {
            // Check if scrolled to bottom
            const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
            if (isAtBottom) {
                el.classList.remove('has-overflow');
            } else {
                el.classList.add('has-overflow');
            }

            // Add scroll listener if not already added
            if (!el.dataset.scrollListener) {
                el.dataset.scrollListener = 'true';
                el.addEventListener('scroll', () => {
                    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
                    if (atBottom) {
                        el.classList.remove('has-overflow');
                    } else if (el.scrollHeight > el.clientHeight + 10) {
                        el.classList.add('has-overflow');
                    }
                });
            }
        } else {
            el.classList.remove('has-overflow');
        }
    });
}

function updateNavigationButtons() {
    // Cards loop - always enabled
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    if (prevBtnDesktop) prevBtnDesktop.disabled = false;
    if (nextBtnDesktop) nextBtnDesktop.disabled = false;
}

function flipCard() {
    isFlipped = !isFlipped;
    flashcard.classList.toggle('flipped', isFlipped);
}

function nextCard() {
    if (cards.length === 0) return;
    currentIndex = (currentIndex + 1) % cards.length;
    updateCard();
}

function prevCard() {
    if (cards.length === 0) return;
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCard();
}

function shuffleCards() {
    if (cards.length === 0) return;

    const previousCard = cards[currentIndex];

    // Fisher-Yates shuffle
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    // UX Improvement: If the new first card is the same as the one user was just looking at,
    // swap it with the last card so the user sees something new immediately.
    if (cards.length > 1 && cards[0] === previousCard) {
        [cards[0], cards[cards.length - 1]] = [cards[cards.length - 1], cards[0]];
    }

    currentIndex = 0;
    updateCard();
}

function exportCards() {
    if (cards.length === 0) {
        alert('No cards to export.');
        return;
    }

    const csv = generateCSV(cards);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'flashcards.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ===== Event Listeners =====

// Dropzone
dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
    e.target.value = '';
});

// Header buttons
importBtn.addEventListener('click', () => fileInputHeader.click());

fileInputHeader.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
    e.target.value = '';
});

exportBtn.addEventListener('click', exportCards);
shuffleBtn.addEventListener('click', shuffleCards);

// Demo button
demoBtn.addEventListener('click', () => {
    cards = [...DEMO_CARDS];
    currentIndex = 0;
    isFlipped = false;
    showFlashcardView();
    updateCard();
});

// Card flip
flashcard.addEventListener('click', flipCard);

// Navigation (mobile)
prevBtn.addEventListener('click', prevCard);
nextBtn.addEventListener('click', nextCard);

// Navigation (desktop)
if (prevBtnDesktop) prevBtnDesktop.addEventListener('click', prevCard);
if (nextBtnDesktop) nextBtnDesktop.addEventListener('click', nextCard);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (flashcardView.classList.contains('hidden')) return;

    switch (e.key) {
        case ' ':
        case 'Spacebar':
            e.preventDefault();
            flipCard();
            break;
        case 'ArrowRight':
        case 'Right':
            nextCard();
            break;
        case 'ArrowLeft':
        case 'Left':
            prevCard();
            break;
    }
});

// ===== Local Storage =====
function saveProgress() {
    if (cards.length === 0) return;
    localStorage.setItem('flashcards_index', currentIndex.toString());
}

function loadProgress() {
    const saved = localStorage.getItem('flashcards_index');
    if (saved !== null) {
        const index = parseInt(saved, 10);
        if (!isNaN(index) && index >= 0 && index < cards.length) {
            currentIndex = index;
        }
    }
}

// Save progress on navigation
const originalNextCard = nextCard;
const originalPrevCard = prevCard;

nextCard = function () {
    originalNextCard();
    saveProgress();
};

prevCard = function () {
    originalPrevCard();
    saveProgress();
};

// ===== Touch Swipe Support =====
let touchStartX = 0;
let touchEndX = 0;

flashcard.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

flashcard.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const threshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
        // Swipe left - next card
        nextCard();
    } else {
        // Swipe right - previous card
        prevCard();
    }
}

// ===== Initialize =====
console.log('Flashcards app loaded. Import a CSV to get started!');
