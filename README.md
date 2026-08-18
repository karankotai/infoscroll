# InfoScroll

InfoScroll is an Expo React Native app for browsing short, swipeable learning cards and short-form videos. It uses Supabase for auth, feed storage, user card state, and news fetching.

## What Is Inside

- `app/` - Expo Router screens for auth, feed, news, saved items, and settings.
- `components/` - Feed swiper, card actions, topic pills, and individual card renderers.
- `stores/` - Zustand stores for feed state and app interactions.
- `lib/` - Supabase client, shared schemas, and TypeScript types.
- `supabase/` - Database migrations and edge functions.
- `content-pipeline/` - Prompt generation, schema validation, and upload tooling for static card content.

## Prerequisites

- Node.js 18+
- npm
- Expo CLI via `npx expo`
- Supabase project credentials
- EAS CLI for native builds, if you plan to build or submit the app

## Setup

Install app dependencies:

```bash
npm install
```

Create a local `.env` file for the Expo app:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Install the content pipeline dependencies when you need to generate or upload card content:

```bash
cd content-pipeline
npm install
```

The content pipeline expects `content-pipeline/.env` to contain:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Running The App

Start the Expo development server:

```bash
npm start
```

Run native development builds:

```bash
npm run ios
npm run android
```

Run the web target:

```bash
npm run web
```

## Native Builds

The project includes `eas.json` profiles for development, preview, simulator preview, and production builds.

```bash
eas build --profile development --platform ios
eas build --profile preview --platform ios
eas build --profile production --platform ios
```

## Supabase

Database schema changes live in `supabase/migrations/`. The app expects:

- `cards` for feed content
- `user_card_state` for seen, saved, and skipped items
- `news_cache` for cached news data
- `get_feed` and `get_video_feed` RPCs for personalized card and video feeds

There is also a `supabase/functions/fetch-news` edge function for news ingestion.

## Content Pipeline

Generate prompt files and a manifest:

```bash
cd content-pipeline
npm run generate
```

Fill the generated JSON outputs in `content-pipeline/output/`, then validate and upload them to Supabase:

```bash
npm run upload
```

The upload script validates card payloads with Zod before inserting them into the `cards` table.

## Scripts

```bash
npm start             # Start Expo
npm run ios           # Run iOS development build
npm run ios:release   # Run iOS release configuration
npm run android       # Run Android development build
npm run android:release
npm run web           # Start Expo web
```
