## Info
This is my JavaScript Fullstack Capstone Project for the IBM Full-Stack JavaScript Developer Professional Certificate on Coursera.

## Setup
To build on the the Coursera temporary dev environment:
- Clone the repo into the env being used.
- Set up MongoDB and get credentials.
- Update the temporary credentials in `giftlink-backend/util/import-mongo/.env` 
- Run `npm install` and then `npm run build-all` from the root of the repo.
- Run `npm run start:backend`, then open the app from port 3060. Within the IBM lab environment (IBM Skills Network) this can be launched from the Toolbox. Copy the URL that is served from the backend.
- Paste the backend URL into the frontend .env file.
