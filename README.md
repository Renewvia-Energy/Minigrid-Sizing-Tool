# Minigrid Design Tool. 
The goal of this project is to optimize two engineering input battery count and charger controller count so that we can arrive at the most profitable IRR while still provide sufficient electricity to customer. In order to do that, we splitted the project into three part. 
## Simulation:  
This part of the project concerns the Minigrid Design Tool spreadsheet. Given the project inputs (for example: generator size, load, battery count, charge controller count, interver count) we want to arrive at a final results display the amount of electricity we sell to customer, cost for turning on the generator, yealy demands, etc. 

The backbone of system data is found in data.js and src/System.js. 
##### data.js 
Contains price for auto-generated cost,loading percentage, generator size and DC power production for the project. 
##### System.js 
Contains constructor for Battery, PV, Interver and Generator classes. 

##### Simulation.js
Calculation function contains formulas to calculate the following for every hour
```
    var available_solar_from_array
    var available_solar_from_inverters;
    var load_with_distribution_losses;
    var total_solar_to_load;
    var load_remaining_after_solar;
    var solar_remaining;
    var solar_into_battery;
    var battery_available_to_load;
    var battery_to_load;
    var load_remain_after_battery;
    var generator_load;
    var load_shedding;
    var wasted_solar;
    var generator_loading;
    var generator_fuel
```
Simulation function use a while loop to call calulation iteratively to gather data throughout the 24 hours for a year and return all the above information to displays for users and/or use it for optimizer function

## Project Overview. 

```
|
|   +-- docs
|           +-- ExpenseClassDesign.txt      Throughout plan to generate the original budget table in Cost Tracking Tool spreadsheet
|           +-- GradientDescent.txt         Throughout plan to optimize the engineering inputs
|
|   +-- images                      
|       +-- logo.png                     Renewvia logo
|
|   +-- src                              Source code
|       +-- data.js                          Contains price for auto-generated cost,loading percentage, generator size and button handler to call DC power production API
|       +-- IRRCalculator.js                 Contains function to calculate IRR for the project
|       +-- System.js                        System data for Battery, Generator, PV, Inverter
|       +-- costTracking.js                  Contains calculations and formular to generate the total cost follow Cost Tracking Tool spreadsheet
|       +-- gradientOptimization.js          Complete function to optimize the engineering inputs and optimizer button handler
|       +-- simulation.js                    Simulation function to generate Minigrid Design Tool spreadsheet
|   +-- index.html                      UI for users to enter project input and displays output
|   +-- main.css                        CSS stylesheet for index.html
```
