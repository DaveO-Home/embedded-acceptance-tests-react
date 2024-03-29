# Embedded React Acceptance Testing with Karma and Jasmine

The basic idea is to build a production application ensuring consistent and stable code using JavaScript, CSS and ~~bootstrap~~ linting and automated unit and e2e testing. This will be in part, assisted by the development tools, detailed in the [Development Overview](#development) and bundle sections.

[Production Build](#production-build)

[Test Build](#test-build)

[Development Overview](#development)

## Bundle Tools

> 1. [Browserify](#i-browserify)
> 2. [Brunch](#ii-brunch)
> 3. [esbuild](#iii-esbuild)
> 4. [Fusebox](#iv-fusebox)
> 5. [Parcel](#v-parcel)
> 6. [Rollup](#vi-rollup)
> 7. ~~[Steal](#vii-stealjs)~~
> 8. [Webpack](#viii-webpack)

[Installation](#installation)

[Docker](#viii-dockerfile)

**Dodex**: Added for testing and demo. <https://github.com/DaveO-Home/dodex>

## Other Framworks

  1. **Canjs** - <https://github.com/DaveO-Home/embedded-acceptance-tests>
  2. **Vue** - <https://github.com/DaveO-Home/embedded-acceptance-tests-vue>
  3. **Angular** - <https://github.com/DaveO-Home/embedded-acceptance-tests-ng>

**Dockerfile**: See instructions at bottom of README.

## Main Tools

  1. Gulp
  2. Karma
  3. Jasmine
  4. Any Browser with a karma launcher
  5. Code bundling tools
  6. See `public/package.json` for details
  7. Node, npm - node v10 or greater works best

## Installation

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

**Desktop:**

  clone the repository or download the .zip

**Install Assumptions:**

  1. OS Linux or Windows(Tested on Windows10)
  2. Node and npm
  3. Gulp4 is default - If your global Gulp is version 3, you can execute `npx gulp` from the build directories or use the `bm` script, for example, `bm webpack prod`.
  4. Google Chrome
  5. Firefox

**Server:**

  `cd` to top level directory `<install>/embedded-acceptance-tests`

```bash
  npm install or npm install --legacy-peer-deps 
```

  This will install a small Node/Express setup to view the results of a production build.

  `cd <install>/acceptance-tests/public`

```bash
  npm install or npm install --legacy-peer-deps
```

  To install all required dependencies. If trying Brunch, install the global package for Brunch, `npm install brunch -g`.

  __Note:__ The install will produce a few vulnerabilities, run `npm audit --omit dev` to see production vulnerabilities. Do not run `audit fix` or `npm update`. These commands may invalidate the `parcel` bundler.

**Client:**

Test builds will generate bundles in 'dist_test' and production in the 'dist' directory at the root level, 'public'.

## Production Build

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

To generate a build "cd to `public/<bundler>/build` and type `gulp`, e.g.

```bash
  cd public/fusebox/build
  npx gulp test
```

or `npx gulp prod`

You can also use the `bm` script located in the `public` directory with the __bundle__ and __gulp task__ as parameters;

executing `bm esbuild prod` will build the bundle from the public directory.

If the tests succeed then the build should complete.

To run the production application:

  1. `cd <install>/acceptance_tests-react`
  2. `npm start`  -  This should start a Node Server with port 3080.
  3. Start a browser and enter `localhost:3080/dist/<bundler>/appl/testapp.html`

You can repeat the procedure with any of the supported bundlers. Output from the build can be logged by setting the environment variable `USE_LOGFILE=true`.

You can run `gulp prd` from the `<bundler>/build` directory as a stand-alone build.

## Test Build

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

The test build simply runs the tests in headless mode. The default browsers are ChromeHeadless and FirefoxHeadless.  To change the default you can set an environment variable; e.g.

```bash
  export USE_BROWSERS=ChromeHeadless,Opera
```

to remove FirefoxHeadless from the browser list and add Opera.  You can also set this environment variable for a production build.

To run the tests "cd to `public/<bundler>/build` and type `gulp test`, e.g.

```bash
  cd public/webpack/build
  export USE_BROWSERS=FirefoxHeadless,ChromeHeadless,Opera
  gulp test
```
You can also use the `bm` script located in the `public` directory with the __bundle__ and __gulp task__ as parameters;

executing `bm esbuild test` will build and test the bundle from the public directory.

A test result might look like;

```text
[2019-09-05T14:21:30.265] [INFO] launcher - Starting browser Firefox
[2019-09-05T14:21:30.310] [INFO] launcher - Starting browser ChromeHeadless
[2019-09-05T14:21:30.352] [INFO] launcher - Starting browser Opera
  Unit Tests - Suite 1
    ✔ Verify that browser supports Promises
    ✔ ES6 Support
  Unit Tests - Suite 2
    ✔ Is Karma active
    ✔ Verify NaN
  Popper Defined - required for Bootstrap
    ✔ is JQuery defined
    ✔ is Popper defined
  Application Unit test suite - AppTest
    ✔ Is Default Page Loaded(Start)
    ✔ Is Tools Table Loaded
    ✔ Re-load Start Page
    ✔ Is Pdf Loaded
    ✔ Is React Welcome Loaded
    Load new tools page
      ✔ setup and click events executed.
      ✔ did Redux set default value.
      ✔ new page loaded on change.
      ✔ did Redux set new value.
      ✔ verify state management
    Contact Form Validation
      ✔ Contact form - verify required fields
      ✔ Contact form - validate populated fields, email mismatch.
      ✔ Contact form - validate email with valid email address.
      ✔ Contact form - validate form submission.
    Popup Login Form
      ✔ Login form - verify modal with login loaded
      ✔ Login form - verify cancel and removed from DOM
    Dodex Operation Validation
      ✔ Dodex - loaded and toggle on icon mousedown
      ✔ Dodex - Check that card A is current and flipped on mousedown
      ✔ Dodex - Check that card B is current and flipped on mousedown
      ✔ Dodex - Flip cards A & B back to original positions
      ✔ Dodex - Flip multiple cards on tab mousedown
      ✔ Dodex - Add additional app/personal cards
      ✔ Dodex - Load Login Popup from card1(A)
    Dodex Input Operation Validation
      ✔ Dodex Input - popup on mouse double click
      ✔ Dodex Input - Verify that form elements exist
      ✔ Dodex Input - verify that uploaded file is processed
      ✔ Dodex Input - close popup on button click

Finished in 32.012 secs / 26.381 secs @ 14:21:51 GMT-0700 (Pacific Daylight Time)

SUMMARY:
✔ 105 tests completed
```

## Development

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

__Note:__ When modifying project assets(.handlebars, .html, etc.) you can execute `gulp copy` from the `public/<bundler>/build` directory to preview changes. This is not required for ~~__StealJs__~~. Also all of the gulp tasks can be run from the public directory with the `bm` script described above.

__A word on developing tests__; You can write and execute tests quicker by using the rebuild process of a given bundler and running the `acceptance` gulp task after the auto-rebuild, e.g. with __Rollup__ you can;

* `cd public/rollup/build`
* `gulp watch`
* Develop or modify a test.
* In another window execute `gulp acceptance` from the `build` directory to view the modified or new test results.

**Both Chrome and Firefox are the default browsers.**

__Also Note:__ With a few of the bundle tools, execute the `gulp development` task to run from one window.

### I. **Browserify**

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

1. ***Development Server Window*** -

   * `cd public/browserify/build`
   * `gulp server`

   Browsersync will start a browser tab(default Chrome) with `localhost:3080/dist_test/browserify/appl/testapp_dev.html`.  Any changes to the source code(*.js files) should be reflected in the browser auto reload.

2. ***Hot Module Reload(HMR) Window*** -

   * `cd public/browserify/build`
   * `gulp hmr`

   The `watchify` plugin will remain active to rebuild the bundle on code change.

3. ***Test Driven Development(tdd) Window*** -

   * `cd public/browserify/build`
   * `gulp tdd`

   Tests will rerun as source code(*.js) is changed. Note, tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.  Note, you do not need `hmr` active for `tdd`. Also, `tdd` can be run with a headless browser.

### II. **Brunch**

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

1. ***Watch, Recompile and Reload Window*** -

   * `cd public/brunch/build`
   * `gulp watch` or `./cook watch` (output formatted better)

   At this point you can start a browser and enter `localhost:3080/appl/testapp_dev.htm`. Any changes to the source code(*.js files and other assets such as *.html) should be reflected in the browser auto reload.

   __Note:__ The test url is `localhost:3080` since Brunch by default uses 'config.paths.public' as the server context. Also, the reload module has been upgraded to v3, notice that the test file is `testapp.dev.htm` not `...html` for the new reload(watch).

2. ***Test Driven Development(tdd) Window*** -

   * `cd public/brunch/build`
   * `gulp tdd` or `./cook tdd`

   While the Brunch watcher is running, tests are re-run when code are changed. 
  
   __Note:__ tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

3. ***Special Considerations***
  
   * Brunch plugin eslint-brunch uses eslint 3. The demo/react uses version 4.  The `gulp`(production build) command uses a gulp linter, so javascript linting is executed. However, if you wish to use the Brunch eslint-brunch plugin, do the following;
       * `cd <install>/public/node_modules/eslint-brunch`
       * `npm install eslint@latest`
       * `cd <install>/public` and edit the `brunch-config.js` file and uncomment the eslint section.

### III. **esbuild**

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

1. ***Hot Module Reload(HMR) Server Window*** -

   * `cd public/esbuild/build`
   * `gulp hmr`
   * HMR will start a web server with port 3080, a watcher will also start that rebuilds the bundle on code change.

   HMR is using `browser-sync` so a web page will start at: `localhost:3080/dist_test/esbuild/appl/testapp_dev.html`.  Any changes to the source code(\*.js|*.jsx) files should be reflected in the browser auto reload. Also, the browser will reload when changing static content by executing `gulp copy`.

   For development and testing, the normal tasks; `gulp test`, `gulp acceptance`, `gulp rebuild` can be executed when needed.

2. ***Test Driven Development(tdd) Window*** -

   * `cd public/esbuild/build`
   * `gulp tdd`

   You must use `gulp build` and not gulp rebuild with `gulp tdd` running. Tdd will fail with gulp rebuild because it cleans the test directory.

   The HMR Server must be running if you want tests to rerun as source code(*.js) are changed. Note, tests can be added or 
   removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

### IV. **Fusebox**

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

1. ***Hot Module Reload(HMR) Server Window*** -

   * `cd public/fusebox/build`
   * `gulp hmr`
  
   If using TDD you must execute hmr with `gulp hmr --noftl` flag so that karma can detect changes. Or you can execute `gulp development` to run both hmr and tdd.  
  
   At this point you can start a browser and enter `localhost:3080/dist_test/fusebox/appl/testapp_dev.html`.  Any changes to the source code(\*.js|*.ts) files should be reflected in the browser auto reload.  

2. ***Test Driven Development(tdd) Window*** -

   * `cd public/fusebox/build`
   * `gulp tdd`

   The HMR Server must be running if you want tests to rerun as source code(*.js) is changed. Note, tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

### V. **Parcel**

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

1. ***Watch, Recompile and Reload Window*** -

   * `cd public/parcel/build`
   * `gulp watch`

   At this point you can start a browser and enter `localhost:3080/dist_test/appl/parcel/testapp_dev.html` (configured to auto open browser tab). Any changes to the source code(*.js and *.css files) should be reflected in the browser auto reload.

   __Note:__ You may need to remove cache `..../public/parcel/build/.cache` during development.

2. ***Test Driven Development(tdd) Window*** -

   * `cd public/parcel/build`
   * `gulp tdd`

   While the Parcel watcher is running, tests are re-run when code are changed.
  
   * Using `export USE_BUNDLER=false`- When using `gulp watch & gulp tdd` together, you can set USE_BUNDLER to false to startup TDD without building first, `gulp watch` does the test build.  Also, by settting `USE_BUNDLER=false` before `gulp`(production build), only testing and linting will execute.  
  
   __Note:__ tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

### VI. **Rollup**

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

1. ***Development Server Window*** -

   * `cd public/rollup/build`
   * `gulp watch`

   The Rollup Development Server, Watch(auto-rebuild) and Page Reload functions are started together.  Simply use one of the following URLs in any browser; `localhost:3080/rollup/appl/testapp_dev.html` or `localhost:3080/dist_test/rollup/appl/testapp_dev.html`.

2. ***Test Driven Development(tdd) Window*** -

   * `cd public/rollup/build`
   * `gulp tdd`

   Tests will rerun as source code(*.js) is changed. Note, tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

### ~~VII. **Stealjs**~~

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

1. ***Development Server Window*** -

    __Note:__ You may need to run ```gulp hmr``` at least once to generate the ```.../public/dev-bundle.js``` file first.

   * `cd public/stealjs/build`
   * `gulp server`

2. ***Live-Reload(HMR) Window*** -

   * `cd public/stealjs/build`
   * `gulp hmr`

   At this point you can start a browser and enter `localhost:3080/stealjs/appl/testapp_dev.html`(please note that dist_test is not in the URL).  Any changes to the source code(*.js files) should be reflected in the browser auto reload.  The `gulp hmr` by default builds a vendor bundle for faster reload.  When you are not modifying the node_modules directory, subsequent executions of `gulp hmr` do not need the vendor bundle build. You can disable by setting an environment variable, `export USE_VENDOR_BUILD=false`.

   Stealjs does not require a dist_test build. It runs development directly from the source(nice!). However, when starting `hmr` a vendor bundle is produced at public/dev-bundle.js for `hmr` performance. The bundle is accessed from the `testapp_dev.html` page, via a `deps-bundle` attribute.

3. ***Test Driven Development(tdd) Window*** -

   * `cd public/steal/build`
   * `gulp tdd`

   Tests will rerun as source code(*.js) is changed. Note, tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

### VIII. **Webpack**

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

1. ***Development HMR Server Window*** -

   * `cd public/webpack/build`
   * `gulp hmr`

2. ***Hot Module Reload(Watch) Window*** -

   * `cd public/webpack/build`
   * `gulp watch`

   At this point you can start a browser and enter `localhost:3080/dist_test/webpack/appl/testapp_dev.html`.  Any changes to the source code(*.js files) should be reflected in the browser auto reload. Running the application from the source directory should also work, e.g., `localhost:3080/webpack/appl/testapp_dev.html`.

3. ***Test Driven Development(tdd) Window*** -

   * `cd public/webpack/build`
   * `gulp tdd`

   Tests will rerun as source code(*.js) is changed. Note, tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

### VIII. **Dockerfile**

[Top](#embedded-react-acceptance-testing-with-karma-and-jasmine)

You can build a complete test/develpment environment on a Docker vm with the supplied Dockerfile.

**Linux as Parent Host**(assumes docker is installed and daemon is running)-

In the top parent directory, usually `..../embedded-acceptance-tests-vue/` execute the following commands;

1. ```docker build -t embedded fedora``` or ```docker build -t embedded centos```

2. ```docker run -ti --privileged  -p 3080:3080 -e DISPLAY=$DISPLAY  -v /tmp/.X11-unix:/tmp/.X11-unix --name test_env embedded bash```

    You should be logged into the test container(test_env). There will be 4 embedded-acceptance-tests* directories. Change into to default directory defined in the Dockerfile, for example canjs(embedded-acceptance-tests/public). All of the node dependencies should be installed, so ```cd``` to a desired bundler build directory, i.e. ```stealjs/build``` and follow the above instructions on testing, development and production builds.

3. When existing the vm after the ```docker run``` command, the container may be stopped. To restart execute ```docker start test_env``` and then ```docker exec -it --privileged --user tester -e DISPLAY=$DISPLAY -w /home/tester test_env bash```.  You can also use ```--user root``` to execute admin work.

**Windows as Parent Host**-

For Pro and Enterpise OS's, follow the Docker instructions on installation.  For the Home OS version you can use the legacy **Docker Desktop** client. It is best to have a Pro or Enterpise Windows OS to use a WSL(Windows bash) install. Use following commands with Windows;

1. ```docker build -t embedded fedora``` or ```docker build -t embedded centos```

2. ```docker run -ti --privileged  -p 3080:3080 --name test_env embedded bash```

3. ```docker exec -it --privileged --user tester -w /home/tester test_env bash```

The web port 3080 is exposed to the parent host, so once an application is sucessfully bundled and the node server(```npm start``` in directory embedded-acceptance-tests) is started, a host browser can view the application using say ```localhost:3080/dist/fusebox/appl/testapp.html```.

__Note:__ Without a complete Pro/Enterprise docker installation, the ```test_env``` container can only run with Headless browsers. Therfore you should execute ```export USE_BROWSERS=ChromeHeadless,FirefoxHeadless``` before testing, development and building.
