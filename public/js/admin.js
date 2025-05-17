// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Initialize popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function(popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
  
  // Add event listener for alert close
  document.querySelectorAll('.alert .btn-close').forEach(button => {
    button.addEventListener('click', function() {
      this.closest('.alert').classList.add('d-none');
    });
  });
  
  // Toggle sidebar
  const sidebarToggle = document.getElementById('sidebarToggleTop');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      document.getElementById('sidebar').classList.toggle('active');
      document.getElementById('content').classList.toggle('active');
    });
  }
  
  // Confirm delete actions
  document.querySelectorAll('[data-confirm]').forEach(button => {
    button.addEventListener('click', function(e) {
      if (!confirm(this.getAttribute('data-confirm'))) {
        e.preventDefault();
        return false;
      }
    });
  });
  
  // File input preview
  document.querySelectorAll('.custom-file-input').forEach(input => {
    input.addEventListener('change', function() {
      const fileName = this.files[0].name;
      const nextSibling = this.nextElementSibling;
      nextSibling.innerText = fileName;
      
      // Image preview
      if (this.dataset.preview) {
        const preview = document.getElementById(this.dataset.preview);
        if (preview) {
          const reader = new FileReader();
          reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
          };
          reader.readAsDataURL(this.files[0]);
        }
      }
    });
  });
  
  // Custom date formatting
  document.querySelectorAll('.format-date').forEach(element => {
    const date = new Date(element.innerText);
    if (!isNaN(date)) {
      element.innerText = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  });
}); 