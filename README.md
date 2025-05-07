# Drive-Thru Lane Visualizer 

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.10.

## Project Introduction

Drive-Thru Lane Visualizer is a single-page app built with Angular 19.2.10 that shows drive-thru lane layouts in a full-screen 1920×1080 dashboard using SVG. The app gets lane data from a mock REST API and shows lane paths, service points, and flow connections.

Each lane automatically adjusts to fit the screen size, with the right amount of space around it, keeping the correct shape and making sure there are no scrollbars when you zoom in or out. All points (vertices) are based on real-world positions (in meters) and are shown correctly on the screen. Different types of points, like “Order,” “Cash,” and “Merge,” are shown using different shapes and colors to make them easy to understand. Important points like "Order" or "Cash" are labeled in big, clear text (≥28px) so they can be easily read from 3 meters away.

The app has a dropdown in the top-left corner to switch between Lane 1 and Lane 2 without reloading the page. After 5 seconds the dropdown hides to keep the layout clean.

This project shows how the drive-thru industry can use technology to improve lane flow and make service more efficient.

## Technical Stack

FroontEnd - Angular 19.2.10 Vesrion 

Backend - angular-in-memory-web-api package 0.19.0 version

## Development server

To start a local development server, run:

1. Clone the project using the link https://github.com/Navyayalamat/summit.git

    git clone https://github.com/Navyayalamat/summit.git

2. Run the below command to install all packages 
   
    npm install

3. Run the server using the below command to start backend and angular server 
   
    npm start 

4. open the url http://localhost:4200 to launch the application in the browser 

5. Run the below command to run the test cases 
   
    npm test

## Scaling Algorithm

The scaling algorithm takes the real-world positions (in meters) of each point on the lane and fits them onto the screen. It calculates the right size for the lane based on the space available on the screen (1920×1080). The algorithm checks the area where the lane fits and changes the size of the points to keep the shape correct. This keeps the lane looking good on the screen, without stretching or shrinking, and makes sure there are no scrollbars, no matter how much you zoom in or out on the browser.


