# Environment Setup

> How to configure your development environment for Lasu Financial.

---

## 1. Install Prerequisites

```bash
# Node.js (LTS recommended)
nvm install 20
nvm use 20

# pnpm
npm install -g pnpm

# Expo CLI & EAS CLI
npm install -g expo-cli eas-cli

# Supabase CLI (macOS)
brew install supabase/tap/supabase

# Verify installations
node --version    # >= 20.x
pnpm --version    # >= 9.x
supabase --version
```

---

## 2. Clone & Install

```bash
git clone https://github.com/your-org/lasu-financial.git
cd lasu-financial
pnpm install
```

---

## 3. Environment Variables

Create a local env file:

```bash
cp .env.example .env.development
```

Fill in the required values:

```env
# Supabase — get these from https://supabase.com/dashboard/project/_/settings/api
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### How to Get Supabase Credentials

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Navigate to **Settings → API**
4. Copy the **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
5. Copy the **anon/public key** → `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

> **Security Note:** The publishable/anon key is safe to include in client code. Row-Level Security (RLS) policies protect your data on the server side.

---

## 4. Supabase Local Development (Optional)

For local Supabase development:

```bash
# Initialize Supabase in the project
supabase init

# Start local Supabase services (Postgres, Auth, Storage, Edge Functions)
supabase start

# This outputs local URLs and keys — use these in .env.development:
# EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
# EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local-anon-key>

# Stop local services
supabase stop

# Reset local database (applies all migrations fresh)
supabase db reset
```

### Migrations

```bash
# Create a new migration
supabase migration new create_instruments_table

# Apply pending migrations locally
supabase db reset

# Push migrations to remote Supabase
supabase db push

# Pull remote schema changes
supabase db pull
```

---

## 5. Running the App

### Expo Go (Quick Start)

```bash
pnpm start
# Scan QR code with Expo Go app
```

> **Limitation:** Expo Go doesn't support all native modules (e.g., MMKV). Use a development build for full functionality.

### Development Build (Recommended)

```bash
# Build for iOS Simulator
npx eas-cli@latest build --profile development-simulator --platform ios

# Build for Android Emulator
npx eas-cli@latest build --profile development --platform android

# Or build locally (requires Xcode / Android Studio)
npx expo run:ios
npx expo run:android
```

After installing the dev build on your device/simulator:

```bash
pnpm start
# The dev build connects automatically
```

---

## 6. Development Tools

### TypeScript Check

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint        # Check for issues
pnpm lint:fix    # Auto-fix issues
```

### Formatting

```bash
pnpm format         # Format all files
pnpm format:check   # Check without writing
```

### Project Health

```bash
pnpm doctor    # Check for dependency issues
```

---

## 7. EAS Configuration

### Login to EAS

```bash
eas login
```

### Build Profiles

The `eas.json` file defines four build profiles:

| Profile                 | Use Case                        |
| ----------------------- | ------------------------------- |
| `development`           | Dev builds for physical devices |
| `development-simulator` | Dev builds for iOS Simulator    |
| `preview`               | Internal testing builds         |
| `production`            | Store-ready builds              |

### Running Workflows

```bash
# Preview update + website deploy
pnpm draft

# Create development builds
pnpm development-builds

# Full production deployment
pnpm deploy
```

---

## 8. Troubleshooting

### Metro Cache Issues

```bash
pnpm start:clear
# or
npx expo start --clear
```

### Dependency Issues

```bash
npx expo install --check   # Check for incompatible versions
npx expo install --fix     # Auto-fix version mismatches
pnpm doctor                # Full health check
```

### NativeWind Not Working

1. Ensure `global.css` is imported in `app/_layout.tsx`
2. Verify `babel.config.js` has `nativewind/babel` preset
3. Verify `metro.config.js` wraps config with `withNativeWind`
4. Clear cache: `pnpm start:clear`

### MMKV / Native Module Errors

These modules require a development build. They won't work in Expo Go:

```bash
npx expo run:ios    # Build locally with native modules
```

### Supabase Connection Issues

1. Verify env variables are set correctly
2. Check that the Supabase project is active (free tier pauses after inactivity)
3. For local development, verify `supabase start` is running
