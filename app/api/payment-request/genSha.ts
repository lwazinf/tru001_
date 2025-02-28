import crypto from 'crypto';

/**
 * Generates a SHA-512 hash from the provided string
 * @param input The string to hash
 * @returns SHA-512 hash as a hexadecimal string
 */
export function generateSha512(input: string): string {
  return crypto.createHash('sha512').update(input).digest('hex');
}

/**
 * Generates a SHA-512 hash specifically for the payment gateway format.
 * @param baseData - Base data for the transaction
 * @param requestData - Request-specific data
 * @param privateKey - The private key for the transaction
 * @returns The SHA-512 hash as a hexadecimal string
 */
export function generatePaymentHash(
  baseData: {
    countryCode: string;
    currencyCode: string;
    isTest: boolean | string;
    siteCode: string;
  },
  requestData: {
    transactionReference: string;
    bankReference: string;
    amount: string | number;
  },
  privateKey: string
): string {
  const concatenatedString = `${baseData.countryCode}${baseData.currencyCode}${baseData.isTest}${baseData.siteCode}${requestData.transactionReference}${requestData.bankReference}${requestData.amount}${privateKey}`.toLowerCase();
  
  return generateSha512(concatenatedString);
}