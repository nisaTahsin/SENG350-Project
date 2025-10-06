# Student Programming Environment

To work effectively on the course project everyone should work in the same programming environment. For this course, we ask that you use VSCode as your IDE. If everyone uses VSCode consistently, you can collectively maintain launch files, and workspace configurations, that help you and your team develop and run your project. 

We have already set-up, and created a template repository for you. This repository contains some directories that are reserved for course-work, and it will give you a basic VSCode configuration for the course project. This basic configuration install some useful plugins, and has some useful settings already applied. 

As a group, you are more than welcome to build on this, and tweak this basic configuration. In fact, we actively encourage you to do so. It might for instance be very helpful to expand the launch.json to help you run automatic tests.

## AI Usage

One of the key learning goals of the project is learning how to use AI for software development. GitHub Copilot is one of the leading AI development tools, used by many different developers, and as a student you can get a free license for GitHub Copilot. Therefore, you must use GitHub Copilot for your project. To get access to a free license you can apply for the GitHub Developer Pack [here](https://GitHub.com/education/students).  

After signing in with your GitHub account you can use both Copilot code suggestions, and agents for your group project. In fact, you are actively encouraged to use and experiment with AI. 

### Customizing your AI Usage

One of the additional advantages is that you can use custom instructions files for GitHub Copilot (See the documentation [here](https://docs.GitHub.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions). Using these custom instruction files will greatly help you improve the usefulness of GitHub Copilot. 

We have already given you a custom instructions file, that is specifically instructing the model to only **translate this file to medieval english**. You can test out what the effect of the custom instruction file is by opening the chat on this file. The file is located in `.GitHub/instructions/Example.instructions.md`. 

### Archiving your AI Usage

Another course requirement is to be transparent about how you use AI. This includes keeping track of how, and for what parts of the system you have used AI. To help you keep a comprehensive log the default settings *already include a plugin that maintains a log of your AI interactions* in the local repository. To maintain these logs, you must commit them to the repository so that they are preserved. 

## Running the tests

This project uses Vitest + @testing-library/react with a jsdom environment.
1) Prerequisites of the tests are:
a)Node.js ≥ 18
b)pnpm or npm (examples use npm)

2) Dependencies for the tests are:
a)npm install

3) Command to run all tests:
a)npm run test
or
b)npx vitest run

4) Watch mode (TDD) for the tests:
a)npm run test:watch
or
b)npx vitest

5) Command to run a single test file:
a)npx vitest run tests/AdminDashboard.test.tsx
6) To filter by test name (pattern) :
a)npx vitest run -t "renders login form"
7) Showing coverage:
a)npm run test:coverage
or
b)npx vitest run --coverage
c)Coverage output is written to coverage/. Open coverage/index.html in a browser to view the report.

8) UI Runner (optional):
a)Vitest provides a web UI (handy for debugging):
b)npx vitest --ui
c)Then open the printed local URL.

9) Common troubleshooting problems:
a)“renderWithProviders is not a function”
b)Our tests don’t rely on it; use the provided helpers in each spec or render() directly with MemoryRouter / mocked providers as shown.
c)React Router warnings about v7 future flags
They’re informational and do not affect test results.
d)Labels not associated with inputs
Tests should query by accessible roles (getByRole('combobox'), getByRole('checkbox'), etc.) if the label and control aren’t programmatically associated.

10) Useful scripts (add to package.json if missing):
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}


