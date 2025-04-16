import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Shortens an Ethereum address or other long hash to a displayable format
 * @param address The full address to shorten
 * @param startChars Number of characters to keep at the start
 * @param endChars Number of characters to keep at the end
 * @returns The shortened address with ellipsis in the middle
 */
export function shortenAddress(address: string | null | undefined, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(address.length - endChars)}`;
}
