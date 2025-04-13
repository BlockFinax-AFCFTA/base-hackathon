# TradeChain: Quick Start Guide

This guide helps you get TradeChain up and running quickly for development or testing purposes.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Git
- PostgreSQL (optional, in-memory storage available for development)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/tradechain.git
   cd tradechain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file to configure:
   - Database connection (if using PostgreSQL)
   - Blockchain network details
   - API keys and secrets

## Starting the Application

Start the development server:
```bash
npm run dev
```

This starts both the backend Express server and the frontend Vite development server.

The application will be available at:
- Frontend: http://localhost:5000
- API: http://localhost:5000/api

## Default Accounts

For development purposes, the following accounts are pre-configured:

### Importer Account
- Username: `importer`
- Password: `password`
- Role: Buyer/Importer

### Exporter Account
- Username: `exporter`
- Password: `password`
- Role: Seller/Exporter

### Mediator Account
- Username: `mediator`
- Password: `password`
- Role: Mediator/Facilitator

## Development Quick Tips

### Using In-Memory Storage

For quick development without a database, use the in-memory storage option:

1. Open `server/index.ts`
2. Ensure the `useInMemoryStorage` flag is set to `true`

### Creating a Test Contract

1. Log in as an Importer
2. Navigate to "New Trade Contract"
3. Fill in the contract details:
   - Title: Test Import Contract
   - Add the Exporter's address as a counterparty
   - Set trade terms
4. Submit the contract
5. Log in as the Exporter to approve the contract

### Testing Document Upload

1. Log in to any account
2. Navigate to "Documents"
3. Click "Upload Document"
4. Select a sample document
5. Link it to a contract if desired

### Testing the Escrow Process

1. Create a contract between Importer and Exporter
2. As Importer, fund the escrow
3. As Exporter, upload shipping documents
4. As Importer, confirm receipt of goods
5. Observe automatic fund release

## Building for Production

To build the application for production:

```bash
npm run build
```

The compiled application will be in the `dist` directory.

## Running Tests

Run the test suite:

```bash
npm test
```

## Troubleshooting

### Common Issues

1. **Connection errors**:
   - Ensure PostgreSQL is running (if using database storage)
   - Check environment variables for correct database connection string

2. **Blockchain connectivity**:
   - Verify blockchain network settings
   - Ensure you have test ETH if using a testnet

3. **API errors**:
   - Check browser console for detailed error messages
   - Verify API routes in server logs

### Getting Help

If you encounter issues:
- Check the detailed documentation in the [README.md](README.md)
- Review [TECHNICAL.md](TECHNICAL.md) for architecture details
- Submit an issue on the GitHub repository

## Next Steps

After getting the application running:

1. Read [USER_GUIDE.md](USER_GUIDE.md) for detailed feature instructions
2. Explore [API_DOCS.md](API_DOCS.md) for API integration options
3. Review [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute to the project

---

Happy trading with TradeChain!