# Psychometric Assessment Platform - Implementation Plan

## Project Overview
- **Project Name**: Psychometric Assessment Platform for Managers
- **Type**: Web-based psychometric assessment with forced-choice triplet format
- **Core Functionality**: Adaptive assessment with theta-like scoring, percentile rankings, and directional visualization
- **Target Users**: Managers and leadership professionals

## Tech Stack
- **Frontend**: React with React Router
- **Backend**: Flask (Python)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Implementation Steps

### Phase 1: Backend Setup
- [ ] 1.1 Create Flask backend with Supabase configuration
- [ ] 1.2 Define database models (themes, triplets, statements, responses, sessions, scores)
- [ ] 1.3 Implement API routes for authentication
- [ ] 1.4 Implement API routes for assessment (get triplet, submit response)
- [ ] 1.5 Implement adaptive logic for triplet selection
- [ ] 1.6 Implement theta scoring algorithm
- [ ] 1.7 Implement percentile calculation
- [ ] 1.8 Implement results API

### Phase 2: Frontend Setup
- [ ] 2.1 Create React project structure
- [ ] 2.2 Set up Supabase client
- [ ] 2.3 Create authentication context
- [ ] 2.4 Create routing structure

### Phase 3: Frontend Pages
- [ ] 3.1 Login Page (Supabase Auth)
- [ ] 3.2 Instructions Page
- [ ] 3.3 Triplet Question Page (with Most Likely/Least Likely selection)
- [ ] 3.4 Completion/Processing Page
- [ ] 3.5 Results Dashboard (theme table + directional graphs)

### Phase 4: Sample Data
- [ ] 4.1 Create leadership themes (6-8 themes)
- [ ] 4.2 Create triplet questions for each theme
- [ ] 4.3 Set up norm group data for percentiles

## Database Schema

### Tables:
1. **profiles** - User profiles linked to Supabase Auth
2. **themes** - Leadership competency themes
3. **triplets** - Groups of 3 statements
4. **statements** - Individual statements with theme associations
5. **assessment_sessions** - Track assessment progress
6. **responses** - User responses (most_likely, least_likely)
7. **theme_scores** - Computed theta scores and percentiles

## API Endpoints

### Authentication
- POST /api/auth/login - Login with Supabase
- POST /api/auth/register - Register new user
- GET /api/auth/me - Get current user

### Assessment
- POST /api/assessment/start - Start new assessment
- GET /api/assessment/next-triplet - Get next triplet based on adaptive logic
- POST /api/assessment/submit-response - Submit response for current triplet
- POST /api/assessment/complete - Complete assessment and compute scores

### Results
- GET /api/results/:session_id - Get assessment results
- GET /api/results/:session_id/themes - Get theme-level scores

## Adaptive Logic

The adaptive algorithm selects the next triplet based on:
1. Theme coverage - Prioritize themes with lowest measurement coverage
2. Information value - Select triplets that provide most information
3. No repeat - Never show the same triplet twice

Stopping criteria:
- Minimum 15 triplets completed
- Maximum 30 triplets completed

## Theta Scoring Algorithm

Theta is computed using a simplified IRT-like approach:
1. Initialize theta at 0 for each theme
2. Update theta based on response patterns
3. Normalize theta to a standard scale (-3 to +3)
4. Calculate percentile based on norm group distribution

## UI Components

### Triplet Question Component
- Table layout with 3 statements
- Radio buttons for Most Likely and Least Likely
- Validation: cannot select same statement for both
- Next button disabled until valid selection

### Progress Indicator
- Linear progress bar
- No exact percentage displayed

### Results Dashboard
- Theme Summary Table (Theme Name, Theta Score, Percentile)
- Directional Graph per Theme (-3 to +3 scale)
- Color zones: Red (Low), Amber (Moderate), Green (High)
- Strength Highlights (Top 2 themes)
- Development Areas (Bottom 2 themes)
