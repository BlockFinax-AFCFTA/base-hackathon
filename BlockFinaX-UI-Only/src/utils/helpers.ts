import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines classNames with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shortens an Ethereum address or other long hash to a displayable format
 */
export function shortenAddress(address: string | null | undefined, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string | number | null | undefined): string {
  if (!date) return 'Not specified';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formats a currency amount with appropriate symbols and decimals
 */
export function formatCurrency(amount: number | string, currency: string = 'USDC', decimals: number = 2): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return `0 ${currency}`;
  }
  
  return `${numAmount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })} ${currency}`;
}

/**
 * Simple delay function for simulating API calls
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get status badge color based on status
 */
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    'completed': 'bg-green-100 text-green-800',
    'active': 'bg-blue-100 text-blue-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'draft': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800',
    'funded': 'bg-emerald-100 text-emerald-800',
    'awaiting_funds': 'bg-amber-100 text-amber-800',
    'goodsshipped': 'bg-indigo-100 text-indigo-800',
    'goodsreceived': 'bg-violet-100 text-violet-800',
    'disputed': 'bg-orange-100 text-orange-800',
    'paid': 'bg-green-100 text-green-800',
    'overdue': 'bg-red-100 text-red-800',
    'sent': 'bg-blue-100 text-blue-800',
    'default': 'bg-gray-100 text-gray-800'
  };

  const normalizedStatus = status.toLowerCase().replace(/[^a-z]/g, '');
  return statusMap[normalizedStatus] || statusMap.default;
}