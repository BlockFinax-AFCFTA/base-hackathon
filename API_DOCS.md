# TradeChain API Documentation

This document provides details on the RESTful API endpoints available in the TradeChain platform. These endpoints allow for programmatic interaction with all key platform functionality.

## API Overview

- Base URL: `/api`
- Data Format: All requests and responses use JSON format
- Authentication: Session-based authentication for web endpoints; token-based for API integration

## Authentication API

### Session Management

#### Get Current Session

```
GET /api/auth/session
```

**Response:**
```json
{
  "id": 1,
  "username": "user123",
  "walletAddress": "0x123...",
  "profileImage": "/images/profile.jpg",
  "kycStatus": "VERIFIED"
}
```

#### Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "user123",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "user123",
    "walletAddress": "0x123...",
    "profileImage": "/images/profile.jpg",
    "kycStatus": "VERIFIED"
  }
}
```

#### Logout

```
POST /api/auth/logout
```

**Response:**
```json
{
  "success": true
}
```

#### Register New User

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "newuser",
  "password": "securepassword",
  "walletAddress": "0x123..." // Optional
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 2,
    "username": "newuser",
    "walletAddress": "0x123...",
    "kycStatus": "PENDING"
  }
}
```

## User API

#### Get User Profile

```
GET /api/users/:id
```

**Response:**
```json
{
  "id": 1,
  "username": "user123",
  "walletAddress": "0x123...",
  "profileImage": "/images/profile.jpg",
  "kycStatus": "VERIFIED",
  "riskScore": 85
}
```

#### Update User Profile

```
PATCH /api/users/:id
```

**Request Body:**
```json
{
  "profileImage": "/images/new-profile.jpg"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "user123",
  "walletAddress": "0x123...",
  "profileImage": "/images/new-profile.jpg",
  "kycStatus": "VERIFIED",
  "riskScore": 85
}
```

## Contract API

#### Get All Contracts

```
GET /api/contracts
```

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `status` (optional): Filter by contract status

**Response:**
```json
[
  {
    "id": 1,
    "contractAddress": "0xabc...",
    "title": "Coffee Bean Import",
    "description": "Import of 20 tons of arabica coffee beans",
    "status": "FUNDED",
    "createdBy": "user123",
    "createdAt": "2023-05-15T10:30:00Z",
    "updatedAt": "2023-05-16T14:20:00Z",
    "parties": [...],
    "tradeTerms": {...},
    "milestones": {...},
    "escrowWalletId": 5
  },
  // More contracts
]
```

#### Get Contract by ID

```
GET /api/contracts/:id
```

**Response:**
```json
{
  "id": 1,
  "contractAddress": "0xabc...",
  "title": "Coffee Bean Import",
  "description": "Import of 20 tons of arabica coffee beans",
  "status": "FUNDED",
  "createdBy": "user123",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-16T14:20:00Z",
  "parties": [
    {
      "address": "0x123...",
      "role": "IMPORTER",
      "name": "Coffee Distributors Inc.",
      "country": "United States"
    },
    {
      "address": "0x456...",
      "role": "EXPORTER",
      "name": "Colombian Coffee Farms",
      "country": "Colombia"
    }
  ],
  "tradeTerms": {
    "incoterm": "FOB",
    "paymentTerms": "Letter of Credit",
    "currency": "USD",
    "amount": 75000,
    "deliveryDeadline": "2023-06-15T00:00:00Z",
    "inspectionPeriod": 7,
    "disputeResolutionMechanism": "Arbitration"
  },
  "milestones": {
    "created": "2023-05-15T10:30:00Z",
    "funded": "2023-05-16T14:20:00Z"
  },
  "escrowWalletId": 5
}
```

#### Create New Contract

```
POST /api/contracts
```

**Request Body:**
```json
{
  "title": "Electronics Import",
  "description": "Import of 500 smartphones",
  "createdBy": "user123",
  "parties": [
    {
      "address": "0x123...",
      "role": "IMPORTER",
      "name": "Tech Distributors Ltd",
      "country": "United Kingdom"
    },
    {
      "address": "0x456...",
      "role": "EXPORTER",
      "name": "Shanghai Electronics",
      "country": "China"
    }
  ],
  "tradeTerms": {
    "incoterm": "CIF",
    "paymentTerms": "Open Account",
    "currency": "USD",
    "amount": 125000,
    "deliveryDeadline": "2023-08-01T00:00:00Z",
    "inspectionPeriod": 10,
    "disputeResolutionMechanism": "Mediation"
  }
}
```

**Response:**
```json
{
  "id": 2,
  "contractAddress": null,
  "title": "Electronics Import",
  "description": "Import of 500 smartphones",
  "status": "DRAFT",
  "createdBy": "user123",
  "createdAt": "2023-05-20T09:45:00Z",
  "updatedAt": "2023-05-20T09:45:00Z",
  "parties": [...],
  "tradeTerms": {...},
  "milestones": {
    "created": "2023-05-20T09:45:00Z"
  },
  "escrowWalletId": 6
}
```

#### Update Contract Status

```
PATCH /api/contracts/:id
```

**Request Body:**
```json
{
  "status": "GOODS_SHIPPED",
  "milestones": {
    "shipped": "2023-05-25T08:30:00Z"
  }
}
```

**Response:**
```json
{
  "id": 1,
  "status": "GOODS_SHIPPED",
  "updatedAt": "2023-05-25T08:30:00Z",
  "milestones": {
    "created": "2023-05-15T10:30:00Z",
    "funded": "2023-05-16T14:20:00Z",
    "shipped": "2023-05-25T08:30:00Z"
  },
  // Other contract fields
}
```

## Document API

#### Get All Documents

```
GET /api/documents
```

**Query Parameters:**
- `contractId` (optional): Filter by contract ID
- `invoiceId` (optional): Filter by invoice ID
- `userId` (optional): Filter by user ID (for accessible documents)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Bill of Lading.pdf",
    "type": "BILL_OF_LADING",
    "size": 245678,
    "hash": "0xdf2c8...",
    "url": "/documents/bill_of_lading_1.pdf",
    "contractId": 1,
    "invoiceId": null,
    "uploadedBy": "user456",
    "uploadedAt": "2023-05-17T11:20:00Z",
    "tags": ["shipping", "original"],
    "access": [1, 3],
    "isVerified": true
  },
  // More documents
]
```

#### Get Document by ID

```
GET /api/documents/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "Bill of Lading.pdf",
  "type": "BILL_OF_LADING",
  "size": 245678,
  "hash": "0xdf2c8...",
  "url": "/documents/bill_of_lading_1.pdf",
  "contractId": 1,
  "invoiceId": null,
  "uploadedBy": "user456",
  "uploadedAt": "2023-05-17T11:20:00Z",
  "tags": ["shipping", "original"],
  "access": [1, 3],
  "isVerified": true
}
```

#### Upload Document

```
POST /api/documents
```

**Request Body (multipart/form-data):**
- `file`: The document file
- `name`: Document name
- `type`: Document type
- `contractId` (optional): Associated contract ID
- `invoiceId` (optional): Associated invoice ID
- `tags` (optional): Array of tags
- `access` (optional): Array of user IDs who can access

**Response:**
```json
{
  "id": 2,
  "name": "Invoice_12345.pdf",
  "type": "INVOICE",
  "size": 156789,
  "hash": "0xabcd...",
  "url": "/documents/invoice_12345.pdf",
  "contractId": 1,
  "invoiceId": 1,
  "uploadedBy": "user123",
  "uploadedAt": "2023-05-20T15:45:00Z",
  "tags": ["financial", "original"],
  "access": [1, 2],
  "isVerified": false
}
```

#### Update Document Access

```
PATCH /api/documents/:id/access
```

**Request Body:**
```json
{
  "action": "grant",
  "userIds": [4, 5]
}
```

**Response:**
```json
{
  "id": 1,
  "access": [1, 3, 4, 5],
  // Other document fields
}
```

## Wallet API

#### Get User Wallets

```
GET /api/wallets/user/:userId
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "walletType": "MAIN",
    "contractId": null,
    "balance": "10000.00",
    "currency": "USD",
    "createdAt": "2023-04-10T09:00:00Z",
    "updatedAt": "2023-05-18T14:35:00Z"
  },
  {
    "id": 5,
    "userId": 1,
    "walletType": "ESCROW",
    "contractId": 1,
    "balance": "75000.00",
    "currency": "USD",
    "createdAt": "2023-05-15T10:35:00Z",
    "updatedAt": "2023-05-16T14:20:00Z"
  }
]
```

#### Get Wallet by ID

```
GET /api/wallets/:id
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "walletType": "MAIN",
  "contractId": null,
  "balance": "10000.00",
  "currency": "USD",
  "createdAt": "2023-04-10T09:00:00Z",
  "updatedAt": "2023-05-18T14:35:00Z"
}
```

#### Create Transaction

```
POST /api/transactions
```

**Request Body:**
```json
{
  "fromWalletId": 1,
  "toWalletId": 5,
  "amount": "75000.00",
  "currency": "USD",
  "txType": "ESCROW_LOCK",
  "contractId": 1,
  "description": "Funding escrow for coffee import contract"
}
```

**Response:**
```json
{
  "id": 3,
  "fromWalletId": 1,
  "toWalletId": 5,
  "amount": "75000.00",
  "currency": "USD",
  "txType": "ESCROW_LOCK",
  "status": "COMPLETED",
  "contractId": 1,
  "description": "Funding escrow for coffee import contract",
  "createdAt": "2023-05-16T14:20:00Z",
  "metadata": null
}
```

## Invoice API

#### Get All Invoices

```
GET /api/invoices
```

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `role` (optional): Filter by role ('buyer' or 'seller')
- `contractId` (optional): Filter by contract ID

**Response:**
```json
[
  {
    "id": 1,
    "invoiceNumber": "INV-2023-001",
    "contractId": 1,
    "sellerId": 2,
    "buyerId": 1,
    "amount": "75000.00",
    "currency": "USD",
    "issueDate": "2023-05-17T10:00:00Z",
    "dueDate": "2023-06-17T00:00:00Z",
    "status": "UNPAID",
    "items": [
      {
        "description": "Arabica Coffee Beans",
        "quantity": 20,
        "unitPrice": 3750,
        "totalPrice": 75000
      }
    ],
    "paymentTerms": "Net 30",
    "notes": "Please reference invoice number with payment"
  },
  // More invoices
]
```

#### Create Invoice

```
POST /api/invoices
```

**Request Body:**
```json
{
  "invoiceNumber": "INV-2023-002",
  "contractId": 2,
  "sellerId": 3,
  "buyerId": 1,
  "amount": "125000.00",
  "currency": "USD",
  "dueDate": "2023-09-01T00:00:00Z",
  "status": "UNPAID",
  "items": [
    {
      "description": "Smartphone Model X",
      "quantity": 500,
      "unitPrice": 250,
      "totalPrice": 125000
    }
  ],
  "paymentTerms": "Net 30",
  "notes": "Includes 1-year warranty"
}
```

**Response:**
```json
{
  "id": 2,
  "invoiceNumber": "INV-2023-002",
  "contractId": 2,
  "sellerId": 3,
  "buyerId": 1,
  "amount": "125000.00",
  "currency": "USD",
  "issueDate": "2023-05-20T10:15:00Z",
  "dueDate": "2023-09-01T00:00:00Z",
  "status": "UNPAID",
  "items": [...],
  "paymentTerms": "Net 30",
  "notes": "Includes 1-year warranty"
}
```

## Trade Finance API

#### Get Trade Finance Applications

```
GET /api/trade-finance
```

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `contractId` (optional): Filter by contract ID
- `status` (optional): Filter by application status

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "contractId": 1,
    "applicationType": "LETTER_OF_CREDIT",
    "amount": "75000.00",
    "currency": "USD",
    "status": "APPROVED",
    "applicationDate": "2023-05-15T14:30:00Z",
    "approvalDate": "2023-05-18T11:20:00Z",
    "expiryDate": "2023-07-18T00:00:00Z",
    "terms": {
      "issuerBank": "International Trade Bank",
      "beneficiaryBank": "Colombian National Bank",
      "conditions": "Shipment before June 15, 2023"
    },
    "supportingDocuments": [3, 4]
  },
  // More applications
]
```

#### Submit Trade Finance Application

```
POST /api/trade-finance
```

**Request Body:**
```json
{
  "userId": 1,
  "contractId": 2,
  "applicationType": "BANK_GUARANTEE",
  "amount": "50000.00",
  "currency": "USD",
  "expiryDate": "2023-10-01T00:00:00Z",
  "terms": {
    "guarantorBank": "Global Trade Bank",
    "beneficiary": "Shanghai Electronics",
    "conditions": "Performance guarantee for electronics import"
  },
  "supportingDocuments": [5, 6]
}
```

**Response:**
```json
{
  "id": 2,
  "userId": 1,
  "contractId": 2,
  "applicationType": "BANK_GUARANTEE",
  "amount": "50000.00",
  "currency": "USD",
  "status": "PENDING",
  "applicationDate": "2023-05-20T16:45:00Z",
  "approvalDate": null,
  "expiryDate": "2023-10-01T00:00:00Z",
  "terms": {...},
  "supportingDocuments": [5, 6]
}
```

## KYC API

#### Submit KYC Data

```
POST /api/kyc
```

**Request Body:**
```json
{
  "userId": 1,
  "kycData": {
    "firstName": "John",
    "lastName": "Smith",
    "dateOfBirth": "1980-05-15",
    "nationality": "United States",
    "residenceCountry": "United States",
    "idType": "PASSPORT",
    "idNumber": "123456789",
    "idExpiryDate": "2028-03-21",
    "companyName": "Coffee Distributors Inc.",
    "companyRegistrationNumber": "US12345678",
    "companyType": "LLC",
    "businessCategory": "Wholesale",
    "contactDetails": {
      "email": "john@coffeedistr.com",
      "phone": "+1-555-123-4567"
    }
  }
}
```

**Response:**
```json
{
  "userId": 1,
  "kycStatus": "PENDING",
  "kycData": {...},
  "message": "KYC submission successful, verification in progress"
}
```

#### Update KYC Status

```
PATCH /api/kyc/:userId
```

**Request Body:**
```json
{
  "status": "VERIFIED",
  "riskScore": 85
}
```

**Response:**
```json
{
  "userId": 1,
  "kycStatus": "VERIFIED",
  "riskScore": 85,
  "message": "KYC verification completed successfully"
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": true,
  "message": "Description of the error",
  "code": "ERROR_CODE",
  "details": {} // Optional additional error details
}
```

### Common Error Codes

- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API endpoints are subject to rate limiting to ensure platform stability:

- Standard users: 100 requests per minute
- Business users: 300 requests per minute
- Enterprise users: Custom limits

## Webhook Notifications

TradeChain also provides webhook notifications for key events:

1. **Configure Webhook URL**:
```
POST /api/webhooks
```

2. **Subscribe to Events**:
```json
{
  "url": "https://your-domain.com/webhook",
  "events": [
    "contract.created",
    "contract.statusChanged",
    "document.uploaded",
    "transaction.completed"
  ],
  "secret": "your-webhook-secret"
}
```

3. **Event Payload Example**:
```json
{
  "event": "contract.statusChanged",
  "timestamp": "2023-05-25T08:30:00Z",
  "data": {
    "contractId": 1,
    "previousStatus": "FUNDED",
    "newStatus": "GOODS_SHIPPED"
  }
}
```

---

This API documentation is subject to change as the platform evolves. For the latest API documentation, please refer to our Developer Portal.