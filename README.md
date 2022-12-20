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
