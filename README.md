# loan-platform

A Turborepo + pnpm monorepo with two branded Expo apps (`brand-a`, `brand-b`)
sharing app-agnostic logic blocks. See [docs/component-strategy.md](docs/component-strategy.md)
for the layout & component approach.

## Running locally

Each brand runs as its own Expo dev server. No Android Studio or emulator is
required — you run the app on a physical phone via **Expo Go**.

1. Open a terminal and start a brand's dev server:

   ```bash
   cd apps/brand-a
   npx expo start
   ```

   For the other brand, repeat in a separate terminal:

   ```bash
   cd apps/brand-b
   npx expo start
   ```

2. On your phone, open **Expo Go** (Android: the **"Scan QR code"** button;
   iOS: the **Camera** app) and scan the QR code printed in the terminal.

3. Metro bundles the JS and the app loads on your phone. Edits to the code
   (form, navbar, etc.) **hot-reload in real time** — no restart needed.

### Notes

- The phone and computer must be on the **same Wi-Fi** network. If your network
  blocks device-to-device connections, start with a tunnel instead — it works
  over any network, including cellular:

  ```bash
  npx expo start --tunnel
  ```

- Requires an **Expo Go** build that supports **SDK 54** (the apps are pinned to
  SDK 54).
- Use `npx expo start` for Expo Go. `npx expo run:android` / `run:ios` are for
  native development builds and require Android Studio / Xcode.
