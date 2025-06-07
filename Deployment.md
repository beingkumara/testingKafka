# F1nity Project Setup Guide

## 1. Install Required Software

- **Java (>17)**: Install the latest JDK (version 17 or higher)
- **Maven**: Install Maven for Java dependency management and build automation
- **Git**: Install Git for version control
- **Node.js**: Install Node.js for frontend development
- **MongoDB**: Install MongoDB for the database
- **Postman**: Install Postman for API testing

## 2. Clone the Repository

Clone the repository:
```bash
git clone <repository-url>
```

Navigate to the repository directory:
```bash
cd <repository-name>
```

Checkout the desired branch:
```bash
git checkout <branch-name>
```

Pull the latest changes:
```bash
git pull origin <branch-name>
```

## 3. Build the Project

### a. F1nity Frontend

Navigate to the frontend directory:
```bash
cd frontend/project
```

Install dependencies:
```bash
npm install
```

Build the frontend:
```bash
npm run build
```

### b. F1nity Backend

#### i. Authentication

Navigate to the authentication directory:
```bash
cd authentication
```

Clean and install dependencies:
```bash
mvn clean install
```

Run the authentication service:
```bash
mvn spring-boot:run
```

#### ii. F1nity Engine

Navigate to the engine directory:
```bash
cd engine
```

Clean and install dependencies:
```bash
mvn clean install
```

Run the engine service:
```bash
mvn spring-boot:run
```

## 4. Populate the Database

Run the following API endpoints in Postman in the specified order to populate the database:

1. `/accumulateRaces`
2. `/drivers`
3. `/constructors`
4. `/podiums`

**Important**: After running the 4th API call (`/podiums`), you must update the database before proceeding with further API calls.

### MongoDB Updates

Access the MongoDB shell:
```bash
mongosh
```

Switch to the f1nity database:
```javascript
use f1nity
```

Update driver names:
```javascript
db.drivers.updateOne({_id: 'antonelli'}, {$set: {fullName: 'KIMI ANTONELLI'}})
db.drivers.updateOne({_id: 'hulkenberg'}, {$set: {fullName: 'NICO HULKENBERG'}})
```

### Note on Driver ID Issue

The driver IDs for Kimi Antonelli and Nico Hulkenberg differ between the Ergast and OpenF1 APIs. A solution is needed to avoid manual database updates for these drivers.

Continue with the following API endpoints in Postman:

5. `/standings`
6. `/sprints`

Update driver and circuit images:
- `/updateDriverImages`
- `/updateImagesForRaces`
