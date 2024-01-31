1. Make sure you have install Node.Js install in the computer
2. Make sure you install Mocha in the computer.
    - npm install -g mocha
3. Once all is included make sure package.json contains the next commands under "scripts"
    "scripts": {
    "start": "SET NODE_ENV=dev && node server.js",
    "test": "mocha 'test/*.js' --timeout 150000"
    }

4. Once the prvios steps are set we can just run the next command
   to run the Suite : 
 npm run test //when value is set for script test

