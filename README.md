# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`
7. Create your PostgreSQL database `createdb -U your_username database-name` or `psql` -> `CREATE DATABASE database-name OWNER your-username;`
8. Change your config.js file so that DB_URL has a backup link. Remove `'postgresql://example_username@localhost/example_database_name'` and put in your correct information.
9. Update the DB_URL and TEST_DB_URL links in your .env file.
10. Create migrations and seeds folders and create your migration and seed files. Type `npm run migrate` and `npm run migrate:test` to create the tables. 
11. Seed your database with `psql -U your_username -d example-database-name -f ./seeds/seed.example_seed_file.sql` (do NOT seed your test database! We will do that in the tests themselves.)
12. Delete `/src/examples` before you deploy or if you no longer need the reference.

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Run migrations `npm run migrate` or `npm run migrate:test`


## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.