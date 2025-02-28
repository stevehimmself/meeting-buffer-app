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
3. Follow the [Google Apps Script setup guide](https://developers.google.com/apps-script/guides/clasp) to:
   - Enable the [Google Apps Script API](https://script.google.com/home/usersettings)
   - Install and authenticate clasp
   - Set up your Apps Script project
   - Create a new project and a `.clasp.json` file should be created automatically with your script ID

## Usage

After deploying the script:

1. Open Google Calendar
2. The script will automatically process events for the next 3 months (unless you change the `MONTHS_AHEAD` variable in the script)
3. 15 minute buffer events (unless you change the `BUFFER_LENGTH` variable in the script) will be created after each qualifying meeting with a gray color

## Development

- `npm run push` - Push changes to Google Apps Script
- `npm run pull` - Pull latest changes from Google Apps Script
- `npm run deploy` - Deploy a new version

## License

MIT
