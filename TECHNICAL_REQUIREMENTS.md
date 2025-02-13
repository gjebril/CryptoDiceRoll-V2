
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
- Roll Range: 0-99.99
- Target Value: User-selected number between 1-98
- Win Conditions: Roll > Target (Over mode) or Roll < Target (Under mode)
- Win Chance: Over mode = (99 - target)%, Under mode = target%

#### Betting Calculations
- Multiplier = 99 / win_chance
- Payout = bet_amount * multiplier (on win)
- House Edge: 1% (built into the 99/win_chance formula)

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
