# DeceiveNet — Demo Frontend

Standalone single-page prototype used to validate the user flow (home → auth → console → attack lab → events).  
All state is stored in `localStorage` — no backend required.

## Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (http://localhost:5174) |
| `npm run build` | Production build |

## Structure

```
demo-frontend/
├── src/
│   ├── App.tsx      All pages + components in one file
│   ├── main.tsx     Entry point
│   └── styles.css   Plain CSS (no Tailwind)
└── index.html
```

> This is a **prototype only** — see `../frontend/` for the full production UI.
