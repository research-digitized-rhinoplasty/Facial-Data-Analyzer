# Digitized Rhinoplasty - Web-based Software for Data Analysis of 3D Facial Measurements and Landmark Locations
Created to work with Dr. Oguzhan Topsakal's Digitized Rhinoplasty for my Masters Project.

To start:

1. Install npm dependencies

    * Open cmd or something similar and navigate to the project directory (/).
    * Confirm the details inside package.json, then type ```npm install```.
    * A folder called ```npm_modules``` will be downloaded to the project directory.
    * If for any reason you wish to delete the project files and run into issues deleting ```npm_modules```:
        * Using cmd or something similar, in the project directory, run the command ```npx rimraf --glob ./node_modules```.
    
2. Input database details

    * Open file ```js/node/sqlFunctions.js``` in a text editor.
    * Under variable ```con``` commented with ```server connection details```, change the server details to your MySQL server.
    * The database you connect to must have the correct schema (```participant```, ```participant_landmark```, ```participant_measurement```, ```landmark```, ```measurement```) as well as landmark and measurement data.

3. Run node server

    * Using Command Prompt, Visual Studio Code, or something similar, run the node server (```src/server.js```).
    * The server runs on port 8000. If you wish to change the port, you must change the port number in the following files:
        * ```src/server.js```
            * Line 7
        * ```js/eventListener/displayLandmarksMeasurements.js```
            * Line 25
        * ```js/JSONCheckParseSend.js```
            * Line 69

4. Use the application
    * Open the file ```index.html``` in a web browser.
    * Select participant features, measurements or landmarks, and statistics.
    * Press submit.
    * Choose between options to view statistical information.

