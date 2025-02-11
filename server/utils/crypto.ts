import { randomBytes, createHash } from 'crypto';

export function generateServerSeed(length = 32): string {
  return randomBytes(length).toString('hex');
}

export function calculateServerSeedHash(serverSeed: string): string {
  return createHash('sha256').update(serverSeed).digest('hex');
}

export function calculateResult(
  clientSeed: string,
  serverSeed: string,
  target: number,
  isOver: boolean
): { roll: number; won: boolean } {
  const combinedSeed = clientSeed + serverSeed;
  const hash = createHash('sha256').update(combinedSeed).digest('hex');
  
  // Use first 4 bytes for entropy
  const entropy = parseInt(hash.slice(0, 8), 16);
  // Generate number between 0 and 100
  const roll = (entropy % 10000) / 100;
  
  const won = isOver ? roll > target : roll < target;
  
  return { roll, won };
}
