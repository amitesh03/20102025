/*
LeetCode 1011. Capacity To Ship Packages Within D Days
Link: https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/

Question:
Given an array weights where weights[i] is the weight of the i-th package, and a number days,
we want to ship all packages in order within days days. Each day, we load packages onto the ship
up to the ship's capacity and ship them. Return the least weight capacity of the ship such that
the packages can be shipped within days days.

Constraints:
- 1 <= weights.length <= 5 * 10^4
- 1 <= weights[i] <= 500
- 1 <= days <= weights.length

Approach (Binary Search on Answer):
- Capacity is monotonic: if capacity C works (can ship in <= days), any larger capacity works.
- Lower bound lo = max(weights[i]) (must fit the heaviest single package).
- Upper bound hi = sum(weights[i]) (all packages in one day).
- Binary search C in [lo..hi], using a feasibility check that simulates day loading with capacity C.

Complexity:
- Time: O(n log(sum(weights))) where n = weights.size()
- Space: O(1)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    int shipWithinDays(std::vector<int>& weights, int days) {
        int n = static_cast<int>(weights.size());
        int lo = 0, hi = 0;
        // compute bounds
        for (int i = 0; i < n; ++i) {
            if (weights[i] > lo) lo = weights[i];
            hi += weights[i];
        }
        while (lo < hi) {
            int mid = lo + ((hi - lo) >> 1);
            if (feasible(weights, days, mid)) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
    }

private:
    bool feasible(const std::vector<int>& w, int days, int cap) {
        int usedDays = 1;
        int load = 0;
        int n = static_cast<int>(w.size());
        for (int i = 0; i < n; ++i) {
            if (load + w[i] > cap) {
                ++usedDays;
                load = 0;
            }
            load += w[i];
            if (usedDays > days) return false;
        }
        return true;
    }
};