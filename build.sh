#!/bin/bash

# EAS Build Helper Script
# Makes it easy to build for different scenarios

set -e  # Exit on error

echo "🐝 Bee Garden Build Helper"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function show_menu() {
    echo "Select build type:"
    echo ""
    echo "  ${GREEN}1)${NC} Android APK (Cloud Build - Recommended)"
    echo "  ${GREEN}2)${NC} iOS IPA (Cloud Build - Recommended)"
    echo "  ${GREEN}3)${NC} Both platforms (Cloud Build)"
    echo ""
    echo "  ${YELLOW}4)${NC} Android APK (Local Build - Requires SDK)"
    echo "  ${YELLOW}5)${NC} iOS IPA (Local Build - Requires Xcode)"
    echo ""
    echo "  ${GREEN}6)${NC} Production Build - Android"
    echo "  ${GREEN}7)${NC} Production Build - iOS"
    echo "  ${GREEN}8)${NC} Production Build - Both"
    echo ""
    echo "  ${RED}9)${NC} Cancel"
    echo ""
}

function build_android_cloud() {
    echo "📱 Building Android APK in the cloud..."
    echo "This will use production Supabase and take about 10-15 minutes"
    echo ""
    eas build --profile local --platform android
}

function build_ios_cloud() {
    echo "📱 Building iOS IPA in the cloud..."
    echo "This will use production Supabase and take about 15-20 minutes"
    echo ""
    eas build --profile local --platform ios
}

function build_both_cloud() {
    echo "📱 Building both platforms in the cloud..."
    echo "This will use production Supabase and take about 20-30 minutes"
    echo ""
    eas build --profile local --platform all
}

function build_android_local() {
    echo "⚠️  Building Android APK locally..."
    echo "This requires Android SDK installed at: $ANDROID_HOME"
    echo ""
    
    if [ -z "$ANDROID_HOME" ]; then
        echo "${RED}ERROR: ANDROID_HOME is not set!${NC}"
        echo "Please install Android Studio and set ANDROID_HOME"
        echo "Or use cloud build instead (option 1)"
        exit 1
    fi
    
    eas build --profile local --platform android --local
}

function build_ios_local() {
    echo "⚠️  Building iOS IPA locally..."
    echo "This requires Xcode and command line tools installed"
    echo ""
    
    if ! command -v xcodebuild &> /dev/null; then
        echo "${RED}ERROR: Xcode command line tools not found!${NC}"
        echo "Please install Xcode"
        echo "Or use cloud build instead (option 2)"
        exit 1
    fi
    
    eas build --profile local --platform ios --local
}

function build_production_android() {
    echo "🚀 Building production Android APK..."
    echo "This will be ready for Google Play Store"
    echo ""
    eas build --profile production --platform android
}

function build_production_ios() {
    echo "🚀 Building production iOS IPA..."
    echo "This will be ready for App Store/TestFlight"
    echo ""
    eas build --profile production --platform ios
}

function build_production_both() {
    echo "🚀 Building production builds for both platforms..."
    echo "These will be ready for App Store and Google Play Store"
    echo ""
    eas build --profile production --platform all
}

# Main script
show_menu

read -p "Enter your choice (1-9): " choice

case $choice in
    1)
        build_android_cloud
        ;;
    2)
        build_ios_cloud
        ;;
    3)
        build_both_cloud
        ;;
    4)
        build_android_local
        ;;
    5)
        build_ios_local
        ;;
    6)
        build_production_android
        ;;
    7)
        build_production_ios
        ;;
    8)
        build_production_both
        ;;
    9)
        echo "Cancelled"
        exit 0
        ;;
    *)
        echo "${RED}Invalid choice!${NC}"
        exit 1
        ;;
esac

echo ""
echo "${GREEN}✅ Build started!${NC}"
echo ""
echo "You can:"
echo "  - Watch progress in the terminal"
echo "  - View builds at: https://expo.dev/accounts/liamar/projects/bee-garden/builds"
echo "  - Download the APK/IPA when complete"
