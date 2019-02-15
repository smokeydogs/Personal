# Needed Setup
1. [node.js](https://nodejs.org/en/) is installed
2. Packages are installed using ```npm install```
3. Gulp is installed globally ```npm install gulp -g```

# Running the Test
While interacting with the website creditcards.com I encountered the possibility of landing on two different home pages.  One with a button that navigates the user to a series of questions, and another home page without a button that will navigate the user to a page of credit card options.

As I was unable to force a specific page to load I opted to select one of the values present when mousing over a header value.  I hard coded the mouse action for the purpose of the demo, but the script can be modified for more dynamic usage.  The test can be run from the root directory of the project by typing the following command once all dependencies have been installed with the setup.

```
gulp
```

# Testing Methodology for Creditcards.com
The Acceptance level of testing for the site would ensure that the required informational elements are properly loaded onto the landing home page, and that the header and footer links are properly populated.  The header links would need to be verified that the correct information was provided to the UI, and that the information is correct in the list of elements on the page.  Subsequent pages would follow the same pattern of communicating with the REST service that provides the data for the UI, then ensuring that the elements present on the page contain the data from the REST response.  Proper communication with the sales and project management would need to be established so correct criteria could be created using a configuration file for dynamic values that could be changed at their request.

Ensuring that proper redirects for credit card applications would need to be verified to ensure that the business income stream is not affected from possible code updates.

Further analysis of the business needs would update and expand this basic methodlogy analysis when more information becomes available.

# Further Documentation Methodologies
# Naming Conventions
1. Files: kebab-case-files
2. Function: camelCaseFunctions
3. Data: snake_case_data

# Run a specific feature file
To run a specific file in the test directory you need to be in the root directory of the project that contains the gulpfile.  From the command line you will type the gulp keyword followed by the path to the specific test you wish to run.
```
gulp specs/FOLDER/FILE.JS
```

# Run a defined test suite
From the root project directory run the defined gulp command that is defined in the gulpfile
```
gulp jenkins
```

# Config Object
The config object stores environmental data used by the suite, and is stored in the root directory.
1. server: controls which Selenium server will be used.  Most users will want to have this set to 'localhost', CI will use docker containers or browserstack.  This is not implemented in this demo.
2. env_url: controls which which environment is used to start the test.
3. timeout: controls the time that a test will timeout waiting for a Selenium action to take place before a test fails
4. sleep: controls the global sleep time that is used in some functionality.  Sleep should be used with extreme caution
5. headers: stores the base REST headers needed for most REST calls, and can be extended using lodash's merge functionality

# Step Functions
Step functions are not impplemented in this demo solution as more information of the specific interactions of the system are needed in order for this to be properly built.  Step functions are repeated patterns of user behavior that are called in test files.  Take the following example
1. Click the login button
2. Input the user's email address
3. Input the user's password
4. Click the sign in button

An alternative to this repeated pattern is to create a login function in a step file.  The following example takes a passed in argument, or sets a static generic user.  A test file can now call the function, and should the need arise to change the flow it is only needed to be changed in one place.

```javascript
  let loginUser = Promise.coroutine(function* (user_payload) {
    let qa = new selenium(this.driver);
    let payload = user_payload || require(`._data/user/generic.json`);

    await qa.input(page.iam.login.username, payload.username, true);
    await qa.input(page.iam.login.password, payload.password, true);
    await qa.click(page.iam.login.sign_in);
  })
```

# Page Objects
Page objects are a nested JSON object with a key value pair, and store the CSS or XPATH value for the locator.  Page objects are bulk loaded by the master page object javascript file located in the specs/page/ directory.

# Screenshots
Screenshots are taken on test failure, and show the state of the UI when the test failed.  They are stored in the screenshot directory, and are not pushed up to the repo.  In a CI environment they will be stored as artifacts of the build.


## Selenium
The Selenium file gives access to various Selenium [JavaScript](https://seleniumhq.github.io/selenium/docs/api/javascript/) bindings.  Each command is wrapped in a dynamic locating function that is controlled by the config timeout value.  The file can easily be extended with new functionality, just be mindful to call the _locator and _exists function.

## REST
The REST function is a simple interface to the request-promise package.  The functionality is not fully implemented in this demo.
