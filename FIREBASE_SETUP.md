# Firebase Setup Guide for Netflix Clone

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "netflix-clone")
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following sign-in providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and add your project's support email

## Step 3: Enable Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location
5. Click "Done"

## Step 4: Get Your Firebase Configuration

1. Go to Project Settings (gear icon in the left sidebar)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname (e.g., "netflix-web")
5. Copy the Firebase configuration object

## Step 5: Update Your Configuration

Replace the placeholder configuration in `index.html` with your actual Firebase config:

```javascript
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'your-actual-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-actual-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: 'your-actual-sender-id',
  appId: 'your-actual-app-id',
};
```

## Step 6: Set Up Firestore Security Rules (Optional)

For better security, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow read access to public content
    match /movies/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 7: Test Your Setup

1. Open your Netflix clone in a web browser
2. Click "Sign In" to test the authentication
3. Try creating an account with email/password
4. Try signing in with Google
5. Check the Firebase Console to see if users are being created

## Features Included

✅ **Email/Password Authentication**

- User registration with name, email, and password
- Password confirmation validation
- Secure login/logout

✅ **Google Sign-In**

- One-click authentication with Google
- Automatic user profile creation

✅ **User Profile Management**

- Display user name and email
- Profile dropdown with logout option
- Persistent authentication state

✅ **Firestore Integration**

- User data storage
- User preferences tracking
- Extensible for watchlists and viewing history

✅ **Modern UI/UX**

- Netflix-style authentication forms
- Responsive design
- Error handling and notifications
- Loading states

## Next Steps

- Add user watchlists
- Track viewing history
- Add user preferences (language, maturity rating)
- Implement user ratings and reviews
- Add social features (sharing, recommendations)

## Troubleshooting

**Authentication not working?**

- Check that you've enabled Email/Password and Google sign-in methods
- Verify your Firebase configuration is correct
- Check browser console for error messages

**Quota exceeded errors?**

- You may need to upgrade to a paid Firebase plan for production use
- Firebase Spark (free) plan has daily limits

**CORS errors?**

- Make sure you're serving the app from a web server, not opening the HTML file directly
- Use a local server like Live Server extension in VS Code
