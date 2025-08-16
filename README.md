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

### Version 1.2 - 16/08/2025

* Support for IGCD V4.

### Version 1.1 - 03/05/2025

* **Clickable logo**: clicking the logo directs to the page with all models of that make.
* **Clickable Origin**: clicking the origin directs to the page with all makes from that country.
* **Added exceptions:**
    * Specific exception for **A:Level**, displaying its correct logo.
    * Specific exception for **Puma (Italy)**, displaying its correct logo.
    * Specific exception for **Đuro Đaković**, redirecting correctly.
    * Specific exception for **Konštrukta Trenčín**, redirecting correctly.

### Version 1.0 - 29/05/2025

* **Added logo:** the logo is displayed on the page.
* **Clickable links:** the following sections are now clickable and take you to searches:
    * Make (if the make doesn't have a logo, it doesn't differentiate between make and model).
    * Model (if the make doesn't have a logo, it doesn't differentiate between make and model).
    * Surname.
    * Extra info.
    * Chassis.



## Known Bugs

* Clicking on certain makes with special characters, such as [Đuro Đaković](https://igcd.net/vehicle.php?id=245829), may result in an error when searching. This is due to the structure of IGCD, and this script can't resolve that.
* Currently, the makes "American Bridge Co.", "American Car Company", "American Coal Enterprises", and "American Ship Building Company" don't have their own logos, the script mistakenly displays the logo for the "American" make instead. Since IGCD doesn't distinguish between make and model in its storage system, I have to scrape the page and try to match any existing logos. In these cases, it only finds and returns "American". The same issue occurs with "Derby Works" with "Derby", "Bell Boeing" with "Bell", "Lake Shore" with "Lake", "Bristol Boats" with "Bristol", etc.
* For some reason, there is a file named [Devel Sixteen.png](https://igcd.net/logos/Devel%20Sixteen.png) (it should be Devel.png). This causes the logo to display incorrectly on Devel Sixteen vehicles.


## Author

Klumb3r
