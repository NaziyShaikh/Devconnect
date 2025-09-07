const fs = require('fs');

// Read the server.js file
let serverContent = fs.readFileSync('devconnect-backend/server.js', 'utf8');

// Add the import for joinRequestsRoutes
serverContent = serverContent.replace(
  "import projectRoutes from './routes/project.js';",
  "import projectRoutes from './routes/project.js';\nimport joinRequestsRoutes from './routes/joinRequests.js';"
);

// Add the route usage
serverContent = serverContent.replace(
  "app.use('/api/projects', projectRoutes);",
  "app.use('/api/projects', projectRoutes);\napp.use('/api/join-requests', joinRequestsRoutes);"
);

// Write the updated content back
fs.writeFileSync('devconnect-backend/server.js', serverContent);

console.log('✅ Join requests routes added to server.js');
