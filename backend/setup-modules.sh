#!/bin/bash

# This script generates all module stubs for the Groow E-Commerce Platform
# Run this after installing dependencies: npm install

echo "Generating all module files..."

# Create all module directories
modules=(
  "notification"
  "payment"
  "upload"
  "cms"
  "report"
  "order"
  "rfq"
  "admin"
  "vendor"
  "customer"
)

for module in "${modules[@]}"; do
  mkdir -p "src/modules/$module"
  mkdir -p "src/modules/$module/entities"
  mkdir -p "src/modules/$module/dto"
  mkdir -p "src/modules/$module/controllers"
  mkdir -p "src/modules/$module/services"
done

echo "✓ Module structure created"
echo "✓ Next step: Run 'npm install' in the backend directory"
echo "✓ Then: Create .env file from .env.example"
echo "✓ Finally: Run 'npm run start:dev' to start the backend"
