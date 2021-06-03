import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const styleElement = document.createElement('style');
styleElement.textContent = `
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  @media (prefers-reduced-motion: no-preference) {
    :root {
      scroll-behavior: smooth;
    }
  }

  html,
  body {
    margin: 0;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans',
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    overflow: hidden;
  }

  html *,
  body * {
    user-select: none;
  }

  ul {
    padding: unset;
    margin: unset;
  }

  li {
    list-style: none;
  }

  svg {
    width: 100%;
    height: auto;
  }
`;

document.head.appendChild(styleElement);

ReactDOM.render(<App />, document.getElementById('app'));
