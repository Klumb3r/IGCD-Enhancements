// ==UserScript==
// @name         IGCD Enhancements
// @version      1.2
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
    const checkImage = async (make, countryCode = null) => {
        const logoBaseUrl = window.location.protocol + '//' + window.location.hostname;
        const makeWithHyphen = make.replace('/', '-'); // Replace slash with hyphen for logo search

        const tryUrls = [];

        if (make === 'Puma' && countryCode === 'IT') { // Exception for Puma (Italy)
            tryUrls.push(`${logoBaseUrl}/logos/Pumait.png`);
        }

        tryUrls.push(
            `${logoBaseUrl}/logos/${encodeURIComponent(make)}.png`, // Try the make name as is in the URL
            `${logoBaseUrl}/logos/${encodeURIComponent(removeAccents(make))}.png`, // Try the make name without accents in the URL
            `${logoBaseUrl}/logos/${encodeURIComponent(makeWithHyphen)}.png`, // Try with hyphen
            `${logoBaseUrl}/logos/${encodeURIComponent(removeAccents(makeWithHyphen))}.png` // Try with hyphen and without accents
        );

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
        const targetH5 = document.querySelector('h5');
        if (targetH5) {
            const originalText = targetH5.textContent.trim();
            const yearMatch = originalText.match(/^(\d{4})\s+(.*)/);
            const year = yearMatch ? yearMatch[1] : '';
            const makeAndModel = yearMatch ? yearMatch[2] : originalText;
            const words = makeAndModel.split(' ');

            let foundMake = '';
            let foundModel = '';
            let makeLogoUrl = '';
            let originCountryCode = null;

            // Function to extract the origin country code
            const originBoldElement = Array.from(document.querySelectorAll('b')).find(b => b.textContent.includes('Origin:'));
            if (originBoldElement && originBoldElement.parentNode) {
                const flagImage = originBoldElement.parentNode.querySelector('img');
                if (flagImage && flagImage.src) {
                    const codeMatch = flagImage.src.match(/drapeaux\/([A-Z]+)\.png/);
                    originCountryCode = codeMatch ? codeMatch[1] : null;
                }
            }

            // Iterate backwards through the words to find the longest matching make
            for (let i = words.length; i > 0; i--) {
                const candidate = words.slice(0, i).join(' ');
                const logoUrl = await checkImage(candidate, originCountryCode);
                if (logoUrl) {
                    foundMake = candidate;
                    makeLogoUrl = logoUrl;
                    foundModel = words.slice(i).join(' ');
                    break;
                } else if (candidate === 'A:Level') { // Exception for A:Level
                    foundMake = candidate;
                    makeLogoUrl = '';
                    foundModel = words.slice(i).join(' ');
                    break;
                } else if (candidate === 'Puma') { // Exception for Puma (Italy)
                    foundMake = candidate;
                    makeLogoUrl = await checkImage(candidate, originCountryCode);
                    if (!makeLogoUrl) {
                        makeLogoUrl = ''; // Fallback if specific Puma (Italy) logo isn't found
                    }
                    foundModel = words.slice(i).join(' ');
                    break;
                } else if (candidate === 'Đuro Đaković') { // Exception for Đuro Đaković
                    foundMake = candidate;
                    makeLogoUrl = await checkImage(candidate);
                    foundModel = words.slice(i).join(' ');
                    break;
                } else if (candidate === 'Konštrukta Trenčín') { // Exception for Konštrukta Trenčín
                    foundMake = candidate;
                    makeLogoUrl = await checkImage(candidate);
                    foundModel = words.slice(i).join(' ');
                    break;
                }
            }

            // Create a container for the logo and the title text
            const container = document.createElement('div');
            Object.assign(container.style, {
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '30px',
                gap: '30px'
            });

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
                    fontSize: '0.6em',
                    fontWeight: 'bold'
                });
                yearDiv.textContent = year;
                textContainer.appendChild(yearDiv);
            }

            // If a logo URL is found, create an image link
            if (makeLogoUrl || foundMake === 'A:Level') {
                const logoLink = document.createElement('a');
                const normalizedMakeForLogo = removeAccents(foundMake);
                let logoHref = `https://igcd.net/marque.php?id=${encodeURIComponent(normalizedMakeForLogo)}`;
                if (originCountryCode) { // Exception for A:Level
                    logoHref += `&pays=${originCountryCode}`;
                }
                if (foundMake === 'A:Level') {
                    makeLogoUrl = 'https://igcd.net/logos/ALevel.png';
                }
                if (foundMake === 'Đuro Đaković') { // Exception for Đuro Đaković
                    logoHref = `https://igcd.net/marque.php?id=%26%23272%3Buro%20%26%23272%3Bakovi%26%23263%3B`;
                    if (originCountryCode) {
                        logoHref += `&pays=${originCountryCode}`;
                    }
                }
                if (foundMake === 'Konštrukta Trenčín') { // Exception for Konštrukta Trenčín
                    logoHref = `https://igcd.net/marque.php?id=Kon%9Atrukta%20Tren%26%23269%3B%EDn`;
                    if (originCountryCode) {
                        logoHref += `&pays=${originCountryCode}`;
                    }
                }
                logoLink.href = logoHref;
                const logoImg = document.createElement('img');
                Object.assign(logoImg.style, {
                    width: '100px',
                    height: '80px',
                    objectFit: 'contain'
                });
                logoImg.src = makeLogoUrl;
                logoLink.appendChild(logoImg);
                container.appendChild(logoLink);

                textContainer.appendChild(createTitleLink(foundMake, `https://igcd.net/search.php?title=${normalizeForSearch(foundMake)}&type=vehicules`));
                if (foundModel) {
                    const modelDiv = document.createElement('div');
                    const modelWords = foundModel.split(' ');
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
                }
            } else {
                const modelDiv = document.createElement('div');
                const modelWords = makeAndModel.split(' ');
                let accumulatedModel = '';
                modelWords.forEach((word, index) => {
                    const linkText = accumulatedModel ? `${accumulatedModel} ${word}`.trim() : word;
                    const normalizedAccumulatedModel = normalizeForSearch(linkText);
                    const link = createTitleLink(word, `https://igcd.net/search.php?title=${normalizedAccumulatedModel}&type=vehicules`);
                    modelDiv.appendChild(link);
                    if (index < modelWords.length - 1) {
                        accumulatedModel += `${word} `;
                        modelDiv.appendChild(document.createTextNode(' '));
                    }
                });
                textContainer.appendChild(modelDiv);
            }

            container.appendChild(textContainer);
            targetH5.innerHTML = '';
            targetH5.appendChild(container);
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

    // Function to find and make the country clickable
    const findAndLogCountry = () => {
        const originBoldElement = Array.from(document.querySelectorAll('b')).find(b => b.textContent.includes('Origin:'));
        if (originBoldElement) {
            let countryElement = null;
            let countryCode = null;
            let flagImageElement = null;
            let nextNode = originBoldElement.nextSibling;

            while (nextNode) {
                if (nextNode && nextNode.nodeType === Node.ELEMENT_NODE && nextNode.tagName === 'IMG') {
                    flagImageElement = nextNode;
                    const codeMatch = flagImageElement.src.match(/drapeaux\/([A-Z]+)\.png/);
                    if (codeMatch) {
                        countryCode = codeMatch ? codeMatch[1] : null;
                    }
                    if (flagImageElement.nextSibling && flagImageElement.nextSibling.nodeType === Node.TEXT_NODE && flagImageElement.nextSibling.textContent.trim()) {
                        countryElement = flagImageElement.nextSibling;
                        break;
                    }
                } else if (nextNode && nextNode.nodeType === Node.TEXT_NODE && nextNode.textContent.trim()) {
                    countryElement = nextNode;
                    break;
                }
                nextNode = nextNode.nextSibling;
            }

            if (countryElement && countryCode) {
                const countryText = countryElement.textContent.trim();
                const linkUrl = `https://igcd.net/marques.php?pays=${countryCode}`;
                const linkElement = document.createElement('a');
                linkElement.href = linkUrl;
                linkElement.textContent = countryText;
                Object.assign(linkElement.style, { color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'none', cursor: 'pointer' });

                // Insert space before the flag image
                const initialSpace = document.createTextNode(' ');
                originBoldElement.parentNode.insertBefore(initialSpace, originBoldElement.nextSibling);

                if (flagImageElement) {
                    originBoldElement.parentNode.insertBefore(flagImageElement, initialSpace.nextSibling);
                    const spaceAfterFlag = document.createTextNode(' ');
                    originBoldElement.parentNode.insertBefore(spaceAfterFlag, flagImageElement.nextSibling);
                    originBoldElement.parentNode.insertBefore(linkElement, spaceAfterFlag.nextSibling);
                    originBoldElement.parentNode.removeChild(countryElement);
                } else {
                    originBoldElement.parentNode.insertBefore(linkElement, initialSpace.nextSibling);
                    originBoldElement.parentNode.removeChild(countryElement);
                }
            }
        }
    };

    // Execute processClickableInfo first, then processVehicleTitle, then findAndLogCountry
    processClickableInfo();
    processVehicleTitle().then(() => {
        findAndLogCountry();
    });
})();
