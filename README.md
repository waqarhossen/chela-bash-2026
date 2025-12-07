# Chela Bash 2026 - Event Microsite

A two-phase event microsite with RSVP management, token-based invitations, and admin dashboard.

## Features

- **Phase 1**: Save-the-date page with RSVP form
- **Phase 2**: Token-protected full invitation page
- **Admin Dashboard**: Manage guests, view stats, export CSV
- **Database**: Neon PostgreSQL for data persistence

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Neon PostgreSQL
- React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
ADMIN_PASSWORD=your-secure-admin-password
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Get your Neon PostgreSQL connection string:**
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Paste it as `DATABASE_URL`

### 3. Setup Database

Run the database setup script:

```bash
npm run db:setup
```

This creates the `guests` table with all required fields.

### 4. Add Media Files

Replace placeholder files in the `public` folder:
- `public/placeholder-photo.jpg` - Hero image for save-the-date page
- `public/chela-bash-audio.mp3` - Audio clip saying "Chela Bash 2026!"

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
chele-bash-2026/
├── app/
│   ├── page.tsx                    # Phase 1: Save-the-date + RSVP
│   ├── invitation/[token]/page.tsx # Phase 2: Full invitation
│   ├── admin/page.tsx              # Admin dashboard
│   ├── api/
│   │   ├── rsvp/route.ts          # RSVP submission
│   │   ├── guest/[token]/route.ts # Guest data & updates
│   │   └── admin/guests/route.ts  # Admin guest list
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── db.ts                       # Database connection
├── scripts/
│   └── setup-db.js                 # Database setup script
├── public/
│   ├── placeholder-photo.jpg
│   └── chela-bash-audio.mp3
└── package.json
```

## Usage Guide

### For Guests

1. **Phase 1 - RSVP**:
   - Visit the homepage
   - Fill out the RSVP form
   - Receive a unique token

2. **Phase 2 - Invitation**:
   - Use the token link sent by the host
   - View full event details
   - Confirm attendance and update guest count

### For Administrators

1. **Access Admin Dashboard**:
   - Visit `/admin`
   - Login with the password from `.env.local`

2. **Manage Guests**:
   - View all RSVPs
   - See real-time statistics
   - Search/filter guests
   - Export data to CSV
   - Copy invitation links to send to guests

3. **Send Invitations**:
   - Click "Copy Link" next to any guest
   - Send the link via email/text
   - Guests use this link to access Phase 2

## Database Schema

```sql
CREATE TABLE guests (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  age INTEGER NOT NULL,
  relationship VARCHAR(255) NOT NULL,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  token VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'reserved',
  confirmed_adults INTEGER,
  confirmed_children INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL=your-neon-production-url
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Customization

### Update Event Details

Edit `app/invitation/[token]/page.tsx` to change:
- Event date and time
- Venue information
- Dress code
- Parking details
- Host message

### Styling

Modify `app/globals.css` to customize colors, fonts, and layout.

### Audio & Images

Replace files in the `public` folder with your own media.

## API Endpoints

- `POST /api/rsvp` - Submit RSVP
- `GET /api/guest/[token]` - Get guest details
- `PUT /api/guest/[token]` - Update guest confirmation
- `GET /api/admin/guests` - Get all guests (requires auth)

## Support

For issues or questions, refer to:
- Next.js docs: https://nextjs.org/docs
- Neon docs: https://neon.tech/docs
