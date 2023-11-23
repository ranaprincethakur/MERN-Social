# SocialMedia App

## Description

SocialMedia is a web application that enables users to connect and share their updates with friends. It's built using the MERN stack (MongoDB, Express.js, React, Node.js) with real-time messaging facilitated by Socket.IO. The platform allows users to create profiles, share posts, follow friends, and exchange messages in real time.

## Features

- **User Authentication**: Login, registration, and JWT-based authentication.
- **Profile Management**: Create, edit, and update user profiles.
- **Post Creation**: Share updates.
- **Real-time Messaging**: Instant messaging with friends using Socket.IO.
- **Follow System**: Follow and unfollow other users.

## Prerequisites

- Node.js and npm installed on your machine.
- Create a `.env` file in the client directory with the following content:
  REACT_APP_PUBLIC_FOLDER=http://localhost:5000/images/
- Create a `.env` file in the `server` folder with the following content:
  MONGO_URL(your mongo database url to connect)
  PORT=5000
  JWT_KEY(your custom key)

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/ranaprincethakur/MERN-Social.git
cd SocialMedia-App
run npm install and npm run start in all three directory
```
## Video

https://github.com/ranaprincethakur/MERN-Social/assets/77564766/ebfd78c1-1251-4471-b421-d7b274383d56
