#!/bin/bash

# Build the demo
echo "Building demo..."
npm run build:demo

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Demo built successfully!"
    echo "📁 Demo files are in: dist-demo/"
    echo ""
    echo "To deploy to GitHub Pages:"
    echo "1. Push this repository to GitHub"
    echo "2. Go to Settings > Pages"
    echo "3. Set Source to 'GitHub Actions'"
    echo "4. The demo will be available at: https://whytepeter.github.io/vue-tour-guide/"
else
    echo "❌ Demo build failed!"
    exit 1
fi 