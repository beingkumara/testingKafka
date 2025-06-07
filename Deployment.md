F1nity Project Setup and Data Accumulation Guide
This guide provides step-by-step instructions for setting up the F1nity project, including installation of dependencies on Linux, Windows, and macOS, cloning the repository, building the project, and accumulating data in the MongoDB database.
1. Install Dependencies
Below are the installation steps for each tool on Linux (Ubuntu-based), Windows, and macOS.
a. Java (>17)

Linux (Ubuntu):sudo apt update
sudo apt install openjdk-17-jdk
java -version


Windows:
Download the JDK 17 installer from Oracle JDK.
Run the installer and follow the prompts.
Set the JAVA_HOME environment variable:
Right-click 'This PC' > Properties > Advanced system settings > Environment Variables.
Add JAVA_HOME with the path (e.g., C:\Program Files\Java\jdk-17).
Append %JAVA_HOME%\bin to the Path variable.


Verify: java -version in Command Prompt.


macOS:brew install openjdk@17
sudo ln -sfn /usr/local/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
java -version

Note: Install Homebrew first if not installed: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)".

b. Maven

Linux (Ubuntu):sudo apt update
sudo apt install maven
mvn -version


Windows:
Download the Maven binary zip from Maven.
Extract to a directory (e.g., C:\Program Files\Apache\maven).
Set environment variables:
Add M2_HOME with the path (e.g., C:\Program Files\Apache\maven\apache-maven-3.9.6).
Append %M2_HOME%\bin to the Path variable.


Verify: mvn -version in Command Prompt.


macOS:brew install maven
mvn -version



c. Git

Linux (Ubuntu):sudo apt update
sudo apt install git
git --version


Windows:
Download the Git installer from Git.
Run the installer, accepting default settings.
Verify: git --version in Command Prompt or Git Bash.


macOS:brew install git
git --version



d. Node.js

Linux (Ubuntu):sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v


Windows:
Download the Node.js installer from Node.js.
Run the installer, accepting default settings.
Verify: node -v and npm -v in Command Prompt.


macOS:brew install node
node -v
npm -v



e. MongoDB

Linux (Ubuntu):sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
mongosh --version


Windows:
Download the MongoDB Community Server installer from MongoDB.
Run the installer, selecting "Complete" setup and installing MongoDB as a service.
Add C:\Program Files\MongoDB\Server\<version>\bin to the Path environment variable.
Verify: mongosh --version in Command Prompt.


macOS:brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
mongosh --version



f. Postman

Linux (Ubuntu):
Download the Postman tar.gz file from Postman.
Extract and run:tar -xvf postman-linux-x64.tar.gz
sudo mv Postman /opt/Postman
/opt/Postman/Postman




Windows:
Download the Postman installer from Postman.
Run the installer and follow the prompts.
Launch Postman from the Start menu.


macOS:
Download the Postman DMG file from Postman.
Open the DMG and drag Postman to the Applications folder.
Launch Postman from Applications.



2. Clone the Repository
Clone the F1nity repository and switch to the desired branch:
git clone <repository-url>
cd <repository-name>
git checkout <branch-name>
git pull origin <branch-name>

Replace <repository-url> and <branch-name> with the appropriate repository URL and branch name.
3. Build the Project
a. F1nity Frontend
Navigate to the frontend directory, install dependencies, and build the project:
cd frontend/project
npm install
npm run build

b. F1nity Backend
i. Authentication Service
Navigate to the authentication directory, build, and run the service:
cd authentication
mvn clean install
mvn spring-boot:run

ii. F1nity Engine
Navigate to the engine directory, build, and run the service:
cd engine
mvn clean install
mvn spring-boot:run

4. Accumulate Data in MongoDB
Run the following API endpoints in Postman in the specified order to populate the database:

/accumulateRaces
/drivers
/constructors
/podiums

MongoDB Updates
Access the MongoDB shell and update driver names:
mongosh
use f1nity
db.drivers.updateOne({_id: "antonelli"}, {$set: {fullName: "KIMI ANTONELLI"}})
db.drivers.updateOne({_id: "hulkenberg"}, {$set: {fullName: "NICO HULKENBERG"}})
db.drivers.deleteOne({_id: "kimi antonelli"})
db.drivers.deleteOne({_id: "nico hulkenberg"})

Note: The driver IDs for antonelli and hulkenberg differ between the Ergast and OpenF1 APIs, causing the need for manual updates. To avoid this, consider the following approach:

Proposed Solution: Modify the backend data ingestion logic to standardize driver IDs across both APIs before inserting into the database. For example, implement a mapping table or preprocessing step to align IDs from Ergast and OpenF1 APIs. This requires updating the /drivers endpoint logic to handle ID reconciliation.

Continue with the remaining API calls in Postman:

/standings
/sprints

Update Images in Database
Update driver and circuit images by calling the following APIs:

/updateDriverImages
/updateImagesForRaces

Notes

Ensure MongoDB is running before executing API calls (sudo systemctl start mongodb on Linux, brew services start mongodb/brew/mongodb-community on macOS, or ensure the service is running on Windows).
Verify that all services (frontend, authentication, engine) are running before making API requests in Postman.
The proposed solution for driver ID mismatches requires backend code changes. If you need assistance with implementing the mapping logic, please provide the relevant code or API details.
On Windows, use Command Prompt or PowerShell for commands, and replace sudo with administrator privileges if needed.
On Linux/macOS, ensure proper permissions for MongoDB data directories if you encounter access issues.


