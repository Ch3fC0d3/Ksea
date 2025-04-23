#!/bin/bash
echo "Starting application..."
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la
echo "Starting Node.js server..."
node server.js
