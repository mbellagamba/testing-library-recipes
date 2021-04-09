# Testing Library Recipes - Getting started

Automated software testing has become a critical organization process within software development to ensure that expected business systems and product features behave correctly as expected. When developing a [React.js](https://reactjs.org/) front-end application, the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) is the officially recommended tool and it is the primary choice for many developers because it encourages good practices by enforcing not to test implementation details, but by focusing on tests that closely resemble how your web pages are interacted by the users.

This is the very first article of a series talking about best practices in testing front-end applications using the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro). Even if you are not a React.js developer, you can find useful information because the underlying concepts are the same of the [Core Testing Library](https://testing-library.com/).

> If you are not familiar with the theory of software testing, or you don't know the meaning of concepts like unit test, integration test, stub, mock, test doubles, you should take a look to some [Software Testing reference](https://en.wikipedia.org/wiki/Software_testing), just to make sure to speak the same language.

The best place to start learning how to test a React web application is probably the official documentation:

- [React.js Testing](https://reactjs.org/docs/testing.html)
- [Testing Library Docs](https://testing-library.com/docs/)

Although the official documentation is great, I found myself too many times digging the web for the perfect setup, trying to understand in which way my tests will be robust and give me confidence about the code I wrote. My journey with Testing Library started two years ago and since that time I widely experimented its features and its limits. I want to share this experience and my personal test recipes.

At the end of the article, I share with you a **repository** that you can use as reference or as template to setup your project.

Let's start simple from the foundation concepts.

## Basic concepts

An automated test is just a code checking the correctness of another piece of code. But how should you write this code? A common way to setup tests is the [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert) pattern: a pattern for arranging and formatting code in UnitTest methods.

1. Arrange all necessary preconditions and inputs.
2. Act on the object or method under test.
3. Assert that the expected results have occurred.

For example, this code is a simple test.

```javascript
function sum(numbers: number[]): number {
  return numbers.reduce((partial, current) => partial + current, 0);
}

function shouldSumAllNumbers() {
  // Arrange
  const input = [1, 2, 3];

  // Act
  const output = sum(input);

  // Assert
  if (output !== 6) {
    throw new Error(`Test failed. Expected: 6, Actual: ${output}.`);
  }
}
```

If you're asking... Yes, it's not very different from the "sum test" you have probably already seen on every other introductory resource on testing 😴. I promise to talk about more interesting stuff later on.
Even if not required, as I showed previously, writing and executing tests is way easier using frameworks or a set of testing utilities, especially for writing more complex tests, as those involving the DOM. So, let's set up our test environment.

## Setup the environment

Depending on your project setup, you'll need some initial configuration to run tests on your React application.

1. Install required dependencies
2. Setting up the testing framework
3. Start testing!

> Projects created with [Create React App](https://create-react-app.dev/) have out of the box support for React Testing Library, you can skip to fine tuning. Projects created with other tool chains like [Next.js](https://nextjs.org/), [Gatsby.js](https://www.gatsbyjs.com/) needs this steps. If you are a complete beginner, it's probably better to pick CRA and start testing without caring about configuration. If you are setting up a custom toolchain then these steps could be really useful.

This guide makes some assumptions:

- [Babel](https://babeljs.io/) transpiles JS/TS files and it is configured with the [TypeScript preset](https://babeljs.io/docs/en/babel-preset-typescript).
- [Webpack](https://webpack.js.org/) is used as bundler.
- The files structure is like the following.

```
project-root/       // The root directory
 |-src/             // Contains the JS/TS source code
 |-test/            // Contains test config and utilities
   |-config/        // Contains test config files
   |-setupTests.js // The test env setup file
```

If you use a different setup, this guide could still work but you probably need to tweak some pieces, such as file paths. If you need a more advanced setup, you could check out [Jest - Using with webpack](https://jestjs.io/docs/webpack).

### 1. Install dependencies

First of all, let's install required npm packages.

```
npm i -D jest babel-jest @testing-library/jest-dom @testing-library/react @testing-library/user-event
```

What have we just installed?

- [jest](https://jestjs.io/): the testing framework. It provides the test environment, a command line tool, a simulated DOM, functions for defining tests (`describe`, `it`, `test`, etc.), mocking and spying utilities, functions for assertions and expectations.
- [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest): it transpiles JS files in tests. It requires @babel/core is installed. [Babel](https://babeljs.io/) is a popular JavaScript transpiler, but how to configure Babel for your project is out of the scope of this article.
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/): it builds on top of DOM Testing Library by adding APIs for working with React components.
- [@testing-library/jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/): provides custom DOM element matchers for Jest. It extends the set of expectations we can use.
- [@testing-library/user-event](https://testing-library.com/docs/ecosystem-user-event): it is a companion library for Testing Library that provides more advanced simulation of browser interactions than the built-in `fireEvent` method. It is not required, but it is highly recommended.

### 2. Configure Jest

Jest aims to work out of the box, config free, on most JavaScript projects. But in spite of this, I prefer to customize the configuration to support these 3 features.

1. Add support for testing library and TS files.
2. Stub file imports
3. Stub CSS imports

#### Jest config file

Create a `jest.config.js` file in the project root directory.

```javascript
module.exports = {
  verbose: true,
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.js"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.css$": "<rootDir>/test/config/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "<rootDir>/test/config/fileTransform.js",
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleFileExtensions: [
    "web.js",
    "js",
    "web.ts",
    "ts",
    "web.tsx",
    "tsx",
    "json",
    "web.jsx",
    "jsx",
    "node",
  ],
  resetMocks: true,
};
```

This configuration file instruct Jest about:

- **Log verbosity**: `verbose`, I like to see what's happening 🕵️.
- **Source code roots**: the `src` folder.
- **Code coverage sources**: JS/TS file excluding TS declaration files.
- **Environment setup file**: the `setupTests.js` file. We'll see it later.
- **Test sources**: every file whose name ends with `.test.js`, `.spec.js` or corresponding TS, JSX, TSX variations. Also files within a `__tests__` folder are included.
- **Test environment**: Jest DOM
- **File transformers**: JS/TS files are processed by Babel, CSS files and other files will require custom transformers we'll see later.
- **Transform ignore files**: we avoid transforming source files from _node_modules_ and CSS modules.
- **Module file extensions**: the module file extensions we support.
- **Reset mocks**: `true`, Jest automatically resets mocks after tests.

#### Jest setup file `setupTests.js`

Create a _setupTests.js_ file in _<rootDir>/test/_.

```javascript
import "@testing-library/jest-dom";
```

It instructs Jest with Testing Library custom matchers.

#### CSS transformer

Create the file _<rootDir>/test/config/cssTransform.js_.

```javascript

```

This is a custom Jest transformer turning style imports into empty objects. In our tests, we does not need to import real CSS files.

#### File transform

```javascript
"use strict";

const path = require("path");
const camelcase = require("camelcase");

module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    if (filename.match(/\.svg$/)) {
      const pascalCaseFilename = camelcase(path.parse(filename).name, {
        pascalCase: true,
      });
      const componentName = `Svg${pascalCaseFilename}`;
      return `const React = require('react');
      module.exports = {
        __esModule: true,
        default: ${assetFilename},
        ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
          return {
            $$typeof: Symbol.for('react.element'),
            type: 'svg',
            ref: ref,
            key: null,
            props: Object.assign({}, props, {
              children: ${assetFilename}
            })
          };
        }),
      };`;
    }

    return `module.exports = ${assetFilename};`;
  },
};
```

Importing real file assets is something we do not care in testing. This custom Jest transformer is responsible for:

- Turning SVG files into Component or string. In our app we could import SVG both with `import svg from '../path/to/asset.svg'` and `import { ReactComponent as Asset } from '../path/to/asset.svg'`.
- Turning other assets (images, videos, etc.) as strings.

## Start testing your components

Now that Jest is installed and configured we can set up the test script. In your _package.json_ add or update the _test_ script to run `jest`. There's no need of additional command line parameters since the configuration file take care of the customizations.

```json
// package.json
{
  "scripts": {
    "test": "jest"
  }
}
```

> Run tests in watch mode launching `npm test -- --watch` (or `npx jest --watch`) in the command line.

Now our test environment is ready 🙌. Let's write our first test.

Given this `App` component:

```javascript
function App() {
  return (
    <div>
      <h1>Testing Library Recipes</h1>
      <a href="https://testing-library.com/">Getting Started</a>
    </div>
  );
}
export default App;
```

This test ensures that the page renders a link.

```javascript
import { render, screen } from "@testing-library/react";
import App from "./App";

it("Should contain a link", () => {
  render(<App />);
  const linkElement = screen.getByRole("link", { name: /getting started/i });
  expect(linkElement).toBeInTheDocument();
});
```

The test does not rely on any implementation detail but it makes assumptions only on what final users actually see, as states the [guiding principle](https://testing-library.com/docs/guiding-principles) of Testing Library.

> The more your tests resemble the way your software is used, the more confidence they can give you.

Running `npm test` the console output should be like the following.

```
> jest

 PASS  src/App.test.tsx
  ✓ Should contain a link (71 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.726 s
Ran all test suites.
```

## Bonus: Run tests on commit

A test environment is really effective only if tests run frequently. The best way to do that is to set up a Continuous Integration server that automatically run tests at every push. Besides that, it could be useful to run tests even before each commit. This give you a faster feedback, and it prevents you from committing not working code.
[Husky](https://typicode.github.io/husky/) is a powerful tool that helps us to configure Git hooks to achieve this result.

1. Let's install and init Husky in our project! This command installs Husky as dev dependency and it adds a `prepare` script in our _package.json_.

```shell
npx husky-init && npm install
```

You should have a new `prepare` script in your _package.json_. If you don't see it, add it manually.

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

2. Install husky hooks running the prepare script (or you can directly run `npx husky install`).

```shell
npm run prepare
```

3. Then we need to create a Git `pre-commit` hook. This pre-commit hook runs `npm test` just before the commit.

```shell
npx husky add .husky/pre-commit "npm test"
```

If `npm test` command fails, your commit will be automatically aborted.

> As your test suite grows, the execution time could slow down your development process. Running all tests in your local machine before every single commits could become a waste of time. In that case, running tests on a Continuous Integration server is probably the better choice. However, it shouldn't be an all or nothing approach: you can keep fast tests on your pre-commit hook (unit tests) and move slower ones on the CI process (end-to-end tests).

### GitHub Actions

[GitHub Actions](https://github.com/features/actions) provide an easy way to automate software workflows, including Continuous Integration, and it is free for public repositories.
Setting up a GitHub Action that run tests on push is really common workflow, and GitHub suggests a Node.js template for this if you switch to the Actions tab on your GitHub repository page. However, you can set up it manually and achieve the same result even before pushing your code to GitHub.
For this CI action, GitHub needs a workflow configuration file, which defines the environment and the commands to run.

To get started quickly, create a `node.js.yml` file in `.github/workflows` directory of your repository. The file content should be like this.

```yaml
name: Node.js CI

on:
  push:
    branches: [$default-branch]
  pull_request:
    branches: [$default-branch]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x, 14.x, 15.x]

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
```

This workflow will do a clean install of node dependencies, build the source code and run tests across different versions of node. For more information see [Using Node.js with GitHub Actions](https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions).
This template will fit most use cases, but you can customize the CI process depending on your needs. You can read more on this directly on [Github Actions Docs](https://docs.github.com/en/actions).

## Wrapping up

Getting ready for testing requires these steps:

1. Install Jest, Testing Library and all the required dependencies
2. Configure Jest
3. Configure Git hooks
4. Set up a GitHub Action

I leave you with a project template that you can use as reference. This is a custom development toolchain which includes React Testing Library, Jest, Husky, TypeScript, Babel, Webpack, React.

[https://github.com/mbellagamba/testing-library-recipes](https://github.com/mbellagamba/testing-library-recipes)

Happy testing! 😃
