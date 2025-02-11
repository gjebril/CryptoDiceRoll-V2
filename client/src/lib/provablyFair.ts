// For client-side crypto operations
export function generateClientSeed(length = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateServerSeed(): string {
  // Server-side only, not used in browser
  return '';
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
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Use first 4 bytes for entropy
  const entropy = parseInt(hashHex.slice(0, 8), 16);
  // Generate number between 0 and 100
  const roll = (entropy % 10000) / 100;

  const won = isOver ? roll > target : roll < target;

  return { roll, won };
}