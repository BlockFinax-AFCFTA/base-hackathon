# TradeChain: Technical Documentation

## System Architecture

TradeChain is built as a full-stack JavaScript application with a clear separation of concerns between the frontend and backend components.

### Frontend Architecture

- **Framework**: React with TypeScript
- **State Management**: React Context API and TanStack Query
- **Routing**: Wouter for lightweight routing
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme
- **Form Management**: React Hook Form with Zod validation
- **Web3 Integration**: ethers.js for blockchain interactions

### Backend Architecture

- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL (can be swapped with in-memory storage for development)
- **ORM**: Drizzle ORM with Zod schema validation
- **Session Management**: express-session with connect-pg-simple
- **Authentication**: Custom authentication with Passport.js
- **File Storage**: Server-managed document storage with hash verification

### Data Flow

1. Frontend components make API requests to the backend through TanStack Query
2. Backend routes validate input using Zod schemas
3. Business logic is implemented in the storage layer
4. Blockchain transactions are managed through the Web3 service

## Data Model

### Core Entities

#### Users
- User authentication and profile information
- KYC status and verification data
- Risk scoring for compliance

#### Wallets
- Main wallets for general funds
- Escrow wallets linked to specific contracts
- Balance and transaction history

#### Contracts
- Trade agreement details
- Party information (importer, exporter, mediator)
- Trade terms and conditions
- Milestone tracking

#### Documents
- Trade-related document storage
- Cryptographic verification with blockchain
- Access control for sensitive information

#### Invoices
- Billing information for trade transactions
- Payment status tracking
- Items and payment terms

#### Transactions
- Financial transaction records
- Different transaction types (deposit, withdrawal, escrow)
- Status tracking and verification

#### Trade Finance Applications
- Applications for trade finance instruments
- Status tracking and approval workflow
- Supporting documentation

## Key Technical Components

### Smart Contract Integration

The platform integrates with Ethereum-compatible blockchains through a custom Web3 service. The core smart contract functionality includes:

```typescript
// Simplified ABI for the escrow contract
const ESCROW_CONTRACT_ABI = [
  "function createEscrow(address _seller, address _mediator, uint256 _value, uint256 _releaseTime) payable returns (uint256)",
  "function getEscrowDetails(uint256 _escrowId) view returns (address buyer, address seller, address mediator, uint256 amount, uint256 releaseTime, uint8 status)",
  "function confirmDelivery(uint256 _escrowId)",
  "function refundBuyer(uint256 _escrowId)",
  "function resolveDispute(uint256 _escrowId, bool _releaseToSeller)",
  "function raiseDispute(uint256 _escrowId)"
];
```

### Contract State Management

Contracts follow a clear lifecycle with the following states:

```typescript
export enum ContractStatus {
  DRAFT = 'DRAFT',
  AWAITING_FUNDS = 'AWAITING_FUNDS',
  FUNDED = 'FUNDED',
  GOODS_SHIPPED = 'GOODS_SHIPPED',
  GOODS_RECEIVED = 'GOODS_RECEIVED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED'
}
```

### Document Verification

Documents are verified using blockchain by:
1. Computing document hash
2. Storing hash in the blockchain
3. Verifying document authenticity by comparing hashes

### Storage Interface

The application uses a flexible storage interface that can work with different backends:

```typescript
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  // ...more methods...
  
  // Contract methods
  getContracts(): Promise<Contract[]>;
  getContractById(id: number): Promise<Contract | undefined>;
  // ...more methods...
  
  // Document methods
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | undefined>;
  // ...more methods...
}
```

### API Routes

The backend exposes RESTful API endpoints for all core functionality:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Contracts**: `/api/contracts/*`
- **Documents**: `/api/documents/*`
- **Wallets**: `/api/wallets/*`
- **Transactions**: `/api/transactions/*`
- **Invoices**: `/api/invoices/*`
- **Trade Finance**: `/api/trade-finance/*`

## Development Workflow

### Project Structure

```
├── client/             # Frontend code
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── context/    # React context providers
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   ├── pages/      # Page components
│   │   ├── services/   # Service classes
│   │   └── types/      # TypeScript type definitions
├── server/             # Backend code
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data storage interface
│   └── vite.ts         # Vite integration
├── shared/             # Shared code
│   └── schema.ts       # Database schema and types
└── public/             # Static assets
```

### Running the Project

The application is configured to run with a single command:

```bash
npm run dev
```

This starts both the Express backend server and the Vite development server for the frontend.

## Security Considerations

### Authentication and Authorization

- Session-based authentication for web interface
- JWT tokens for API authentication
- Route protection for sensitive operations

### Data Protection

- Encrypted storage of sensitive information
- Hash verification for document integrity
- Access control for document viewing and management

### Blockchain Security

- Smart contract auditing
- Secure key management for blockchain transactions
- Multi-signature requirements for critical operations

## Future Enhancements

1. **Expanded Blockchain Support**: Integration with additional blockchain networks
2. **AI-Powered Risk Assessment**: Machine learning for trade risk analysis
3. **Supply Chain Tracking**: Integration with IoT for real-time shipment tracking
4. **Enhanced API Ecosystem**: Developer APIs for platform integration
5. **Mobile Applications**: Native mobile apps for on-the-go trade management

## Deployment Architecture

The application is designed to be deployed on scalable cloud infrastructure:

- Frontend: Static hosting with CDN
- Backend: Containerized microservices
- Database: Managed PostgreSQL service
- Blockchain Nodes: Hybrid of managed services and dedicated nodes

## Performance Optimization

1. **Query Optimization**: Efficient database queries
2. **Caching Strategy**: Response caching for common requests
3. **Lazy Loading**: Component and data lazy loading
4. **Asset Optimization**: Compressed static assets
5. **SSR Consideration**: Server-side rendering for critical paths