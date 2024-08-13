#ifndef NAPPS_H
#define NAPPS_H

#include <vector>
#include <memory>
#include <algorithm>

namespace napps {
	/**
	 * Applies a function to each element of a vector of unique pointers and returns a new vector with the results.
	 *
	 * @tparam T The type of the elements in the input vector.
	 * @tparam Func The type of the function to apply to each element.
	 *
	 * @param input The vector of unique pointers to the elements.
	 * @param f The function to apply to each element.
	 *
	 * @return A new vector with the results of applying the function to each element of the input vector.
	 *
	 * @throws None
	 */
	template<typename T, typename Func>
	auto map_vector(const std::vector<T>& input, Func f) {
		std::vector<std::decay_t<decltype(f(*input.begin()))>> result;
		result.reserve(input.size());
		std::transform(input.begin(), input.end(), std::back_inserter(result), f);
		return result;
	}

	/**
	 * Copies a vector of unique pointers and returns a new vector with copied unique pointers.
	 *
	 * @param input The vector of unique pointers to copy.
	 *
	 * @return A new vector with copied unique pointers.
	 *
	 * @throws None
	 */
	template<typename T>
	std::vector<std::unique_ptr<T>> copyUniquePointerVector(const std::vector<std::unique_ptr<T>>& source) {
		std::vector<std::unique_ptr<T>> destination;
		destination.reserve(source.size());
		
		for (const auto& ptr : source) {
			if (ptr) {
				destination.push_back(std::make_unique<T>(*ptr));
			} else {
				destination.push_back(nullptr);
			}
		}
		
		return destination;
	}

	/**
	 * Finds the index of a given key in a vector.
	 *
	 * @tparam T The type of elements in the vector.
	 *
	 * @param v The vector in which to search.
	 * @param key The key for which to search.
	 *
	 * @return The index of the key in the vector, or -1 if the key is not found.
	 *
	 * @throws None.
	 */
	template<typename T>
	int indexOf(std::vector<T> v, T key) {
		typename std::vector<T>::iterator itr = std::find(v.begin(), v.end(), key);

		if (itr != v.end()) {
			return std::distance(v.begin(), itr);
		}
		return -1;
	}
}

#endif // NAPPS_H