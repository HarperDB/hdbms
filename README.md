# HarperDB UI Scaffold
The easiest way to create a harperdb-powered UI is to start with our. It gets you up and running in minutes.


## What’s in the box

- Third party software (click to review each library's licensing)
    - [ReactJS](https://reactjs.org/) site scaffold
    - [react-router](https://reacttraining.com/react-router/) for navigation
    - [webpack 4](https://webpack.js.org/) module bundling and development webserver

If you’re at all familiar with React, this simple example covers most of what you need to know to get started.


## Hello world

Follow these steps to create a simple UI to interact with your HarperDB instance.

1. In your terminal, clone the UI scaffold, enter the directory, and install dependencies.
    ```
    git clone https://github.com/harperdb/ui-scaffold.git my-project
    cd my-project
    npm i -s
    ```

1. In the root of the project, rename `config.js.example` to `config.js`, and fill out the details for your HarperDB instance.

1. Start the project.
    ```
    npm start
    ```

1. Visit the project at https://0.0.0.0:3000.
    - The development web server uses a self-signed certificate, and you may see a warning about the site being insecure. In your local development environment, it is safe to click "Advanced" > "proceed to site anyway."

You’ll see a simple UI with the result of a `describe_all` operation.
