#!/bin/bash

echo "🔍 Testing Supabase Connection..."
echo ""
echo "📍 Checking Supabase status:"
supabase status
echo ""
echo "🌐 Testing API endpoint:"
curl -s http://127.0.0.1:54321/health | jq '.' || echo "Health endpoint not responding"
echo ""
echo "🔑 Environment variables in .env.local:"
grep EXPO_PUBLIC_SUPABASE .env.local
echo ""
echo "✅ To fix the iOS simulator connection:"
echo "1. Make sure .env.local uses http://127.0.0.1:54321"
echo "2. Stop the Expo server (Ctrl+C in the terminal)"
echo "3. Clear cache: expo start -c"
echo "4. Restart: yarn start"
echo ""
echo "🔧 Current Supabase URL from .env.local:"
grep EXPO_PUBLIC_SUPABASE_URL .env.local
