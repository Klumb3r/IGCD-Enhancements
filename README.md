# IGCD Enhancements

A [Tampermonkey](https://www.tampermonkey.net/) userscript that adds vehicle make logos, clickable information, and external search links to [IGCD](https://igcd.net/), the Internet Game Cars Database.

**Version:** 3.0 | **Updated:** November 15, 2026 | **Author:** Klumb3r

## Features

* **Vehicle make logos:** Displays the make's logo next to the vehicle title, using an extensive built-in table of IGCD make IDs.
* **Make recognition without a logo:** Recognizes makes independently of logo availability, keeping the make and model separate when the make is in the table.
* **Clickable logo area:** Opens the make's page, respecting the country of origin and supported special cases. If the logo is unavailable, the transparent 100×80 area remains clickable for recognized makes.
* **Clickable vehicle information:** Adds IGCD search links to the year, make, model, Surname, Chassis, and Extra info.
* **Clickable country of origin:** Opens the list of makes from that country.
* **Clickable game information:** Adds links to developers, publishers, and contributors on game pages.
* **External game searches:** Adds links to game databases and stores based on the listed platforms.
* **DLC searches:** Adds external store search links for DLC listed on vehicle pages.
* **Hover labels:** Shows the make name over the logo area, the game name over its cover on vehicle pages, and the site name over external search icons.
* **Faster title processing:** Known makes no longer wait for a logo check before the title is updated.

## Installation

Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension first.

### Direct installation

[**Install IGCD Enhancements**](https://github.com/Klumb3r/IGCD-Enhancements/raw/refs/heads/main/IGCD-Enhancements.user.js)

Tampermonkey should detect the script and display an installation page. Click **Install** to finish.

### Alternative: import through the dashboard

1. Click the Tampermonkey icon in your browser's toolbar.
2. Open **Dashboard** and select the **Utilities** tab.
3. Find **Import from URL** and paste:

   ```text
   https://github.com/Klumb3r/IGCD-Enhancements/raw/refs/heads/main/IGCD-Enhancements.user.js
   ```

4. Click **Import**, then **Install** on the installation page.

## Usage

The script runs automatically on IGCD vehicle and game pages:

```text
*://*.igcd.net/vehicle.php?id=*
*://*.igcd.net/game.php?id=*
```

### Vehicle pages

* Click the make logo to open the make's page. If a recognized make has no logo, click the empty space to the left of the title.
* Click the year, make, model, Surname, Chassis, or Extra info to search IGCD.
* Click the country of origin to browse makes from that country.
* Hover over the make logo area to see the make name.
* Hover over the game cover to see the game name taken from the page title.
* Use the external icons to search for the listed DLC, when available.

Try it on the [1998 Ford Crown Victoria](https://igcd.net/vehicle.php?id=50386).

### Game pages

* Click developers, publishers, or contributors to browse their IGCD entries.
* Use the external search icons to find the game on other sites. Hover over an icon to see its site name.

| Platforms | External search links |
|---|---|
| All games | MobyGames, Metacritic, Wikipedia, IGDB, HowLongToBeat |
| PC / Mac | PCGamingWiki, SteamDB, GOG, Epic Games Store |
| PlayStation | PlayStation Store |
| Xbox | Xbox Store |
| Nintendo Switch | Nintendo eShop |
| Android | Google Play Store |
| iOS | App Store |
| Mobile | Google Play Store, App Store |

These links open searches; they do not confirm that a game or DLC is available on a particular store.

## Changelog

### Version 3.0 - November 15, 2026

* Added an extensive built-in make ID table for more reliable make recognition and numeric logo URLs used by IGCD V4.
* Separated make recognition from logo availability. Known makes without logos now retain their correct make/model separation instead of falling back to a shorter make with a matching logo.
* Fixed the previously reported make-matching cases involving American-prefixed makes, Derby Works, Bell Boeing, Lake Shore, and Bristol Boats.
* Fixed make/model recognition for Devel Sixteen without relying on the incorrectly named logo file.
* Improved support for makes beginning with numbers, including 23 August Works.
* Added a clickable transparent 100×80 logo area for recognized makes whose logo is missing or fails to load.
* Added make-name tooltips to the logo area, including when no logo is available.
* Added a game-name tooltip to the cover on vehicle pages, using the existing page title without additional requests.
* Prioritized recognized make links already present in the original vehicle title, with text matching as a fallback.
* Made known-make title processing independent of logo loading and removed the preliminary logo request for those makes.
* Optimized fallback matching to select the longest known make in one pass.
* Removed duplicate logo URL attempts and added a three-second timeout per request in the legacy logo search.
* Normalized repeated spaces, tabs, line breaks, and non-breaking spaces before recognizing the vehicle title.
* Added site-name tooltips and accessibility labels to external game and DLC icons.
* Prevented duplicate external game and DLC icon groups if their functions run again.
* Updated make entries and simplified exceptions now covered by the ID table, while preserving supported country-specific logos and special links.

### Version 2.0 - April 30, 2026

* Added external links to game pages with platform detection:
  * Always visible: MobyGames, Metacritic, Wikipedia, IGDB, HowLongToBeat.
  * PC/Mac: PCGamingWiki, SteamDB, GOG, Epic Games Store.
  * PlayStation: PlayStation Store.
  * Xbox: Xbox Store.
  * Switch: Nintendo eShop.
  * Android: Google Play Store.
  * iOS: App Store.

  <img width="280" height="251" alt="External game links" src="https://github.com/user-attachments/assets/93c5bd80-d8ac-4681-9a80-1771bd50815b" />

* Added DLC store links on vehicle pages (thanks to speedfreak975 for the idea).

  <img width="278" height="52" alt="DLC store links" src="https://github.com/user-attachments/assets/c7ad2125-11f8-4f65-a4e7-163b2a13f863" />

* Contributors are now clickable on game pages.

  <img width="397" height="26" alt="Clickable contributors" src="https://github.com/user-attachments/assets/4b82bb93-cdd8-4764-9df0-aab289bd6707" />

### Version 1.3 - August 17, 2025

* Rewritten code to optimize functionality.
* Added exceptions for Bolloré, Clément-Bayard, Crosslé, DMC, DeLorean, Končar, Rába, and Skipasýn-Icelandic.
* Land-Rover is now displayed as Land Rover.
* Developer and Publisher are now clickable on game pages.

### Version 1.2 - August 16, 2025

* Added support for IGCD V4.

### Version 1.1 - May 3, 2025

* Added clickable logos that open the page listing models from that make.
* Added clickable countries of origin (thanks to Comfortably Numb for the idea).
* Added exceptions for A:Level, Đuro Đaković, Konštrukta Trenčín, and Puma (Italy).

### Version 1.0 - April 29, 2025

* Added vehicle make logos.
* Added search links for Make, Model, Surname, Extra info, and Chassis.
* Make/model separation initially depended on finding a matching logo.

## Known Limitations

* IGCD vehicle titles may contain only plain text, without separate make and model fields. If a make is missing from the built-in table and no usable make link is available, the script uses its legacy logo search. Recognition can be slower or inaccurate in these cases.
* Missing or incorrect logos on IGCD may still require corrections on the website. A recognized make without a working logo keeps its clickable empty logo area.

## Author

Klumb3r
