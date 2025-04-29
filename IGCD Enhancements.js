// ==UserScript==
// @name         IGCD Enhancements
// @version      1.0
// @author       Klumb3r
// @description  Shows logo, and several links are now clickable
// @match        *://*.igcd.net/vehicle.php?id=*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove accents and specific characters from a string
    const removeAccents = (text) => text.normalize('NFD').replace(/[\u0300-\u036fĐđĆć]/g, (match) => ({ 'Đ': 'D', 'đ': 'd', 'Ć': 'C', 'ć': 'c' }[match] || ''));

    // Function to normalize text for search URLs (remove accents and replace spaces with hyphens)
    const normalizeForSearch = (text) => removeAccents(text).replace(/\s+/g, '-');

    // Asynchronous function to check if an image URL exists by making a HEAD request
    const checkImage = async (make) => {
        const logoBaseUrl = window.location.protocol + '//' + window.location.hostname;
        const makeWithHyphen = make.replace('/', '-'); // Replace slash with hyphen for logo search

        const tryUrls = [
            `${logoBaseUrl}/logos/${encodeURIComponent(make)}.png`, // Try the make name as is in the URL
            `${logoBaseUrl}/logos/${encodeURIComponent(removeAccents(make))}.png`, // Try the make name without accents in the URL
            `${logoBaseUrl}/logos/${encodeURIComponent(makeWithHyphen)}.png`, // Try with hyphen
            `${logoBaseUrl}/logos/${encodeURIComponent(removeAccents(makeWithHyphen))}.png` // Try with hyphen and without accents
        ];
        for (const url of tryUrls) {
            const exists = await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'HEAD',
                    url: url,
                    onload: (response) => resolve(response.status === 200),
                    onerror: () => resolve(false)
                });
            });
            if (exists) return url;
        }
        return null;
    };

    // Function to create a simple styled link element
    const createStyledLink = (text, url) => {
        const linkElement = document.createElement('a');
        linkElement.href = url;
        linkElement.textContent = text;
        Object.assign(linkElement.style, {
            color: 'inherit',
            fontSize: '1em',
            fontWeight: 'normal',
            textDecoration: 'none'
        });
        return linkElement;
    };

    // Function to create a link element for titles with hover underline effect
    const createTitleLink = (text, url) => {
        const linkElement = document.createElement('a');
        linkElement.href = url;
        linkElement.textContent = text;
        Object.assign(linkElement.style, {
            color: 'inherit',
            fontSize: '1em',
            fontWeight: 'normal',
            textDecoration: 'none' // No default underline
        });
        linkElement.addEventListener('mouseover', () => linkElement.style.textDecoration = 'underline');
        linkElement.addEventListener('mouseout', () => linkElement.style.textDecoration = 'none');
        return linkElement;
    };

    // Asynchronous function to process the vehicle title, find the make logo, and create links
    const processVehicleTitle = async () => {
        const targetH1 = document.querySelector('h1');
        if (targetH1) {
            const originalText = targetH1.textContent.trim();
            const yearMatch = originalText.match(/^(\d{4})\s+(.*)/);
            const year = yearMatch ? yearMatch[1] : '';
            const makeAndModel = yearMatch ? yearMatch[2] : originalText;
            const words = makeAndModel.split(' ');

            let foundMake = '';
            let foundModel = '';
            let makeLogoUrl = '';

            // Iterate backwards through the words to find the longest matching make
            for (let i = words.length; i > 0; i--) {
                const candidate = words.slice(0, i).join(' ');
                const logoUrl = await checkImage(candidate);
                if (logoUrl) {
                    foundMake = candidate;
                    makeLogoUrl = logoUrl;
                    foundModel = words.slice(i).join(' ');
                    break;
                }
            }

            // Create a container for the logo and the title text
            const container = document.createElement('div');
            Object.assign(container.style, {
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            });

            // If a logo URL is found, create an image link
            if (makeLogoUrl) {
                const logoLink = document.createElement('a');
                const logoSearchMake = foundMake.replace('/', '-'); // Replace slash only for logo search
                logoLink.href = `https://igcd.net/search.php?title=${normalizeForSearch(foundMake)}&type=vehicules`;
                const logoImg = document.createElement('img');
                Object.assign(logoImg.style, {
                    width: '100px',
                    height: '80px',
                    objectFit: 'contain'
                });
                logoImg.src = makeLogoUrl;
                logoLink.appendChild(logoImg);
                container.appendChild(logoLink);
            }

            // Create a container for the title text (year, make, model)
            const textContainer = document.createElement('div');
            Object.assign(textContainer.style, {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                lineHeight: '1.2'
            });

            // Add the year if it exists
            if (year) {
                const yearDiv = document.createElement('div');
                Object.assign(yearDiv.style, {
                    fontSize: '0.5em',
                    fontWeight: 'bold'
                });
                yearDiv.textContent = year;
                textContainer.appendChild(yearDiv);
            }

            // Add the make as a clickable link
            textContainer.appendChild(createTitleLink(foundMake, `https://igcd.net/search.php?title=${normalizeForSearch(foundMake)}&type=vehicules`));

            // Function to process the model words and create clickable links
            const processModelWords = (model) => {
                if (!model) return;
                const modelDiv = document.createElement('div');
                const modelWords = model.split(' ');
                let accumulatedModel = '';
                modelWords.forEach((word, index) => {
                    const linkText = accumulatedModel ? `${accumulatedModel} ${word}`.trim() : word;
                    const normalizedAccumulatedModel = normalizeForSearch(linkText);
                    const link = createTitleLink(word, `https://igcd.net/search.php?title=${normalizedAccumulatedModel}&type=vehicules`);
                    modelDiv.appendChild(link);
                    if (index < modelWords.length - 1) {
                        accumulatedModel += `${word} `;
                        const space = document.createTextNode(' ');
                        modelDiv.appendChild(space);
                    } else {
                        accumulatedModel = linkText;
                    }
                });
                textContainer.appendChild(modelDiv);
            };

            // Process and add the model as clickable links
            if (foundModel) {
                processModelWords(foundModel);
            } else if (!foundMake) {
                processModelWords(makeAndModel);
            }

            // Replace the original H1 content with the new structure
            container.appendChild(textContainer);
            targetH1.innerHTML = '';
            targetH1.appendChild(container);
        }
    };

    // Function to make 'Surname', 'Chassis', and 'Extra info' clickable
    const processClickableInfo = () => {
        const searchFields = ['Surname', 'Chassis', 'Extra info'];
        const linkStyleClickableInfo = {
            color: 'inherit',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            textDecoration: 'none',
            cursor: 'pointer'
        };

        const allBolds = document.querySelectorAll('b');

        searchFields.forEach(field => {
            const searchText = field + ':';
            allBolds.forEach(boldElement => {
                if (boldElement.textContent.includes(searchText)) {
                    let nextSibling = boldElement.nextSibling;

                    if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent.trim()) {
                        const targetText = nextSibling.textContent.trim();
                        const parentElement = boldElement.parentNode;
                        let previousSibling = boldElement;
                        let accumulatedWord = '';
                        const words = targetText.split(' ');

                        const spaceNode = document.createTextNode(' ');
                        parentElement.insertBefore(spaceNode, nextSibling);
                        previousSibling = spaceNode;

                        words.forEach((word, index) => {
                            const linkText = accumulatedWord ? `${accumulatedWord} ${word}`.trim() : word;
                            const normalizedLinkText = normalizeForSearch(linkText);
                            const searchUrl = `https://igcd.net/search.php?title=${encodeURIComponent(normalizedLinkText)}&type=vehicules`;
                            const linkElement = document.createElement('a');
                            linkElement.href = searchUrl;
                            linkElement.textContent = word;
                            Object.assign(linkElement.style, linkStyleClickableInfo);

                            parentElement.insertBefore(linkElement, previousSibling.nextSibling);
                            previousSibling = linkElement;

                            if (index < words.length - 1) {
                                accumulatedWord += `${word} `;
                                const spaceNode = document.createTextNode(' ');
                                parentElement.insertBefore(spaceNode, previousSibling.nextSibling);
                                previousSibling = spaceNode;
                            } else {
                                accumulatedWord = linkText;
                            }
                        });

                        if (nextSibling && nextSibling.parentNode) {
                            nextSibling.parentNode.removeChild(nextSibling);
                        }
                    }
                }
            });
        });
    };

    // Execute the functions after the DOM is loaded
    processVehicleTitle().then(processClickableInfo);
})();