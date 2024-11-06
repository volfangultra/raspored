# Full Stack Web Application Documentation

This documentation provides instructions to set up and run a full stack web application consisting of a React frontend and a .NET backend with SQLite for data storage.

## Prerequisites

### Software Requirements

Make sure you have the following installed:

- **Node.js**: Version 18.x (LTS)  
  [Download Node.js](https://nodejs.org/)  
  Verify installation: `node -v`

- **npm**: Version 10.x Comes with Node.js  
  Verify installation: `npm -v`

- **.NET SDK**: Version 8.0 or higher  
  [Download .NET SDK](https://dotnet.microsoft.com/download/dotnet)  
  Verify installation: `dotnet --version`

- **SQLite**: Ensure SQLite is installed if you want to interact directly with the SQLite database.  
  [Download SQLite](https://www.sqlite.org/download.html)

- **Git**: Install Git: [Download Git](https://git-scm.com/downloads)  
   Verify installation: `git --version`

- **Docker**: Install Docker: [Download Docker](https://www.docker.com/products/docker-desktop)  
   Verify installation: `docker --version`

- **Docker Compose**: Install Docker Compose: [Download Docker Compose](https://docs.docker.com/compose/install/)  
   Verify installation: `docker-compose --version`


### Project Setup

1. Inside your project folder, run:
   ```bash
   git clone https://github.com/volfangultra/raspored
   cd raspored
   git checkout -b branch_name
   ```
2. You can use `git status` to check which branch you are in.

## Developing
1. Run `docker-compose build`, then run `docker-compose up`.
   For some changes, you will need to press `Ctrl+C` in the terminal and run `docker-compose up` again.
   These changes are all in the backend and are listed in [Microsoft's documentation](https://learn.microsoft.com/en-us/visualstudio/debugger/supported-code-changes-csharp?view=vs-2022).

2. After you finish editing, run:
   ```bash
   git add .
   git commit -m "Some message"
   git push
   ```
3. You can then create a pull request on [GitHub](https://github.com).

### Code checking and testing: TODO


## License

This project is licensed under the MIT License.

---

With this guide, you should be able to set up, run, and maintain the application. For further issues, please consult the documentation for React, .NET, or SQLite.
