# Supabase Setup Instructions

## Step 1: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Sign in** with your account: `mdrrmopioduran@gmail.com`
3. **Select your project** or create a new one
4. **Go to Settings** → **API**
5. **Copy these values**:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - Anon/Public Key (starts with `eyJ...`)

## Step 2: Update Environment Variables

Replace the placeholder values in `.env` file with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 3: Run Database Migration

The migration file is already created at `supabase/migrations/20250629105114_calm_tower.sql`

**Option A: Using Supabase Dashboard**
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the content from the migration file
4. Click **Run**

**Option B: Using Supabase CLI (if installed)**
```bash
supabase db push
```

## Step 4: Verify Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the application**:
   - Visit: http://localhost:5173
   - Try logging in: http://localhost:5173/admin/login
   - Use credentials: `admin@mdrrmo.gov.ph` / `admin123`

## Step 5: Enable Authentication

In your Supabase Dashboard:
1. Go to **Authentication** → **Settings**
2. **Disable email confirmation** (for demo purposes)
3. **Add your domain** to allowed origins if needed

## What's Included

✅ **Complete Database Schema**:
- News articles
- Services
- Incident reports
- Gallery items
- About sections
- Pages
- Emergency alerts
- Social posts

✅ **Row Level Security (RLS)**:
- Public can read published content
- Authenticated users can manage all content
- Anyone can submit incident reports

✅ **Sample Data**:
- Pre-populated with demo content
- Ready to use immediately

✅ **Real-time Features**:
- Live updates across all components
- Automatic data synchronization

## Troubleshooting

**If you get connection errors**:
1. Check your credentials in `.env`
2. Ensure your Supabase project is active
3. Verify the migration was run successfully

**If authentication fails**:
1. Check that email confirmation is disabled
2. Verify the demo users exist in the auth table
3. Try creating users manually in Supabase dashboard

## Next Steps

Once connected, you can:
1. **Manage Content** - Add/edit news, services, gallery items
2. **Handle Incidents** - Review and respond to public reports
3. **Emergency Alerts** - Send automated alerts to the community
4. **Social Media** - Manage social media presence
5. **Analytics** - Track engagement and performance

Need help? The application includes comprehensive admin tools for all features!