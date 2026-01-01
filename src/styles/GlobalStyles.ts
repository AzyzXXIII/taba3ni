import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
/* ============================================
   CSS VARIABLES - Light & Dark Mode
   ============================================ */

/* Light mode (default) */
:root,
:root.light-mode {
  /* Brand Colors - Your Dairy Blue Palette */
  --color-brand-50: #b1d4e0;  /* lightest - for backgrounds */
  --color-brand-100: #2e8bc0; /* light */
  --color-brand-200: #145da0; /* medium */
  --color-brand-500: #0c2d48; /* primary - main brand color */
  --color-brand-600: #145da0; /* hover states */
  --color-brand-700: #2e8bc0; /* active states */
  --color-brand-800: #0c2d48; /* dark accent */
  --color-brand-900: #0c2d48; /* darkest */

  /* Grey Scale */
  --color-grey-0: #fff;
  --color-grey-50: #f9fafb;
  --color-grey-100: #f3f4f6;
  --color-grey-200: #e5e7eb;
  --color-grey-300: #d1d5db;
  --color-grey-400: #9ca3af;
  --color-grey-500: #6b7280;
  --color-grey-600: #4b5563;
  --color-grey-700: #374151;
  --color-grey-800: #1f2937;
  --color-grey-900: #111827;

  /* Status Colors */
  --color-blue-100: #57bcffff;
  --color-blue-700: #0369a1;
  --color-green-100: #1cf769ff;
  --color-green-700: #00722aff;
  --color-yellow-100: #fef9c3;
  --color-yellow-700: #a16207;
  --color-silver-100: #e5e7eb;
  --color-silver-700: #374151;
  --color-red-100: #fee2e2;
  --color-red-700: #b91c1c;
  --color-red-800: #991b1b;

  /* UI Elements */
  --backdrop-color: rgba(255, 255, 255, 0.1);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  
  /* Border Radius */
  --border-radius-tiny: 3px;
  --border-radius-sm: 5px;
  --border-radius-md: 7px;
  --border-radius-lg: 9px;

  /* Images */
  --image-grayscale: 0;
  --image-opacity: 100%;
}

/* Dark mode */
:root.dark-mode {
  /* Brand Colors Inverted */
  --color-brand-50: #0c2d48;
  --color-brand-100: #145da0;
  --color-brand-200: #2e8bc0;
  --color-brand-500: #b1d4e0;
  --color-brand-600: #2e8bc0;
  --color-brand-700: #145da0;
  --color-brand-800: #0c2d48;
  --color-brand-900: #0c2d48;

  /* Grey Scale Inverted */
  --color-grey-0: #18212f;
  --color-grey-50: #111827;
  --color-grey-100: #1f2937;
  --color-grey-200: #374151;
  --color-grey-300: #4b5563;
  --color-grey-400: #6b7280;
  --color-grey-500: #9ca3af;
  --color-grey-600: #d1d5db;
  --color-grey-700: #e5e7eb;
  --color-grey-800: #f3f4f6;
  --color-grey-900: #f9fafb;

  /* Status Colors Dark */
  --color-blue-100: #1e3a8a;
  --color-blue-700: #dbeafe;
  --color-green-100: #14532d;
  --color-green-700: #dcfce7;
  --color-yellow-100: #92400e;
  --color-yellow-700: #fef9c3;
  --color-silver-100: #374151;
  --color-silver-700: #e5e7eb;
  --color-red-100: #7f1d1d;
  --color-red-700: #fca5a5;
  --color-red-800: #dc2626;

  /* UI Elements Dark */
  --backdrop-color: rgba(0, 0, 0, 0.3);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

  /* Images Dark */
  --image-grayscale: 10%;
  --image-opacity: 90%;
}

/* ============================================
   RESET & BASE STYLES
   ============================================ */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 62.5%; /* 1rem = 10px */
  overflow-x: hidden;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif;
  font-size: 1.6rem;
  line-height: 1.6;
  color: var(--color-grey-700);
  background-color: var(--color-grey-0);
  transition: background-color 0.3s ease, color 0.3s ease;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-grey-900);
}

h1 { font-size: 3.2rem; }
h2 { font-size: 2.4rem; }
h3 { font-size: 2rem; }
h4 { font-size: 1.8rem; }
h5 { font-size: 1.6rem; }
h6 { font-size: 1.4rem; }

p {
  margin-bottom: 1rem;
}

a {
  color: var(--color-brand-600);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--color-brand-700);
}

/* Form Elements */
input,
textarea,
select,
button {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  border: none;
  outline: none;
}

button {
  cursor: pointer;
  transition: all 0.2s ease;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

input:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-600);
  outline-offset: 2px;
}

/* Lists */
ul, ol {
  list-style: none;
}

/* Images */
img {
  max-width: 100%;
  display: block;
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 1rem;
}

::-webkit-scrollbar-track {
  background: var(--color-grey-100);
}

::-webkit-scrollbar-thumb {
  background: var(--color-grey-400);
  border-radius: var(--border-radius-md);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-brand-600);
}

/* Selection */
::selection {
  background-color: var(--color-brand-200);
  color: var(--color-grey-0);
}

/* ============================================
   UTILITY CLASSES
   ============================================ */

.container {
  max-width: 120rem;
  margin: 0 auto;
  padding: 0 2rem;
}

.text-center {
  text-align: center;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Loading States */
.spinner {
  width: 4rem;
  height: 4rem;
  border: 4px solid var(--color-grey-200);
  border-top-color: var(--color-brand-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  html {
    font-size: 56.25%; /* 1rem = 9px */
  }

  h1 { font-size: 2.8rem; }
  h2 { font-size: 2.2rem; }
  h3 { font-size: 1.8rem; }
}

@media (max-width: 480px) {
  html {
    font-size: 50%; /* 1rem = 8px */
  }
}
`;

export default GlobalStyles;
