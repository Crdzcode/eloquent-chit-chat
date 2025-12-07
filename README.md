# Eloquent Chit Chat  
A lightweight, embeddable chat widget designed for modern web applications. Eloquent Chit Chat provides a clean and professional interface for integrating conversational AI into any frontend project. The library was built with scalability, extensibility, and ease of integration in mind, offering a full chat interface, message handling, customizable themes, and support for pluggable LLM backends.

---

## Features

### Core Widget Features
- Clean and modern UI designed to blend into any website.
- Expandable and collapsible chat interface with smooth animations.
- Message grouping, alignment, and styled conversation bubbles.
- Support for user and assistant roles.
- Status awareness (online, maintenance, offline).
- Loading indicator with typing bubbles when awaiting LLM responses.
- Scroll anchoring to always display the latest message.
- Persistent message history stored in localStorage, retaining the last 10 messages.

### Theming and Styling
- Light and dark mode themes.
- Customizable CSS variables for full UI personalization.
- Adjustable positioning (bottom-left or bottom-right).
- SVG-based UI icons for crisp rendering in all resolutions.

### Developer Experience
- Easily embeddable React component.
- Fully typed with TypeScript.
- Exports a pluggable `llmClient` function for backend communication.
- Can be used with OpenAI, custom APIs, or any other language model endpoint.
- Production-ready build distributed as an npm package.

---

## Installation

Install the package using npm:

```bash
npm install @crdzcode/eloquent-chit-chat
```

If you published under a different registry scope, ensure your `.npmrc` is configured accordingly.

---

## Basic Usage

```tsx
import { EloquentChitChat } from "@crdzcode/eloquent-chit-chat";

function App() {
  const llmClient = async ({ messages }) => {
    const response = await fetch("https://your-express-backend/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });
    const data = await response.json();
    return data.reply;
  };

  return (
    <EloquentChitChat
      title="Eloquent Assistant"
      llmClient={llmClient}
      theme="dark"
      position="bottom-right"
    />
  );
}

export default App;
```

---

## Props

| Prop | Type | Description |
|------|-------|-------------|
| `title` | `string` | Sets the header title for the chat window. |
| `initialMessages` | `ChatMessage[]` | Optional starting messages in the chat history. |
| `messages` | `ChatMessage[]` | External controlled state for messages. |
| `llmClient` | `(params: { messages: ChatMessage[] }) => Promise<string>` | Handler responsible for returning assistant responses. |
| `status` | `"online" | "offline" | "maintenance"` | Controls availability and visual indicators. |
| `theme` | `"light" | "dark"` | Switches between predefined themes. |
| `position` | `"bottom-left" | "bottom-right"` | Determines where the widget appears on screen. |
| `className` | `string` | Allows additional custom class styling. |

---

## LLM Integration

The widget does not enforce any particular model provider. Instead, it uses an injected `llmClient` function. This keeps the library frontend-only and compatible with any deployment environment.

A typical `llmClient` may call:

- A custom backend (recommended)
- OpenAI’s Chat Completions endpoint
- Local inference endpoints
- Third-party AI gateways

Example using an Express backend:

```ts
export async function llmClient({ messages }) {
  const res = await fetch("https://your-backend/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  return data.reply;
}
```

---

## Persistence

Eloquent Chit Chat stores the last 10 messages in `localStorage`. This includes both user and assistant messages. On page reload, the chat restores from persistent history unless overridden by the `initialMessages` prop.

---

## Theming

The widget exposes a set of CSS custom properties allowing full customization. Themes are defined in `vars.css` and can be extended or replaced.

Example:

```css
:root {
  --ecc-light-bg: #ffffff;
  --ecc-light-surface: #f5f5f7;
  --ecc-light-text-user: #111111;
  --ecc-light-text-bot: #333333;

  --ecc-dark-bg: #0b0b0d;
  --ecc-dark-surface: #1a1a1e;
  --ecc-dark-text-user: #ffffff;
  --ecc-dark-text-bot: #e1e1e1;
}
```

---

## Animations

The widget uses a mount-aware animation strategy to allow smooth transitions both when opening and closing the chat interface. This avoids the limitations of pure conditional rendering and CSS alone.

---

## Development

To contribute locally:

```bash
npm install
npm run dev
```

Build the distributable package:

```bash
npm run build
```

Pack the distribution for testing:

```bash
npm run release
```

Install the generated `.tgz` in another project to test integration.

---

## License

This project is licensed under the MIT License.

