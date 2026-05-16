# deceivenet-sdk

The official Node.js / Express integration for the **DeceiveNet Telemetry Platform**.

Secure your application, detect malicious probes (SQLi, XSS, Path Traversal), and pipe threat telemetry straight into your DeceiveNet dashboard without running risky proxy honeypots.

## Installation

```bash
npm install deceivenet-sdk
```

## Usage

Add the SDK middleware to your Express application. It runs asynchronously and will **never** block or crash your application.

```javascript
const express = require('express');
const { DeceiveNet } = require('deceivenet-sdk');

const app = express();

app.use(DeceiveNet({
  projectId: 'YOUR_PROJECT_ID',
  token: 'YOUR_API_KEY',
  
  // Optional: Only scan these routes
  interceptRoutes: ['/login', '/api/admin', '/wp-admin'],
  
  // Optional Privacy Settings
  privacy: {
    redactHeaders: true,
    redactCookies: true,
    captureBodies: true,
    maxPayloadSize: 4096
  },
  
  debug: false
}));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(8080);
```

## Security & Privacy Guarantee
This SDK treats all incoming data as hostile.
- It **never** executes payloads or evaluates content.
- It utilizes a fast, regex-based threat engine locally.
- It recursively redacts `passwords`, `tokens`, and `authorization` headers locally *before* telemetry ever leaves your server.
- It signs outbound telemetry batches with HMAC-SHA256 to prevent tampering.
