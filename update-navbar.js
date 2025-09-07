const fs = require('fs');

// Read the navbar file
let navbarContent = fs.readFileSync('devconnect-client-new/src/components/Navbar.jsx', 'utf8');

// Add the join requests link for admin users
navbarContent = navbarContent.replace(
  `  const navLinks = user ? [
    { to: '/developers', label: 'Developers' },
    { to: '/projects', label: 'Projects' },
    { to: '/my-projects', label: 'My Projects' },
    { to: '/create-project', label: 'Post Project' },
    { to: '/profile', label: 'Profile' },
  ] : [
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ];`,
  `  const navLinks = user ? [
    { to: '/developers', label: 'Developers' },
    { to: '/projects', label: 'Projects' },
    { to: '/my-projects', label: 'My Projects' },
    { to: '/create-project', label: 'Post Project' },
    { to: '/profile', label: 'Profile' },
    ...(user?.role === 'admin' ? [{ to: '/join-requests', label: 'Join Requests' }] : []),
  ] : [
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ];`
);

// Write the updated content back
fs.writeFileSync('devconnect-client-new/src/components/Navbar.jsx', navbarContent);

console.log('✅ Navbar updated with join requests link for admins');
