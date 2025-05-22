let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing
  e.preventDefault();

  deferredPrompt = e;

  // Create and style the install button
  const installBtn = document.createElement('button');
  installBtn.id = 'installBtn';
  installBtn.textContent = '📲 Install Weather App';
  installBtn.style = `
    margin: 1rem auto;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: block;
  `;

  // Add it below the main content
  document.body.appendChild(installBtn);

  installBtn.addEventListener('click', () => {
    installBtn.disabled = true;
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      } else {
        console.log('❌ User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});
