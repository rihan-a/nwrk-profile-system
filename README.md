# Employee Profile HR App

A simple HR app where employees can manage their profiles, request time off, and give feedback to each other. Different people see different things based on their role.


## Core Requirements Met

### Employee Profile Management ✅
- Role-based data visibility (public vs sensitive data)
- Managers and profile owners can see/edit all data
- Co-workers see only non-sensitive data
- Proper data filtering in profile.controller.ts

### Feedback System ✅
- Co-workers can leave feedback
- AI enhancement implemented using Google Gemini API
- Role-based feedback visibility
- Professional feedback enhancement with safety filtering

### Absence Request System ✅
- Employees can request absences
- Manager approval workflow
- Status tracking (pending/approved/rejected)
- Proper validation and date handling

### Role-Based Access Control ✅
- Three roles: Manager, Employee, Co-worker
- Proper middleware implementation
- Data filtering based on user permissions


## How to Run

1. **Install everything:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the `apps/backend/` directory:
   ```bash
   # Create the environment file
   touch apps/backend/.env
   ```
   
   Add your Google Gemini API key to the file:
   ```env
   # Google Gemini API Key for AI feedback enhancement
   # Get your free API key from: https://makersuite.google.com/app/apikey
   GEMINI_API_KEY=your_actual_api_key_here
   
   # Optional: Server Configuration
   PORT=3001
   NODE_ENV=development
   ```
   
   **Note:** You'll receive the API key via email. Without this key, the AI feedback enhancement feature won't work, but the rest of the app will function normally.

3. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```

4. **Open your browser to:** http://localhost:5173

## Demo Users

Try these accounts to see how different roles work:

- **Manager**: `manager@newwork.com` (can see everyone, approve time off)
- **Employee**: `employee@newwork.com` (can edit own profile, request time off)  
- **Co-worker**: `coworker@newwork.com` (can see public info, give feedback)

## What I Built

**Frontend:** React app with TypeScript and Tailwind for styling
**Backend:** Express server with TypeScript
**Features:**
- Profile management (view/edit based on role)
- Time off requests with manager approval
- Feedback system with AI enhancement (using Google's Gemini)
- Role-based access (managers see more, employees see less)

## Architecture Decisions

- **Monorepo setup:** Keeps frontend and backend together for easier development
- **Feature-based folders:** Each feature (profiles, feedback, absence) has its own folder with everything it needs
- **Mock data:** No database needed for this demo - everything lives in memory
- **Simple auth:** Just role-based, no complex login system since it's a demo
- **AI integration:** Added Gemini API to polish feedback text automatically

## Troubleshooting

**AI Enhancement Not Working:**
- Make sure you've created the `.env` file in `apps/backend/`
- Verify your `GEMINI_API_KEY` is correct
- Check the backend console for API errors
- The app will work without AI enhancement - feedback will just show the original text

**Authentication Issues:**
- Clear browser localStorage if you encounter login problems

## What I'd Improve With More Time

- **Real database:** Replace mock data with proper database (PostgreSQL or MongoDB)
- **Better auth:** Add JWT tokens, password hashing, proper login/logout
- **More validation:** Better form validation and error handling
- **Testing:** Add unit tests and integration tests
- **Performance:** Add loading states, pagination for large lists
- **Mobile:** Make it work better on phones and tablets
- **Notifications:** Real-time updates when someone approves your time off
- **File uploads:** Let people upload profile pictures
- **Search:** Add search and filtering for employee profiles
