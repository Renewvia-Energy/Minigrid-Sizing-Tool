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
	std::vector<T> map_vector(const std::vector<T>& input, Func f) {
		std::vector<T> result;
		result.reserve(input.size());
		std::transform(input.begin(), input.end(), std::back_inserter(result), f);
		return result;
	}

	template<typename T>
	std::vector<std::unique_ptr<T>> copy_unique_ptr_vector(const std::vector<std::unique_ptr<T>>& input) {
		return napps::map_vector(input, [](const auto& ptr) { return std::make_unique<T>(*ptr); });
	}
}

#endif // NAPPS_H