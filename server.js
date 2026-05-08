// ============================================================
// server.js – HTTP Server Entry Point
// ============================================================
'use strict';

// Suppress DEP0044 (util.isArray) deprecation from internal dependencies
const originalEmitWarning = process.emitWarning;
process.emitWarning = function (warning, ...args) {
  if (typeof warning === 'string' && warning.includes('util.isArray')) return;
  if (args[0] === 'DeprecationWarning' && args[1] === 'DEP0044') return;
  return originalEmitWarning.call(this, warning, ...args);
};

require('dotenv').config();
const app  = require('./app');
const port = parseInt(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`
  ███╗   ██╗███████╗ ██████╗ ███╗   ██╗    ████████╗███████╗ ██████╗██╗  ██╗
  ████╗  ██║██╔════╝██╔═══██╗████╗  ██║    ╚══██╔══╝██╔════╝██╔════╝██║  ██║
  ██╔██╗ ██║█████╗  ██║   ██║██╔██╗ ██║       ██║   █████╗  ██║     ███████║
  ██║╚██╗██║██╔══╝  ██║   ██║██║╚██╗██║       ██║   ██╔══╝  ██║     ██╔══██║
  ██║ ╚████║███████╗╚██████╔╝██║ ╚████║       ██║   ███████╗╚██████╗██║  ██║
  ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝       ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝
  
  🚀 Server running at http://localhost:${port}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  `);
});
