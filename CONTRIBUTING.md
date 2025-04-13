# Contributing to TradeChain

Thank you for your interest in contributing to TradeChain! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Pull Request Process](#pull-request-process)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Documentation](#documentation)

## Code of Conduct

Our project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

### Prerequisites

To contribute to TradeChain, you will need:

- Node.js (v16 or higher)
- npm or yarn
- Git
- PostgreSQL (for database development)
- A basic understanding of blockchain technologies and smart contracts

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/tradechain.git
   cd tradechain
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environmental variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your local configuration.

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Project Structure

The project follows a full-stack JavaScript structure:

- `/client` - Frontend React application
- `/server` - Backend Express API
- `/shared` - Shared code between frontend and backend
- `/public` - Static assets

### Branching Strategy

We use a feature branch workflow:

1. Create a new branch for each feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. Make your changes in this branch
3. Commit your changes with clear, descriptive commit messages
4. Push your branch to your fork

### Database Changes

When making changes to the database schema:

1. Update the schema definitions in `shared/schema.ts`
2. Generate migration files if needed

## Pull Request Process

1. Ensure your code follows our coding standards
2. Update documentation as necessary
3. Ensure all tests pass
4. Submit a pull request to the `main` branch of the original repository
5. Include a detailed description of your changes
6. Reference any related issues

## Coding Standards

### General Guidelines

- Follow consistent naming conventions
- Write clean, readable, and maintainable code
- Avoid unnecessary complexity
- Prioritize type safety
- Write comments for complex logic

### Frontend Guidelines

- Use functional components with hooks
- Maintain separation of concerns (UI components vs. hooks)
- Use shadcn's component library when possible
- Follow React best practices

### Backend Guidelines

- Use strong typing with TypeScript
- Validate all input with Zod schemas
- Maintain a clean separation between routes and business logic
- Follow RESTful API design principles

### TypeScript Best Practices

- Use proper type annotations
- Avoid using `any` type
- Use interface for public API and type for internal types
- Use Zod for runtime type validation

## Testing Guidelines

### Frontend Testing

- Write unit tests for React components
- Test hooks separately from components
- Mock API requests in tests
- Focus on user interactions and state changes

### Backend Testing

- Write unit tests for business logic
- Write integration tests for API endpoints
- Use in-memory database for testing
- Mock external services

## Documentation

### Code Documentation

- Document public APIs and functions
- Use JSDoc syntax for function documentation
- Document complex algorithms and data structures
- Keep documentation up-to-date with code changes

### User Documentation

- Update README.md with new features
- Document API changes in API_DOCS.md
- Update user guides as needed
- Provide examples for new functionality

## Smart Contract Development

When working on blockchain-related features:

1. Follow smart contract best practices
2. Test contracts thoroughly before integration
3. Document contract interfaces and behavior
4. Consider gas optimization

## Security Considerations

- Never commit secrets or credentials
- Follow security best practices
- Validate and sanitize all user input
- Use proper authentication and authorization

## Performance

- Consider performance implications of changes
- Optimize queries and data access patterns
- Minimize unnecessary re-renders in the frontend
- Use appropriate indexing for database tables

---

Thank you for contributing to TradeChain! Your efforts help make international trade more secure, transparent, and efficient.