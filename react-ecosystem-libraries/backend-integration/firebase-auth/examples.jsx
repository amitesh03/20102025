import React, { useState } from 'react';
import { CodeBlock, InteractiveDemo, NavigationTabs } from '../../components';

const FirebaseAuthExamples = () => {
  const [activeTab, setActiveTab] = useState('setup');

  const tabs = [
    { id: 'setup', label: 'Setup' },
    { id: 'user-management', label: 'User Management' },
    { id: 'authentication', label: 'Authentication' },
    { id: 'custom-claims', label: 'Custom Claims' },
    { id: 'multi-factor', label: 'Multi-Factor Auth' },
    { id: 'email-verification', label: 'Email Verification' },
    { id: 'password-reset', label: 'Password Reset' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'setup':
        return (
          <div>
            <h3>Firebase Admin SDK Setup</h3>
            <p>Set up the Firebase Admin SDK to manage authentication from a privileged server environment:</p>
            
            <CodeBlock
              title="Initialize Firebase Admin SDK"
              language="javascript"
              code={`// Initialize the Firebase Admin SDK
const admin = require('firebase-admin');

// Initialize with service account
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com'
});

// Get auth service
const auth = admin.auth();

console.log('Firebase Admin SDK initialized successfully');`}
            />
            
            <CodeBlock
              title="Initialize with Environment Variables"
              language="javascript"
              code={`// Initialize using environment variables (recommended for production)
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\\\n/g, '\\n')
  }),
  databaseURL: \`https://\${process.env.FIREBASE_PROJECT_ID}.firebaseio.com\`
});

const auth = admin.auth();`}
            />
            
            <CodeBlock
              title="Initialize in Different Environments"
              language="javascript"
              code={`// Initialize differently based on environment
const admin = require('firebase-admin');

let serviceAccount;

if (process.env.NODE_ENV === 'production') {
  // Use environment variables in production
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\\\n/g, '\\n')
  };
} else {
  // Use service account file in development
  serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();`}
            />
          </div>
        );
        
      case 'user-management':
        return (
          <div>
            <h3>User Management</h3>
            <p>Manage Firebase Authentication users programmatically with the Admin SDK:</p>
            
            <CodeBlock
              title="Create a New User"
              language="javascript"
              code={`const admin = require('firebase-admin');
const auth = admin.auth();

// Create a new user
async function createUser(email, password, displayName) {
  try {
    const userRecord = await auth.createUser({
      email: email,
      emailVerified: false,
      password: password,
      displayName: displayName,
      disabled: false
    });
    
    console.log('Successfully created new user:', userRecord.uid);
    return userRecord;
  } catch (error) {
    console.log('Error creating new user:', error);
    throw error;
  }
}

// Usage
createUser('user@example.com', 'password123', 'John Doe')
  .then(userRecord => console.log('User created:', userRecord.uid))
  .catch(error => console.error('Error:', error));`}
            />
            
            <CodeBlock
              title="Get User by UID"
              language="javascript"
              code={`// Get user by UID
async function getUserById(uid) {
  try {
    const userRecord = await auth.getUser(uid);
    console.log('Successfully fetched user data:', userRecord.toJSON());
    return userRecord;
  } catch (error) {
    console.log('Error fetching user data:', error);
    throw error;
  }
}

// Usage
getUserById('some-user-uid')
  .then(userRecord => console.log('User:', userRecord.email))
  .catch(error => console.error('Error:', error));`}
            />
            
            <CodeBlock
              title="Get User by Email"
              language="javascript"
              code={`// Get user by email
async function getUserByEmail(email) {
  try {
    const userRecord = await auth.getUserByEmail(email);
    console.log('Successfully fetched user data:', userRecord.toJSON());
    return userRecord;
  } catch (error) {
    console.log('Error fetching user data:', error);
    throw error;
  }
}

// Usage
getUserByEmail('user@example.com')
  .then(userRecord => console.log('User:', userRecord.uid))
  .catch(error => console.error('Error:', error));`}
            />
            
            <CodeBlock
              title="Update User"
              language="javascript"
              code={`// Update user properties
async function updateUser(uid, updates) {
  try {
    const userRecord = await auth.updateUser(uid, updates);
    console.log('Successfully updated user:', userRecord.toJSON());
    return userRecord;
  } catch (error) {
    console.log('Error updating user:', error);
    throw error;
  }
}

// Usage
updateUser('some-user-uid', {
  displayName: 'Jane Doe',
  email: 'janedoe@example.com',
  emailVerified: true
})
  .then(userRecord => console.log('Updated user:', userRecord.displayName))
  .catch(error => console.error('Error:', error));`}
            />
            
            <CodeBlock
              title="Delete User"
              language="javascript"
              code={`// Delete a user
async function deleteUser(uid) {
  try {
    await auth.deleteUser(uid);
    console.log('Successfully deleted user');
    return true;
  } catch (error) {
    console.log('Error deleting user:', error);
    throw error;
  }
}

// Usage
deleteUser('some-user-uid')
  .then(() => console.log('User deleted successfully'))
  .catch(error => console.error('Error:', error));`}
            />
            
            <CodeBlock
              title="List All Users"
              language="javascript"
              code={`// List all users (with pagination)
async function listAllUsers(nextPageToken) {
  try {
    // List batch of users, 1000 at a time
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    listUsersResult.users.forEach((userRecord) => {
      console.log('user:', userRecord.toJSON());
    });
    
    if (listUsersResult.pageToken) {
      // List next batch of users
      await listAllUsers(listUsersResult.pageToken);
    }
    
    return listUsersResult.users;
  } catch (error) {
    console.log('Error listing users:', error);
    throw error;
  }
}

// Usage
listAllUsers()
  .then(users => console.log(\`Listed \${users.length} users\`))
  .catch(error => console.error('Error:', error));`}
            />
          </div>
        );
        
      case 'authentication':
        return (
          <div>
            <h3>Authentication</h3>
            <p>Handle authentication flows and verify ID tokens:</p>
            
            <CodeBlock
              title="Verify ID Token"
              language="javascript"
              code={`const admin = require('firebase-admin');
const auth = admin.auth();

// Verify ID token from client
async function verifyIdToken(idToken) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log('Token is valid. UID:', uid);
    return decodedToken;
  } catch (error) {
    console.log('Error verifying token:', error);
    throw error;
  }
}

// Express middleware example
function authenticateToken(req, res, next) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  
  if (!idToken) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      next();
    })
    .catch(error => {
      res.status(403).json({ error: 'Invalid token' });
    });
}

// Usage in Express
const express = require('express');
const app = express();

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});`}
            />
            
            <CodeBlock
              title="Create Custom Token"
              language="javascript"
              code={`// Create custom token for client-side authentication
async function createCustomToken(uid, additionalClaims = {}) {
  try {
    const customToken = await auth.createCustomToken(uid, additionalClaims);
    console.log('Successfully created custom token:', customToken);
    return customToken;
  } catch (error) {
    console.log('Error creating custom token:', error);
    throw error;
  }
}

// Usage
createCustomToken('some-user-uid', { premium: true })
  .then(customToken => {
    // Send this token to the client
    res.json({ token: customToken });
  })
  .catch(error => console.error('Error:', error));`}
            />
            
            <CodeBlock
              title="Revoke Refresh Tokens"
              language="javascript"
              code={`// Revoke all refresh tokens for a user
async function revokeRefreshTokens(uid) {
  try {
    await auth.revokeRefreshTokens(uid);
    console.log('Successfully revoked refresh tokens');
    return true;
  } catch (error) {
    console.log('Error revoking refresh tokens:', error);
    throw error;
  }
}

// Usage
revokeRefreshTokens('some-user-uid')
  .then(() => console.log('Tokens revoked'))
  .catch(error => console.error('Error:', error));`}
            />
          </div>
        );
        
      case 'custom-claims':
        return (
          <div>
            <h3>Custom Claims</h3>
            <p>Set and manage custom claims to implement role-based access control:</p>
            
            <CodeBlock
              title="Set Custom Claims"
              language="javascript"
              code={`// Set custom claims for a user
async function setCustomClaims(uid, claims) {
  try {
    await auth.setCustomUserClaims(uid, claims);
    console.log('Successfully set custom claims');
    
    // Get updated user record to verify
    const userRecord = await auth.getUser(uid);
    console.log('Custom claims:', userRecord.customClaims);
    return userRecord;
  } catch (error) {
    console.log('Error setting custom claims:', error);
    throw error;
  }
}

// Usage - Set admin role
setCustomClaims('some-user-uid', { admin: true })
  .then(userRecord => console.log('Admin claims set'))
  .catch(error => console.error('Error:', error));

// Usage - Set multiple roles
setCustomClaims('another-user-uid', { 
  roles: ['editor', 'moderator'],
  subscription: 'premium'
})
  .then(userRecord => console.log('Multiple claims set'))
  .catch(error => console.error('Error:', error));`}
            />
            
            <CodeBlock
              title="Check Custom Claims in Middleware"
              language="javascript"
              code={`// Middleware to check custom claims
function requireRole(role) {
  return (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    
    if (!idToken) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    auth.verifyIdToken(idToken)
      .then(decodedToken => {
        // Check if user has required role
        if (decodedToken[role] === true || 
            (decodedToken.roles && decodedToken.roles.includes(role))) {
          req.user = decodedToken;
          next();
        } else {
          res.status(403).json({ error: 'Insufficient permissions' });
        }
      })
      .catch(error => {
        res.status(403).json({ error: 'Invalid token' });
      });
  };
}

// Usage in Express
const app = express();

// Admin-only route
app.get('/admin', requireRole('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Editor or admin route
app.get('/content', requireRole('editor'), (req, res) => {
  res.json({ message: 'Editor access granted' });
});`}
            />
          </div>
        );
        
      case 'multi-factor':
        return (
          <div>
            <h3>Multi-Factor Authentication</h3>
            <p>Implement multi-factor authentication (MFA) for enhanced security:</p>
            
            <CodeBlock
              title="Create User with MFA"
              language="javascript"
              code={`// Create a new user with multi-factor authentication
async function createUserWithMFA(email, password, phoneNumbers) {
  try {
    const enrolledFactors = phoneNumbers.map((phone, index) => ({
      phoneNumber: phone,
      displayName: \`Phone \${index + 1}\`,
      factorId: 'phone'
    }));
    
    const userRecord = await auth.createUser({
      email: email,
      emailVerified: true, // Required for MFA users
      password: password,
      multiFactor: {
        enrolledFactors: enrolledFactors
      }
    });
    
    console.log('Successfully created user with MFA:', userRecord.uid);
    console.log('Enrolled factors:', userRecord.multiFactor.enrolledFactors);
    return userRecord;
  } catch (error) {
    console.log('Error creating user with MFA:', error);
    throw error;
  }
}

// Usage
createUserWithMFA(
  'secure@example.com',
  'strongPassword123',
  ['+16505550001', '+16505550002']
)
  .then(userRecord => console.log('MFA user created'))
  .catch(error => console.error('Error:', error));`}
            />
            
            <CodeBlock
              title="List Users with MFA Status"
              language="javascript"
              code={`// List users and check their MFA status
async function listUsersWithMFAStatus() {
  try {
    const listUsersResult = await auth.listUsers(1000);
    
    const usersWithMFA = listUsersResult.users.filter(user => 
      user.multiFactor && user.multiFactor.enrolledFactors.length > 0
    );
    
    console.log('Users with MFA:', usersWithMFA.length);
    
    usersWithMFA.forEach(user => {
      console.log(\`User \${user.email} has \${user.multiFactor.enrolledFactors.length} factors:\`);
      user.multiFactor.enrolledFactors.forEach(factor => {
        console.log(\`  - \${factor.displayName}: \${factor.phoneNumber}\`);
      });
    });
    
    return usersWithMFA;
  } catch (error) {
    console.log('Error listing users:', error);
    throw error;
  }
}

// Usage
listUsersWithMFAStatus()
  .then(users => console.log(\`Found \${users.length} users with MFA\`))
  .catch(error => console.error('Error:', error));`}
            />
          </div>
        );
        
      case 'email-verification':
        return (
          <div>
            <h3>Email Verification</h3>
            <p>Manage email verification for users:</p>
            
            <CodeBlock
              title="Generate Email Verification Link"
              language="javascript"
              code={`// Generate email verification link
async function generateEmailVerificationLink(email) {
  try {
    const link = await auth.generateEmailVerificationLink(email, {
      url: 'https://your-app.com/verify-email', // Continue URL after verification
      handleCodeInApp: false
    });
    
    console.log('Email verification link generated:', link);
    return link;
  } catch (error) {
    console.log('Error generating email verification link:', error);
    throw error;
  }
}

// Usage
generateEmailVerificationLink('user@example.com')
  .then(link => {
    // Send this link to the user via email
    console.log('Send this link to user:', link);
  })
  .catch(error => console.error('Error:', error));`}
            />
            
            <CodeBlock
              title="Verify Email Without Link"
              language="javascript"
              code={`// Verify user email without sending verification link
async function verifyUserEmail(uid) {
  try {
    await auth.updateUser(uid, {
      emailVerified: true
    });
    
    console.log('Email verified successfully');
    return true;
  } catch (error) {
    console.log('Error verifying email:', error);
    throw error;
  }
}

// Usage
verifyUserEmail('some-user-uid')
  .then(() => console.log('Email verified'))
  .catch(error => console.error('Error:', error));`}
            />
          </div>
        );
        
      case 'password-reset':
        return (
          <div>
            <h3>Password Reset</h3>
            <p>Handle password reset functionality:</p>
            
            <CodeBlock
              title="Generate Password Reset Link"
              language="javascript"
              code={`// Generate password reset link
async function generatePasswordResetLink(email) {
  try {
    const link = await auth.generatePasswordResetLink(email, {
      url: 'https://your-app.com/reset-password', // Continue URL after reset
      handleCodeInApp: false
    });
    
    console.log('Password reset link generated:', link);
    return link;
  } catch (error) {
    console.log('Error generating password reset link:', error);
    throw error;
  }
}

// Usage
generatePasswordResetLink('user@example.com')
  .then(link => {
    // Send this link to the user via email
    console.log('Send this link to user:', link);
  })
  .catch(error => console.error('Error:', error));`}
            />
            
            <CodeBlock
              title="Update User Password"
              language="javascript"
              code={`// Update user password (admin override)
async function updateUserPassword(uid, newPassword) {
  try {
    await auth.updateUser(uid, {
      password: newPassword
    });
    
    console.log('Password updated successfully');
    return true;
  } catch (error) {
    console.log('Error updating password:', error);
    throw error;
  }
}

// Usage
updateUserPassword('some-user-uid', 'newSecurePassword123')
  .then(() => console.log('Password updated'))
  .catch(error => console.error('Error:', error));`}
            />
          </div>
        );
        
      default:
        return <div>Select a tab to view examples</div>;
    }
  };

  return (
    <div className="examples-container">
      <h2>Firebase Authentication Examples</h2>
      <p>
        Firebase Authentication provides backend services, easy-to-use SDKs, and ready-made UI libraries 
        to authenticate users to your app. It supports authentication using passwords, phone numbers, 
        popular federated identity providers like Google, Facebook and Twitter, and more.
      </p>
      
      <NavigationTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="tab-content">
        {renderContent()}
      </div>
      
      <div className="additional-resources">
        <h3>Additional Resources</h3>
        <ul>
          <li><a href="https://firebase.google.com/docs/auth/admin" target="_blank" rel="noopener noreferrer">Firebase Admin SDK Documentation</a></li>
          <li><a href="https://firebase.google.com/docs/auth" target="_blank" rel="noopener noreferrer">Firebase Authentication Documentation</a></li>
          <li><a href="https://github.com/firebase/firebase-admin-node" target="_blank" rel="noopener noreferrer">Firebase Admin Node.js SDK</a></li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseAuthExamples;