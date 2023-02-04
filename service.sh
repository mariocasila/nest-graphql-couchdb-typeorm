#!/bin/sh

echo "Running service tests..."
npm run test

echo "Running service..."
npm run start:prod
