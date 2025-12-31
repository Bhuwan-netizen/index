
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector(".sidebar-toggle");
    

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });
});


// Select all sidebar links and content sections
const menuLinks = document.querySelectorAll('.menu-link');
const contentSections = document.querySelectorAll('.content-section');

// Function to hide all content sections
function hideAllSections() {
    contentSections.forEach(section => section.classList.remove('active'));
}

// Add click event to each link
menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        const targetId = link.dataset.target; // use data-target from HTML
        const targetSection = document.getElementById(targetId);
        if(targetSection) {
            targetSection.classList.add('active');
        }
    });
});

const contactBtn = document.getElementById("contactDeveloper");

contactBtn.addEventListener("click", () => {
    alert("Developer: Bhuwan Sangroula\n Email: bhuwansangroula588@email.com\n Phone: +977- 9815910188");
});
