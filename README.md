# IGCD Enhancements

This user script for [Tampermonkey](https://www.tampermonkey.net/) enhances the experience on the Internet Game Cars Database (IGCD) website. It provides the following features:

* **Shows vehicle make logo:** Displays the logo of the vehicle's make next to the title for easier identification.
* **Makes title elements (year, make, model) and additional info (Surname, Chassis, Extra info) clickable:** Turns these text elements into clickable links for quick searches on IGCD.



## Installation

To install this script, you need to have the [Tampermonkey](https://www.tampermonkey.net/) browser extension installed.

✨ **Step 1: Easy Direct Installation** ✨

Just click the link below! Tampermonkey should automatically detect the script and guide you through the installation process.

👉 https://github.com/Klumb3r/IGCD-Enhancements/raw/refs/heads/main/IGCD-Enhancements.user.js 👈

Follow the prompts in Tampermonkey to complete the installation.

🛠️ **Step 2: Alternative Import via Tampermonkey Dashboard** 🛠️

If the direct installation doesn't work for you, try this method:

1.  Click on the Tampermonkey icon in your browser's toolbar.
2.  Go to the **"Dashboard"**.
3.  Navigate to the **"Utilities"** tab.
4.  Find the **"Import from URL"** section.
5.  In the "URL" field, paste the following link:
    ```
    https://github.com/Klumb3r/IGCD-Enhancements/raw/refs/heads/main/IGCD-Enhancements.user.js
    ```
6.  Click the **"Import"** button.
7.  Tampermonkey will then show you the installation page. Click **"Install"** to finish.



## Usage

Once installed, the script will automatically run on any page matching `*://*.igcd.net/vehicle.php?id=*`. Simply navigate to a vehicle page on IGCD, and the enhancements will be visible.
* Click on the vehicle make logo next to the title to search for that information.
* Click on the **make** or **model** within the vehicle title to search for that information.
* Click on the text following **Surname**, **Chassis**, or **Extra info** to search for that information.
* Test the script here, on the [1998 Ford Crown Victoria](https://igcd.net/vehicle.php?id=50386).



## Changelog

**Version 1.0 - First Release**

* Allows individual clicks on the logo, make, model, Surname, Chassis, and Extra info, directing users to the corresponding search page on IGCD.



## Known Bugs

* For makes with the same name, but from different countries, it could display the other make's logo. (example: [Puma from Brazil](https://igcd.net/marque.php?id=Puma&pays=BR) and [Puma from Italy](https://igcd.net/marque.php?id=Puma&pays=IT)).
* Clicking on certain logos with special characters, such as [Đuro Đaković](https://igcd.net/vehicle.php?id=245829), may result in an error. This is due to the structure of IGCD, and this script can't resolve that.
* Currently, the makes "American Bridge Co.", "American Car Company", "American Coal Enterprises", and "American Ship Building Company" don't have their own logos, the script mistakenly displays the logo for the "American" make instead. Since IGCD doesn't distinguish between make and model in its storage system, I have to scrape the page and try to match any existing logos. In these cases, it only finds and returns "American". The same issue occurs with "Derby Works" and "Derby".
* The logo of the Russian brand [A:Level](https://igcd.net/marque.php?id=A:Level&pays=RU) exists, but without the colon [(:)](https://igcd.net/logos/ALevel.png), the script is unable to find it. The script can be modified; it will be fixed in the future.


## Author

Klumb3r
