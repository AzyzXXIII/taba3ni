import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
/* Light mode (default) */
:root,
:root.light-mode {
  /* Brand (your new palette) */
  --color-brand-50: #b1d4e0;  /* lightest */
  --color-brand-100: #2e8bc0;
  --color-brand-200: #145da0;
  --color-brand-500: #0c2d48; /* darkest */
  --color-brand-600: #145da0;
  --color-brand-700: #2e8bc0;
  --color-brand-800: #0c2d48;
  --color-brand-900: #0c2d48;

  /* Grey (keeping your neutral palette) */
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

  /* Support colors (unchanged for now) */
  --color-blue-100: #e0f2fe;
  --color-blue-700: #0369a1;
  --color-green-100: #dcfce7;
  --color-green-700: #15803d;
  --color-yellow-100: #fef9c3;
  --color-yellow-700: #a16207;
  --color-silver-100: #e5e7eb;
  --color-silver-700: #374151;

  --color-red-100: #fee2e2;
  --color-red-700: #b91c1c;
  --color-red-800: #991b1b;

  --backdrop-color: rgba(255, 255, 255, 0.1);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);

  --border-radius-tiny: 3px;
  --border-radius-sm: 5px;
  --border-radius-md: 7px;
  --border-radius-lg: 9px;

  --image-grayscale: 0;
  --image-opacity: 100%;
}

/* Dark mode */
:root.dark-mode {
  /* Invert your brand palette for dark mode */
  --color-brand-50: #0c2d48;  /* darkest */
  --color-brand-100: #145da0;
  --color-brand-200: #2e8bc0;
  --color-brand-500: #b1d4e0; /* lightest */
  --color-brand-600: #2e8bc0;
  --color-brand-700: #145da0;
  --color-brand-800: #0c2d48;
  --color-brand-900: #0c2d48;

  /* Grey inverted */
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

  /* Support colors unchanged */
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

  --backdrop-color: rgba(0, 0, 0, 0.3);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

  --image-grayscale: 10%;
  --image-opacity: 90%;
}

/* ... rest of your reset & base styles unchanged ... */
`;

export default GlobalStyles;
