/**
 * Main JavaScript file for Taekwondo Bogor website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Bootstrap tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize Bootstrap popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function(popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Scroll to top button
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.className = 'btn btn-primary scroll-to-top';
  scrollToTopBtn.style.position = 'fixed';
  scrollToTopBtn.style.bottom = '20px';
  scrollToTopBtn.style.right = '20px';
  scrollToTopBtn.style.display = 'none';
  scrollToTopBtn.style.zIndex = '999';
  scrollToTopBtn.style.width = '40px';
  scrollToTopBtn.style.height = '40px';
  scrollToTopBtn.style.borderRadius = '50%';
  document.body.appendChild(scrollToTopBtn);

  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  });

  // Handle contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Send data to backend
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      })
      .then(response => response.json())
      .then(data => {
        // Show success message
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.role = 'alert';
        alertDiv.textContent = 'Pesan Anda telah dikirim. Kami akan segera menghubungi Anda.';
        
        // Insert alert before form
        contactForm.parentNode.insertBefore(alertDiv, contactForm);
        
        // Reset form
        contactForm.reset();
        
        // Remove alert after 5 seconds
        setTimeout(() => {
          alertDiv.remove();
        }, 5000);
      })
      .catch(error => {
        console.error('Error:', error);
        
        // Show error message
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger';
        alertDiv.role = 'alert';
        alertDiv.textContent = 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi nanti.';
        
        // Insert alert before form
        contactForm.parentNode.insertBefore(alertDiv, contactForm);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
          alertDiv.remove();
        }, 5000);
      });
    });
  }
}); 