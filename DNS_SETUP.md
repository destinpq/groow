# GROOW DNS Setup with Cloudflare

## New Domain Structure
- **Frontend**: `groow.destinpq.com` 
- **Backend API**: `groow-api.destinpq.com`
- **Server IP**: `20.40.56.175` (Azure VM)

## Cloudflare DNS Configuration

### API Token: `aa8d66bee78f7440a4543b636ea0851eee8b6`

### Required DNS Records

Add these A records in Cloudflare DNS dashboard:

```
Type: A
Name: groow
Content/Value: 20.40.56.175
Proxy Status: Proxied (Orange Cloud) ☁️
TTL: Auto

Type: A  
Name: groow-api
Content/Value: 20.40.56.175
Proxy Status: Proxied (Orange Cloud) ☁️
TTL: Auto
```

### Cloudflare Dashboard Steps

1. Login to Cloudflare dashboard
2. Select `destinpq.com` domain
3. Go to **DNS** > **Records**
4. Click **Add record**
5. Add the records above

### SSL/TLS Settings

In Cloudflare dashboard:
- Go to **SSL/TLS** > **Overview**
- Set encryption mode to **Full (strict)** for HTTPS
- **Edge Certificates** should be enabled for automatic SSL

### Security Settings

Recommended Cloudflare settings:
- **Security Level**: Medium
- **Bot Fight Mode**: On
- **Browser Integrity Check**: On

## Verification Commands

After DNS propagation (2-5 minutes):
```bash
# Check frontend domain
dig groow.destinpq.com
nslookup groow.destinpq.com

# Check backend domain
dig groow-api.destinpq.com  
nslookup groow-api.destinpq.com

# Test API endpoint
curl -I https://groow-api.destinpq.com/api/v1/health
```

## Testing the Setup

### Frontend Access
- URL: `https://groow.destinpq.com`
- Should serve the React/UMI frontend

### Backend API Access  
- Base URL: `https://groow-api.destinpq.com/api/v1`
- Health Check: `https://groow-api.destinpq.com/api/v1/health`
- API Docs: `https://groow-api.destinpq.com/api/docs`

## Troubleshooting

### If DNS doesn't resolve immediately:
```bash
# Clear DNS cache
sudo systemctl flush-dns
# or
sudo systemd-resolve --flush-caches

# Use specific DNS server
dig @8.8.8.8 groow-api.destinpq.com
```

### If Cloudflare shows errors:
- Check that both domains point to the same IP: `20.40.56.175`
- Verify SSL/TLS mode is set correctly
- Ensure Caddy is running and configured properly

## Next Steps

1. Configure Caddy for new domains
2. Update CORS settings in backend
3. Update environment variables
4. Deploy and test