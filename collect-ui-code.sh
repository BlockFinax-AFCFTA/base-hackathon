#!/bin/bash

# Script to collect and package the BlockFinaX UI code

echo "Collecting UI code for BlockFinaX..."

# Create a zip archive
zip -r BlockFinaX-UI-Only.zip BlockFinaX-UI-Only/

echo "Done! BlockFinaX-UI-Only.zip has been created."
echo "This archive contains a standalone React+Vite application with all the UI components."
echo "To use it:"
echo "1. Extract the zip file"
echo "2. Navigate to the extracted directory: cd BlockFinaX-UI-Only"
echo "3. Install dependencies: npm install"
echo "4. Start the development server: npm run dev"