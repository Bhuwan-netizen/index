document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector(".sidebar-toggle");
    const menuLinks = document.querySelectorAll('.menu-link');
    const contentSections = document.querySelectorAll('.content-section');
    const contactBtn = document.getElementById("contactDeveloper");

    // 1. Sidebar Collapse Functionality (Desktop View Only)
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }

    // 2. Clear Active States and Sections
    function switchSection(targetId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    // 3. Navigation Click Handler
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update Navigation Menu Styles
            menuLinks.forEach(item => item.classList.remove('active-link'));
            link.classList.add('active-link');
            
            // Switch Actual Content Views
            const targetId = link.dataset.target;
            switchSection(targetId);
        });
    });

    // 4. Contact Modal/Alert Dialog
    if (contactBtn) {
        contactBtn.addEventListener("click", () => {
            alert(
                "Developer: Bhuwan Sangroula\n" +
                "Email: bhuwansangroula588@email.com\n" +
                "Phone: +977-9815910188"
            );
        });
    }
});