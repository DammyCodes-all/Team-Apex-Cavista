<p align="center">
  <img src="assets/images/icon.png" alt="Kin AI Logo" width="100" />
</p>

<h1 align="center">Kin AI</h1>

<p align="center">
  <strong>Your Health, Forecasted</strong><br/>
  An AI-powered mobile app that silently tracks your habits and delivers personalized health prevention insights — no daily input required.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-54-000020?logo=expo" alt="Expo SDK 54" />
  <img src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NativeWind-4.x-06B6D4?logo=tailwindcss" alt="NativeWind" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Navigation & Routing](#navigation--routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Design System](#design-system)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Kin AI** is a cross-platform mobile health application built for the **Cavista Hackathon** by **Team Apex**. The app leverages AI to passively monitor user health patterns — including steps, sleep, screen time, location, and optional voice stress analysis — and provides personalized prevention insights and risk forecasts.

The app requires **zero daily input** from users. It learns your routines over 7 days and progressively delivers smarter, more actionable health recommendations.

---

## Features

### Onboarding Flow (5 Steps)

- **Step 1** — Welcome screen with branded shield icon and introduction
- **Step 2** — Granular data permission toggles (steps, sleep, screen time, location, voice stress)
- **Step 3** — Personal info form (name, age, gender, height, weight) with validation
- **Step 4** — Health goal selection (Better Sleep, More Active, Stress Less, Focus Better, Overall Health, Custom Goal)
- **Step 5** — Setup completion summary with connected timeline showing what to expect in the first 7 days

### Dashboard (Home)

- Dynamic greeting with time-of-day context
- Daily AI insight cards
- Health metrics grid (steps, sleep, screen time, heart rate)
- Weekly goal progress tracking
- Floating AI Chat button

### AI Chat

- Conversational interface with the AI health assistant
- Attachment support (Photo, Camera, Document, Location)
- Typing indicator and message history

### Health Trends

- Interactive risk trend charts with touch-to-inspect
- Donut chart visualizations for health risk categories

### Reports

- Weekly/monthly health report summaries
- Interactive chart with pan gesture support
- Report-ready export modal

### Profile

- Editable personal information
- Baseline health summary
- Privacy and notification preferences
- Sign out flow

### Authentication

- Email/password sign-up and sign-in
- Automatic token refresh with retry logic
- Persistent sessions via AsyncStorage
- Auth-gated navigation (redirects unauthenticated users)

---

## Tech Stack

| Category       | Technology                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| **Framework**  | [Expo SDK 54](https://expo.dev) + [React Native 0.81](https://reactnative.dev)                           |
| **Language**   | [TypeScript 5.x](https://typescriptlang.org)                                                             |
| **Navigation** | [Expo Router 6](https://docs.expo.dev/router/introduction/) (file-based routing)                         |
| **Styling**    | [NativeWind 4](https://www.nativewind.dev/) (Tailwind CSS) + inline styles via design tokens             |
| **State**      | [Zustand 5](https://zustand-demo.pmnd.rs/) (onboarding store) + React Context (auth)                     |
| **Forms**      | [React Hook Form 7](https://react-hook-form.com/) + [Zod 4](https://zod.dev/) validation                 |
| **HTTP**       | [Axios](https://axios-http.com/) with interceptors for auth token management                             |
| **Charts**     | [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit) + custom SVG             |
| **Icons**      | [@expo/vector-icons](https://icons.expo.fyi/) (Ionicons, MaterialIcons)                                  |
| **Fonts**      | [Poppins](https://fonts.google.com/specimen/Poppins) (Regular, Medium, SemiBold, Bold)                   |
| **Animations** | [React Native Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) + Gesture Handler       |
| **Storage**    | [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) |
| **Build**      | [EAS Build](https://docs.expo.dev/build/introduction/)                                                   |

---

## Project Structure

```
frontend/
├── app/                        # File-based routing (Expo Router)
│   ├── _layout.tsx             # Root layout (fonts, theme, auth provider)
│   ├── index.tsx               # Entry redirect logic
│   ├── (tabs)/                 # Main tab navigator (auth-gated)
│   │   ├── _layout.tsx         # Tab bar configuration (Home, Trends, Reports, Profile)
│   │   ├── index.tsx           # Dashboard / Home screen
│   │   ├── risk.tsx            # Health trends & risk screen
│   │   ├── reports.tsx         # Health reports screen
│   │   ├── profile.tsx         # User profile screen
│   │   └── aiPage.tsx          # AI chat screen (hidden tab)
│   ├── auth/                   # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── onboarding/             # 5-step onboarding flow
│       ├── _layout.tsx
│       └── step-1.tsx … step-5.tsx
│
├── components/                 # Reusable UI components
│   ├── shield-icon.tsx         # Branded SVG shield icon
│   ├── permission-card.tsx     # Permission toggle card
│   ├── gender-modal.tsx        # Gender selection bottom sheet
│   ├── goal-card.tsx           # Goal selection card
│   ├── custom-goal-modal.tsx   # Custom goal input modal
│   ├── setup-item-row.tsx      # Setup summary row with checkmark
│   ├── timeline-section.tsx    # Connected timeline visualization
│   ├── onboarding-step-dots.tsx# Step indicator dots
│   ├── onboarding-swipe-view.tsx# Swipeable onboarding wrapper
│   ├── password-input.tsx      # Secure text input with toggle
│   ├── home/                   # Dashboard-specific components
│   │   ├── Header.tsx
│   │   ├── DailyInsightCard.tsx
│   │   ├── MetricsGrid.tsx
│   │   ├── WeeklyGoals.tsx
│   │   └── ...
│   ├── profile/                # Profile-specific components
│   │   ├── AvatarSection.tsx
│   │   ├── PersonalInfo.tsx
│   │   ├── Preferences.tsx
│   │   └── ...
│   └── ui/                     # Generic UI primitives
│       ├── collapsible.tsx
│       └── icon-symbol.tsx
│
├── constants/                  # App-wide constants
│   ├── tokens.ts               # Design tokens (colors, typography, spacing)
│   ├── permissions.ts          # Permission definitions
│   ├── goals.ts                # Health goal definitions
│   └── theme.ts                # Theme configuration
│
├── contexts/                   # React context providers
│   └── auth-context.tsx        # Authentication state & methods
│
├── hooks/                      # Custom hooks
│   ├── use-api-methods.ts      # Typed HTTP method hooks (useGet, usePost, etc.)
│   ├── use-api-request.ts      # Generic async request hook
│   ├── use-metrics.ts          # Health metrics data hook
│   └── use-color-scheme.ts     # Color scheme detection
│
├── lib/api/                    # API layer
│   ├── client.ts               # Axios instance, interceptors, token management
│   ├── config.ts               # API base URL and timeout
│   └── profile.ts              # Profile API methods
│
├── stores/                     # Zustand stores
│   └── onboarding-store.ts     # Onboarding flow state
│
└── assets/images/              # App icons, splash screen, images
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- **Expo CLI** (`npx expo`)
- **iOS Simulator** (macOS) or **Android Emulator**, or **Expo Go** on a physical device

### Installation

```bash
# Clone the repository
git clone https://github.com/DammyCodes-all/Team-Apex-Cavista.git
cd Team-Apex-Cavista/frontend

# Install dependencies
npm install
```

### Running the App

```bash
# Start the Expo development server
npx expo start
```

From the terminal output, choose how to open the app:

| Option            | Command               |
| ----------------- | --------------------- |
| Android emulator  | Press `a`             |
| iOS simulator     | Press `i`             |
| Web browser       | Press `w`             |
| Expo Go (scan QR) | Scan with Expo Go app |

> For full native module support (e.g., health data, background fetch), use a **development build** instead of Expo Go:
>
> ```bash
> npx expo run:android   # or run:ios
> ```

---

## Available Scripts

| Script                  | Description                  |
| ----------------------- | ---------------------------- |
| `npm start`             | Start Expo dev server        |
| `npm run android`       | Start on Android             |
| `npm run ios`           | Start on iOS                 |
| `npm run web`           | Start on web                 |
| `npm run lint`          | Run ESLint                   |
| `npm run reset-project` | Reset to clean project state |

---

## Navigation & Routing

The app uses **Expo Router** with file-based routing. The navigation structure:

```
/ (index.tsx)                 → Entry point / redirect
├── /auth/login               → Sign in
├── /auth/signup              → Sign up
├── /onboarding/step-1…5     → Onboarding flow
└── /(tabs)/                  → Main app (auth-gated)
    ├── /                     → Dashboard (Home)
    ├── /risk                 → Health Trends
    ├── /reports              → Reports
    ├── /profile              → Profile
    └── /aiPage               → AI Chat (hidden tab)
```

**Auth gating:** The tab layout checks authentication state and redirects unauthenticated users to `/auth/login` or `/auth/signup` based on whether they have prior auth history.

---

## State Management

### Authentication — React Context

Managed in `contexts/auth-context.tsx`. Provides:

- `signIn()` / `signUp()` / `signOut()`
- Persistent sessions via `AsyncStorage`
- Auto token refresh on 401/403 responses
- `isAuthenticated`, `isHydrating`, `hasAuthHistory` flags

### Onboarding — Zustand Store

Managed in `stores/onboarding-store.ts`. Stores all onboarding data across the 5-step flow:

- Data tracking permissions
- Personal info (name, age, gender, height, weight)
- Selected health goals + custom goal text
- `getOnboardingData()` aggregator for API submission
- `resetOnboarding()` cleanup after successful submission

---

## API Integration

### Base Configuration

- **Base URL:** `https://team-apex-cavista.onrender.com`
- **Timeout:** 15 seconds
- **Auth:** Bearer token (auto-attached via Axios interceptor)
- **Token refresh:** Automatic on 401/403 with request deduplication

### Reusable Hooks

Import from `@/hooks`:

```tsx
import { useGet, usePost, usePut, usePatch, useDelete } from "@/hooks";

// GET request
const { data, loading, error, execute } = useGet<ProfileResponse>("/profile");

// POST request
const { execute: login } = usePost<LoginResponse, LoginPayload>("/auth/login");
```

### API Modules

| Module               | Endpoints                                                      |
| -------------------- | -------------------------------------------------------------- |
| `lib/api/client.ts`  | Axios instance, `get()`, `post()`, `put()`, `patch()`, `del()` |
| `lib/api/profile.ts` | `getProfile()`, `updateProfile()`                              |

---

## Design System

### Design Tokens (`constants/tokens.ts`)

The `preventionTheme` object provides consistent styling across the app:

| Token          | Example Values                                             |
| -------------- | ---------------------------------------------------------- |
| **Colors**     | Primary: `#6EC1E4`, Secondary: `#A6E3C1`, Error: `#F66A6A` |
| **Typography** | Poppins family (Regular, Medium, SemiBold, Bold)           |
| **Spacing**    | `xs: 4`, `s: 8`, `m: 16`, `l: 24`, `xl: 32`, `xxl: 48`     |
| **Radius**     | `sm: 12`, `md: 16`                                         |
| **Shadows**    | Card shadow preset                                         |

Full light and dark color palettes are available via `preventionTheme.colors.light` and `preventionTheme.colors.dark`.

### Styling Approach

- **NativeWind** (Tailwind CSS classes) for layout utilities
- **Inline styles** with design tokens for component-specific styling
- **Poppins** font family loaded globally in the root layout

---

## Building for Production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) for production builds.

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo account
eas login

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

### Build Profiles (eas.json)

| Profile       | Description                           |
| ------------- | ------------------------------------- |
| `development` | Dev client with internal distribution |
| `preview`     | Internal testing build                |
| `production`  | Production build with auto-increment  |

---

## Contributing

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a **Pull Request** against the `main` branch

### Code Conventions

- TypeScript strict mode
- ESLint with Expo config
- Poppins font via design tokens (avoid hardcoded font strings)
- Components in `components/` with kebab-case filenames
- Constants and types co-located in `constants/`

---

## Team

**Team Apex** — Built for the Cavista Hackathon

---

## License

This project is developed as part of the Cavista Hackathon. See the repository for license details.
