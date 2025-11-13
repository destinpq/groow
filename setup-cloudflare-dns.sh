#!/bin/bash

# Cloudflare DNS Setup Script
# Using provided API key: aa8d66bee78f7440a4543b636ea0851eee8b6

set -e

echo "Setting up Cloudflare DNS records..."

# Cloudflare API configuration
CF_TOKEN="aa8d66bee78f7440a4543b636ea0851eee8b6"
ZONE_NAME="destinpq.com"
SERVER_IP="20.40.56.175"

# Get zone ID
echo "Getting zone ID for $ZONE_NAME..."
ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE_NAME" \
     -H "Authorization: Bearer $CF_TOKEN" \
     -H "Content-Type: application/json")

ZONE_ID=$(echo $ZONE_RESPONSE | jq -r '.result[0].id')

if [ "$ZONE_ID" = "null" ] || [ -z "$ZONE_ID" ]; then
    echo "Error: Could not get zone ID. Response:"
    echo $ZONE_RESPONSE
    echo "Trying alternative API key format..."
    
    # Try with API key format
    ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE_NAME" \
         -H "X-Auth-Key: $CF_TOKEN" \
         -H "X-Auth-Email: khanapurkarpratik@gmail.com" \
         -H "Content-Type: application/json")
    
    ZONE_ID=$(echo $ZONE_RESPONSE | jq -r '.result[0].id')
fi

if [ "$ZONE_ID" = "null" ] || [ -z "$ZONE_ID" ]; then
    echo "Error: Still could not get zone ID. Manual setup required."
    echo "Please add these records manually in Cloudflare:"
    echo "1. groow.destinpq.com → $SERVER_IP (A record, proxied)"
    echo "2. groow-api.destinpq.com → $SERVER_IP (A record, proxied)"
    exit 1
fi

echo "Zone ID: $ZONE_ID"

# First, let's check if records exist and delete them
echo "Checking for existing records..."
RECORDS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=groow.destinpq.com" \
     -H "X-Auth-Key: $CF_TOKEN" \
     -H "X-Auth-Email: khanapurkarpratik@gmail.com" \
     -H "Content-Type: application/json")

# Delete existing groow record if it exists
RECORD_ID=$(echo $RECORDS | jq -r '.result[0].id')
if [ "$RECORD_ID" != "null" ] && [ -n "$RECORD_ID" ]; then
    echo "Deleting existing groow record..."
    curl -X DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
         -H "X-Auth-Key: $CF_TOKEN" \
         -H "X-Auth-Email: khanapurkarpratik@gmail.com" \
         -H "Content-Type: application/json"
fi

# Check groow-api records
API_RECORDS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=groow-api.destinpq.com" \
     -H "X-Auth-Key: $CF_TOKEN" \
     -H "X-Auth-Email: khanapurkarpratik@gmail.com" \
     -H "Content-Type: application/json")

API_RECORD_ID=$(echo $API_RECORDS | jq -r '.result[0].id')
if [ "$API_RECORD_ID" != "null" ] && [ -n "$API_RECORD_ID" ]; then
    echo "Deleting existing groow-api record..."
    curl -X DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$API_RECORD_ID" \
         -H "X-Auth-Key: $CF_TOKEN" \
         -H "X-Auth-Email: khanapurkarpratik@gmail.com" \
         -H "Content-Type: application/json"
fi

# Create groow.destinpq.com record
echo "Creating groow.destinpq.com DNS record..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
     -H "X-Auth-Key: $CF_TOKEN" \
     -H "X-Auth-Email: khanapurkarpratik@gmail.com" \
     -H "Content-Type: application/json" \
     --data '{
       "type": "A",
       "name": "groow",
       "content": "'$SERVER_IP'",
       "ttl": 1,
       "proxied": true
     }'

echo ""

# Create groow-api.destinpq.com record  
echo "Creating groow-api.destinpq.com DNS record..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
     -H "X-Auth-Key: $CF_TOKEN" \
     -H "X-Auth-Email: khanapurkarpratik@gmail.com" \
     -H "Content-Type: application/json" \
     --data '{
       "type": "A", 
       "name": "groow-api",
       "content": "'$SERVER_IP'",
       "ttl": 1,
       "proxied": true
     }'

echo ""
echo "DNS records created! Testing resolution..."

# Wait a moment for DNS propagation
sleep 10

# Test DNS resolution
echo "Testing groow.destinpq.com..."
dig +short groow.destinpq.com

echo "Testing groow-api.destinpq.com..."
dig +short groow-api.destinpq.com

echo "DNS setup complete!"