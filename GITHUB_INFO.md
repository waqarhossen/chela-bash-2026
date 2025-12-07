# GitHub Repository Information

## Short Description (for GitHub repo)

```
Two-phase event microsite for grandmother's 98th birthday celebration. Features RSVP management, token-based invitations, admin dashboard, and guest tracking for up to 200 attendees. Built with Next.js 14, TypeScript, and Neon PostgreSQL.
```

## Repository Name Suggestions

- `chela-bash-2026`
- `celebration-of-life-microsite`
- `event-rsvp-microsite`

## Topics/Tags (for GitHub)

```
nextjs, typescript, event-management, rsvp, microsite, postgresql, neon, vercel, celebration, invitation
```

## README.md for GitHub

See the main README.md file in the project root.

## .gitignore

Already configured to exclude:
- node_modules
- .next
- .env.local
- .env
- *.log
- .DS_Store

## Before Pushing to GitHub

1. **Remove sensitive data:**
   - Ensure `.env.local` is NOT committed
   - Database credentials are in environment variables only

2. **Update README.md:**
   - Remove specific database connection strings
   - Add deployment instructions
   - Add demo credentials (if applicable)

3. **Add to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Chela Bash 2026 event microsite"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/chela-bash-2026.git
   git push -u origin main
   ```

## Public Repository URL Format

```
https://github.com/YOUR-USERNAME/chela-bash-2026
```

## Live Demo URL (after Vercel deployment)

```
https://chela-bash-2026.vercel.app
```

or custom domain:
```
https://chelabash2026.com
```
