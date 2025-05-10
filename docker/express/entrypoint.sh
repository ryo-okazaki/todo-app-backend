#!/bin/sh

# install npm packages
cd /workdir && npm install

# init prisma client
npx prisma generate


# start express server
if [ "$EXPRESS_SERVER_DEBUG" = "1" ]; then
  cd /workdir
  npm install --save-dev nodemon && npm run debug-start
else
  cd /workdir && npm start
fi
