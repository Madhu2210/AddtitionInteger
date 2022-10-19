## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Installation and run](#installation-and-run)
* [Test application using cypress](#test-application-using-cypress)
* [Test application using jest](#test-application-using-jest)


## General info
This project is a trading web application.
	

## Technologies
Project is created with:
* react
* redux
* crypto-js
* primereact
* @msf/msf-reactjs-weblib-base


## Installation and run
> To install node & run it locally using npm:

```
$ npm install
$ npm start
```


## Test application using cypress
> For application automation testing, do the following,

```
$ npm run install_testing_packages      -- To install testing dependencies like cypress

-- Before run, have to start npm in local
    $ npm run test:open                 -- To run the automation test in browser
    $ npm run test:run                  -- To run the test in terminal

```

* When using 'test:open' command, the cypress application window will open, there we have to choose browser & select which test file to execute.
* There is option for 'Run all spec', using that we can execute all the test files one by one automatically.


## Test application using jest
> For func/comp level testing, do the following,

```
$ npm run test
or
$ npm run test:jest
```

* It execute all the test file and shows the pass/fail results in terminal.