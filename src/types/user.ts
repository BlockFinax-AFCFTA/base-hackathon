export interface User {
  id: number;
  username: string;
  walletAddress?: string | null;
  profileImage?: string | null;
  kycStatus?: string | null;
  riskScore?: number | null;
  kycData?: any | null;
}