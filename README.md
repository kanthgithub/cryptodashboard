# CryptoDashBoard

## Dashboard to check the real-time crypto-market data




## Dependencies:

- body-parser: This will add all the information we pass to the API to the request.body object.
- bcrypt: We'll use this to hash our passwords before we save them our database.
- dotenv: We'll use this to load all the environment variables we keep secret in our .env file.
- jsonwebtoken: This will be used to sign and verify JSON web tokens.
- mongoose: We'll use this to interface with our mongo database.
- expressJS:
- express-ejs-layouts:
- fs:
- https-errors:


## Development dependencies

- morgan: This will log all the requests we make to the console whilst in our development environment.
- nodemon: We'll use this to restart our server automatically whenever we make changes to our files.
- cross-env: This will make all our bash commands compatible with machines running windows.

## Test Dependencies

- mocha: javascript framework for Node.js which allows Asynchronous testing.
- chai: assertion library for tests

## Test Details:

- To run mocha I added the flag --timeout 10000 because I fetch data from a database hosted on mongolab
- So the default 2 seconds may not be enough.
- Integration testing on mongodb - reference taken from 
   - https://www.toptal.com/nodejs/integration-and-e2e-tests-nodejs-mongodb
   - https://github.com/kanthgithub/mongo-unit
