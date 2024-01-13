(function () {
    
    const separation = 5; 
    let iframe;
    let iframeContainer;
    let originalContent;
    let flexContainer;
    let handle;
    let isDragging = false;
    let startX = 0;
    let startOffset = 0;
    let mask;

    function injectIFrame() {

        chrome.storage.local.get('isExtensionOn', (data) => {
            if (data.isExtensionOn) {
                return;
            }
        });

        if (!document.body.hasChildNodes()) {
            document.body.innerHTML = '';
        }

        flexContainer = document.createElement('div');
        flexContainer.id = 'myExtensionFlexContainer';
        flexContainer.style.display = 'flex';
        flexContainer.style.width = '100vw';
        flexContainer.style.height = '100vh';

        originalContent = document.createElement('div');
        originalContent.id = 'myExtensionOriginalContent';
        originalContent.style.position = 'sticky';
        originalContent.style.top = '0';
        originalContent.style.left = '0';
        originalContent.style.height = `calc(100vh - ${separation}px)`;
        originalContent.style.overflow = 'auto';
        originalContent.style.border = '2px solid #555';
        originalContent.style.marginRight = `${separation}px`;
        originalContent.style.marginBottom = `${separation}px`;

        while (document.body.firstChild) {
            originalContent.appendChild(document.body.firstChild);
        }

        flexContainer.appendChild(originalContent);

        iframeContainer = document.createElement('div');
        iframeContainer.id = 'myExtensionIframeContainer';
        iframeContainer.style.height = `calc(100vh - ${separation}px)`;
        iframeContainer.style.overflow = 'hidden';
        iframeContainer.style.position = 'fixed';
        iframeContainer.style.top = '0';
        iframeContainer.style.right = '0';
        iframeContainer.style.zIndex = '99999999';
        iframeContainer.style.border = '1px solid #555';
        iframeContainer.style.marginLeft = `${separation}px`;
        iframeContainer.style.marginBottom = `${separation}px`;

        iframe = document.createElement('iframe');
        iframe.id = 'myExtensionIframe';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.src = chrome.runtime.getURL('main.html');
        iframe.style.border = 'none';

        iframeContainer.appendChild(iframe);
        flexContainer.appendChild(iframeContainer);
        document.body.appendChild(flexContainer);

        handle = document.createElement('div');
        handle.id = 'myExtensionHandle';
        handle.style.width = '5px';
        handle.style.height = `calc(100vh - ${separation}px)`;
        handle.style.position = 'fixed';
        handle.style.top = '0';
        handle.style.left = `calc(50% - ${separation / 2 + 2.5}px)`;
        handle.style.zIndex = '100000000';
        handle.style.backgroundColor = '#333';
        handle.style.cursor = 'col-resize';
        handle.style.border = '1px solid #555';
        handle.style.marginBottom = `${separation}px`;

        document.body.appendChild(handle);

        handle.addEventListener('mousedown', handleMouseDown, false);
        document.addEventListener('mousemove', drag, false);
        document.addEventListener('mouseup', handleMouseUp, false);

        // Add event listener for window resize
        window.addEventListener('resize', handleWindowResize, false);

        setSplit(window.innerWidth * .75);

        // Add hover effect
        handle.addEventListener('mouseover', function () {
            handle.style.backgroundColor = 'limegreen';
        });

        // Remove hover effect
        handle.addEventListener('mouseout', function () {
            handle.style.backgroundColor = 'darkgreen';
        });

    }

    function handleMouseDown(e) {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
        startOffset = handle.offsetLeft;
        handle.style.backgroundColor = 'darkgreen'; // darken color during drag

        // Add a mask to prevent iframe from capturing mouse events during dragging
        mask = document.createElement('div');
        mask.style.position = 'fixed';
        mask.style.top = '0';
        mask.style.right = '0';
        mask.style.width = iframeContainer.style.width;
        mask.style.height = '100vh';
        mask.style.zIndex = '999999999';
        document.body.appendChild(mask);
    }

    function drag(e) {
        e.preventDefault();
        if (isDragging) {
            const dragOffset = e.clientX - startX;
            const newOffset = startOffset + dragOffset;
            const maxWidth = window.innerWidth - handle.offsetWidth;

            if (newOffset >= 0 && newOffset <= maxWidth) {
                const handleWidth = handle.offsetWidth;

                handle.style.left = newOffset + 'px';
                originalContent.style.width = newOffset + handleWidth / 2 + 'px';
                iframeContainer.style.width = maxWidth - newOffset - handleWidth / 2 + 'px';

                if (mask) {
                    mask.style.width = iframeContainer.style.width;
                }
            }
        }
    }

    function handleMouseUp() {
        isDragging = false;
        handle.style.backgroundColor = '#333'; // revert to original color after drag

        // Recalculate the position of handle and iframeContainer
        const handleWidth = handle.offsetWidth;
        const handleLeft = parseInt(handle.style.left);
        const maxWidth = window.innerWidth - handle.offsetWidth;

        handle.style.left = handleLeft + 'px';
        originalContent.style.width = handleLeft + handleWidth / 2 + 'px';
        iframeContainer.style.width = maxWidth - handleLeft - handleWidth / 2 + 'px';

        if (mask) {
            mask.remove();
            mask = null;
        }
    }

    function handleWindowResize() {
        // Calculate the new split position based on the window width
        const newSplit = window.innerWidth * .75;
        setSplit(newSplit);
    }

    function setSplit(splitPosition) {
        const handleWidth = handle.offsetWidth;
        const maxWidth = window.innerWidth - handleWidth;

        const newOffset = splitPosition - handleWidth / 2;
        const newLeft = splitPosition - handleWidth;

        handle.style.left = newLeft + 'px';
        originalContent.style.width = newOffset + 'px';
        iframeContainer.style.width = maxWidth - newOffset + 'px';
        if (mask) {
            mask.style.width = iframeContainer.style.width;
        }

        // Adjust the font size of the original content to fit within its container
        const scaleFactor = originalContent.offsetWidth / originalContent.scrollWidth;
        originalContent.style.transform = `scale(${scaleFactor})`;
        originalContent.style.transformOrigin = 'top left';
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
