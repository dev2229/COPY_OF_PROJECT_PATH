
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("ProjectPath: Booting architectural engine...");

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("ProjectPath: System ready.");
  } catch (err) {
    console.error("ProjectPath: Mount Exception:", err);
    rootElement.innerHTML = `<div style="color: white; padding: 50px;">Mount Failed: ${err instanceof Error ? err.message : 'Unknown'}</div>`;
  }
}
