#include <iostream>
#include <vector>
#include <memory>

class Vehicle {
public:
    virtual void display() const = 0; // Pure virtual function making this class abstract
    virtual ~Vehicle() = default; // Virtual destructor
};

class Car : public Vehicle {
public:
    void display() const override {
        std::cout << "This is a car." << std::endl;
    }
};

class Bike : public Vehicle {
public:
    void display() const override {
        std::cout << "This is a bike." << std::endl;
    }
};

template <typename T, typename = std::enable_if_t<std::is_base_of<Vehicle, T>::value>>
class VehicleGroup {
protected:
    std::vector<T> vehicles;
public:
	VehicleGroup(std::vector<T> vehicleList) : vehicles(vehicleList) {}
    void displayVehicles() const {
		for (auto& vehicle : vehicles) {
			vehicle.display();
		}
	}
    virtual ~VehicleGroup() = default; // Virtual destructor
};

class CarGroup : public VehicleGroup<Car> {
public:
    CarGroup(std::vector<Car> vehicleList) : VehicleGroup<Car>(vehicleList) {}
};

class BikeGroup : public VehicleGroup<Bike> {
public:
    BikeGroup(std::vector<Bike> vehicleList) : VehicleGroup<Bike>(vehicleList) {}
};

int main() {
    try {
        std::vector<Car> cars = { Car(), Car() };
        std::vector<Bike> bikes = { Bike(), Bike(), Bike() };

        CarGroup carGroup(cars);
        BikeGroup bikeGroup(bikes);
        // Uncomment the following line to see the compiler reject
		// BikeGroup bikeGroup(cars);

        carGroup.displayVehicles();
        bikeGroup.displayVehicles();
    } catch (const std::invalid_argument& e) {
        std::cerr << e.what() << std::endl;
    }

    return 0;
}