# Email Troubleshooting Guide for Vercel

## Common Issues and Solutions

### 1. Environment Variables
Make sure these are set in Vercel dashboard:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@domain.com
EMAIL_FROM_NAME=Your Name
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
```

### 2. Gmail Configuration
- Use Gmail App Password, not regular password
- Generate at: https://myaccount.google.com/apppasswords
- Enable 2-factor authentication first
- Use port 587 with SMTP_SECURE=false

### 3. Test Email Function
Visit: `https://your-domain.vercel.app/api/test-email`
This will test your email configuration and show detailed error logs.

### 4. Check Vercel Logs
- Go to Vercel dashboard
- Select your project
- Go to "Functions" tab
- Check logs for email errors

### 5. Common Fixes

#### Port Configuration
- Use port 587 (not 465) for Gmail on Vercel
- Set SMTP_SECURE=false for port 587

#### Authentication Issues
- Verify Gmail App Password is correct
- Check if 2FA is enabled on Gmail account
- Try regenerating App Password

#### Domain Issues
- Make sure NEXT_PUBLIC_BASE_URL matches your Vercel domain
- Use https:// for production URLs

### 6. Alternative Email Providers
If Gmail doesn't work, try:
- SendGrid (recommended for production)
- Mailgun
- AWS SES

### 7. Debug Steps
1. Test locally first with same environment variables
2. Use the test endpoint to verify configuration
3. Check Vercel function logs for specific errors
4. Verify all environment variables are set in Vercel dashboard
