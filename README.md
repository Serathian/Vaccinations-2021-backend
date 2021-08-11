# Solita Vaccine Exercise 2021

## By Jake Reddy

#### This is a fullstack application using Nodejs, React and Mongodb. The database is populated with dataset supplied by Solita as part of the assignment.

From the start I wanted to set myself apart from the rest of the applicants by hopefully doing something different,
I jumped at the chance to refresh my memory of D3 skills. I thought it would be interesting to overlay the Finnish COVID API over
the dataset of vaccinations.

**Backend - Nodejs:** Uses Express and Mongoose framework to do all the heavy lifting and Jest, Supertest and Mongo-memory-server for testing.

**Frontend - React:** Vanilla react using Axios, axios-cache-adapter and some D3 for graphical data display.

### Things to note:

- the 'Graph' and 'Data processed in browser' sections both get their data from a cached in the browsers local storage.
  whereas 'Data processed server side' makes a new call when the date is updated.
  _I done this out of curiosity to see the loading times of an API call compared to local data aggregation._
- Data processed in 'Browser' and 'Server Side' show different values, This is interesting little 'bug' due to the way
  I coded date parsing on the server side differently to the frontend. Server side returns data **INCLUDING** the requested date.
  Browser data filters **UPTO** the requested date, there is a 24h difference. I left it in as a little reminder of
  how difficult it is to work with time Date objects.
- Cases dataset comes form a gist I complied from data obtained from the thl api. I tried to implement
  a endpoint so I could dynamically get the data based on the date picked by the user, but I couldn't decipher the api documentations for date queries format (It seems quite cryptic).

### Challenges I faced:

- Working with javascript Date objects was surprisingly frustrating.

### Things I'd like to improve on:

- There is a lack of error handling and regex on the endpoints.
- Testing for the frontend.
- Better way to populate the dataset before the tests are run. (Mongodb-memory-server doesn't have this function, a workaround is to write a script to replace the
  database folder with a populated folder once the database is established.)
- add styling with styled-components (My personal preference) or css modules
  How to Install and Run the tests;

npm install
npm test OR run test script
