(function () {

    
    let iframe;
    let iframeContainer;
    let originalContent;
    let flexContainer;
    let handle;
    let isDragging = false;
    let startX = 0;
    
    let mask;
    let HandleBackgroundColor = 'rgb(50, 50, 50)';

    function injectIFrame() {
        chrome.storage.local.get('isExtensionOn', (data) => {
            if (data.isExtensionOn) {
                return;
            }
        })

        if (!document.body) {
            document.body = document.createElement('body');
        }

        // we create a flex container to hold everything
        flexContainer = document.createElement('div');
        flexContainer.id = 'myExtensionFlexContainer';
        flexContainer.style.display = 'flex';
        flexContainer.style.width = '100%';
        flexContainer.style.height = '100%';
        
        // we capture original tab content 
        originalContent = document.createElement('div');
        originalContent.id = 'myExtensionOriginalContent';
        originalContent.style.flex = '3';
        originalContent.style.overflow = 'auto';
        originalContent.style.border = '2px solid #555';

        // we load whatever correntyy on tab to originalContent
        while (document.body.firstChild) {
            originalContent.appendChild(document.body.firstChild);
        }

        // we create a container for our side panel
        iframeContainer = document.createElement('div');
        iframeContainer.id = 'myExtensionIframeContainer';
        iframeContainer.style.flex = '1';
        iframeContainer.style.overflow = 'hidden';
        iframeContainer.style.border = '1px solid #555';

        // we will create iframe of our side panel i.e the main page of our extention
        iframe = document.createElement('iframe');
        iframe.id = 'myExtensionIframe';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.src = chrome.runtime.getURL('main.html');
        iframe.style.border = 'none';

        // put it to container , this way if we need other pages in case we can create and add in the container . 
        iframeContainer.appendChild(iframe);

        // now we add a handle that can be used to drag around to resize our split of original and our extention
        handle = document.createElement('div');
        handle.id = 'myExtensionHandle';
        handle.style.width = '3px';
        handle.style.height = '100vh';
        handle.style.backgroundColor = HandleBackgroundColor;
        handle.style.cursor = 'col-resize';
        handle.style.flexShrink = '0';
        handle.style.zIndex = '9999'; // Ensure it's above other elements

        // its important the order of following for handle to come in center of both original and extention 
        flexContainer.appendChild(originalContent);
        flexContainer.appendChild(handle);
        flexContainer.appendChild(iframeContainer);

        // finally we will add all the composition to body of original tab 
        document.body.appendChild(flexContainer);
        
        // Add event listener for window resize
        window.addEventListener('resize', handleWindowResize, false);
        // we only care for mouse event on  handle
        handle.addEventListener('mousedown', handleMouseDown, false);
        // we will fire up regardless of handle or anywhere else
        document.addEventListener('mouseup', handleMouseUp, false);
        // Add hover effect
        handle.addEventListener('mouseover', function () {
            handle.style.backgroundColor = 'rgb(50, 100, 200)';
        });
        // remove upon mouse out hover effect
        handle.addEventListener('mouseout', function() {
            handle.style.backgroundColor = HandleBackgroundColor; // Revert to original color
        });

    }


    function handleMouseDown(e) {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
        handle.style.backgroundColor = 'rgb(50, 150, 50)';
        handle.style.width = '5px';
        // Add a mask to prevent capturing mouse events during dragging
        mask = document.createElement('div');
        mask.style.position = 'fixed';
        mask.style.top = '0';
        mask.style.left = '0';
        mask.style.width = '100vw';
        mask.style.height = '100vh';
        mask.style.zIndex = '999999999';
        document.body.appendChild(mask);
        document.addEventListener('mousemove', drag, false);
    }


    function drag(e) {
        e.preventDefault();
        if (isDragging) {
            const currentX = e.clientX;
            const newWidthOriginal = currentX;
            const newWidthIframe = window.innerWidth - currentX;

            if (newWidthOriginal >= 0 && newWidthIframe >= 0) {
                originalContent.style.flex = '3'; // Maintain the original ratio
                iframeContainer.style.flex = '1'; // Maintain the iframe ratio

                originalContent.style.flexBasis = `${newWidthOriginal}px`;
                iframeContainer.style.flexBasis = `${newWidthIframe}px`;
            }
        }
    }



    function handleMouseUp() {
        isDragging = false;
        handle.style.backgroundColor = HandleBackgroundColor;
        handle.style.width = '3px';
        if (mask) {
            mask.remove();
            mask = null;
        }
        document.removeEventListener('mousemove', drag, false);
    }


    function handleWindowResize() {
        // Calculate the new split position based on the window width
        const newSplit = window.innerWidth * .75;
        setSplit(newSplit);
    }


    function setSplit(splitPosition) {
        // handleWidth accounts for the width of the resizing handle
        const handleWidth = handle.offsetWidth;

        // Calculate the width for originalContent and iframeContainer
        const newWidthOriginal = splitPosition - handleWidth / 2;
        const newWidthIframe = window.innerWidth - newWidthOriginal - handleWidth;

        if (newWidthOriginal >= 0 && newWidthIframe >= 0) {
            // Set the left position of the handle
            handle.style.left = `${newWidthOriginal}px`;

            // Update the widths of the originalContent and iframeContainer
            originalContent.style.width = `${newWidthOriginal}px`;
            iframeContainer.style.width = `${newWidthIframe}px`;

            // Optional: Adjust the scale of the original content
            const scaleFactor = originalContent.offsetWidth / originalContent.scrollWidth;
            originalContent.style.transform = `scale(${scaleFactor})`;
            originalContent.style.transformOrigin = 'top left';
        }
    }

    function removeIFrame() {

        chrome.storage.local.get('isExtensionOn', (data) => {
            if (!data.isExtensionOn) {
                return;
            }
        });


        if (iframeContainer && iframeContainer.parentNode) {
            iframeContainer.parentNode.removeChild(iframeContainer);
        }
        if (handle && handle.parentNode) {
            handle.parentNode.removeChild(handle);
        }
        if (flexContainer && flexContainer.parentNode) {
            flexContainer.parentNode.removeChild(flexContainer);
        }

        // Move all children from originalContent back to body
        while (originalContent && originalContent.firstChild) {
            document.body.appendChild(originalContent.firstChild);
        }

        // Clean up: Remove the originalContent and mask if they exist
        if (originalContent && originalContent.parentNode) {
            originalContent.parentNode.removeChild(originalContent);
        }
        if (mask && mask.parentNode) {
            mask.parentNode.removeChild(mask);
        }

        // Remove event listeners
        window.removeEventListener('resize', handleWindowResize);
        if (handle) {
            handle.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', handleMouseUp);
        }


    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log("Message received:", request);
        if (request.text === 'toggle') {
            chrome.storage.local.get('isExtensionOn', (data) => {
                if (data.isExtensionOn) {
                    removeIFrame();
                } else {
                    injectIFrame();
                }
            });
        }
    });


})();
