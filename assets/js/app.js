// Configuration
const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY_STORAGE_KEY = 'openai_api_key';

// DOM Elements
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const translateBtn = document.getElementById('translate-btn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const genButtons = document.querySelectorAll('.gen-btn');

// API Key elements
const apiKeyInput = document.getElementById('api-key-input');
const apiKeyStatus = document.getElementById('api-key-status');
const saveKeyBtn = document.getElementById('save-key-btn');
const toggleKeyBtn = document.getElementById('toggle-key');

let selectedGeneration = 'boomer';

// Generation-specific prompts
const generationPrompts = {
    boomer: {
        name: 'Baby Boomer',
        tone: 'Formal, earnest, nostalgic, and slightly verbose. Values hard work and face-to-face communication.',
        examples: [
            { input: "That's really good!", output: "Well, I'll be! That's [[top-notch]] work right there." },
            { input: "Let me know when you're ready.", output: "Give me a [[ring]] when you're all set, and we'll get the ball rolling." }
        ],
        instruction: `Translate into Baby Boomer slang and speech patterns. Use phrases like "back in my day", "kids these days", reference rotary phones, newspapers, handwritten letters, face-to-face conversations, hard work ethics, and formal language. Be authentic and slightly nostalgic.`
    },
    millennial: {
        name: 'Millennial',
        tone: 'Self-aware, ironic, casually anxious. References work-life balance, social media, and existential humor.',
        examples: [
            { input: "That's really good!", output: "OMG [[yaas]]! This is [[literally]] so good, I [[can't even]]." },
            { input: "Let me know when you're ready.", output: "Just hit me up when you're done [[adulting]] and we can make it happen." }
        ],
        instruction: `Translate into Millennial slang and speech patterns. Use phrases like "adulting", "literally", "I can't even", "lowkey/highkey", "on fleek", "yaas", "slay", references to social media, student loans, avocado toast, Netflix, and startup culture. Be ironic and self-aware.`
    },
    genz: {
        name: 'Gen Z',
        tone: 'Extremely casual, abbreviated, internet-native. Confident and direct with heavy use of trending slang.',
        examples: [
            { input: "That's really good!", output: "[[No cap]], this is [[bussin]] [[fr fr]]! You [[ate]] and left no crumbs." },
            { input: "Let me know when you're ready.", output: "Lmk when ur ready and we can link, [[periodt]]." }
        ],
        instruction: `Translate into Gen Z slang and speech patterns. Use phrases like "no cap", "fr fr", "bussin", "slay", "periodt", "it's giving", "ate and left no crumbs", "main character energy", "understood the assignment", lots of abbreviations, TikTok references, and internet culture. Be extremely casual and use trending slang.`
    },
    genalpha: {
        name: 'Gen Alpha',
        tone: 'Meme-heavy, gaming-influenced, very online. Chaotic energy with heavy slang mixing.',
        examples: [
            { input: "That's really good!", output: "This is so [[sigma]]! You got that [[rizz]] with this, [[no cap]]. Absolutely [[bussin]]." },
            { input: "Let me know when you're ready.", output: "Yo lmk when ur [[locked in]] and we can [[griddy]] on this fr." }
        ],
        instruction: `Translate into Gen Alpha slang and speech patterns. Use phrases like "sigma", "rizz", "skibidi", "fanum tax", "gyat", "ohio", "only in ohio", "griddy", gaming terms, YouTube and streaming culture references, iPad kid energy, and very online terminology. Be extremely casual and reference memes and gaming culture heavily.`
    }
};

// API Key Management
function getApiKey() {
    return sessionStorage.getItem(API_KEY_STORAGE_KEY);
}

function saveApiKey(key) {
    if (key && key.trim()) {
        sessionStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
        updateApiKeyStatus(true);
        return true;
    }
    return false;
}

function updateApiKeyStatus(hasSaved = null) {
    const hasKey = hasSaved !== null ? hasSaved : !!getApiKey();

    if (hasKey) {
        apiKeyStatus.textContent = '✓ Saved';
        apiKeyStatus.className = 'api-key-status saved';
    } else {
        apiKeyStatus.textContent = '⚠ Not saved';
        apiKeyStatus.className = 'api-key-status not-saved';
    }
}

function loadApiKey() {
    const savedKey = getApiKey();
    // Don't pre-fill the input for security, but show status if key exists
    if (savedKey) {
        updateApiKeyStatus(true);
    } else {
        updateApiKeyStatus(false);
    }
}

// Event Listeners
genButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        genButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedGeneration = btn.dataset.gen;
    });
});

translateBtn.addEventListener('click', translateText);

inputText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        translateText();
    }
});

saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        if (saveApiKey(key)) {
            showSuccess('API key saved successfully!');
        }
    } else {
        showError('Please enter a valid API key');
    }
});

toggleKeyBtn.addEventListener('click', () => {
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleKeyBtn.textContent = '🙈';
    } else {
        apiKeyInput.type = 'password';
        toggleKeyBtn.textContent = '👁️';
    }
});

// Highlight slang terms marked with [[brackets]]
function highlightSlang(text) {
    // Escape HTML to prevent XSS, then convert markers to highlights
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    // Replace [[slang]] markers with highlighted spans
    const highlighted = escaped.replace(/\[\[(.+?)\]\]/g, '<mark class="slang-highlight">$1</mark>');

    return highlighted;
}

// Main translation function
async function translateText() {
    const text = inputText.value.trim();

    if (!text) {
        showError('Please enter some text to translate');
        return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        showError('Please enter and save your OpenAI API key first');
        return;
    }

    // Show loading state
    loading.classList.add('show');
    error.classList.remove('show');
    translateBtn.disabled = true;
    outputText.textContent = '';
    outputText.classList.remove('has-content');

    try {
        const generation = generationPrompts[selectedGeneration];

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4.1',
                messages: [
                    {
                        role: 'system',
                        content: `You are a slang translator that converts normal text into ${generation.name} slang and speech patterns.

TONE & STYLE: ${generation.tone}

Here are examples of good ${generation.name} translations:
${generation.examples.map(ex => `Input: "${ex.input}" → Output: "${ex.output}"`).join('\n')}

IMPORTANT: Wrap ONLY generation-specific slang in double brackets like [[this]].

What TO mark:
- Slang words/phrases that are DISTINCTLY used by ${generation.name} (not other generations)
- Generation-specific catchphrases that would clearly identify this generation
- Signature interjections or expressions unique to this era

What NOT to mark:
- Common words that all generations use (even if informal)
- Standard English or basic slang used across generations
- Technical terms, proper nouns, articles, prepositions
- Words you added just for natural flow, not for generational flavor

Be selective - only mark what truly identifies this as ${generation.name} speech.

${generation.instruction}

Only output the translated text with marked slang, nothing else.`
                    },
                    {
                        role: 'user',
                        content: `Text to translate: "${text}"`
                    }
                ],
                temperature: 0.8,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const data = await response.json();
        const translation = data.choices[0].message.content.trim();

        // Parse and highlight slang terms
        const highlightedTranslation = highlightSlang(translation);

        // Display result
        outputText.innerHTML = highlightedTranslation;
        outputText.classList.add('has-content');

    } catch (err) {
        showError(`Translation failed: ${err.message}`);
    } finally {
        loading.classList.remove('show');
        translateBtn.disabled = false;
    }
}

function showError(message) {
    error.textContent = message;
    error.classList.add('show');
    setTimeout(() => {
        error.classList.remove('show');
    }, 5000);
}

function showSuccess(message) {
    // Reuse error div but with success styling
    error.textContent = '✓ ' + message;
    error.style.background = '#d4edda';
    error.style.borderColor = '#c3e6cb';
    error.style.color = '#155724';
    error.classList.add('show');
    setTimeout(() => {
        error.classList.remove('show');
        // Reset to error styling
        error.style.background = '';
        error.style.borderColor = '';
        error.style.color = '';
    }, 3000);
}

// Initialize on load
window.addEventListener('load', () => {
    inputText.placeholder = "Type something here... e.g., 'That's really impressive! You did an excellent job on this project.'";
    loadApiKey();
});
