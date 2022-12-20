#Minigrid Design Tool
#Project Overview
.
|
|   +-- docs
|       +-- src
|           +-- ExpenseClassDesign.txt      Throughout plan to generate the original budget table in Cost Tracking Tool spreadsheet
|           +-- GradientDescent.txt         Throughout plan to optimize the engineering inputs
|
|   +-- images                      
|       +-- logo.png                     Renewvia logo
|
|   +-- src                              Source code
|       +-- data.js                          Contains price for auto-generated cost,loading percentage, generator size and button handler to load DC power production
|       +-- IRRCalculator.js                 Contains function to calculate IRR for the project
|       +-- System.js                        System data for Battery, Generator, PV, Inverter
|       +-- costTracking.js                  Contains calculations and formular to generate the total cost follow Cost Tracking Tool spreadsheet
|       +-- gradientOptimization.js          Complete function to optimize the engineering inputs and optimizer button handler
|       +-- simulation.js                    Simulation function to generate Minigrid Design Tool spreadsheet
|   +-- index.html                      UI for users to enter project input and displays output
|   +-- main.css                        CSS stylesheet for index.html


.
|
+-- src
|   +-- marble_flow
|       +-- src
|           +-- blob_error_pub.cpp    Reads camera video feed and calculates and publishes position error.
|           +-- blob_tracker.hpp      Header file for high level CV algorithms.
|           +-- go_to.py              Command motion to specific joint angles for Sawyer.
|           +-- sawyer_comm.py        Receives position error from C++ and commands Sawyer to move.
|
+-- test                              Testing implementations of OpenCV algorithms in C++.
|   +-- DISP_RW                       Scripts to read and write image and video data.
|       +-- disp_cam.cpp              Read and display video data from webcam in real time.
|       +-- disp_pic.cpp              Read and display image from file.
|       +-- disp_vid.cpp              Read and display video from file.
|       +-- pixel_write.cpp           Draw line on image from file.
|   +-- OLDCV_code/                   OpenCV2 code.
|   +-- realsense                     Testing the RealSense camera.
|       +-- open_cam.cpp              Read and dispaly video data from RealSense camera.
|   +-- transforms                    Common image transformations.
|       +-- canny.cpp                 Canny edge detection on image from file.
|       +-- canny_cam.cpp             Canny edge detection on video data from camera.
|       +-- erode.cpp                 Erosion on video data from camera.
|       +-- simple_transform.cpp      Gaussian blur on image from file.
|   +-- blank.cpp                     Draw square.
|   +-- flow.cpp                      Optical flow.
|   +-- flow.hpp                      Optical flow header file.
|   +-- movie_maker.hpp               Header file to publish video data to file.
|   +-- plot_flow.cpp                 Use optical flow to estimate and plot position.
