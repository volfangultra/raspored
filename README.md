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

### Project Setup

This application is split into two parts: the React frontend and the .NET backend. Follow the setup steps below for each part.

## Getting Started

### Step 1: Clone the Repository

Clone the repository to your local machine.

```bash
git clone <repository-url>
cd <repository-folder>
```

### Step 2: Install Dependencies

#### Frontend Setup (React)

Navigate to the `frontend` folder and install dependencies.

```bash
cd frontend-app
npm install
```

#### Backend Setup (.NET)

Navigate to the `backend` folder and restore .NET packages.

```bash
cd ../backend-api
dotnet restore
```

## Running the Application

### Start the Backend (.NET API)

1. Navigate to the `backend-api` folder.

   ```bash
   cd backend-api
   ```

2. Run the following command to start the backend server:

   ```bash
   dotnet run
   ```

   The backend will start on `http://localhost:5255`.

### Start the Frontend (React)

1. Open a new terminal window.
2. Navigate to the `frontend` folder.

   ```bash
   cd frontend-app
   ```

3. Run the following command to start the frontend development server:

   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`.

Now, you should have both the backend and frontend servers running. Access the full application by opening `http://localhost:3000` in your web browser.

## Linting and Code Formatting

Both the frontend and backend have linters set up to ensure code quality.

### Frontend (React) Linting

1. Navigate to the `frontend=api` folder.
2. Run the following command to check for linting errors:

   ```bash
   npm run lint
   ```

3. To automatically fix linting issues, run:

   ```bash
   npm run format
   ```

### Backend (.NET) Linting

The backend uses **StyleCop** for code analysis and style checking.

1. Run the following command to analyze the backend code:

   ```bash
   dotnet build
   ```

   StyleCop will check for code style issues during the build process and display any warnings or errors in the output.

2. To apply StyleCop rules manually, open your `.cs` files and ensure they align with the standard C# style conventions enforced by StyleCop.

or

1. Run the command
   ```bash
   dotnet format
   ```

## Database Management

This application uses SQLite as the database. To reset or update the database schema, use Entity Framework Core’s migrations.
For easy use/access use the SQLite tool in VSCode and use the console.sql to run queries.

## License

This project is licensed under the MIT License.

---

With this guide, you should be able to set up, run, and maintain the application. For further issues, please consult the documentation for React, .NET, or SQLite.
