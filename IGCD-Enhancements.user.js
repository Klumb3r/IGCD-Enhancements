// ==UserScript==
// @name         IGCD Enhancements
// @version      1.3
// @author       Klumb3r
// @description  Shows logo, and several links are now clickable
// @match        *://*.igcd.net/vehicle.php?id=*
// @match        *://*.igcd.net/game.php?id=*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Remove accents and specific characters from a string
    const removeAccents = (text) => text.normalize('NFD').replace(/[\u0300-\u036fĐđĆć]/g, (match) => ({ 'Đ': 'D', 'đ': 'd', 'Ć': 'C', 'ć': 'c' }[match] || ''));

    // Normalize text for search URLs (remove accents and replace spaces with hyphens)
    const normalizeForSearch = (text) => removeAccents(text).replace(/\s+/g, '-');

    // Check if an image URL exists by making a HEAD request
    const checkImage = async (make, countryCode = null) => {
        const logoBaseUrl = window.location.protocol + '//' + window.location.hostname;
        const makeWithHyphen = make.replace('/', '-'); // Replace slash with hyphen for logo search
        const tryUrls = [];

        tryUrls.push(
            `${logoBaseUrl}/logos/${encodeURIComponent(make)}.png`, // Try the make name as is in the URL
            `${logoBaseUrl}/logos/${encodeURIComponent(removeAccents(make))}.png`, // Try the make name without accents in the URL
            `${logoBaseUrl}/logos/${encodeURIComponent(makeWithHyphen)}.png`, // Try with hyphen
            `${logoBaseUrl}/logos/${encodeURIComponent(removeAccents(makeWithHyphen))}.png` // Try with hyphen and without accents
        );

        for(const url of tryUrls) {
            const exists = await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'HEAD',
                    url: url,
                    onload: (response) => resolve(response.status === 200),
                    onerror: () => resolve(false)
                });
            });
            if(exists) return url;
        }
        return null;
    };

    // Create a simple styled link element
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

    // Create a link element for titles with hover underline effect
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
        linkElement.onmouseover = () => { linkElement.style.textDecoration = 'underline'; };
        linkElement.onmouseout = () => { linkElement.style.textDecoration = 'none'; };
        return linkElement;
    };

    // Exceptions for specific makes
    const exceptions = (candidate, originCountryCode) => {
        let logoUrl = '';
        let linkUrl = '';
        let textLinkUrl = '';
        switch(candidate) {
            case 'A:Level':
                logoUrl = 'https://igcd.net/logos/2171.png';
                linkUrl = 'https://igcd.net/marque.php?id=A%3ALevel&pays=RU';
                break;
            case 'Puma':
                if(originCountryCode === 'IT') {
                    logoUrl = 'https://igcd.net/logos/Pumait.png';
                }
                linkUrl = `https://igcd.net/marque.php?id=${encodeURIComponent(candidate)}`;
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
            case 'Şantierul Naval 2 Mai':
                linkUrl = `https://igcd.net/marque.php?id=%26%23350%3Bantierul+Naval+2+Mai`;
                textLinkUrl = 'https://igcd.net/search.php?title=antierul+Naval+2+Mai&type=vehicules';
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
            case 'Đuro Đaković':
                logoUrl = 'https://igcd.net/logos/2146.png';
                linkUrl = `https://igcd.net/marque.php?id=%26%23272%3Buro+%26%23272%3Bakovi%26%23263%3B`;
                textLinkUrl = 'https://igcd.net/search.php?title=akovi&type=vehicules';
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
            case 'Konštrukta Trenčín':
                logoUrl = 'https://igcd.net/logos/2382.png';
                linkUrl = `https://igcd.net/marque.php?id=Kon%C5%A1trukta+Tren%26%23269%3B%C3%ADn`;
                textLinkUrl = 'https://igcd.net/search.php?title=Kon%C5%A1trukta&type=vehicules';
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
            case 'DMC':
                logoUrl = 'https://igcd.net/logos/3917.png';
                linkUrl = 'https://igcd.net/marque.php?id=DMC';
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
            case 'DeLorean':
                logoUrl = 'https://igcd.net/logos/3920.png';
                linkUrl = 'https://igcd.net/marque.php?id=DeLorean';
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
            case 'Rába':
                logoUrl = 'https://igcd.net/logos/799.png';
                linkUrl = 'https://igcd.net/marque.php?id=Rába';
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
            case 'Končar':
                logoUrl = 'https://igcd.net/logos/3178.png';
                linkUrl = 'https://igcd.net/marque.php?id=Kon%26%23269%3Bar';
                textLinkUrl = 'https://igcd.net/search.php?title=Kon%26%23269%3Bar&type=vehicules';
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
            case 'Skipasýn-Icelandic':
                logoUrl = 'https://igcd.net/logos/3763.png';
                linkUrl = 'https://igcd.net/marque.php?id=Skipasýn-Icelandic';
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
            case 'Crosslé':
                logoUrl = 'https://igcd.net/logos/2260.png';
                linkUrl = 'https://igcd.net/marque.php?id=Crosslé';
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
            case 'Bolloré':
                logoUrl = 'https://igcd.net/logos/2334.png';
                linkUrl = 'https://igcd.net/marque.php?id=Bolloré';
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
            case 'Clément-Bayard':
                logoUrl = 'https://igcd.net/logos/1949.png';
                linkUrl = 'https://igcd.net/marque.php?id=Clément-Bayard';
                if(originCountryCode) linkUrl += `&pays=${originCountryCode}`;
                break;
        }
        return {logoUrl, linkUrl, textLinkUrl};
    };

    // Process vehicle title
    const processVehicleTitle = async () => {
        if (!window.location.href.includes('vehicle.php')) return;

        const targetH5 = document.querySelector('h5');
        if(!targetH5) return;

        let originalText = targetH5.textContent.trim().replace(/\bLand-Rover\b/g, "Land Rover");
        const yearMatch = originalText.match(/^(\d{4})\s+(.*)/);
        const year = yearMatch ? yearMatch[1] : '';
        const makeAndModel = yearMatch ? yearMatch[2] : originalText;
        const words = makeAndModel.split(' ');

        let foundMake = '';
        let foundModel = '';
        let makeLogoUrl = '';
        let logoHref = '';
        let textLinkUrl = '';
        let originCountryCode = null;

        // Identify origin country
        const originBoldElement = Array.from(document.querySelectorAll('b')).find(b => b.textContent.includes('Origin:'));
        if(originBoldElement && originBoldElement.parentNode) {
            const flagImage = originBoldElement.parentNode.querySelector('img');
            if(flagImage && flagImage.src) {
                const codeMatch = flagImage.src.match(/drapeaux\/([A-Z]+)\.png/);
                originCountryCode = codeMatch ? codeMatch[1] : null;
            }
        }

        // Iterate backwards through the words to find the longest matching make
        for (let i = words.length; i > 0; i--) {
            const candidate = words.slice(0, i).join(' ');

            // First, check exceptions (special logos)
            const exception = exceptions(candidate, originCountryCode);
            if (exception.logoUrl) {
                foundMake = candidate;
                makeLogoUrl = exception.logoUrl;
                logoHref = exception.linkUrl;
                textLinkUrl = exception.textLinkUrl;
                foundModel = words.slice(i).join(' ');
                break;
            }

            // If no special logo, try normal checkImage
            let logoUrlCheck = await checkImage(candidate, originCountryCode);
            if (logoUrlCheck) {
                foundMake = candidate;
                makeLogoUrl = logoUrlCheck;
                logoHref = `https://igcd.net/marque.php?id=${encodeURIComponent(candidate)}`;
                if (originCountryCode) logoHref += `&pays=${originCountryCode}`;
                foundModel = words.slice(i).join(' ');
                break;
            }
        }

        // Container for the logo and the title text
        const container = document.createElement('div');
        Object.assign(container.style, {
            display:'flex',
            alignItems:'center',
            paddingLeft:'30px',
            gap:'30px'
        });

        // Container for the title text (year, make, model)
        const textContainer = document.createElement('div');
        Object.assign(textContainer.style, {
            display:'flex',
            flexDirection:'column',
            alignItems:'flex-start',
            lineHeight:'1.2'
        });

        // Add year
        if(year){
            const yearDiv = document.createElement('div');
            Object.assign(yearDiv.style, {
                fontSize:'0.6em',
                fontWeight:'bold'
            });
            yearDiv.textContent = year;
            textContainer.appendChild(yearDiv);
        }

        // If a logo URL is found, create an image link
        if(makeLogoUrl){
            const logoLink = document.createElement('a');
            logoLink.href = logoHref;
            const logoImg = document.createElement('img');
            Object.assign(logoImg.style, {
                width:'100px',
                height:'80px',
                objectFit:'contain'
            });
            logoImg.src = makeLogoUrl;
            logoLink.appendChild(logoImg);
            container.appendChild(logoLink);

            // Use textLinkUrl from exceptions
            let makeLinkUrl = textLinkUrl
            ? textLinkUrl
            : `https://igcd.net/search.php?title=${normalizeForSearch(foundMake)}&type=vehicules`;
            textContainer.appendChild(createTitleLink(foundMake, makeLinkUrl));

            // Found make and model
            if(foundModel){
                const modelDiv = document.createElement('div');
                let accumulated = '';
                foundModel.split(' ').forEach((word,index)=>{
                    const linkText = accumulated ? `${accumulated} ${word}`.trim() : word;
                    const link = createTitleLink(word, `https://igcd.net/search.php?title=${normalizeForSearch(linkText)}&type=vehicules`);
                    modelDiv.appendChild(link);
                    if(index < foundModel.split(' ').length-1){
                        accumulated += `${word} `;
                        modelDiv.appendChild(document.createTextNode(' '));
                    } else accumulated = linkText;
                });
                textContainer.appendChild(modelDiv);
            }
        } else {
            // No logo: word by word clickable
            const modelDiv = document.createElement('div');
            let accumulated = '';
            makeAndModel.split(' ').forEach((word,index)=>{
                const linkText = accumulated ? `${accumulated} ${word}`.trim() : word;
                const link = createTitleLink(word, `https://igcd.net/search.php?title=${normalizeForSearch(linkText)}&type=vehicules`);
                modelDiv.appendChild(link);
                if(index < makeAndModel.split(' ').length-1){
                    accumulated += `${word} `;
                    modelDiv.appendChild(document.createTextNode(' '));
                } else accumulated = linkText;
            });
            textContainer.appendChild(modelDiv);
        }

        container.appendChild(textContainer);
        targetH5.innerHTML='';
        targetH5.appendChild(container);
    };

    // Make Surname, Chassis, and Extra info clickable
    const processClickableInfo = () => {
        if (!window.location.href.includes('vehicle.php')) return;

        const searchFields = ['Surname','Chassis','Extra info'];
        const linkStyleClickableInfo = {
            color:'inherit',
            fontFamily:'inherit',
            fontSize:'inherit',
            textDecoration:'none',
            cursor:'pointer'
        };
        const allBolds = document.querySelectorAll('b');

        searchFields.forEach(field=>{
            const searchText = field+':';
            allBolds.forEach(bold=>{
                if(bold.textContent.includes(searchText)){
                    let nextSibling = bold.nextSibling;
                    if(nextSibling && nextSibling.nodeType===Node.TEXT_NODE && nextSibling.textContent.trim()){
                        const targetText = nextSibling.textContent.trim();
                        const parent = bold.parentNode;
                        let previous = bold;
                        let accumulated = '';
                        const words = targetText.split(' ');
                        const spaceNode = document.createTextNode(' ');
                        parent.insertBefore(spaceNode,nextSibling);
                        previous = spaceNode;

                        words.forEach((word,index)=>{
                            const linkText = accumulated ? `${accumulated} ${word}`.trim() : word;
                            const searchUrl = `https://igcd.net/search.php?title=${encodeURIComponent(normalizeForSearch(linkText))}&type=vehicules`;
                            const link = document.createElement('a');
                            link.href = searchUrl;
                            link.textContent = word;
                            Object.assign(link.style,linkStyleClickableInfo);
                            parent.insertBefore(link,previous.nextSibling);
                            previous = link;
                            if(index<words.length-1){
                                accumulated += `${word} `;
                                const space = document.createTextNode(' ');
                                parent.insertBefore(space,previous.nextSibling);
                                previous = space;
                            } else accumulated = linkText;
                        });
                        if(nextSibling.parentNode) nextSibling.parentNode.removeChild(nextSibling);
                    }
                }
            });
        });
    };

    // Function to find and make the country clickable
    const findAndLogCountry = () => {
        if (!window.location.href.includes('vehicle.php')) return;

        const originBold = Array.from(document.querySelectorAll('b')).find(b=>b.textContent.includes('Origin:'));
        if(!originBold) return;
        let countryElem=null, countryCode=null, flagImage=null, nextNode=originBold.nextSibling;

        while(nextNode){
            if(nextNode.nodeType===Node.ELEMENT_NODE && nextNode.tagName==='IMG'){
                flagImage=nextNode;
                const codeMatch=flagImage.src.match(/drapeaux\/([A-Z]+)\.png/);
                if(codeMatch) countryCode=codeMatch[1];
                if(flagImage.nextSibling && flagImage.nextSibling.nodeType===Node.TEXT_NODE && flagImage.nextSibling.textContent.trim()){
                    countryElem=flagImage.nextSibling; break;
                }
            } else if(nextNode.nodeType===Node.TEXT_NODE && nextNode.textContent.trim()){
                countryElem=nextNode; break;
            }
            nextNode=nextNode.nextSibling;
        }

        if(countryElem && countryCode){
            const countryText = countryElem.textContent.trim();
            const linkUrl = `https://igcd.net/marques.php?pays=${countryCode}`;
            const link = document.createElement('a');
            link.href = linkUrl;
            link.textContent = countryText;
            Object.assign(link.style,{color:'inherit',fontFamily:'inherit',fontSize:'inherit',textDecoration:'none',cursor:'pointer'});

            // Insert space before the flag image
            const initialSpace = document.createTextNode(' ');
            originBold.parentNode.insertBefore(initialSpace,originBold.nextSibling);

            if(flagImage){
                originBold.parentNode.insertBefore(flagImage,initialSpace.nextSibling);
                const spaceAfter = document.createTextNode(' ');
                originBold.parentNode.insertBefore(spaceAfter,flagImage.nextSibling);
                originBold.parentNode.insertBefore(link,spaceAfter.nextSibling);
                originBold.parentNode.removeChild(countryElem);
            } else {
                originBold.parentNode.insertBefore(link,initialSpace.nextSibling);
                originBold.parentNode.removeChild(countryElem);
            }
        }
    };

    // Make Publisher and Developer clickable
    const processGameInfo = () => {
        if (!window.location.href.includes('game.php')) return;
        const gameFields = ['Publisher', 'Developer'];
        const linkStyleClickableInfo = {
            color: 'inherit',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            textDecoration: 'none',
            cursor: 'pointer'
        };
        const allBolds = document.querySelectorAll('b');

        gameFields.forEach(field => {
            const searchText = field + ':';
            allBolds.forEach(bold => {
                if (bold.textContent.includes(searchText)) {
                    let nextSibling = bold.nextSibling;
                    if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent.trim()) {
                        const targetText = nextSibling.textContent.trim();
                        const parent = bold.parentNode;
                        let previous = bold;
                        const words = targetText.split(' ');
                        let accumulated = '';

                        // Create a space node for separation
                        const spaceNode = document.createTextNode(' ');
                        parent.insertBefore(spaceNode, nextSibling);
                        previous = spaceNode;

                        words.forEach((word, index) => {
                            const linkText = accumulated ? `${accumulated} ${word}`.trim() : word;
                            const searchUrl = `https://igcd.net/search.php?title=${encodeURIComponent(normalizeForSearch(linkText))}&type=jeux`;
                            const link = document.createElement('a');
                            link.href = searchUrl;
                            link.textContent = word;
                            Object.assign(link.style, linkStyleClickableInfo);
                            parent.insertBefore(link, previous.nextSibling);
                            previous = link;

                            // Add space between words
                            if (index < words.length - 1) {
                                accumulated += `${word} `;
                                const space = document.createTextNode(' ');
                                parent.insertBefore(space, previous.nextSibling);
                                previous = space;
                            } else {
                                accumulated = linkText;
                            }
                        });
                        if (nextSibling.parentNode) {
                            nextSibling.parentNode.removeChild(nextSibling);
                        }
                    }
                }
            });
        });
    };

    // Execute all functions, each one will check if it's on the correct page.
    processClickableInfo();
    processGameInfo();
    processVehicleTitle().then(()=>{ findAndLogCountry(); });
})();
