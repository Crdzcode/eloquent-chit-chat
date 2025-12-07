# Eloquent Chit Chat  
A lightweight, embeddable chat widget designed for modern web applications. Eloquent Chit Chat provides a clean and professional interface for integrating conversational AI into any frontend project. The library was built with scalability, extensibility, and ease of integration in mind, offering a full chat interface, message handling, customizable themes, and support for pluggable LLM backends.

---

## Live Demo

A live demonstration of the Eloquent Chit Chat widget is available for interactive testing and evaluation.

The demo environment showcases:

- The fully embeddable chat widget running inside a real web application
- Support for both light and dark themes
- LLM integration flow
- Status indicators, animations, and overall user experience

You can access the live demo at:

https://eloquent-chit-chat-integration.vercel.app/

This demo can be used as a reference implementation to understand how the widget behaves in practice and how it can be integrated into other frontend applications.

The repository for the integration project can be accessed at:

https://github.com/Crdzcode/eloquent-chit-chat-integration

---

## About the Build System (tsup)

This library uses tsup as its bundler. tsup is a fast, zero-config build tool powered by esbuild, designed specifically for packaging TypeScript and React component libraries. It outputs ESM, CJS, and type definitions, ensuring compatibility with various project setups.

### Key reasons for choosing tsup:

- Very fast builds due to esbuild

- Minimal configuration required

- Automatic generation of .d.ts type definitions

- Ideal for reusable component libraries published to npm

- Externalizes peer dependencies such as React, reducing bundle size

This setup keeps the package lightweight, maintainable, and ready for production distribution.

---

## Features

### Core Widget Features
- Clean and modern UI designed to blend into any website.
- Expandable and collapsible chat interface with smooth animations.
- Support for user and assistant roles.
- Status awareness (online, maintenance, offline).
- Loading indicator with typing bubbles when awaiting LLM responses.
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
        initialMessages={[
            {
                id: 'welcome',
                role: 'assistant',
                content: 'Hello! How can I assist you today?',
            },
        ]}
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
| `llmClient` | `(params: { messages: ChatMessage[] }) => Promise<string>` | Handler responsible for returning assistant responses. The expected response is an string with the AI response message content |
| `status` | `"online" or "offline" or "maintenance"` | Controls availability and visual indicators. |
| `theme` | `"light" or "dark"` | Switches between predefined themes. |
| `position` | `"bottom-left" or "bottom-right"` | Determines where the widget appears on screen. |

---

## LLM Integration

The widget does not enforce any specific AI provider. Instead, it relies on an injected `llmClient` function, allowing you to define how messages are sent and how responses are retrieved. This design keeps the library frontend-only, lightweight, and compatible with a wide range of deployment environments.

A typical `llmClient` implementation may integrate with:

- A custom backend service (recommended for production)
- OpenAI's Chat Completions API
- Third-party AI orchestration platforms
- Local inference endpoints

### Using the Express backend (recommended for testing)

For development and testing, you can use the included backend example hosted on Render.

This backend was intentionally developed to be simple, and to have a secure integration with OpenAI's API, without exposing the API Key on the Front-end

GIT Repository: 
https://github.com/Crdzcode/eloquent-chit-chat-express

Backend URL:  
https://eloquent-chit-chat-express.onrender.com

Endpoint path:  
`/chat`

Payload format:
```
{
  "messages": [
    {
      "role": "",
      "content": ""
    }
  ]
}
```

It is recommended to configure the backend URL using an environment variable such as:

```
VITE_CHAT_API_URL=https://eloquent-chit-chat-express.onrender.com
```

This avoids hard‑coding endpoints and allows your frontend to switch easily between staging, production, and local development.

### Example client implementation

Below is a complete example of an `llmClient` using the Express backend:

```typescript
import type { ChatMessage } from '@crdzcode/eloquent-chit-chat';

const API_BASE_URL =
  import.meta.env.VITE_CHAT_API_URL ??
  'https://eloquent-chit-chat-express.onrender.com';

export const llmClient = async ({
  messages,
}: {
  messages: ChatMessage[];
}): Promise<string> => {
  const payload = {
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  };

  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error('LLM backend error', res.status, await res.text());
    throw new Error('Failed to retrieve response from backend');
  }

  const data: { reply: string } = await res.json();
  return data.reply;
};
```
---

## Persistence

Eloquent Chit Chat stores the last 10 messages in `localStorage`. This includes both user and assistant messages. On page reload, the chat restores from persistent history unless there isn't any history.

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

### To contribute locally:

```bash
npm install
npm run dev
```

### Build the distributable package:

```bash
npm run build
```

### Pack the distribution for testing:

```bash
npm pack
```

### Clean, build and pack the distribution for testing:

```bash
npm run release
```

### Create a new version
```bash
npm version patch
```

Or

```bash
npm version minor
```

Or

```bash
npm version major
```

### Publish the build version

```bash
npm publish
```

---

## Installing the Library Using the .tgz Package

If you want to test the widget locally before publishing to npm, you can install the .tgz package produced by npm pack.

### Step 1: Build and pack the library

Run:
```bash
npm run release
```

This will clean the output directory, build the library using tsup, and generate a file similar to:
crdzcode-eloquent-chit-chat-1.0.0.tgz

### Step 2: Install the .tgz file in a different project

From your test project, install the file using a relative or absolute path:

```bash
npm install ./path-to-library/crdzcode-eloquent-chit-chat-1.0.0.tgz
```

Or:

```bash
npm install C:/Users/your-user/path/crdzcode-eloquent-chit-chat-1.0.0.tgz
```

### Step 3: Import and use the widget

You can now use the component normally:

```typescript
import { EloquentChitChat } from '@crdzcode/eloquent-chit-chat';

function App() {
return <EloquentChitChat llmClient={llmClient} />;
}
```

This workflow allows you to fully test the widget locally without publishing it to npm. It is the recommended development approach.
