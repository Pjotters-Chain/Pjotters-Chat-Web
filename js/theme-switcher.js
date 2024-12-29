document.addEventListener('DOMContentLoaded', () => {
    // Voeg theme switcher button toe
    const button = document.createElement('button');
    button.className = 'theme-switch';
    button.innerHTML = `<img src="../images/logo kopie.png" alt="Theme Switch">`;
    document.body.appendChild(button);

    // Check voor opgeslagen thema
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Theme switch functionaliteit
    button.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}); 
