#ifndef DIESELGENERATOR_CPP
#define DIESELGENERATOR_CPP

#include <algorithm>
#include <string>
#include <memory>
#include <iostream>
#include <array>
#include <cassert>
#include "../include/Constants.h"

struct GeneratorResponse {
	double energy;
	double diesel;
};

class DieselGenerator {
	private:
		static const int NUM_LOADING_FRACS = 5;
		static const int NUM_GEN_SIZES = 26;
		static constexpr double GENERATOR_TABLE[NUM_GEN_SIZES][NUM_LOADING_FRACS] = {
			{0.0,  0.3,  0.5,   0.7,   0.8},
			{0.0,  0.6,  0.9,   1.3,   1.6},
			{0.0,  1.3,  1.8,   2.4,   2.9},
			{0.0,  1.6,  2.3,   3.2,   4.0},
			{0.0,  1.8,  2.9,   3.8,   4.8},
			{0.0,  2.4,  3.4,   4.6,   6.1},
			{0.0,  2.6,  4.1,   5.8,   7.4},
			{0.0,  3.1,  5.0,   7.1,   9.1},
			{0.0,  3.3,  5.4,   7.6,   9.8},
			{0.0,  3.6,  5.9,   8.4,  10.9},
			{0.0,  4.1,  6.8,   9.7,  12.7},
			{0.0,  4.7,  7.7,  11.0,  14.4},
			{0.0,  5.3,  8.8,  12.5,  16.6},
			{0.0,  5.7,  9.5,  13.6,  18.0},
			{0.0,  6.8, 11.3,  16.1,  21.5},
			{0.0,  7.9, 13.1,  18.7,  25.1},
			{0.0,  8.9, 14.9,  21.3,  28.6},
			{0.0, 11.0, 18.5,  26.4,  35.7},
			{0.0, 13.2, 22.0,  31.5,  42.8},
			{0.0, 16.3, 27.4,  39.3,  53.4},
			{0.0, 21.6, 36.4,  52.1,  71.1},
			{0.0, 26.9, 45.3,  65.0,  88.8},
			{0.0, 32.2, 54.3,  77.8, 106.5},
			{0.0, 37.5, 63.2,  90.7, 124.2},
			{0.0, 42.8, 72.2, 103.5, 141.9},
			{0.0, 48.1, 81.1, 116.4, 159.6}
		};
		static constexpr double LOADING_FRAC_HEADERS[NUM_LOADING_FRACS] = {0, 0.25, 0.5, 0.75, 1.0};
		static constexpr double GEN_SIZE_HEADERS[NUM_GEN_SIZES] = {10, 20, 30, 40, 60, 75, 100, 125, 135, 150, 175, 200, 230, 250, 300, 350, 400, 500, 600, 750, 1000, 125, 1500, 1750, 2000, 2250};
		
		static std::array<double, NUM_LOADING_FRACS> getGeneratorRow(double ratedPower) {
			std::array<double, NUM_LOADING_FRACS> generatorRow;
			for (int p=0; p<NUM_GEN_SIZES; p++) {
				if (ratedPower == GEN_SIZE_HEADERS[p]) {
					std::copy(std::begin(GENERATOR_TABLE[p]), std::end(GENERATOR_TABLE[p]), std::begin(generatorRow));
					return generatorRow;
				} else if (ratedPower < GEN_SIZE_HEADERS[p+1]) {
					double p_frac = (ratedPower-GEN_SIZE_HEADERS[p]) / (GEN_SIZE_HEADERS[p+1]-GEN_SIZE_HEADERS[p]);
					for (int l=0; l<NUM_LOADING_FRACS; l++) {
						generatorRow[l] = GENERATOR_TABLE[p][l] + p_frac * (GENERATOR_TABLE[p+1][l]-GENERATOR_TABLE[p][l]);
					}
					return generatorRow;
				}
			}
		}
		
		const double ratedPower;
		const double price;
		double runHours;
		double dieselConsumed;
		bool turnedOn;
		double currentOutput;
		const std::array<double, NUM_LOADING_FRACS> generatorRow;

	public:
		DieselGenerator(double ratedPower, double price) : ratedPower(ratedPower), price(price), runHours(0), dieselConsumed(0), turnedOn(false), currentOutput(0), generatorRow(getGeneratorRow(ratedPower)) {
			assert((ratedPower < *std::min_element(std::begin(GEN_SIZE_HEADERS), std::end(GEN_SIZE_HEADERS)) || ratedPower > *std::max_element(std::begin(GEN_SIZE_HEADERS), std::end(GEN_SIZE_HEADERS))) && ("Diesel genset power " + std::to_string(ratedPower) + " is outside the range [" + std::to_string(*std::min_element(std::begin(GEN_SIZE_HEADERS), std::end(GEN_SIZE_HEADERS))) + "," + std::to_string(*std::max_element(std::begin(GEN_SIZE_HEADERS), std::end(GEN_SIZE_HEADERS))) + "].").c_str());
		}

		// Getters
		double getRatedPower() const { return ratedPower; }
		double getPrice() const { return price; }
		double getRunHours() const { return runHours; }
		double getDieselConsumed() const { return dieselConsumed; }
		double getCurrentOutput() const { return currentOutput; }
		bool isOn() const { return turnedOn; }

		bool canSupply(double energy, double time) {
			return energy/time<=ratedPower;
		}

		void turnOn() {
			turnedOn = true;
		}

		void turnOff() {
			turnedOn = false;
		}

		/**
		 * Request generator supply power. Updates diesel consumption, run hours, and current output.
		 *
		 * @param {number} power - Amount of power requested from the generator.
		 * @param {number} dt - Amount of time to run.
		 * @returns {Object} - An object with two keys:
		 * - energy {number} Amount of energy supplied during dt.
		 * - diesel {number} Amount of diesel consumed during dt.
		 */
		GeneratorResponse supply(double power, double dt) {
			double loadingFrac = power/ratedPower;
			if (loadingFrac > *std::max_element(std::begin(LOADING_FRAC_HEADERS), std::end(LOADING_FRAC_HEADERS))) {
				std::cerr << "Generator asked to supply " << power << ", but can only supply " << ratedPower << std::endl;
				power = ratedPower;
				loadingFrac = 1.0;
			}

			double galPerHr = -1;
			for (int l=0; l<NUM_LOADING_FRACS; l++) {
				if (loadingFrac == LOADING_FRAC_HEADERS[l]) {
					galPerHr = generatorRow[l];
				} else if (loadingFrac < LOADING_FRAC_HEADERS[l+1]) {
					double l_frac = (loadingFrac - LOADING_FRAC_HEADERS[l]) / (LOADING_FRAC_HEADERS[l+1] - LOADING_FRAC_HEADERS[l]);
					galPerHr = generatorRow[l] + l_frac*(generatorRow[l+1] - generatorRow[l]);
				}
			}
			if (galPerHr == -1) { throw std::runtime_error("I wasn't able to compute the amount of diesel consumed per hour."); }

			double lPerHr = galPerHr*Global::L_PER_GAL;

			dieselConsumed+= lPerHr*dt;
			runHours+= dt;
			currentOutput = power;
			return {
				energy: power*dt,
				diesel: lPerHr*dt
			};
		}
};

#endif // DIESELGENERATOR_CPP