# Local Development Setup

This guide will help you set up the project locally for development.

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Eri-py/App.git
cd App
```

### 2. Environment Setup

**Optional - VS Code Setup:** This project was developed entirely in VS Code, so using different IDEs might lead to unexpected issues. If you're using VS Code:

1. Open your terminal (Command Prompt or PowerShell) in the project root directory
2. Run the following command to copy vscode configuration files:

```bash
cp -r setup/.vscode .
```

### 3. Backend Setup (.NET)

#### Configuration Files

The project requires a development configuration file that is not included in the repository for security reasons.

1. Open your terminal (Command Prompt or PowerShell) in the project root directory
2. Run the following command to copy the example configuration file:

```bash
cp setup/appsettings.Development.Example.json server/src/app.api/appsettings.Development.json
```

3. Update the configuration values as described below

#### Required Configuration Values

Open `server/src/app.api/appsettings.Development.json` and update the following sections:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "SQL SERVER OR SQL SERVER/EXPRESS CONNECTION STRING"
  },
  "Mailtrap": {
    "FromName": "App",
    "FromAddress": "app.dev@app.com",
    "Host": "sandbox.smtp.mailtrap.io",
    "Port": "2525",
    "Username": "MAILTRAP USERNAME",
    "Password": "MAILTRAP PASSWORD"
  }
}
```

#### Where to Get Credentials

**Database Connection:**

- For local development, use SQL SERVER or SQL Server Express
- Google the right connection string based on server type.
- Update the connection string to match your local database setup

**Email Configuration (MailKit):**

- **Mailtrap:** Use Mailtrap SMTP for email testing
  - Go to Mailtrap → Email Testing → Inboxes → Your Inbox → SMTP Settings
  - Copy the Username and Password from the SMTP settings

#### Install Dependencies and Run

```bash
# Navigate to the backend project directory
cd server/src/app.api

# Restore packages
dotnet restore

# Create initial migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update

# Run the application
dotnet run
```

### 4. Frontend Setup (React)

```bash
# Navigate to the frontend directory
cd client

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
```

## Default Ports

- **Frontend (React):** `http://localhost:3000`
- **Backend API (.NET):** `https://localhost:7000` (HTTPS) / `http://localhost:5000` (HTTP)

_Note: If you change ports in package.json or launchSettings.json, make sure to update the corresponding CORS policy in Program.cs and API_BASE_URL in client.ts_
