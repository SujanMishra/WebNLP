document.addEventListener('DOMContentLoaded', function () {

    // Setup and start the MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {

            if (mutation.type === 'childList') {
                // Apply necessary styles or DOM manipulations here
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true 
    });

// Reference to the tab buttons
    const tabLinks = document.querySelectorAll('.tabLink');

// Function to open a specific tab and set tab content height
    function openTab(event, tabName) {
        // Reference to the tab content elements
        const tabContents = document.querySelectorAll('.tabContent');

        // Hide all tab contents
        tabContents.forEach((tabContent) => {
            tabContent.style.display = 'none';
        });

        // Remove the 'active' class from all tab buttons
        tabLinks.forEach((button) => {
            button.classList.remove('active');
        });

        // Show the selected tab content
        document.getElementById(tabName).style.display = 'block';

        // Add the 'active' class to the clicked tab button
        event.currentTarget.classList.add('active');

        // Calculate and set the height of .tabContent
        const tabsHeight = document.querySelector('.tabs').offsetHeight;
        const bodyHeight = document.body.clientHeight;
        const tabContentHeight = bodyHeight - tabsHeight;

        tabContents.forEach((tabContent) => {
            tabContent.style.height = `${tabContentHeight}px`;
        });
    }

// Function to open the default tab and set tab content height

    function openDefaultTab() {
        // Get the first tab name
        const defaultTabName = tabLinks[0].dataset.tab;

        //  delay the opening of the default tab slightly to ensure styles are applied
        setTimeout(() => {
           
            openTab({currentTarget: tabLinks[0]}, defaultTabName);

        }, 10); // A minimal timeout can ensure DOM is fully ready and styles are applied smoothly
    }


// Attach click event listener to the parent container of tab buttons
    document.querySelector('.tabs').addEventListener('click', (event) => {
        const button = event.target.closest('.tabLink');
        if (button) {
            const tabName = button.dataset.tab;
            openTab(event, tabName);
        }
    });
   
// Open the default tab
    openDefaultTab();
});