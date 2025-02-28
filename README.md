# Meeting Buffer App

A Google Apps Script project that automatically adds buffer time after Google Calendar meetings and cleans up orphaned buffer events.

## Features

- Adds 15-minute buffer events after meetings
- Only adds buffers for accepted meetings or meetings you organize
- Skips all-day events and events without other guests
- Cleans up orphaned buffer events when meetings are cancelled or rescheduled
- Buffer events are marked private and colored gray

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Customize your Meeting Buffer app settings in the `Code.js` file. No changes are needed if you're good with the defaults:
   - `MONTHS_AHEAD` - The number of months into the future to process events (default is 3 Months)
   - `BUFFER_LENGTH` - The length of buffer time after meetings (in minutes). (default is 15 minutes) 
4. Follow the [Google Apps Script setup guide](https://developers.google.com/apps-script/guides/clasp) to:
   - Enable the [Google Apps Script API](https://script.google.com/home/usersettings)
   - Install and authenticate clasp
   - Set up your Apps Script project
   - Create a new project and a `.clasp.json` file should be created automatically with your script ID
5. Push the script to Google Apps Script
6. Open your Google App Script project and navigate to Triggers
   - Click on "Add Trigger"
   - Select the `addBufferTimeAndCleanup` function and configure the trigger:
     - Function to run: `addBufferTimeAndCleanup`
     - Select event source: `Time-driven`
     - Select type of time based trigger: `Minute timer`
     - Select minute interval: `10` (recommended to run every 10 minutes)
     - Setup failure notifications if you want to be notified of failures
     - Click "Save" and give the script to access your Google Calendar
7. Jump back to the `Code.js` file and click `Run`.
8. Watch the magic happen.

## Usage

After pushing the script to Google Apps Script and setting up a trigger:

1. Open Google Calendar
2. The script will automatically process events for the next 3 months (unless you changed the `MONTHS_AHEAD` variable in the script)
3. 15 minute buffer events (unless you changed the `BUFFER_LENGTH` variable in the script) will be created after each qualifying meeting with a gray color

## Development

- `npm run push` - Push changes to Google Apps Script
- `npm run pull` - Pull latest changes from Google Apps Script
- `npm run deploy` - Deploy a new version

## License

MIT