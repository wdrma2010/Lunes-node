#!/usr/bin/env python3
"""
Lunes Host Auto Keep-Alive Script
自动登录 Lunes 面板保持服务器活跃
"""

import requests
import schedule
import time
from datetime import datetime

# ============================================================
# Configuration
# ============================================================
EMAIL = "awdruer@gmail.com"
PASSWORD = "Vps2020!!!"
SERVER_URL = "https://ctrl.lunes.host/server/0e08dd90"
LOGIN_URL = "https://ctrl.lunes.host/auth/login"

# ============================================================
# Keep-Alive Function
# ============================================================
def keep_alive():
    try:
        session = requests.Session()

        # Login
        login_data = {
            "email": EMAIL,
            "password": PASSWORD
        }
        login_resp = session.post(LOGIN_URL, data=login_data, allow_redirects=True)

        if login_resp.status_code == 200:
            # Access server page
            server_resp = session.get(SERVER_URL)
            if server_resp.status_code == 200:
                print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Keep-alive successful!")
            else:
                print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Server access failed: {server_resp.status_code}")
        else:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Login failed: {login_resp.status_code}")

    except Exception as e:
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Error: {e}")

# ============================================================
# Schedule: Every 7 days
# ============================================================
schedule.every(7).days.do(keep_alive)

print("Lunes Keep-Alive Service Started!")
print(f"Will access server every 7 days")
print(f"Server: {SERVER_URL}")
print("Press Ctrl+C to stop")

# Run immediately on start
keep_alive()

# Keep running
while True:
    schedule.run_pending()
    time.sleep(60)
