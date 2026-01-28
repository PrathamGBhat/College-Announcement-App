// Fetch emails from backend and display them
async function loadEmails() {
  const container = document.getElementById('emails-container');
  
  try {
    // Show loading message
    container.innerHTML = '<div class="container"><h2>Loading emails...</h2></div>';
    
    // Fetch emails from backend
    const response = await fetch('http://localhost:3000/callback');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const emails = await response.json();
    
    // Clear loading message
    container.innerHTML = '';
    
    // Check if there are any emails
    if (Object.keys(emails).length === 0) {
      container.innerHTML = '<div class="container"><h2>No emails found</h2></div>';
      return;
    }
    
    // Create a card for each email
    for (const [subject, link] of Object.entries(emails)) {
      const card = document.createElement('div');
      card.className = 'container';
      card.innerHTML = `<h2><a href="${link}" target="_blank">${subject}</a></h2>`;
      container.appendChild(card);
    }
    
  } catch (error) {
    console.error('Error fetching emails:', error);
    container.innerHTML = `
      <div class="container">
        <h2>Error loading emails</h2>
        <p class="meta">${error.message}</p>
      </div>
    `;
  }
}

// Load emails when page loads
loadEmails();
