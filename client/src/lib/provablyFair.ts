import { Decimal } from "decimal.js";

// For client-side crypto operations
export function generateClientSeed(length = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function calculateResult(
  clientSeed: string,
  serverSeed: string,
  target: number,
  isOver: boolean
): Promise<{ roll: number; won: boolean }> {
  // Use the browser's built-in TextEncoder
  const encoder = new TextEncoder();
  const data = encoder.encode(clientSeed + serverSeed);

  // Generate hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Use first 4 bytes for entropy
  const entropy = parseInt(hashHex.slice(0, 8), 16);
  // Generate number between 0 and 99.99
  const roll = new Decimal(entropy).mod(10000).div(100).toNumber();

  const won = isOver ? roll > target : roll < target;

  return { roll, won };
}

export async function verifyBet(
  clientSeed: string,
  serverSeed: string,
  target: number,
  isOver: boolean
): Promise<{
  roll: number;
  won: boolean;
  verified: boolean;
}> {
  try {
    const result = await calculateResult(clientSeed, serverSeed, target, isOver);
    return {
      ...result,
      verified: true
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      roll: 0,
      won: false,
      verified: false
    };
  }
}