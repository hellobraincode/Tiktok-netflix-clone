# Netflix Clone with Firebase Authentication

🎬 **Your TikTok Netflix Clone now includes:**

- ✅ Firebase Authentication (Email/Password + Google Sign-in)
- ✅ User Profile Management
- ✅ Personalized Features
- ✅ My List functionality
- ✅ Secure user data storage

## 🚀 Quick Start

### Step 1: Set up Firebase (Required)

1. Follow the instructions in `FIREBASE_SETUP.md`
2. Replace the Firebase config in `index.html` with your actual config

### Step 2: Test Your Setup

1. Open `firebase-test.html` in your browser first to test authentication
2. If tests pass, open `index.html` for the full experience

### Step 3: Serve the Files

You need to serve the files from a web server (not open them directly) for Firebase to work properly.

**Option A: Use VS Code Live Server**

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

**Option B: Use Python (if installed)**

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: http://localhost:8000

**Option C: Use Node.js (if installed)**

```bash
npx http-server
```

## 🔥 New Features Added

### Authentication System

- **Sign Up/Sign In**: Email and password authentication
- **Google Sign-In**: One-click authentication with Google
- **User Profiles**: Display user name and email in navigation
- **Secure Logout**: Complete session management

### Personalized Experience

- **My List**: Add/remove movies from personal watchlist (auth required)
- **Personalized Search**: Enhanced search results for logged-in users
- **Custom Notifications**: Tailored notifications based on user status
- **Viewing History**: Track user interactions (framework ready)

### Enhanced UI/UX

- **Modern Auth Forms**: Netflix-style login/signup modals
- **Interactive Elements**: Hover effects, loading states, notifications
- **Responsive Design**: Works on desktop and mobile
- **Error Handling**: User-friendly error messages

## 🎯 How to Use

### For Visitors (Not Signed In)

- Browse movies and shows
- Click movies to see "Sign in to watch" prompt
- Basic search and notifications

### For Authenticated Users

- Full access to all content
- Add movies to "My List" with + button
- Personalized search results
- Custom notifications and recommendations
- Profile management in top-right dropdown

## 🛠️ File Structure

```
Tiktok-netflix-clone/
├── index.html              # Main Netflix clone page
├── style.css              # All styles including auth
├── script.js              # Main functionality + auth integration
├── auth.js                # Firebase authentication module
├── firebase-test.html     # Test page for Firebase setup
├── FIREBASE_SETUP.md      # Detailed setup instructions
└── README.md             # This file
```

## 🔧 Technical Details

### Authentication Flow

1. User clicks "Sign In" → Auth overlay appears
2. User enters credentials → Firebase validates
3. On success → UI updates, user profile shows
4. Auth state persists across page reloads

### Data Storage

- User profiles stored in Firestore `/users/{userId}`
- Extensible for watchlists, preferences, viewing history
- Secure rules protect user data

### Security Features

- Client-side auth state management
- Firestore security rules (see setup guide)
- Input validation and error handling
- Secure password requirements

## 🚨 Troubleshooting

**"Firebase not defined" errors?**

- Make sure you're serving from a web server
- Check that your Firebase config is correct

**Authentication not working?**

- Enable Email/Password and Google auth in Firebase Console
- Check browser console for detailed error messages

**CORS errors?**

- Don't open HTML files directly - use a web server
- Use VS Code Live Server or the Python/Node.js commands above

## 🎉 Next Steps

Ready to extend your Netflix clone? Consider adding:

- User watchlists with Firestore
- Video streaming integration
- User ratings and reviews
- Social features (sharing, friends)
- Admin dashboard for content management
- Mobile app with React Native

---

**Happy coding! 🚀** Your Netflix clone now has professional-grade authentication!
