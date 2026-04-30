// ==UserScript==
// @name         IGCD Enhancements
// @version      2.0
// @author       Klumb3r
// @description  Shows logo, several links are now clickable, and adds external links to game pages
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

    // Add external links to game pages (MobyGames, Wikipedia, SteamDB, etc.)
    const addExternalGameLinks = () => {
        if (!window.location.href.includes('game.php')) return;

        let game = document.querySelector('.card-header h5')?.textContent.trim().replace(/\s*\(\d{4}\)/, '').trim();
        if(!game) return;

        let encoded = encodeURIComponent(game);

        // Get platforms text from the Platforms row
        let platformsText = '';
        const allBolds = document.querySelectorAll('b');
        for (let bold of allBolds) {
            if (bold.textContent.includes('Platforms:')) {
                let nextSibling = bold.nextSibling;
                if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
                    platformsText = nextSibling.textContent.trim();
                } else if (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE) {
                    platformsText = nextSibling.textContent.trim();
                }
                break;
            }
        }

        // Always visible icons (MobyGames, Metacritic, Wikipedia, IGDB, HowLongToBeat)
        let icons = [
            {url: `https://www.mobygames.com/search/?q=${encoded}`, img: 'https://i.imgur.com/3FBWI6J.png'},
            {url: `https://www.metacritic.com/search/${encoded}/`, img: 'https://i.imgur.com/1q4mbTl.png'},
            {url: `https://en.wikipedia.org/w/index.php?search=${encoded}`, img: 'https://i.imgur.com/fpvrhzB.png'},
            {url: `https://www.igdb.com/search?q=${encoded}`, img: 'https://i.imgur.com/Cqz8xq1.png'},
            {url: `https://howlongtobeat.com/?q=${encoded}`, img: 'https://i.imgur.com/S0ct3ct.png'}
        ];

        // Check platforms and add conditional icons
        if (platformsText) {
            // PC platform (exact word, not containing "PC" like Amstrad CPC)
            if (/\bPC\b/i.test(platformsText)) {
                icons.push(
                    {url: `https://www.pcgamingwiki.com/w/index.php?search=${encoded}`, img: 'https://i.imgur.com/Hg7gumt.png'},
                    {url: `https://steamdb.info/search/?a=all&q=${encoded}`, img: 'https://i.imgur.com/qJ3cF7X.png'},
                    {url: `https://www.gog.com/en/games?query=${encoded}`, img: 'https://i.imgur.com/txZKl2u.png'},
                    {url: `https://store.epicgames.com/en-US/browse?q=${encoded}`, img: 'https://i.imgur.com/ls7Pr3m.png'}
                );
            } else if (/\bMac\b/i.test(platformsText)) {
                // Mac also gets PC stores
                icons.push(
                    {url: `https://www.pcgamingwiki.com/w/index.php?search=${encoded}`, img: 'https://i.imgur.com/Hg7gumt.png'},
                    {url: `https://steamdb.info/search/?a=all&q=${encoded}`, img: 'https://i.imgur.com/qJ3cF7X.png'},
                    {url: `https://www.gog.com/en/games?query=${encoded}`, img: 'https://i.imgur.com/txZKl2u.png'},
                    {url: `https://store.epicgames.com/en-US/browse?q=${encoded}`, img: 'https://i.imgur.com/ls7Pr3m.png'}
                );
            }

            // PlayStation
            if (/PlayStation/i.test(platformsText)) {
                icons.push(
                    {url: `https://store.playstation.com/en-us/search/${encoded}`, img: 'https://i.imgur.com/gnzTt3Q.png'}
                );
            }

            // Xbox
            if (/Xbox/i.test(platformsText)) {
                icons.push(
                    {url: `https://www.xbox.com/en-US/Search/Results?q=${encoded}`, img: 'https://i.imgur.com/sxxMtRP.png'}
                );
            }

            // Nintendo Switch (exact word)
            if (/\bSwitch\b/i.test(platformsText)) {
                icons.push(
                    {url: `https://www.nintendo.com/us/search/#q=${encoded}`, img: 'https://i.imgur.com/nxts7lc.png'}
                );
            }

            // Android / Mobile
            if (/Android|Mobile/i.test(platformsText)) {
                icons.push(
                    {url: `https://play.google.com/store/search?q=${encoded}&c=apps`, img: 'https://i.imgur.com/YBMcUjc.png'}
                );
            }

            // iOS / Mobile
            if (/iOS|Mobile/i.test(platformsText)) {
                icons.push(
                    {url: `https://apps.apple.com/us/iphone/search?term=${encoded}`, img: 'https://i.imgur.com/hyyWVVf.png'}
                );
            }
        }

        // Remove duplicates
        const uniqueIcons = [];
        const seenUrls = new Set();
        for (const icon of icons) {
            if (!seenUrls.has(icon.url)) {
                seenUrls.add(icon.url);
                uniqueIcons.push(icon);
            }
        }

        let container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.gap = '10px';
        container.style.marginTop = '10px';

        // If 6 or fewer icons, show in a single row
        if (uniqueIcons.length <= 6) {
            let singleRow = document.createElement('div');
            singleRow.style.display = 'flex';
            singleRow.style.gap = '10px';
            singleRow.style.justifyContent = 'center';

            uniqueIcons.forEach((icon) => {
                let link = document.createElement('a');
                link.href = icon.url;
                link.target = '_blank';
                link.innerHTML = `<img src="${icon.img}" width="20" height="20">`;
                singleRow.appendChild(link);
            });

            container.appendChild(singleRow);
        } else {
            // Two rows for 6 or more icons
            let firstRow = document.createElement('div');
            firstRow.style.display = 'flex';
            firstRow.style.gap = '10px';
            firstRow.style.justifyContent = 'center';

            let secondRow = document.createElement('div');
            secondRow.style.display = 'flex';
            secondRow.style.gap = '10px';
            secondRow.style.justifyContent = 'center';

            let half = Math.ceil(uniqueIcons.length / 2);

            uniqueIcons.forEach((icon, index) => {
                let link = document.createElement('a');
                link.href = icon.url;
                link.target = '_blank';
                link.innerHTML = `<img src="${icon.img}" width="20" height="20">`;

                if (index < half) {
                    firstRow.appendChild(link);
                } else {
                    secondRow.appendChild(link);
                }
            });

            container.appendChild(firstRow);
            container.appendChild(secondRow);
        }

        let targetCell = document.querySelector('.card-custom .text-center');
        if(targetCell) {
            targetCell.appendChild(container);
        } else {
            document.querySelector('.card-custom').after(container);
        }
    };

    // Find the DLC and add store links
    const processDlcLinks = () => {
        if (!window.location.href.includes('vehicle.php')) return;

        // Find the DLC by its classes and SVG icon
        const dlcBadge = document.querySelector('.badge.badge-info[title]');
        if (!dlcBadge) return;

        let dlcName = dlcBadge.getAttribute('title');
        if (!dlcName || dlcName.trim() === '') return;

        // Remove the word DLC if it is present
        dlcName = dlcName.replace(/^DLC\s+/i, '').replace(/\s+DLC$/i, '');

        let encoded = encodeURIComponent(dlcName);

        // Create container for DLC links
        let dlcContainer = document.createElement('span');
        dlcContainer.style.display = 'inline-flex';
        dlcContainer.style.gap = '8px';
        dlcContainer.style.marginLeft = '5px';
        dlcContainer.style.marginRight = '5px';
        dlcContainer.style.alignItems = 'center';
        dlcContainer.style.verticalAlign = 'middle';

        let dlcIcons = [
            {url: `https://steamdb.info/search/?a=all&q=${encoded}`, img: 'https://i.imgur.com/qJ3cF7X.png'},
            {url: `https://store.playstation.com/en-us/search/${encoded}`, img: 'https://i.imgur.com/gnzTt3Q.png'},
            {url: `https://www.xbox.com/en-US/search/results/addons?q=${encoded}`, img: 'https://i.imgur.com/sxxMtRP.png'}
        ];

        dlcIcons.forEach((icon) => {
            let link = document.createElement('a');
            link.href = icon.url;
            link.target = '_blank';
            link.style.display = 'inline-flex';
            link.style.alignItems = 'center';
            link.innerHTML = `<img src="${icon.img}" width="20" height="20" title="Search for ${dlcName}" style="vertical-align: middle;">`;
            dlcContainer.appendChild(link);
        });

        // Insert the container right after the DLC
        dlcBadge.insertAdjacentElement('afterend', dlcContainer);
    };

    // Make contributors clickable
    const processContributors = () => {
        if (!window.location.href.includes('game.php')) return;

        // Find the Contributors element
        const allBolds = document.querySelectorAll('b');
        const contributorsBold = Array.from(allBolds).find(bold =>
                                                           bold.textContent.includes('Contributors (assigned)') ||
                                                           bold.textContent.includes('Contributors (page completed)') ||
                                                           bold.textContent.includes('Contributors (in progress)')
                                                          );

        if (!contributorsBold) return;

        // Get the next sibling (text node with the names)
        let nextSibling = contributorsBold.nextSibling;
        if (!nextSibling || nextSibling.nodeType !== Node.TEXT_NODE) return;

        let namesText = nextSibling.textContent.trim();
        if (!namesText || namesText === '') return;

        // Check "TBD" (not clickable)
        if (namesText === 'TBD') return;

        // Split names by commas and trim whitespace
        let names = namesText.split(',').map(name => name.trim()).filter(name => name !== '');
        if (names.length === 0) return;

        const parent = contributorsBold.parentNode;
        let previous = contributorsBold;

        // Insert a space after the bold text
        const spaceNode = document.createTextNode(' ');
        parent.insertBefore(spaceNode, nextSibling);
        previous = spaceNode;

        // Remove the original text node
        parent.removeChild(nextSibling);

        // Create clickable links for each name
        names.forEach((name, index) => {
            const searchUrl = `https://igcd.net/gameslistcontribu.php?id=${encodeURIComponent(name)}`;
            const link = document.createElement('a');
            link.href = searchUrl;
            link.textContent = name;
            Object.assign(link.style, {
                color: 'inherit',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer'
            });

            parent.insertBefore(link, previous.nextSibling);
            previous = link;

            // Add comma and space after the name (except for the last one)
            if (index < names.length - 1) {
                const commaSpace = document.createTextNode(', ');
                parent.insertBefore(commaSpace, previous.nextSibling);
                previous = commaSpace;
            }
        });
    };

    // Execute all functions
    processClickableInfo();
    processGameInfo();
    processVehicleTitle().then(() => { findAndLogCountry(); });
    addExternalGameLinks();
    processDlcLinks();
    processContributors();
})();
