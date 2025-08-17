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

### Version 1.3 - 17/08/2025

* Rewritten code to optimize functionality.
* Added exceptions:
    * Bolloré.
    * Clément-Bayard.
    * Crosslé.
    * DMC.
    * DeLorean.
    * Končar.
    * Rába.
    * Skipasýn-Icelandic.
 * Land-Rover is now displayed as Land Rover.
 * Developer and Publisher are now clickable on game pages.

### Version 1.2 - 16/08/2025

* Support for IGCD V4.

### Version 1.1 - 03/05/2025

* **Clickable logo**: clicking the logo directs to the page with all models of that make.
* **Clickable Origin**: clicking the origin directs to the page with all makes from that country.
* Added exceptions:
    * A:Level.
    * Đuro Đaković.
    * Konštrukta Trenčín.
    * Puma (Italy).

### Version 1.0 - 29/04/2025

* **Added logo:** the logo is displayed on the page.
* **Clickable links:** the following sections are now clickable and take you to searches:
    * Make (if the make doesn't have a logo, it doesn't differentiate between make and model).
    * Model (if the make doesn't have a logo, it doesn't differentiate between make and model).
    * Surname.
    * Extra info.
    * Chassis.



## Known Bugs

* Currently, the makes "**[American Bridge Co.](https://igcd.net/marque.php?id=American+Bridge+Co.&pays=US)**", "**[American Car Company](https://igcd.net/marque.php?id=American+Car+Company&pays=US)**", "**[American Coal Enterprises](https://igcd.net/marque.php?id=American+Coal+Enterprises&pays=US)**", and "**[American Ship Building Company](https://igcd.net/marque.php?id=American+Ship+Building+Company&pays=US)**" don't have their own logos, the script mistakenly displays the logo for the "**[American](https://igcd.net/marque.php?id=American&pays=US)**" make instead. Since IGCD doesn't distinguish between make and model in its storage system, I have to scrape the page and try to match any existing logos. In these cases, it only finds and returns "**[American](https://igcd.net/marque.php?id=American&pays=US)**". The same issue occurs with "**[Derby Works](https://igcd.net/marque.php?id=Derby+Works&pays=UK)**" with "**[Derby](https://igcd.net/marque.php?id=Derby&pays=FR)**", "**[Bell Boeing](https://igcd.net/marque.php?id=Bell+Boeing&pays=US)**" with "**[Bell](https://igcd.net/marque.php?id=Bell&pays=US)**", "**[Lake Shore](https://igcd.net/marque.php?id=Lake+Shore&pays=US)**" with "**[Lake](https://igcd.net/marque.php?id=Lake&pays=US)**", "**[Bristol Boats](https://igcd.net/marque.php?id=Bristol+Boats&pays=UK)**" with "**[Bristol](https://igcd.net/marque.php?id=Bristol&pays=UK)**", etc.
* For "**Devel Sixteen**", the script merges the make and model because, for some reason, there is a file named "[Devel Sixteen.png](https://igcd.net/logos/Devel%20Sixteen.png)". The proper solution would be to remove this file from the database.
* Makes that start with numbers, such as "[**23 August Works**](https://igcd.net/marque.php?id=23+August+Works&pays=RO)", will display an incorrect logo because in IGCD V4 the logos are named with numbers.

## Author

Klumb3r
