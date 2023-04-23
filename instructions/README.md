# Setup

1. Make sure you have Node.js and npm installed

2. install all dependencies
`npm install`

3. Prepare `.env` file (optional)
Create an `.env` file using the supplied `.env_template`. You can change the port (default is 3000).

4. Seed the database
`npm run seed`

5. run unit tests (optional)
`npm test`

6. run the API
`npm start`


After setting up, the API will be accessible on `http://localhost:<PORT>/`

# Supported endpoints:

You can find definitions of all endpoints and example usage in `/requests/folders.rest` and `/requests/notes.rest`

Pagination and sorting is implemented on `GET /notes/` endpoint.

### Folders
    GET /folders/ 
    GET /folders/:id
    CREATE /folders/
    PUT /folders/:id
    DELETE /folders/
    DELETE /folders/:id

### Notes
    GET /notes/
    GET /notes/:id
    CREATE /notes/
    PUT /notes/:id
    DELETE /notes/
    DELETE /notes/:id