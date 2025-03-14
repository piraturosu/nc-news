# NC News API

NC News API is a REST API created as Back End project during the Northcoders Software Engineer boot camp.

## Instructions

1. Clone the repo:
   > git clone https://github.com/piraturosu/nc-news.git
2. Install dependencies:
   > npm install
3. Setting up local database:

- create both **test** and **development** databases
  > npm run setup-dbs
- seed the **test** database and run tests
  > npm run test
- seed the **development** database
  > npm run seed-dev

4. Environment Variables

- You need to create .env.test and .env.development files in the global directory
- In each file, PGDATABASE should be assigned the value of the corresponding database name.
  For the test env - PGDATABASE=nc_news_test
  For the dev env - PGDATABASE=nc_news

5. Minimum requirements
   **node v18**
   **psql v14**
