#!/bin/sh

# install npm packages
cd /workdir && npm install

# init prisma client
npx prisma generate

# start express server
npm run dev
