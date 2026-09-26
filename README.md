# AWS Serverless Notes App

Serverless notes app built with AWS Amplify Gen 2.

## Features
- Email/password authentication with Amazon Cognito
- Private notes stored in DynamoDB (owner-only access)
- Amplify Gen 2 backend (AppSync API)

## Stack
- Frontend: HTML, CSS, JavaScript, Vite
- Backend: AWS Amplify Gen 2, Cognito, DynamoDB, AppSync

## Run locally
1. Configure AWS CLI credentials
2. `npx ampx sandbox`
3. In another terminal: `npm install` then `npm run dev`
4. Open the local URL, sign up, confirm email, sign in, save notes
