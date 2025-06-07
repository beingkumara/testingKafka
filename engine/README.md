# F1 Data Engine

## Description

This project is a Spring Boot application designed to fetch, process, and serve Formula 1 data. It integrates with external F1 APIs (OpenF1 and Ergast) to gather comprehensive information about drivers, constructors, race results, and standings. The data is then likely stored in a MongoDB database for efficient retrieval.

## Features

*   Fetches and merges driver data from multiple F1 APIs.
*   Retrieves constructor information and standings.
*   Gathers race schedules and results.
*   Provides up-to-date driver standings.
*   Exposes RESTful APIs to access the processed F1 data.

## Technologies Used

*   Java 17
*   Spring Boot 3.4.5
    *   Spring Web
    *   Spring Data MongoDB
    *   Spring WebFlux
*   Maven (for dependency management and build)
*   MongoDB (as the data store)
*   External F1 APIs:
    *   [OpenF1 API](https://api.openf1.org/v1/)
    *   [Ergast F1 API](https://ergast.com/mrd/) (via a proxy `https://api.jolpi.ca/ergast/f1/`)

## Prerequisites

*   Java Development Kit (JDK) 17 or later installed.
*   Apache Maven installed.
*   MongoDB instance running and accessible. (You might need to configure connection details in `application.properties` or `application.yml`).

## Setup and Running the Application

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd engine
    ```

2.  **Configure MongoDB:**
    Ensure your MongoDB server is running. If your application requires specific MongoDB connection details (e.g., host, port, database name, credentials), you'll need to configure them in the `src/main/resources/application.properties` or `src/main/resources/application.yml` file. For example:
    ```properties
    spring.data.mongodb.uri=mongodb://localhost:27017/f1_data
    # or
    # spring.data.mongodb.host=localhost
    # spring.data.mongodb.port=27017
    # spring.data.mongodb.database=f1_data
    ```

3.  **Build the project:**
    Open a terminal in the project root directory (`/Users/tejagutti/Desktop/testingKafka/engine/`) and run:
    ```bash
    ./mvn clean install
    ```
    (On Windows, use `mvn clean install`)

4.  **Run the application:**
    ```bash
    ./mvn spring-boot:run
    ```
    (On Windows, use `mvn spring-boot:run`)

    The application should start, and you'll typically see logs indicating it's running on a specific port (default is 8080).

## API Endpoints

The application likely exposes several RESTful API endpoints to access the F1 data. These would be defined in the `F1nityController.java` class. Common endpoints might include:

*   `/api/drivers` - Get all drivers
*   `/api/constructors` - Get all constructors
*   `/api/races` - Get race schedules/results
*   `/api/standings/drivers` - Get driver standings
*   `/api/standings/constructors` - Get constructor standings

Please refer to the `F1nityController.java` source code for the exact endpoint definitions, request parameters, and response formats.

## Project Structure

*   `src/main/java`: Contains the main Java source code.
    *   `com.raceIQ.engine.controller`: Contains Spring MVC controllers defining API endpoints.
    *   `com.raceIQ.engine.service`: Contains business logic and service layer components.
    *   `com.raceIQ.engine.impl`: Contains implementations for services, including `FastF1.java` which handles data fetching from external APIs.
    *   `com.raceIQ.engine.model`: Contains data model/entity classes.
    *   `com.raceIQ.engine.repository`: Contains Spring Data repository interfaces for database interaction.
*   `src/main/resources`: Contains application configuration files (e.g., `application.properties`).
*   `pom.xml`: Maven project object model file, defining project dependencies and build settings.
