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

## Cost Tracking Tool
This part of the project concerns the Cost Tracking Template spreadsheet. Given the project inputs battery count, charge controller count, interver count, PV counts, site size and non auto-generated costs we want to arrive at a final cummulative cost for the total project

##### costTracking.js 
Helper functions batteryCost(bCount), inverterCost(iV), ccCost(ccC), PVCost(pvC) calculates all the half auto-generated budget.
CalculateC0 calculates the cumulative cost by adding all the non auto-generated, auto-generated and half auto-generated

## Optimizer
This part of the project concerns the optimizing engineering inputs using Gradient Descent optimizer. Given the constrains 
number of batteries (y) and charge controllers (z), we would want to maximize IRR function f(y,z) in 2 dimensions.

The algorithm for the optimization function is as follow 
* stopping criteria: when we loop back to (x,y,z) that we visited before where x is the PV count 
1. have an inital guess for y (battery count) and z (charge controller count)
2. find the discrete derivative of increasing the number of battery count by 1 - dy
3. find the discrete derivative of increasing the number of battery count by 1 - dz
4. adjust the number of battery count and charge controller count based on the maximum of dy and dz
5. continue the algorithm until meets the stopping criteria

## DC Power Production API
After finishing with the logic and calculations of the project, we proceeded with loading the DC power production dynamically based on the input of user by calling https://pvwatts.nrel.gov/pvwatts.php API. We call the API using longitude, latitude, system capacity, module type, PV losses, array type, titl and azimuth input from users. The code for API handler can be found in Data.js
```
fetch(`https://developer.nrel.gov/api/pvwatts/v8.json?api_key=Briy4bp8imL6tXQnBtfciedtG81I0uDOerZye4m3&lat=${lat}&lon=${lon}&system_capacity=${system_capacity}&module_type=${module_type}&losses=${PVlosses}&array_type=${array_type}&tilt=${tilt}&azimuth=${azimuth}&timeframe=${timeframe}`)
    .then(response => {
        // indicates whether the response is successful (status code 200-299) or not
        if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
    })
    .then(data => {
        powerProduction = data.outputs.dc
```
## User Interface
The last part of the project is to create a user interface for users to input system input and get a visualization of outputs. The code can be found in index.html. The UI is splitted into 3 parts. 
 1: Concerns system data input (required for both Simulate and Optimizer button)
 2: inputs to simulate the Minigrid Design Tool result
 3: inputs for Cost Tracking Template and inital guesses (required for Optimizer button)
 

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
