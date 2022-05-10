export default `
html,
body {
      margin: 0;
      padding: 0;
      background-color: var(--color_bg);
      color: var(--color_text);
      font-size: 14px;
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
            Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
            'Noto Color Emoji';
      line-height: 1.5;

      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      scroll-behavior: smooth;
      text-rendering: optimizeLegibility;
      text-size-adjust: 100%;
}

::-webkit-scrollbar-thumb {
      background-color: transparent;
}

::-webkit-scrollbar {
      width: 0px;
      height: 0px;
}

::-webkit-input-placeholder,
.xgen-select-selection-placeholder {
      color: var(--color_placeholder) !important;
}

input:-internal-autofill-previewed,
input:-internal-autofill-selected {
      transition: background-color 5000000s ease-in-out 0s !important;
}

a{
      color: var(--color_text);
}
`