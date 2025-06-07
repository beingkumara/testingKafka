# F1nity - Formula 1 Analytics Platform

F1nity is a web application designed for Formula 1 enthusiasts, providing access to racing data, statistics, and more. This project is built with React, TypeScript, and Vite, utilizing Tailwind CSS for styling.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

*(Please fill this section with the key features of your F1nity application. For example:)*
-   Live race data and standings
-   Detailed driver profiles and career statistics
-   Constructor information and performance analysis
-   Historical race results and data exploration
-   Interactive charts and visualizations

## Technologies Used

**Core Frontend:**
-   React (`react`, `react-dom`)
-   TypeScript
-   Vite (for development server and build tooling)

**Styling & UI:**
-   Tailwind CSS
-   Emotion (`@emotion/react`, `@emotion/styled`)
-   Material-UI (`@mui/material`, `@mui/styles`)
-   Framer Motion (`framer-motion` for animations)
-   Lucide Icons (`lucide-react` for icons)

**Routing & State Management (Implicit):**
-   React Router (`react-router-dom`)
-   React Context API (likely used, inferred from `src/context`)

**Utilities:**
-   React CountUp (`react-countup`)
-   JWT Decode (`jwt-decode` for handling JSON Web Tokens)

**Development & Tooling:**
-   ESLint (`eslint`, `@eslint/js`, `typescript-eslint`) for linting
-   PostCSS (`postcss`) and Autoprefixer (`autoprefixer`) for CSS processing
-   `@vitejs/plugin-react` for Vite-React integration
-   `globals` for ESLint global variable definitions

## Project Structure

The project (`f1nity`) is organized as follows:

/Users/tejagutti/Desktop/testingKafka/frontend/project/
├── .gitattributes           # (If present) Defines attributes per path
├── .gitignore               # Specifies intentionally untracked files
├── .vscode/                 # VS Code editor settings
├── dist/                    # Production build output
├── eslint.config.js         # ESLint configuration file
├── index.html               # Main HTML entry point for Vite
├── node_modules/            # Project dependencies
├── package-lock.json        # Records exact versions of dependencies
├── package.json             # Project metadata, scripts, and dependencies
├── postcss.config.js        # PostCSS configuration
├── public/                  # Static assets (e.g., images, fonts)
│   └── images/
│       └── f1-grid-pattern.svg
├── src/                     # Application source code
│   ├── App.css              # Global styles for App component
│   ├── App.tsx              # Main application root component
│   ├── components/          # Reusable UI components
│   ├── config/              # Application configuration (e.g., constants)
│   ├── context/             # React Context API providers and consumers
│   ├── hooks/               # Custom React hooks
│   ├── index.css            # Global stylesheets
│   ├── main.tsx             # Application entry point (renders App.tsx)
│   ├── pages/               # Page-level components (routed views)
│   ├── services/            # API service integrations, data fetching
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions and helpers
│   └── vite-env.d.ts        # Vite environment type definitions
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.app.json        # TypeScript configuration for the application
├── tsconfig.json            # Root TypeScript configuration
├── tsconfig.node.json       # TypeScript configuration for Node.js environments (e.g., Vite config)
└── vite.config.ts           # Vite build tool configuration

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your system.
-   Node.js (v18.x or later recommended)
-   npm (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    (Replace `<your-repository-url>` with the actual URL if you have one)
    ```bash
    git clone <your-repository-url>
    cd f1nity # or your project's directory name
    ```

2.  **Install dependencies:**
    Navigate to the project directory and run:
    ```bash
    npm install
    ```

## Available Scripts

In the project directory, you can run the following commands:

-   **`npm run dev`**
    Starts the development server using Vite. Open [http://localhost:5173](http://localhost:5173) (or the port Vite assigns, check your terminal output) to view the application in your browser. The page will automatically reload when you make changes.

-   **`npm run build`**
    Builds the application for production. The optimized static files will be output to the `dist/` directory.

-   **`npm run lint`**
    Runs ESLint to check for code quality and style issues across the project.

-   **`npm run preview`**
    Starts a local static web server that serves the files from your `dist/` directory. This is useful for previewing the production build locally before deployment.

## Contributing

Contributions make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

*(Optional: Add more specific guidelines for contributing, such as:)*
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is currently licensed under the MIT License.
*(Consider adding a `LICENSE` file to your project root with the full MIT License text if you haven't already.)*