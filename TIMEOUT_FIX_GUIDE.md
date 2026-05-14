# N8N Webhook Timeout Fix - Complete Implementation

## Problem
The n8n webhook was timing out after 60 seconds, and error responses weren't displaying in the UI.

## Solution Implemented

### 1. **Extended Backend Timeout** 
**File:** `server/routes/audioRoutes.js`
- ⏱️ **60 seconds → 300 seconds (5 minutes)**
- Changed from: `setTimeout(() => controller.abort(), 60_000);`
- Changed to: `setTimeout(() => controller.abort(), 300_000);`
- This gives your n8n workflow plenty of time to complete complex audio analysis

### 2. **Enhanced Frontend Timeout Handling**
**File:** `src/components/AudioUploader.jsx`
- Added proper AbortSignal timeout with 330-second buffer
- Updated error messages to clarify timeout issues

### 3. **Improved Error Display**
**File:** `src/components/ResultDisplay.jsx`
- ✅ Now properly detects and displays errors
- ✅ Shows user-friendly error messages
- ✅ Provides troubleshooting tips when errors occur
- Distinguishes between success and error states with different UI styles

### 4. **Better User Feedback**
**File:** `src/components/AIProcessingScreen.jsx`
- Added warning message: "⏱️ Processing may take up to 5 minutes. Please keep this window open."
- Prevents user confusion during long processing times

## Testing Checklist

- [ ] Deploy changes to your backend
- [ ] Test with an audio file
- [ ] Verify n8n workflow is in "Active" mode (not just test mode)
- [ ] Ensure ngrok tunnel is running: `ngrok http 5678 --domain=your-domain`
- [ ] Check that N8N_WEBHOOK_URL is set in your `.env`
- [ ] Monitor the server logs for any errors
- [ ] Test error handling with an invalid webhook URL

## Troubleshooting

### Still getting timeout errors?
1. **Check n8n workflow status:**
   - Open your n8n instance
   - Verify the workflow is marked as "Active"
   - Not in "Test" mode

2. **Verify ngrok tunnel:**
   ```bash
   ngrok http 5678 --domain=ruthenic-lucy-expositorially.ngrok-free.dev
   ```
   - Copy the https URL from ngrok output

3. **Update N8N_WEBHOOK_URL:**
   - Add to `.env` file:
   ```
   N8N_WEBHOOK_URL=https://your-ngrok-domain.ngrok-free.dev/webhook/your-path
   ```

4. **Check logs:**
   - Backend logs show: `[N8N] → Forwarding to {URL}`
   - n8n logs show incoming request
   - Look for actual n8n processing errors

### Response not displaying?
- Check browser console (F12) for raw JSON response
- Look for `[n8n raw result]` in console logs
- Verify n8n is returning valid JSON output

## Technical Details

- **Frontend timeout:** 330 seconds (matches backend + 30s buffer)
- **Backend timeout:** 300 seconds (5 minutes for n8n processing)
- **Error states:** Detected via `_error`, `error`, or `success: false` fields
- **Response format:** Supports both single objects and arrays (uses first element if array)

## Files Modified
1. `server/routes/audioRoutes.js` - Timeout increase
2. `src/components/AudioUploader.jsx` - Fetch timeout handling
3. `src/components/ResultDisplay.jsx` - Error UI & response display
4. `src/components/AIProcessingScreen.jsx` - User feedback message
