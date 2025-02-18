# Tasks App

A modern task management app with AI-powered features for capturing handwritten tasks.

## Features

- 📝 Task Management with priorities and status
- 📸 Camera integration for capturing handwritten tasks
- 🤖 AI-powered task extraction (supports both Claude and GPT-4V)
- 🎨 Dark mode support
- 🔄 Real-time sync with Supabase
- 📱 Cross-platform (iOS, Android)

## Setup

1. Clone the repository
```bash
git clone <repository-url>
cd robin-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and add your:
- Supabase credentials
- OpenAI API key (for GPT-4o)
- Claude API key (optional)

4. Start the development server
```bash
npm start
```

## Tech Stack

- React Native with Expo
- TypeScript
- Supabase for backend
- OpenAI GPT-4o for image processing
- Claude AI (alternative option)
- Expo Camera

## Development

The app uses Expo for development. You can run it on:
- iOS simulator
- Android emulator
- Physical device via Expo Go app

## Project Structure

- `/app` - App screens and navigation
- `/components` - Reusable React components
- `/src`
  - `/services` - AI and backend services
  - `/hooks` - Custom React hooks
  - `/types` - TypeScript types
  - `/context` - React Context providers
  - `/config` - App configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
