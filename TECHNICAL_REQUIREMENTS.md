
# Technical Requirements Document

## System Architecture

### 1. Frontend Requirements
- React with TypeScript for type safety
- Responsive design using Tailwind CSS
- WebSocket integration for real-time updates
- Client-side validation
- State management with React Query

### 2. Backend Requirements
- Node.js with Express server
- WebSocket server for real-time communication
- In-memory storage system
- RESTful API architecture
- Session management

### 3. Security Requirements
- HTTPS protocol
- Secure WebSocket connections
- Rate limiting implementation
- Input validation and sanitization
- Session timeout handling

### 4. Performance Requirements
- Maximum latency: 100ms
- Concurrent users support: 1000+
- 99.9% uptime
- Efficient memory usage
- Response time < 200ms

### 5. Database Requirements
- PostgreSQL with Drizzle ORM
- Transaction consistency
- Data backup system
- Query optimization
- Connection pooling

### 6. Development Requirements
- Version control with Git
- Automated testing
- CI/CD pipeline


### 9. Game Logic & Calculations

#### Probability System
- Roll Range: 0-99.99 (two decimal places precision)
- Target Value: User-selected number between 1-98
- Win Conditions: 
  * Over mode: Win if Roll > Target
  * Under mode: Win if Roll < Target
- Win Chance Formulas:
  * Over mode: (99 - target)%
  * Under mode: target%

Examples:
1. Target = 50.00
   * Over mode: Win chance = (99 - 50)% = 49%
   * Under mode: Win chance = 50%

2. Target = 75.00
   * Over mode: Win chance = (99 - 75)% = 24%
   * Under mode: Win chance = 75%

#### Betting Calculations
1. Multiplier Formula = 99 / win_chance
   Examples:
   * 50% chance: 99/50 = 1.98x multiplier
   * 25% chance: 99/25 = 3.96x multiplier
   * 10% chance: 99/10 = 9.90x multiplier

2. Payout Formula = bet_amount * multiplier
   Examples:
   * Bet 1.00 at 50%: 1.00 * 1.98 = 1.98 payout
   * Bet 1.00 at 25%: 1.00 * 3.96 = 3.96 payout
   * Bet 1.00 at 10%: 1.00 * 9.90 = 9.90 payout

3. House Edge
   * Built into the multiplier formula using 99 instead of 100
   * Effective house edge = 1%
   * Example:
     - True fair multiplier at 50% = 100/50 = 2.00x
     - Actual multiplier = 99/50 = 1.98x
     - Difference of 1% represents house edge

#### Provably Fair System
1. Client Seed Generation
   - Random 16-byte hex string
   - Generated client-side using crypto.getRandomValues()

2. Server Seed System
   - Server generates random 32-byte hex string
   - Only hash is revealed before bet
   - Full seed revealed after bet for verification

3. Roll Generation
   - Combined Hash = SHA256(clientSeed + serverSeed)
   - Take first 4 bytes for entropy
   - Roll = (entropy mod 10000) / 100

#### Auto-Betting Strategies
1. Martingale
   - Double bet after loss
   - Reset to base after win

2. Reverse Martingale
   - Double bet after win
   - Reset to base after loss

3. D'Alembert
   - Increase by base unit after loss
   - Decrease by base unit after win

4. Fibonacci
   - Follow Fibonacci sequence on loss
   - Move back two steps on win

5. Oscar's Grind
   - Progressive betting system
   - Aims to recover losses while limiting risk

- Code documentation
- Error logging system

### 7. Deployment Requirements
- Replit deployment
- Environment configuration
- Monitoring system
- Backup strategy
- Scaling capabilities

### 8. Integration Requirements
- Cryptocurrency payment processing
- User authentication system
- External API integration
- Analytics integration
- Notification system
