// Authentication Guard - Protects pages requiring login
// Import this at the top of admin.html and client-dashboard-v2.html

import { auth } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Configuration
const config = {
  loginPage: '/login.html',
  adminEmails: ['@hkolimo.com'], // Emails containing this get admin access
  corporateEmails: [] // Add specific corporate domains if needed
};

// Check authentication status
export function requireAuth(requiredRole = null) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Not logged in - redirect to login
        console.log('Not authenticated, redirecting to login');
        window.location.href = config.loginPage;
        reject('Not authenticated');
        return;
      }

      // User is logged in
      console.log('User authenticated:', user.email);

      // Check role if specified
      if (requiredRole) {
        const userRole = getUserRole(user.email);
        
        if (requiredRole === 'admin' && userRole !== 'admin') {
          // Admin page but not admin user
          console.log('Admin access required, redirecting');
          window.location.href = '/client-dashboard-v2.html';
          reject('Insufficient permissions');
          return;
        }

        if (requiredRole === 'corporate' && userRole !== 'corporate') {
          // Corporate page but not corporate user
          console.log('Corporate access required, redirecting');
          window.location.href = '/login.html';
          reject('Insufficient permissions');
          return;
        }
      }

      // All checks passed
      resolve(user);
    });
  });
}

// Determine user role from email
function getUserRole(email) {
  if (config.adminEmails.some(domain => email.includes(domain))) {
    return 'admin';
  }
  
  // Default to corporate client
  return 'corporate';
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}

// Logout function
export async function logout() {
  try {
    await auth.signOut();
    window.location.href = config.loginPage;
  } catch (error) {
    console.error('Logout error:', error);
    alert('Failed to logout. Please try again.');
  }
}

// Check if user is admin
export function isAdmin() {
  const user = auth.currentUser;
  if (!user) return false;
  return getUserRole(user.email) === 'admin';
}

// Initialize auth guard for page
export async function initAuthGuard(requiredRole = null) {
  try {
    const user = await requireAuth(requiredRole);
    console.log('Auth guard passed for:', user.email);
    return user;
  } catch (error) {
    console.error('Auth guard failed:', error);
    // Page will redirect, no need to do anything
  }
}

// Display user info in header
export function displayUserInfo(elementId = 'userInfo') {
  const user = auth.currentUser;
  if (!user) return;

  const element = document.getElementById(elementId);
  if (!element) return;

  element.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-weight: 600;">${user.email}</span>
      <button onclick="window.authLogout()" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
        Logout
      </button>
    </div>
  `;
}

// Make logout available globally
window.authLogout = logout;

// Auto-redirect if on login page and already authenticated
if (window.location.pathname === '/login.html') {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const role = getUserRole(user.email);
      if (role === 'admin') {
        window.location.href = '/admin.html';
      } else {
        window.location.href = '/client-dashboard-v2.html';
      }
    }
  });
}

console.log('✅ Auth guard loaded');
