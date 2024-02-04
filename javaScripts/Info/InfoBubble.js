let infoIframe;
let infoIcons = document.querySelectorAll('.info-icon');
let iconText ;
let infoText;
let currentIcon;
const infoDictionary = {
    'Custom LLM': 'This is the information for Custom LLM.',
    'Local LLM': 'This is the information for Local LLM.',
    'Remote LLM': 'This is the information for Remote LLM.',
    // Add more entries as needed for other info
};

function showInfoBubble() {
    if (infoIframe) {
        infoIframe.remove();
    }

    infoIframe = document.createElement('iframe');
    infoIframe.className = 'info-bubble-iframe';
    infoIframe.setAttribute('src', 'InfoBubble.html');

    infoIframe.onload = () => {
        const infoDocument = infoIframe.contentDocument;
        if (infoDocument) {
            const infoContent = infoDocument.querySelector('.info-content');
            if (infoContent) {
                infoText = infoDictionary[iconText];
                if (infoText) {
                    infoContent.innerHTML = infoText;

                    // Adjust iframe size based on content
                    setTimeout(() => {
                        const body = infoDocument.body;
                        const html = infoDocument.documentElement;
                        const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
                        const width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
                        infoIframe.style.height = `${height}px`;
                        infoIframe.style.width = `${width}px`;
                    }, 0);
                }
            }
        }
    };



    const infoIconRect = currentIcon.getBoundingClientRect();
    infoIframe.style.position = 'absolute';
    infoIframe.style.top = `${infoIconRect.bottom}px`;
    infoIframe.style.left = `${infoIconRect.left}px`;

    document.body.appendChild(infoIframe);
}

infoIcons.forEach((infoIcon) => {
    infoIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        // Clone the parent element
        let parentClone = infoIcon.parentElement.cloneNode(true);
        // Remove the <i> element from the clone
        let iconElement = parentClone.querySelector('i');
        if (iconElement) {
            parentClone.removeChild(iconElement);
        }
        // Get the text content of the clone, which excludes the icon's text
        iconText = parentClone.textContent.trim();
        infoText = infoDictionary[iconText];
        currentIcon = infoIcon;
        showInfoBubble();
    });
});


document.addEventListener('click', (event) => {
    if (infoIframe && (!infoIframe.contains(event.target) && !event.target.classList.contains('info-icon'))) {
        infoIframe.remove();
        iconText=null;
        infoText=null;
        currentIcon =null;
    }
});
