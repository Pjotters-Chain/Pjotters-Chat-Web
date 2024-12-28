// Auth check voor beveiligde pagina's
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if (!user && !window.location.pathname.includes('login.html')) {
            window.location.href = '../pages/login.html';
        }
    });
}); 
