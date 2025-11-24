# BNCC Feedback Form

A React application for collecting and managing feedback for BNCC events. Features a public feedback submission form and an authenticated admin panel for managing submissions.

## Tech Stack

- **Frontend Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS v3
- **Authentication**: Supabase Auth (Google OAuth + Email/Password)
- **Backend API**: REST API (https://bnccbe.drian.my.id/api/v1)
- **Routing**: React Router v7
- **Icons**: Lucide React

## Features

### Public Features

- Submit feedback with name, email, event details, division, rating (1-5 stars), comments, and suggestions
- Responsive design with purple gradient theme
- Form validation

### Admin Features (Authentication Required)

- View all feedback submissions in a table
- Search and filter by status (pending/reviewed/resolved)
- Edit feedback details and update status
- Delete feedback with confirmation
- Pagination support
- User dropdown menu with profile info

## Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_API_BASE_URL=https://bnccbe.drian.my.id/api/v1
```

**Important**: Restart the dev server after changing environment variables.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## API Endpoints

- `GET /feedbacks` - Get all feedbacks (public)
- `POST /feedbacks` - Create new feedback (public)
- `PUT /feedbacks/:id` - Update feedback (protected, requires JWT)
- `DELETE /feedbacks/:id` - Delete feedback (protected, requires JWT)

API Documentation: https://bnccbe.drian.my.id/api-docs

## Feedback Data Structure

```json
{
  "name": "string (required, max 255)",
  "email": "string (required, valid email)",
  "eventName": "string (required, max 255)",
  "division": "enum (required: LnT|EEO|PR|HRD|RnD)",
  "rating": "integer (required: 1-5)",
  "status": "enum (pending|reviewed|resolved)",
  "comment": "string (optional)",
  "suggestion": "string (optional)"
}
```

## Deployment

This project is configured for deployment on Railway with the following setup:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 20.x (specified in nixpacks.toml)

Environment variables must be set in Railway dashboard before deployment.

## Project Structure

```
src/
├── assets/          # Icons and illustrations
├── components/      # Reusable components
├── config/          # Route configuration
├── contexts/        # React contexts (Auth)
├── hooks/           # Custom hooks (useAuth, useFeedback)
├── lib/             # Supabase client setup
├── pages/           # Page components
│   ├── home/        # Public feedback form
│   ├── login/       # Authentication page
│   └── panel/       # Admin dashboard
└── App.jsx          # Main app component
```
