# X Clone Application (Twitter Clone)

## Overview
This project is a clone of the X (formerly Twitter) web application. It includes user authentication, posting, and follows functionality, as well as a feed where users can view and interact with posts.

### Features:
- **Authentication**: Users can sign up, log in, and manage sessions.<br/>
- **Posts**: Users can create, like, and view posts.<br/>
- **Follow System**: Users can follow/unfollow other users.<br/>
- **Responsive Design**: The application is optimized for desktop and mobile devices.<br/>
- **Real-time Updates**: Posts and interactions are displayed dynamically.

## Screenshots:
1. **Signin/Login Page**
   - This is the Signin/login interface where users can enter their credentials to sign in or navigate to the sign-up page if they don’t have an account.<br/><br/>
    ![](https://github.com/user-attachments/assets/ace912c3-c2dc-4d92-82fc-6f2fd2624909)<br/><br/>

   ![](https://github.com/user-attachments/assets/1e0b1cd8-3025-4143-abc6-d2598d1aae0d)<br/><br/>

2. **Home Feed**
   - After logging in, users are redirected to the home feed where they can view posts, like them, and follow other users.<br/><br/>
   ![](https://github.com/user-attachments/assets/1ca85351-7f76-49b1-9512-9ae5a9a6706d)<br/><br/>
   ![](https://github.com/user-attachments/assets/09bbfa75-e7a2-49c4-8776-cfb1754e6882)<br/><br/>

## Technologies Used:
- **React**: For building the frontend of the application.
- **react-router-dom**: For navigation between different pages and routes.
- **Tailwind CSS**: For styling and creating a responsive layout.
- **React Query**: For data fetching and state management of authentication and posts.
- **MongoDB**: As the database for storing user data and posts.
- **Express.js**: Backend framework for handling requests and user authentication.
- **JWT (JSON Web Tokens)**: For managing sessions and securing routes.

## Installation & Setup Instructions:

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project directory:
    ```bash
    cd twitter-clone
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Set up your environment variables. Create a `.env` file in the root directory with the following information:
    ```
    MONGO_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    ```

5. Start the development server:
    ```bash
    npm start
    ```

6. Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

## Project Structure:

```
├── src
│   ├── components
│   │   ├── common
│   │   │   ├── Sidebar.js
│   │   │   ├── RightPanel.js
│   │   │   ├── Downbar.js
│   │   ├── pages
│   │   │   ├── auth
│   │   │   │   ├── LoginPage.js
│   │   │   │   ├── SignUpPage.js
│   │   │   ├── home
│   │   │   │   └── HomePage.js
│   │   │   ├── notification
│   │   │   │   └── NotificationPage.js
│   │   │   ├── profile
│   │   │   │   └── ProfilePage.js
│   ├── App.js
│   ├── index.js
```

### Key Components:

1. **Login Page**: Allows users to sign in or navigate to the sign-up page.
2. **Home Page**: Displays the feed where users can view and interact with posts.
3. **Sidebar**: Displays the navigation links such as Home, Notifications, and Profile.
4. **Right Panel**: Suggests users to follow and displays relevant user profiles.
5. **Downbar**: The footer that includes quick links for the user.

## API Endpoints:

- **Authentication**
  - `POST /api/auth/login`: Logs in a user.
  - `POST /api/auth/signup`: Registers a new user.

- **Posts**
  - `GET /api/posts`: Fetches posts from the database.
  - `POST /api/posts`: Allows an authenticated user to create a new post.

- **User**
  - `GET /api/user/:username`: Fetches user data for a specific profile.
  - `POST /api/user/follow`: Allows an authenticated user to follow another user.

## License:
This project is licensed under the MIT License.

## Contributions:
Feel free to contribute to the project by submitting issues, feature requests, or pull requests. 

