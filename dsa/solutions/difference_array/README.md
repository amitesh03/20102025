# Difference Array (Range updates in O(1) each)

Focus: Efficient range increment updates by marking only boundaries and reconstructing values via a final prefix sum.

Core patterns:
- Single-range updates with diff[l] += x and diff[r+1] -= x (if within bounds)
- Multiple updates aggregated in the diff array, then prefix sum to obtain final array values
- Recover final array by prefix sum over diff

Covered (from syllabus and extras):
- 370 Range Addition
- 1109 Corporate Flight Bookings
- 1854 Maximum Population Year

Implemented:
- 370 Range Addition
  - File: solutions/difference_array/0370_range_addition.cpp
  - Technique: diff[l] += inc; if (r + 1 < length) diff[r + 1] -= inc; prefix sum to recover.
  - Complexity: O(length + updates) time, O(length) space.
- 1109 Corporate Flight Bookings
  - File: solutions/difference_array/1109_corporate_flight_bookings.cpp
  - Technique: diff[l - 1] += seats; if (r < n) diff[r] -= seats; prefix sum to recover.
  - Complexity: O(n + m) time, O(n) space.

Planned (to be added):
- 1854 Maximum Population Year

Notes:
- All solutions use C++ STL (vector) with top-of-file problem headers.
- Editor IntelliSense may show false STL errors; code targets LeetCode toolchains.