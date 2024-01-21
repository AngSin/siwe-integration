# Prerequisites
1. Have node and npm installed
2. Have docker installed and docker daemon running

# Steps to run
1. run: `docker run --name siwe-postgres -e POSTGRES_PASSWORD=securepassword -e POSTGRES_DB=siwe_db -e POSTGRES_USER=admin -p 5432:5432 -d postgres`
2. install & run server: `cd server && npm i && npm run start:dev`
3. install & run client: `cd client && npm i && npm start`
4. go to http://localhost:3000
