PromptGenie is a modern web application built with React and TailwindCSS that provides a comprehensive set of tools for creating, testing, and managing AI prompts.

### Key Features

- Interactive Workbench: A structured editor for creating prompts using frameworks like CRISPE, RACE, Chain-of-Thought, and others

- AI Playground: Immediate testing of prompts with various AI models from:
    - Google (Gemini)
    - OpenAI (GPT)
    - Anthropic (Claude)
    - xAI (Grok)

- Prompt Gallery: Organization and management of prompt collections for different categories:
    - Text
    - Code
    - Images
    - Audio
    - Music
    - Video

- Integrated Documentation: Comprehensive guides on prompting frameworks and API integration examples


### Prerequisites:

You need to have [Node.js](https://nodejs.org/) (which includes npm) installed on your computer.

---

### Step-by-Step Guide:

**1. Clone Repository**

Open your terminal or command prompt and run the following command to clone the repository `promptgebnie`.

```bash
git clone https://github.com/swissmarley/promptgenie.git
```

**2. Navigate into Your Project**

Change your directory to the project root folder:
```bash
cd promptgenie
```

**3. Install Dependencies**

The app requires a few packages. Let's install them:

* **Lucide Icons:** For all the icons used in the app.
* **Tailwind CSS:** For all the styling.

Run the following commands:
```bash
npm install
npm install lucide-react
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

**4. Configure Tailwind CSS**

Open the generated `tailwind.config.js` file and replace its content with this:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
Next, open the `src/index.css` file, delete everything inside, and add these three lines:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
This sets up Tailwind to style your components.


**5. Run the Development Server**

You're all set! Run the final command in your terminal:
```bash
npm run dev
```

This will start the local development server, and you'll see a URL in your terminal (usually `http://localhost:5173`). Open that URL in your web browser to see and interact with your local version of the PromptCraft app.