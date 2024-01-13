// Reference to the tab buttons
const tabButtons = document.querySelectorAll('.tablink');

// Reference to the tab content elements
const tabContents = document.querySelectorAll('.tabcontent');

// Function to open a specific tab
function openTab(event, tabName) {
    // Hide all tab contents
    tabContents.forEach((tabContent) => {
        tabContent.style.display = 'none';
    });

    // Remove the 'active' class from all tab buttons
    tabButtons.forEach((button) => {
        button.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabName).style.display = 'block';

    // Add the 'active' class to the clicked tab button
    event.currentTarget.classList.add('active');
}

// Function to open the default tab
function openDefaultTab() {
    // Get the first tab name
    const defaultTabName = tabButtons[0].dataset.tab;

    // Show the default tab content
    document.getElementById(defaultTabName).style.display = 'block';

    // Add the 'active' class to the default tab button
    tabButtons[0].classList.add('active');
}

// Attach click event listener to the parent container of tab buttons
document.querySelector('.tabs').addEventListener('click', (event) => {
    const button = event.target.closest('.tablink');
    if (button) {
        const tabName = button.dataset.tab;
        openTab(event, tabName);
    }
});

// Open the default tab
openDefaultTab();