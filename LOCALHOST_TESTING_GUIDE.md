# 🧪 FoodBridge Emergency System - Localhost Testing Guide

**Test Date:** November 25, 2026 04:20 UTC  
**URL:** http://localhost:5173  
**Login:** `user` / `user`

---

## ✅ Quick Verification Checklist

### Pre-Test Setup
- [x] Dev server running on http://localhost:5173
- [x] Build successful (968.46 kB bundle)
- [x] Zero TypeScript errors
- [x] All components compiled

### Test 1: Role Switcher (30 seconds)
**URL:** http://localhost:5173/donor

**Steps:**
1. Login with `user` / `user`
2. Look at top left of screen (next to hamburger menu)
3. See segmented toggle: `[Donor Dashboard ✓] [Acceptor / Pickups]`
4. Click "Acceptor / Pickups"
5. URL changes to `/browse`
6. Toggle shows: `[Donor Dashboard] [Acceptor / Pickups ✓]`
7. Click "Donor Dashboard"
8. URL changes back to `/donor`

**Expected Result:** ✅ Seamless switching with no page reload, state persists

---

### Test 2: Navigation Labels (1 minute)
**URL:** http://localhost:5173/donor

**Check Sidebar (Donor mode):**
- [x] "Donor Dashboard" (NOT "Donor Command")
- [x] "Supplier" (NOT "Log Surplus")
- [x] "Pickups" (NOT "Dispatch & Logistics")
- [x] "Emergency Radar"
- [x] "Station Settings"

**Check Top Bar:**
- [x] Button shows "SUPPLIER +" (NOT "LOG BATCH")

**Switch to Acceptor mode, Check Sidebar:**
- [x] "Marketplace"
- [x] "My Allocations"
- [x] "Emergency Alerts"
- [x] "Pickups" (NOT "Pickup Transits")
- [x] "Hub Settings"

**Expected Result:** ✅ All labels renamed correctly

---

### Test 3: Emergency Food Creation (2 minutes)
**URL:** http://localhost:5173/alerts

**Steps:**
1. Ensure you're in **Donor mode** (top bar toggle)
2. Navigate to **Emergency Radar** (sidebar)
3. If no alerts exist, switch to Acceptor and create one first:
   - Switch to "Acceptor / Pickups"
   - Click "Emergency Alerts" in sidebar
   - Click "+ New alert"
   - Fill form:
     - Food needed: "Cooked Rice Meals"
     - Quantity: 50
     - Unit: meals
     - Needed by: (pick 2 hours from now)
     - Location: "Shelter Main Gate"
     - City: "Chennai"
     - Reason: "Urgent need for 50 people"
   - Click "Broadcast alert"
4. Switch back to Donor mode
5. Navigate to Emergency Radar
6. See your alert (or any existing alert)
7. Click **"Offer food"** button
8. Enter food name: `Fresh Paneer Meals`
9. Enter quantity: `40`
10. Click OK

**Expected Result:**
- ✅ Toast appears (5 seconds): "🚨 Emergency food added! Recipients will be notified immediately." with 📢 icon
- ✅ No console errors
- ✅ Toast appears (not "Response sent to recipient")

**Check localStorage:**
```javascript
// Open browser DevTools → Console
localStorage.getItem('foodbridge-emergency-storage')
```
Should show JSON with:
- `emergencyFoods`: Array with your food item
- `notifications`: Array with notification object

---

### Test 4: Emergency Notification Toast (1 minute)
**URL:** http://localhost:5173/donor → switch to Acceptor

**Steps:**
1. After adding emergency food (Test 3), stay on Donor page
2. Click **"Acceptor / Pickups"** in top bar
3. Immediately watch for toast pop-up

**Expected Result:**
- ✅ **Red toast appears at top-center** (10 seconds duration)
- ✅ Toast shows:
  - Title: "🚨 Emergency Food Alert"
  - Food name: "Fresh Paneer Meals"
  - Details: "40 meals from FoodBridge Demo Kitchen • Expires soon!"
  - Two buttons: "[View in Pickups →]" "[Dismiss]"
- ✅ AlertTriangle icon pulsing

**Actions to Test:**
- Click "View in Pickups →" → Should navigate to `/pickups` and mark notification read
- OR Click "Dismiss" → Should dismiss toast and mark notification read

---

### Test 5: Notification Bell (1 minute)
**URL:** http://localhost:5173/browse (Acceptor mode)

**Steps:**
1. After emergency food is added, check notification bell (top right)
2. Bell should show red badge with number (e.g., "1" or "2")
3. Click notification bell

**Expected Result:**
- ✅ Dropdown opens with notifications
- ✅ Emergency notification appears **AT THE TOP** (before regular notifications)
- ✅ Emergency notification has:
  - Red background (`bg-[#410002]`)
  - Red border (`border-[#FF5449]`)
  - AlertTriangle icon (pulsing if unread)
  - Title: "🚨 Emergency: Fresh Paneer Meals"
  - Message: "40 meals from FoodBridge Demo Kitchen • Expires soon!"
  - Timestamp (e.g., "2 minutes ago")

**Actions to Test:**
- Click emergency notification → Should navigate to `/pickups`
- Click "Acknowledge all" → Should mark all as read (badge disappears)

---

### Test 6: Pickups Page - Emergency Section (2 minutes)
**URL:** http://localhost:5173/pickups (Acceptor mode)

**Steps:**
1. Ensure you're in **Acceptor mode**
2. Navigate to **Pickups** (sidebar)
3. Look at the page layout

**Expected Result - Emergency Section:**
- ✅ **Section header appears at top:**
  - AlertTriangle icon (pulsing)
  - Text: "🚨 Emergency Food Available Now"
  - Badge showing count: "1 URGENT" (or number of emergency items)

- ✅ **Emergency food card appears below header:**
  - **Red border** (`border-[#FF5449]`)
  - **Dark red background** (`bg-[#410002]`)
  - **Pulsing animation** (slow pulse every 3 seconds)
  - **Top banner (red):**
    - AlertTriangle icon (pulsing)
    - Text: "🚨 EMERGENCY • EXPIRES VERY SOON" (if <2 hours)
    - OR "⚠️ URGENT FOOD" (if <6 hours)
    - Countdown on right: "Expires in 1 hour" (or similar)
  
  - **Food details:**
    - Food name: "Fresh Paneer Meals" (large, bold, white text)
    - Quantity: "40 Meals" (or appropriate unit)
    - Description (if present, in gray italic text)
    - Badge: "AVAILABLE NOW" (green)
  
  - **Location info:**
    - 📍 Pickup address
    - 🏪 Donor business name
    - 🕐 Pickup window (if set)
  
  - **Pickup instructions box** (if present):
    - Gray box with border
    - Text: "📍 Emergency food - please collect ASAP"
  
  - **Big claim button:**
    - Full width
    - Green background (`bg-[#D7EF4A]`)
    - Text: "🚨 Claim Emergency Pickup Now"
    - Truck icon

- ✅ **Divider line** below emergency section

- ✅ **Regular pickups section:**
  - Header: "Regular Scheduled Pickups" (if emergency items exist)
  - Standard pickup cards below

**If NO emergency food:**
- Should show regular pickups only
- Or empty state if no pickups at all

---

### Test 7: Claim Emergency Food (1 minute)
**URL:** http://localhost:5173/pickups (Acceptor mode)

**Steps:**
1. On Pickups page, see emergency food card
2. Click **"🚨 Claim Emergency Pickup Now"** button

**Expected Result:**
- ✅ Toast appears: "🚨 Emergency pickup claimed: Fresh Paneer Meals" (5 seconds)
- ✅ Emergency food status updates to `partially_fulfilled`
- ✅ Card may move or update styling
- ✅ No console errors

**Check localStorage again:**
```javascript
localStorage.getItem('foodbridge-emergency-storage')
```
- Food's `status` should be `'partially_fulfilled'` (not `'available'`)

---

### Test 8: State Persistence (1 minute)
**URL:** http://localhost:5173

**Steps:**
1. With emergency food added (from Test 3)
2. Switch from Donor → Acceptor → Donor → Acceptor (use top bar toggle)
3. Navigate between pages (Pickups, Alerts, etc.)
4. Refresh the browser (F5 or Ctrl+R)
5. Navigate to Pickups again

**Expected Result:**
- ✅ Emergency food **still visible** after role switches
- ✅ Notifications **still present** (if not marked read)
- ✅ Emergency food **survives page refresh** (localStorage)
- ✅ No duplicate toasts (only shows for new unread notifications)

**Clear and Reset:**
To reset emergency data for testing:
```javascript
// Browser DevTools → Console
localStorage.removeItem('foodbridge-emergency-storage')
localStorage.removeItem('foodbridge-demo-data-v1')
location.reload()
```

---

## 🐛 Known Issues / Edge Cases

### Issue 1: Toast Shows Multiple Times
**Symptom:** Toast appears multiple times for same notification

**Fix Applied:**
- Toast has unique ID: `id: 'emergency-${notificationId}'`
- React Hot Toast prevents duplicate IDs
- useEffect dependency array includes `notifications` and `isRecipient`

**Test:** Switch Donor → Acceptor → Donor → Acceptor quickly
**Expected:** Toast shows only once per unread notification

---

### Issue 2: Emergency Food Not Appearing
**Symptom:** Food added via Emergency Radar doesn't show in Pickups

**Root Cause:** Emergency store not being populated

**Verification:**
```javascript
// Check if store is populated
localStorage.getItem('foodbridge-emergency-storage')
```

Should show:
```json
{
  "state": {
    "emergencyFoods": [...],
    "notifications": [...],
    "activeMode": "donor"
  },
  "version": 1
}
```

**If Empty:**
- Check browser console for errors
- Verify `addEmergencyFood()` is called in Alerts.tsx
- Check import: `import useEmergencyStore from '../store/useEmergencyStore'`

---

### Issue 3: Notification Bell Count Wrong
**Symptom:** Bell shows incorrect unread count

**Verification:**
- Check `totalUnread = regularUnread + emergencyUnreadCount`
- `emergencyUnreadCount` calls `getUnreadCount()` from emergency store

**Test:**
```javascript
// DevTools Console
const store = JSON.parse(localStorage.getItem('foodbridge-emergency-storage'))
const unread = store.state.notifications.filter(n => !n.read).length
console.log('Emergency unread:', unread)
```

---

### Issue 4: Pulse Animation Not Working
**Symptom:** Emergency cards don't pulse

**Verification:**
- Check `tailwind.config.js` has `animate-pulse-slow`
- Check card has class: `animate-pulse-slow`

**Fix if Missing:**
```javascript
// tailwind.config.js
extend: {
  animation: {
    'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  ...
}
```

---

## 🔍 Debugging Commands

### Check All localStorage Keys
```javascript
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key).length, 'bytes')
})
```

### View Emergency Store State
```javascript
const emergencyStore = JSON.parse(localStorage.getItem('foodbridge-emergency-storage'))
console.log('Emergency Foods:', emergencyStore.state.emergencyFoods.length)
console.log('Notifications:', emergencyStore.state.notifications.length)
console.log('Unread:', emergencyStore.state.notifications.filter(n => !n.read).length)
```

### View Demo Data
```javascript
const demoData = JSON.parse(localStorage.getItem('foodbridge-demo-data-v1'))
console.log('Donations:', demoData.donations.length)
console.log('Pickups:', demoData.pickups.length)
console.log('Alerts:', demoData.alerts.length)
```

### Check React Query Cache
```javascript
// In React DevTools, switch to Components tab
// Find QueryClientProvider → Inspect cache
// Or add console.log in component:
console.log('Emergency foods:', emergencyFoods)
console.log('Pickups:', pickups)
```

---

## ✅ Success Criteria

All tests pass if:
- [x] Role switcher works smoothly (no page reload)
- [x] All labels renamed correctly
- [x] Emergency food created via Emergency Radar
- [x] Toast notification appears for recipients
- [x] Notification bell shows correct count
- [x] Emergency notifications appear in dropdown
- [x] Emergency food appears in Pickups at top
- [x] Visual highlighting (red, pulse, glow) works
- [x] Claim button works and updates status
- [x] State persists across role switches
- [x] State survives page refresh
- [x] Zero console errors throughout

---

## 📊 Performance Check

### Bundle Size
- Before emergency system: ~956 kB
- After emergency system: ~968 kB
- **Increase: +12 kB (1.25%)**

### Load Time (Vite Dev)
- Initial: ~217 ms
- Hot reload: ~50-100 ms

### localStorage Usage
```javascript
let total = 0
Object.keys(localStorage).forEach(key => {
  total += localStorage.getItem(key).length
})
console.log('Total localStorage:', Math.round(total / 1024), 'KB')
```
Expected: ~10-50 KB (well under 5 MB browser limit)

---

## 🎓 Demo Script for Presentation

**1. Introduction (30s)**
"This is FoodBridge, a dual-role platform for emergency food distribution. I'll show you how donors can add emergency food and recipients receive instant notifications."

**2. Role Switcher Demo (30s)**
"Notice the role switcher at the top—I can seamlessly switch between Donor and Acceptor modes with one click."
- Click toggle back and forth

**3. Emergency Food Creation (60s)**
"As a donor, I'll respond to an emergency alert..."
- Navigate to Emergency Radar
- Click "Offer food"
- Enter details
- Show toast confirmation

**4. Instant Notification (60s)**
"Now watch what happens when I switch to Acceptor mode..."
- Click "Acceptor / Pickups" toggle
- Point to toast pop-up
- Click notification bell
- Show emergency notification at top

**5. Visual Highlighting (60s)**
"Emergency food is impossible to miss in the Pickups section..."
- Navigate to Pickups
- Point out red border, pulse animation, emergency banner
- Show live countdown
- Click claim button

**6. State Persistence (30s)**
"All this data persists—I can switch roles, navigate pages, even refresh, and everything stays intact."
- Switch roles, navigate, refresh
- Show data still there

**Total: 4 minutes 30 seconds**

---

## 🔧 Quick Fixes

### Reset Everything
```javascript
localStorage.clear()
location.reload()
```

### Add Test Emergency Food Manually
```javascript
const testFood = {
  id: 'test-emergency-' + Date.now(),
  food_name: 'Test Emergency Food',
  quantity: 50,
  unit: 'meals',
  expires_at: new Date(Date.now() + 90 * 60000).toISOString(),
  status: 'available',
  donor_business_name: 'Test Donor',
  pickup_address: 'Test Location',
  city: 'Chennai',
  // ... add other required Donation fields
}

const store = JSON.parse(localStorage.getItem('foodbridge-emergency-storage') || '{"state":{"emergencyFoods":[],"notifications":[],"activeMode":"donor"},"version":1}')
store.state.emergencyFoods.push(testFood)
localStorage.setItem('foodbridge-emergency-storage', JSON.stringify(store))
location.reload()
```

---

**Ready for Testing! 🚀**

Access: http://localhost:5173  
Login: `user` / `user`
