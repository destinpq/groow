# Groow Caddy Configuration - Fixed Issues & Troubleshooting Guide

## ✅ Issues Fixed (November 13, 2025)

### 1. **502 Bad Gateway Errors - FIXED**
- **Problem**: Reverse proxy was experiencing connection timeouts
- **Solution**: 
  - Increased `dial_timeout` to 10s
  - Increased `response_header_timeout` to 30s
  - Added proper error handling with custom error pages
  - Services are properly proxied: localhost:21440 (API) and localhost:21441 (Frontend)

### 2. **SSL/TLS Certificate Issues - RESOLVED**
- **Problem**: Caddy was trying to obtain certificates for domains without DNS records
- **Solution**: 
  - Removed non-existent domains (ecotracker*, www.drakanksha-api.com) from automatic certificate management
  - Caddy now only manages certificates for: groow.destinpq.com and groow-api.destinpq.com
  - SSL certificates will be automatically obtained from Let's Encrypt

### 3. **CORS Headers - ADDED**
- **Problem**: API calls from frontend were being blocked
- **Solution**: Added proper CORS headers to groow-api.destinpq.com:
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH`
  - `Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-Token`
  - CORS preflight (OPTIONS) requests return 204

### 4. **Security Headers - ENHANCED**
- Added comprehensive security headers for both frontend and API
- Removed server information disclosure (-Server, -X-Powered-By)
- Added HSTS for HTTPS enforcement on frontend

---

## 🔍 Current Configuration

### Backend API (groow-api.destinpq.com)
```
Port: 21440
URL: https://groow-api.destinpq.com
Local: http://localhost:21440
Status: ✓ Running
```

### Frontend (groow.destinpq.com)
```
Port: 21441
URL: https://groow.destinpq.com
Local: http://localhost:21441
Status: ✓ Running
```

---

## 🛠️ Monitoring & Troubleshooting

### Check Service Status
```bash
# Check if services are running
ss -tlnp | grep -E ':(21440|21441)'

# Expected output:
# LISTEN 0   511   0.0.0.0:21440   0.0.0.0:*   users:(("node",pid=XXX))
# LISTEN 0   511        *:21441         *:*   users:(("node",pid=XXX))
```

### Check Caddy Status
```bash
# Check Caddy service
sudo systemctl status caddy

# View live Caddy logs
sudo journalctl -u caddy -f

# View recent errors only
sudo journalctl -u caddy -p err -n 50

# Check Caddy configuration
sudo caddy validate --config /etc/caddy/Caddyfile
```

### Test Endpoints Locally
```bash
# Test backend API
curl -I http://localhost:21440

# Test frontend
curl -I http://localhost:21441

# Test through Caddy (externally)
curl -I https://groow-api.destinpq.com
curl -I https://groow.destinpq.com
```

### Check SSL Certificate Status
```bash
# Check certificate expiry
echo | openssl s_client -servername groow.destinpq.com -connect groow.destinpq.com:443 2>/dev/null | openssl x509 -noout -dates

# View all managed certificates
sudo caddy list-certificates
```

---

## 🚨 Common Issues & Solutions

### Issue: 502 Bad Gateway
**Symptoms**: Website shows "502 Bad Gateway" error

**Diagnosis**:
```bash
# 1. Check if backend/frontend services are running
ss -tlnp | grep -E ':(21440|21441)'

# 2. Check service logs
pm2 logs groow-backend    # or check your process manager
pm2 logs groow-frontend

# 3. Check Caddy logs for proxy errors
sudo journalctl -u caddy -n 50 | grep -i "502\|error"
```

**Solutions**:
1. Restart the service that's down:
   ```bash
   pm2 restart groow-backend
   pm2 restart groow-frontend
   ```

2. If Caddy can't connect:
   ```bash
   # Test direct connection
   curl http://localhost:21440
   curl http://localhost:21441
   ```

3. Increase timeouts in Caddyfile (already set to 10s/30s)

---

### Issue: SSL Certificate Not Working
**Symptoms**: SSL errors, certificate warnings in browser

**Diagnosis**:
```bash
# Check if Caddy is obtaining certificates
sudo journalctl -u caddy | grep -i "certificate\|tls" | tail -20

# Check DNS resolution
dig groow.destinpq.com
dig groow-api.destinpq.com
```

**Solutions**:
1. Ensure DNS records point to your server:
   ```bash
   # Check A records
   dig +short groow.destinpq.com
   dig +short groow-api.destinpq.com
   # Should return your server's IP
   ```

2. Ensure ports 80 and 443 are open:
   ```bash
   sudo ufw status | grep -E "80|443"
   # or
   sudo iptables -L -n | grep -E "80|443"
   ```

3. Force certificate renewal:
   ```bash
   sudo systemctl stop caddy
   sudo rm -rf /var/lib/caddy/.local/share/caddy/certificates/*
   sudo systemctl start caddy
   ```

---

### Issue: CORS Errors
**Symptoms**: Browser console shows CORS errors, API calls fail

**Diagnosis**:
```bash
# Test CORS headers
curl -I https://groow-api.destinpq.com

# Should see:
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
```

**Solutions**:
Already configured in the fixed Caddyfile. If still having issues:

1. Test OPTIONS request:
   ```bash
   curl -X OPTIONS -I https://groow-api.destinpq.com
   # Should return 204 No Content
   ```

2. Verify headers are being sent:
   ```bash
   curl -v https://groow-api.destinpq.com 2>&1 | grep -i "access-control"
   ```

---

### Issue: Service Won't Start After Reboot
**Diagnosis**:
```bash
# Check service status
sudo systemctl status caddy

# Check for errors
sudo journalctl -u caddy -n 50
```

**Solutions**:
1. Ensure Caddy is enabled:
   ```bash
   sudo systemctl enable caddy
   ```

2. Check file permissions:
   ```bash
   ls -l /etc/caddy/Caddyfile
   # Should be readable by caddy user
   ```

3. Validate configuration:
   ```bash
   sudo caddy validate --config /etc/caddy/Caddyfile
   ```

---

## 📋 Maintenance Commands

### Reload Configuration (No Downtime)
```bash
sudo systemctl reload caddy
```

### Restart Caddy
```bash
sudo systemctl restart caddy
```

### Format Caddyfile
```bash
sudo caddy fmt --overwrite /etc/caddy/Caddyfile
```

### Backup Caddyfile
```bash
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup.$(date +%Y%m%d_%H%M%S)
```

### View All Backups
```bash
ls -lah /etc/caddy/Caddyfile.backup*
```

### Restore from Backup
```bash
# List backups
ls /etc/caddy/Caddyfile.backup*

# Restore specific backup
sudo cp /etc/caddy/Caddyfile.backup.YYYYMMDD_HHMMSS /etc/caddy/Caddyfile

# Reload
sudo systemctl reload caddy
```

---

## 🔐 Security Best Practices

1. **Keep Caddy Updated**
   ```bash
   sudo apt update && sudo apt upgrade caddy
   ```

2. **Monitor Access Logs**
   ```bash
   # If logging enabled, check for suspicious activity
   sudo tail -f /var/log/caddy/groow-api.log
   sudo tail -f /var/log/caddy/groow-frontend.log
   ```

3. **Enable Firewall**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

4. **Regular Backups**
   - Backup Caddyfile weekly
   - Backup SSL certificates: `/var/lib/caddy/.local/share/caddy/`

---

## 📊 Performance Monitoring

### Check Response Times
```bash
# Backend API
time curl -I https://groow-api.destinpq.com

# Frontend
time curl -I https://groow.destinpq.com
```

### Monitor Active Connections
```bash
# Check connections to backend
ss -tn | grep :21440 | wc -l

# Check connections to frontend
ss -tn | grep :21441 | wc -l
```

### Resource Usage
```bash
# Check Caddy process
ps aux | grep caddy

# Memory usage
free -h

# Disk space
df -h
```

---

## 📝 Configuration Files

### Main Caddyfile Location
```
/etc/caddy/Caddyfile
```

### Backups Location
```
/etc/caddy/Caddyfile.backup*
```

### Project Caddyfiles (Reference)
```
/home/azureuser/Groow/groow/Caddyfile               # Original
/home/azureuser/Groow/groow/Caddyfile.fixed         # Old fix attempt
/home/azureuser/Groow/groow/Caddyfile.groow-fixed   # Latest fix (reference)
```

### Update Script
```
/home/azureuser/Groow/groow/update-groow-caddy.sh
```

---

## 🆘 Emergency Recovery

If everything breaks:

1. **Stop Caddy**
   ```bash
   sudo systemctl stop caddy
   ```

2. **Restore Last Known Good Configuration**
   ```bash
   sudo cp /etc/caddy/Caddyfile.backup.$(ls -t /etc/caddy/Caddyfile.backup* | head -1) /etc/caddy/Caddyfile
   ```

3. **Validate and Start**
   ```bash
   sudo caddy validate --config /etc/caddy/Caddyfile
   sudo systemctl start caddy
   ```

4. **Check Status**
   ```bash
   sudo systemctl status caddy
   sudo journalctl -u caddy -n 50
   ```

---

## ✅ Verification Checklist

After any changes, verify:

- [ ] Caddy configuration validates: `sudo caddy validate --config /etc/caddy/Caddyfile`
- [ ] Caddy service is running: `sudo systemctl status caddy`
- [ ] Backend responds locally: `curl http://localhost:21440`
- [ ] Frontend responds locally: `curl http://localhost:21441`
- [ ] SSL certificate is valid: `curl -I https://groow.destinpq.com`
- [ ] API is accessible: `curl -I https://groow-api.destinpq.com`
- [ ] CORS headers are present: `curl -I https://groow-api.destinpq.com | grep -i access-control`
- [ ] No 502 errors in logs: `sudo journalctl -u caddy -n 50 | grep -i 502`

---

## 📞 Quick Reference

| Component | Port | URL | Check Command |
|-----------|------|-----|---------------|
| Backend API | 21440 | https://groow-api.destinpq.com | `curl -I http://localhost:21440` |
| Frontend | 21441 | https://groow.destinpq.com | `curl -I http://localhost:21441` |
| Caddy | 80, 443 | - | `sudo systemctl status caddy` |

---

## 🎯 Next Steps

1. Monitor the sites for the next 24 hours
2. Check SSL certificate auto-renewal (certificates expire in 90 days, auto-renew at 30 days)
3. Set up monitoring/alerting if not already configured
4. Document any custom application-level configurations

---

**Last Updated**: November 13, 2025
**Configuration Version**: Fixed - v1.0
**Status**: ✅ All issues resolved
