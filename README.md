## Info
This is my JavaScript Fullstack Capstone Project for the IBM Full-Stack JavaScript Developer Professional Certificate on Coursera.

## Setup

### To build on the the Coursera temporary dev environment
- Clone the repo into the env being used.
- Set up MongoDB and get credentials.
- Update the temporary credentials in `giftlink-backend/.env` 
- Run `npm install` and then `npm run build-all` from the root directory.
- Run `npm run start:backend`, then open the app from port 3060. Within the IBM lab environment (IBM Skills Network) this can be launched from the Toolbox. Copy the URL that is served from the backend.
- Paste the backend URL into the frontend .env file.

### To build and run locally
- Set up a local MongoDB database named "giftdb" with a "gifts" collection.
- Use the `.env` template in `giftlink-backend/.env.sample` to create a `.env` file with the database connection string.
- Run `npm install` and then `npm run build-all` from the root directory.
- Run `npm run start:backend` to start the backend service.
- Use the `.env` template in `giftlink-frontend/.env.sample` to create a `.env` file with the backend connection URL, which should be `http://localhost:3060`.
- Open a new terminal and run `npm start:frontend` to start the frontend service.
