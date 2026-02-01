# Slanger - Generational Slang Translator

A web app that translates normal language into generational slang (Boomer, Millennial, Gen Z, and Gen Alpha).

## Setup

1. **Run the app**
   - Simply open `index.html` in your web browser
   - Or serve it with a local server:
     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js
     npx serve
     ```

2. **Get an OpenAI API Key**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Sign up or log in
   - Navigate to API Keys section
   - Click "Create new secret key"
   - Copy your API key (starts with `sk-`)

3. **Add your API key in the app**
   - In the app, find the "OpenAI API Key" section at the top
   - Paste your API key into the input field
   - Click "Save Key"
   - Your key is stored locally in your browser and never sent anywhere except OpenAI

## Usage

1. Enter and save your OpenAI API key (one-time setup)
2. Type your text in the input box
3. Select which generation you want to translate to (Boomer, Millennial, Gen Z, or Gen Alpha)
4. Click "Translate" or press Ctrl+Enter
5. Your translated text will appear below

## Examples

**Original:** "That's really impressive! You did an excellent job on this project."

**Boomer:** "Well, I'll be! That's top-notch work, son. Back in my day, we'd call that going above and beyond. You've really knocked it out of the park."

**Millennial:** "OMG yaas! This is literally so good! You totally slayed this project. I can't even... it's giving major professional vibes. 10/10, no notes."

**Gen Z:** "No cap, this is bussin fr fr! You ate and left no crumbs, periodt. It's giving main character energy. You understood the assignment!"

**Gen Alpha:** "This is so sigma! You got that rizz with this project, no cap. Absolutely bussin, fanum tax on the haters. Only in Ohio would this not be fire. You're locked in fr!"

## Cost

This app uses OpenAI's GPT-4 API, which costs approximately $0.03 per 1K input tokens and $0.06 per 1K output tokens. Each translation typically costs less than $0.01.

## Security Note

Your API key is stored in your browser's sessionStorage:
- **Session-only**: The key is automatically cleared when you close the tab/browser
- It never leaves your browser except when making requests to OpenAI
- No backend server means your key is never sent to any third party
- More secure than localStorage since it doesn't persist
- You'll need to re-enter your key each time you open the app

For enhanced security:
- Don't share your API key with anyone
- Rotate your API key regularly from the OpenAI dashboard
- Monitor your API usage on the OpenAI platform
- Close the browser tab when done to clear the key
- For production use, consider adding a backend proxy to hide your API key entirely