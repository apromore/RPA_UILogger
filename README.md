# RPAMiner

Installation Notes:
1- Install Node.js - https://nodejs.org/en/
2- navigate to /append_http and run 'npm install'
3- navigate to /PassiveListener and run 'npm install'

4- Excel Plugin:
    - In windows, navigate to /Excel Addin, right click -> properties -> Sharing -> Share -> Share
    - Copy the url of the shared folder.
    - Open Excel, go to File -> Options -> Trust Center -> Trust Center Settings -> Paste Url into "Catalog Url" and click "Add catalog"
    - Tick the "Show in Menu" box, then click "OK"
    - Insert -> My Add-Ins -> Shared Folder -> Excel Passive Listener

5- Chrome Plugin
    - in Chrome, navigate to chrome://extensions/
    - Turn on Developer Mode on top right corner
    - Load Unpacked extension -> pick folder RPAMINER/PassiveListener

How to USE:
1- Turn on logger: navigate to /append_http and run 'node .'
2- Turn on Excel sideApp: navigate to /Excel Addin and run 'npm start'
3- Excel Home - Click "Show TaskPane"

3- Log files are under /append_http/log.csv