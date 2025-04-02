document.addEventListener('DOMContentLoaded', () => {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  // Add click handler to each dropdown toggle
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = toggle.parentElement;
      const menu = dropdown.querySelector('.dropdown-menu');
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
        if (openMenu !== menu) {
          openMenu.classList.remove('show');
          openMenu.parentElement.querySelector('.dropdown-toggle').classList.remove('active');
        }
      });
      
      // Toggle current dropdown
      toggle.classList.toggle('active');
      menu.classList.toggle('show');
      
      // Add index to items for staggered animation
      if (menu.classList.contains('show')) {
        menu.querySelectorAll('.dropdown-item').forEach((item, index) => {
          item.style.setProperty('--item-index', index);
        });
      }
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        menu.parentElement.querySelector('.dropdown-toggle').classList.remove('active');
      });
    }
  });
});
