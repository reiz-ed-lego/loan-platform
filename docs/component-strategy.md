# Layout & Component Strategy

The PoC proves one idea: **app-agnostic logic blocks wrapped in brand-specific layout.**
Shared behavior lives once; each brand only supplies its skin.

## The two layers

| Layer | Lives in | Knows about brands? | Example |
|---|---|---|---|
| **Logic block** | `packages/*` (shared) | No | `LoanApplicationForm` in `@app/ui` |
| **Brand layout** | `apps/<brand>/*` | Yes | `Navbar` + `App.tsx` in each app |

A logic block owns state, validation, and behavior. It exposes only **seams** —
typed props the brand fills in (e.g. `accentColor` for theming, `onSubmit` for
behavior). It never imports anything brand-specific.

A brand app composes those blocks inside its own layout elements (navbar,
screen wrapper, colors) and passes its seams down.

```
apps/brand-a/App.tsx
  └─ <Navbar/>                     ← brand layout (blue "QuickLoan")
  └─ <LoanApplicationForm          ← shared logic block from @app/ui
        accentColor={BRAND_A_ACCENT}
        onSubmit={...} />

apps/brand-b/App.tsx
  └─ <Navbar/>                     ← brand layout (green "GreenFund")
  └─ <LoanApplicationForm ... />   ← the SAME block, different seams
```

Change a validation rule once in `@app/ui` and both brands inherit it; the
navbars stay independently designed.

## File convention: colocated component directories

Every component is a directory, not a loose file. Styles and design tokens sit
next to the component:

```
ComponentName/
├── ComponentName.tsx   ← markup + logic
├── styles.ts           ← StyleSheet (static styling)
├── tokens.ts           ← design constants (colors, etc.) — optional
└── index.ts            ← barrel re-export
```

- **Static** styling goes in `styles.ts`. **Dynamic** styling that depends on
  props (e.g. the brand `accentColor`) stays inline in the component.
- `index.ts` re-exports the public surface so importers use the directory path
  (`./components/Navbar`), not the inner file.

### Gotcha: avoid circular imports with a `tokens.ts`

If a component exports a constant *and* its `styles.ts` needs that constant, do
**not** import it from the component — that creates a cycle
(`Navbar → styles → Navbar`). At module-init the constant is still `undefined`,
so `StyleSheet.create` bakes in `undefined` and the style silently breaks.

Put shared constants in a dependency-free `tokens.ts` that both the component
and its styles import. The graph stays acyclic: `tokens → styles → Component → index`.

## Where things go

- New reusable behavior → a shared package under `packages/` (`@app/ui`,
  `@app/auth`, `@app/loans`, …). Keep it brand-agnostic; expose props as seams.
- New brand chrome (navbars, layouts, theme values) → inside the specific
  `apps/<brand>/`.
- Anything a brand must vary → a prop on the shared block, not a fork of it.
