# Cognizant CIS Portal

A comprehensive web application for CIS teams featuring knowledge management, scheduling, collaboration, mentorship, and gamification.

## Features

🔍 **Automated Knowledge Base**
- Searchable FAQ and troubleshooting guide
- AI-powered suggestions based on keywords
- Document upload and resource linking

📅 **Shift & Task Scheduler**
- Calendar view for shifts and tasks
- Task assignment with priority levels
- Notifications and reminders

🏠 **Team Collaboration Hub**
- Announcements board
- Quick links to tools and documents
- Real-time chat and comments

🤝 **Mentorship Matchmaker**
- User profiles with skills and interests
- Intelligent matching algorithm
- Progress tracking and feedback forms

💡 **Tech Tips of the Day**
- Daily tips displayed on homepage
- Community submission and voting system
- Searchable archive of past tips

🕹️ **Gamified Support Challenges**
- Weekly challenges and quizzes
- Leaderboard and achievement badges
- Admin panel for challenge management

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Calendar**: React Big Calendar
- **Real-time**: WebSockets

## Quick Start

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Project Structure

```
cognizant-cis-portal/
├── frontend/          # React TypeScript frontend
├── backend/           # Node.js Express backend
├── shared/           # Shared types and utilities
└── docs/             # Documentation
```

## Development

- Frontend runs on port 5173
- Backend runs on port 3001
- Hot reload enabled for both frontend and backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details. 