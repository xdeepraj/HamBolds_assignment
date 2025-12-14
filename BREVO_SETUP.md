# Brevo Email Setup Guide

## How to Get Your Brevo Credentials

### Step 1: Create a Brevo Account
1. Go to https://www.brevo.com/ (formerly Sendinblue)
2. Sign up for a free account (300 emails/day free tier)

### Step 2: Get Your SMTP Credentials

1. **Log in to Brevo Dashboard**
   - Go to https://app.brevo.com/

2. **Navigate to SMTP Settings**
   - Click on **"SMTP & API"** in the left sidebar
   - Click on **"SMTP"** tab

3. **Get Your SMTP Login**
   - Your **SMTP login** is usually your Brevo account email
   - Or it might be displayed as "SMTP server login"
   - Example: `your-email@example.com` or `smtpXXXXX`

4. **Get Your SMTP Key**
   - Click on **"Generate a new key"** or use existing key
   - Copy the SMTP key (this is your password)
   - Example format: `AbCdEf123456XyZ`

### Step 3: Verify Your Sender Email

1. **Go to Sender & IP**
   - Click on **"Senders & IP"** in the left sidebar
   - Click on **"Senders"** tab

2. **Add and Verify Sender**
   - Click **"Add a sender"**
   - Enter your email address (e.g., `your-email@example.com`)
   - Confirm the verification email sent to that address
   - This verified email is your **FROM_EMAIL**

### Step 4: Set Environment Variables

#### For Local Development (.env file):
```env
PORT=5000
BREVO_SMTP_LOGIN=your-smtp-login@example.com
BREVO_SMTP_KEY=your-smtp-key-here
FROM_EMAIL=your-verified-email@example.com
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
```

#### For Railway Deployment:
1. Go to your Railway project
2. Click on your service
3. Go to **"Variables"** tab
4. Add the following variables:
   - `BREVO_SMTP_LOGIN` = Your SMTP login email
   - `BREVO_SMTP_KEY` = Your SMTP key
   - `FROM_EMAIL` = Your verified sender email (same as SMTP login usually)
   - `BREVO_SMTP_HOST` = `smtp-relay.brevo.com` (optional, already default)
   - `BREVO_SMTP_PORT` = `587` (optional, already default)

### Notes:
- **FROM_EMAIL** should be the email you verified in Brevo's "Senders" section
- Usually, **FROM_EMAIL** is the same as **BREVO_SMTP_LOGIN**
- The FROM_EMAIL must be verified in Brevo, otherwise emails will fail
- Brevo free tier allows 300 emails per day

### Troubleshooting:

**If emails still don't send:**
1. Make sure your sender email is verified in Brevo dashboard
2. Check Railway logs for specific error messages
3. Verify all environment variables are set correctly (no extra spaces)
4. Ensure you're using the SMTP key, not the API key (they're different)

