# IGCD Enhancements UserScript

This user script for [Tampermonkey](https://www.tampermonkey.net/) enhances the experience on the Internet Game Cars Database (IGCD) website. It provides the following features:

* **Shows Vehicle Make Logo:** Displays the logo of the vehicle's manufacturer next to the title for easier identification.
* **Makes Title Elements Clickable:** Turns the year, make, and model in the vehicle title into clickable links for quick searches on IGCD.
* **Makes Additional Info Clickable:** Transforms the text following "Surname:", "Chassis:", and "Extra info:" into clickable links for searching IGCD.

## Installation

To install this script, you need to have the [Tampermonkey](https://www.tampermonkey.net/) browser extension installed.

**Step 1: Install directly from the link**

Click on the following link:

[https://raw.githubusercontent.com/Klumb3r/IGCD-Enhancements/refs/heads/main/IGCD%20Enhancements.js](https://raw.githubusercontent.com/Klumb3r/IGCD-Enhancements/refs/heads/main/IGCD%20Enhancements.js)

Tampermonkey should automatically detect the script and prompt you to install it. Click "Install" to proceed.

**Step 2: If direct installation doesn't work, try importing via the Tampermonkey Dashboard**

1.  Click on the Tampermonkey icon in your browser's toolbar.
2.  Go to the "Dashboard".
3.  In the Tampermonkey Dashboard, navigate to the "Utilities" tab.
4.  Look for the "Import from URL" section.
5.  Copy and paste the following URL into the "URL" field:
    ```
    [https://raw.githubusercontent.com/Klumb3r/IGCD-Enhancements/refs/heads/main/IGCD%20Enhancements.js](https://raw.githubusercontent.com/Klumb3r/IGCD-Enhancements/refs/heads/main/IGCD%20Enhancements.js)
    ```
6.  Click the "Import" button.
7.  Tampermonkey should then display the installation page. Click "Install" to proceed.

## Usage

Once installed, the script will automatically run on any page matching `*://*.igcd.net/vehicle.php?id=*`. Simply navigate to a vehicle page on IGCD, and the enhancements will be visible.

## Author

Klumb3r
