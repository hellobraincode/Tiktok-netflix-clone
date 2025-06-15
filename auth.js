// Firebase Authentication Module
class NetflixAuth {
  constructor() {
    this.user = null;
    this.initializeAuth();
    this.setupEventListeners();
  }

  async initializeAuth() {
    // Wait for Firebase to be available
    while (!window.firebaseAuth) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.auth = window.firebaseAuth;
    this.db = window.firebaseDb;

    // Import Firebase Auth methods
    const {
      onAuthStateChanged,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      GoogleAuthProvider,
      signInWithPopup,
      updateProfile,
    } = await import(
      'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
    );

    const { doc, setDoc, getDoc } = await import(
      'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
    );

    // Store Firebase methods
    this.signInWithEmailAndPassword = signInWithEmailAndPassword;
    this.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
    this.signOut = signOut;
    this.signInWithPopup = signInWithPopup;
    this.GoogleAuthProvider = GoogleAuthProvider;
    this.updateProfile = updateProfile;
    this.doc = doc;
    this.setDoc = setDoc;
    this.getDoc = getDoc;

    // Listen for auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.handleAuthStateChange(user);
    });
  }

  setupEventListeners() {
    // Login button
    document.getElementById('login-btn')?.addEventListener('click', () => {
      this.showAuthOverlay('login');
    });

    // Close auth overlay
    document.getElementById('close-auth')?.addEventListener('click', () => {
      this.hideAuthOverlay();
    });

    // Auth overlay background click
    document.getElementById('auth-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'auth-overlay') {
        this.hideAuthOverlay();
      }
    });

    // Switch between login and signup
    document.getElementById('show-signup')?.addEventListener('click', () => {
      this.showSignupForm();
    });

    document.getElementById('show-login')?.addEventListener('click', () => {
      this.showLoginForm();
    });

    // Form submissions
    document
      .getElementById('login-form-element')
      ?.addEventListener('submit', (e) => {
        this.handleLogin(e);
      });

    document
      .getElementById('signup-form-element')
      ?.addEventListener('submit', (e) => {
        this.handleSignup(e);
      });

    // Google Sign In
    document.getElementById('google-signin')?.addEventListener('click', () => {
      this.handleGoogleSignIn();
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      this.handleLogout();
    });
  }

  showAuthOverlay(type = 'login') {
    const overlay = document.getElementById('auth-overlay');
    overlay.classList.remove('hidden');

    if (type === 'login') {
      this.showLoginForm();
    } else {
      this.showSignupForm();
    }
  }

  hideAuthOverlay() {
    const overlay = document.getElementById('auth-overlay');
    overlay.classList.add('hidden');
  }

  showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
  }

  showSignupForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
  }

  async handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
      submitBtn.textContent = 'Signing In...';
      submitBtn.disabled = true;

      await this.signInWithEmailAndPassword(this.auth, email, password);
      this.hideAuthOverlay();
      this.showNotification('Welcome back!', 'success');
    } catch (error) {
      console.error('Login error:', error);
      this.showNotification(this.getErrorMessage(error.code), 'error');
    } finally {
      submitBtn.textContent = 'Sign In';
      submitBtn.disabled = false;
    }
  }

  async handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById(
      'signup-confirm-password'
    ).value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Validate passwords match
    if (password !== confirmPassword) {
      this.showNotification('Passwords do not match', 'error');
      return;
    }

    try {
      submitBtn.textContent = 'Creating Account...';
      submitBtn.disabled = true;

      // Create user account
      const userCredential = await this.createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile with name
      await this.updateProfile(user, {
        displayName: name,
      });

      // Save additional user data to Firestore
      await this.setDoc(this.doc(this.db, 'users', user.uid), {
        name: name,
        email: email,
        createdAt: new Date(),
        preferences: {
          language: 'en',
          maturityRating: 'PG-13',
        },
      });

      this.hideAuthOverlay();
      this.showNotification('Account created successfully!', 'success');
    } catch (error) {
      console.error('Signup error:', error);
      this.showNotification(this.getErrorMessage(error.code), 'error');
    } finally {
      submitBtn.textContent = 'Sign Up';
      submitBtn.disabled = false;
    }
  }

  async handleGoogleSignIn() {
    const provider = new this.GoogleAuthProvider();
    const button = document.getElementById('google-signin');

    try {
      button.textContent = 'Signing in...';
      button.disabled = true;

      const result = await this.signInWithPopup(this.auth, provider);
      const user = result.user;

      // Save user data to Firestore if it's their first time
      const userDoc = await this.getDoc(this.doc(this.db, 'users', user.uid));
      if (!userDoc.exists()) {
        await this.setDoc(this.doc(this.db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          createdAt: new Date(),
          preferences: {
            language: 'en',
            maturityRating: 'PG-13',
          },
        });
      }

      this.hideAuthOverlay();
      this.showNotification('Welcome to Netflix!', 'success');
    } catch (error) {
      console.error('Google sign-in error:', error);
      this.showNotification('Failed to sign in with Google', 'error');
    } finally {
      button.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
            `;
      button.disabled = false;
    }
  }

  async handleLogout() {
    try {
      await this.signOut(this.auth);
      this.showNotification('Signed out successfully', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      this.showNotification('Failed to sign out', 'error');
    }
  }

  handleAuthStateChange(user) {
    this.user = user;

    if (user) {
      // User is signed in
      this.showUserProfile(user);
      this.hideAuthButtons();
    } else {
      // User is signed out
      this.hideUserProfile();
      this.showAuthButtons();
    }
  }

  showUserProfile(user) {
    const userProfile = document.getElementById('user-profile');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');

    if (userProfile && userName && userEmail) {
      userProfile.classList.remove('hidden');
      userName.textContent = user.displayName || 'User';
      userEmail.textContent = user.email;
    }
  }

  hideUserProfile() {
    const userProfile = document.getElementById('user-profile');
    if (userProfile) {
      userProfile.classList.add('hidden');
    }
  }

  showAuthButtons() {
    const authButtons = document.getElementById('auth-buttons');
    if (authButtons) {
      authButtons.classList.remove('hidden');
    }
  }

  hideAuthButtons() {
    const authButtons = document.getElementById('auth-buttons');
    if (authButtons) {
      authButtons.classList.add('hidden');
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${
              type === 'error'
                ? '#dc2626'
                : type === 'success'
                ? '#16a34a'
                : '#0369a1'
            };
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 4 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests':
        'Too many failed attempts. Please try again later.',
      'auth/network-request-failed':
        'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in cancelled.',
      'auth/cancelled-popup-request':
        'Only one sign-in popup allowed at a time.',
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }

  // Utility method to get current user
  getCurrentUser() {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.user;
  }
}

// Initialize authentication when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.netflixAuth = new NetflixAuth();
});
