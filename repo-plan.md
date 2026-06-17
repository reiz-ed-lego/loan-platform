



Monorepo Setup Guide — Fresh → Simulator

Target: Turborepo + pnpm + Expo Development Builds, two branded apps, both running on simulator.

Prerequisites

Install these once on your machine if you don't have them:

# Node 20+ (use nvm or fnm)
node --version   # must be >= 20

# pnpm
npm install -g pnpm

# Expo CLI
npm install -g expo-cli

# EAS CLI (needed later for native builds)
npm install -g eas-cli

# Turbo
npm install -g turbo


For simulator targets:



* iOS: Xcode installed, at least one iOS simulator (open Xcode → Simulator)

* Android: Android Studio installed, one AVD created and startable

Step 1 — Init the repo

mkdir loan-platform && cd loan-platform
git init
pnpm init -y


Create the workspace manifest:

# pnpm-workspace.yaml
packages:
- 'apps/*'
- 'packages/*'


Create the Turborepo config:

// turbo.json
{
"$schema": "https://turbo.build/schema.json",
"pipeline": {
"build": {
"dependsOn": ["^build"],
"outputs": ["dist/**", ".expo/**"]
},
"lint": { "outputs": [] },
"type-check": { "outputs": [] }
}
}


Root `package.json` — add turbo as a dev dep:

{
"name": "loan-platform",
"private": true,
"scripts": {
"build": "turbo run build",
"lint": "turbo run lint",
"type-check": "turbo run type-check"
},
"devDependencies": {
"turbo": "latest",
"typescript": "^5.4.0"
}
}


Root `tsconfig.base.json`:

{
"compilerOptions": {
"strict": true,
"moduleResolution": "bundler",
"jsx": "react-native",
"allowSyntheticDefaultImports": true,
"esModuleInterop": true,
"skipLibCheck": true
}
}


Step 2 — Create the shared packages

Create these directories:

mkdir -p packages/{config,theme,ui,core,auth,loans,documents,navigation}


For each package, you need a minimal `package.json`. Example for `@app/theme`:

// packages/theme/package.json
{
"name": "@app/theme",
"version": "0.0.1",
"main": "src/index.ts",
"types": "src/index.ts",
"scripts": {
"type-check": "tsc --noEmit"
},
"peerDependencies": {
"react": "*",
"react-native": "*"
}
}


Repeat for each package, changing `name` to `@app/config`, `@app/ui`, `@app/core`, `@app/auth`, `@app/loans`, `@app/documents`, `@app/navigation`.

Each package's `tsconfig.json`:

{
"extends": "../../tsconfig.base.json",
"include": ["src"]
}


Create a minimal `src/index.ts` in each to avoid TypeScript errors at start:

for pkg in config theme ui core auth loans documents navigation; do
mkdir -p packages/$pkg/src
echo "// @app/$pkg" > packages/$pkg/src/index.ts
done


Step 3 — Create the brand apps

# From the repo root
cd apps
npx create-expo-app brand-a --template blank-typescript
npx create-expo-app brand-b --template blank-typescript
cd ..


Rename each app's `package.json` name field:

// apps/brand-a/package.json  (after create-expo-app)
{
"name": "brand-a",
...
}


Add workspace package dependencies to each brand app:

# In apps/brand-a
pnpm add @app/config@workspace:* @app/theme@workspace:* @app/ui@workspace:* \
@app/core@workspace:* @app/auth@workspace:* @app/loans@workspace:* \
@app/documents@workspace:* @app/navigation@workspace:*


Step 4 — Fix Metro for monorepo

This is the critical step that trips everyone up. Metro (React Native's bundler) doesn't know about files outside the app directory by default.

// apps/brand-a/metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../..');
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
path.resolve(projectRoot, 'node_modules'),
path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;


Copy the same file to `apps/brand-b/metro.config.js` (it's identical — `__dirname` resolves correctly per app).

Step 5 — Add path aliases

Install the Babel plugin in each brand app:

cd apps/brand-a && pnpm add -D babel-plugin-module-resolver
cd ../brand-b && pnpm add -D babel-plugin-module-resolver


// apps/brand-a/babel.config.js
module.exports = function (api) {
api.cache(true);
return {
presets: ['babel-preset-expo'],
plugins: [
['module-resolver', {
root: ['./'],
extensions: ['.ts', '.tsx', '.js', '.jsx'],
alias: {
'@app/config':     '../../packages/config/src',
'@app/theme':      '../../packages/theme/src',
'@app/ui':         '../../packages/ui/src',
'@app/core':       '../../packages/core/src',
'@app/auth':       '../../packages/auth/src',
'@app/loans':      '../../packages/loans/src',
'@app/documents':  '../../packages/documents/src',
'@app/navigation': '../../packages/navigation/src',
},
}],
],
};
};


Same for `apps/brand-b/babel.config.js`.

Step 6 — Minimal App.tsx per brand

// apps/brand-a/App.tsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
return (
<View style={styles.container}>
<Text>Brand A</Text>
<StatusBar style="auto" />
</View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});


// apps/brand-b/App.tsx — same but "Brand B"


Step 7 — Install everything

From the repo root:

pnpm install


pnpm resolves all workspace links automatically.

Step 8 — Run on simulator

iOS:

cd apps/brand-a
npx expo run:ios


Android:

cd apps/brand-a
npx expo run:android


For brand-b, same commands from `apps/brand-b`.

`expo run:ios/android` creates the native `ios/` and `android/` folders and installs pods on first run — this takes a few minutes. Subsequent runs are fast.

Do NOT use `expo start` (Expo Go) — Expo Go won't work once you add native SDKs like iDenfy. `expo run:*` is the correct entry point for development builds.

Folder layout after setup

loan-platform/
├── apps/
│   ├── brand-a/
│   │   ├── App.tsx
│   │   ├── metro.config.js      ← monorepo-aware
│   │   ├── babel.config.js      ← @app/* aliases
│   │   ├── app.json
│   │   └── package.json
│   └── brand-b/               ← same structure
│
├── packages/
│   ├── config/src/index.ts
│   ├── theme/src/index.ts
│   ├── ui/src/index.ts
│   ├── core/src/index.ts
│   ├── auth/src/index.ts
│   ├── loans/src/index.ts
│   ├── documents/src/index.ts
│   └── navigation/src/index.ts
│
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json


What comes next

Once both apps boot on simulator, the next steps are:



1. Implement `@app/theme` — `BrandTokens` interface, `ThemeProvider`, `useTheme()`

2. Implement `@app/config` — `FeatureFlags`, `FeaturesCtx`, `useFeature()`

3. Implement `@app/ui` — `Button`, `Input`, `Card` components consuming theme tokens

4. Wire up navigation — React Navigation in each brand app

5. First feature screen — `LoginScreen` in `@app/auth` with the ScreenWrapper pattern

6. Point to BFF — configure `@app/core` API client against your .NET base URL

The architecture doc (`monorepo-architecture.md`) has the full code patterns for each of these steps.