# BlockFinaX UI - Standalone Frontend

This is a standalone UI version of the BlockFinaX application, extracted from the original full-stack project. It uses React with Vite and contains only frontend code, with all backend/API interactions replaced by mock data.

## Features

- Complete UI implementation of BlockFinaX platform
- Built with React, Vite, and TypeScript
- Uses Tailwind CSS for styling
- React Router for navigation
- Mock data for all backend interactions
- Responsive design for various screen sizes

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

### Running in Development Mode

```bash
npm run dev
```

This will start the Vite development server, typically at http://localhost:5173.

### Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

## Project Structure

- `/src` - Main source code
  - `/components` - UI components
    - `/layout` - Layout components (Sidebar, etc.)
    - `/contracts` - Contract-related components
    - `/ui` - Base UI components (Button, Card, etc.)
    - `/documents` - Document management components
    - `/wallet` - Wallet management components
  - `/context` - React context providers
  - `/data` - Mock data for standalone use
  - `/hooks` - Custom React hooks
  - `/pages` - Page components
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions

## Key Pages

- Home/Dashboard - Overview of all features
- Contracts - List and manage contracts
- Contract Details - View and interact with contract details
- Documents - Document management
- Wallet - Asset and escrow management
- Invoices - Invoice management
- Logistics - Logistics tracking

## UI Components

All UI components have been recreated based on the original project, but with backend dependencies removed. The project is completely self-contained and doesn't depend on external APIs.

## Design System

The UI follows a clean, modern design with:

- Consistent spacing and typography
- Responsive layouts
- Interactive elements with appropriate hover/focus states
- Color scheme based on the original application