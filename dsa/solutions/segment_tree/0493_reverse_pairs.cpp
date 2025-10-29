/*
LeetCode 493. Reverse Pairs
Link: https://leetcode.com/problems/reverse-pairs/

Question:
Given an integer array nums, return the number of reverse pairs in the array.
A reverse pair is a pair (i, j) where 0 <= i < j < nums.length and nums[i] > 2 * nums[j].

Constraints:
- 1 <= nums.length <= 5 * 10^4
- -2^31 <= nums[i] <= 2^31 - 1
*/

#include <vector>
#include <algorithm>
#include <cstddef>
#include <cstdint>

class Solution {
private:
    static inline int lowbit(int x) { return x & -x; }

    void add(std::vector<int>& bit, int idx, int delta) {
        for (int i = idx; i < static_cast<int>(bit.size()); i += lowbit(i)) bit[i] += delta;
    }

    int sumPrefix(const std::vector<int>& bit, int idx) const {
        int s = 0;
        for (int i = idx; i > 0; i -= (i & -i)) s += bit[i];
        return s;
    }

public:
    int reversePairs(std::vector<int>& nums) {
        const int n = static_cast<int>(nums.size());
        if (n <= 1) return 0;

        // Coordinate compression over both nums and 2*nums to support threshold queries
        std::vector<long long> vals;
        vals.reserve(static_cast<std::size_t>(2 * n));
        for (int i = 0; i < n; ++i) {
            vals.push_back(static_cast<long long>(nums[i]));
            vals.push_back(static_cast<long long>(2) * static_cast<long long>(nums[i]));
        }
        std::sort(vals.begin(), vals.end());
        vals.erase(std::unique(vals.begin(), vals.end()), vals.end());

        auto getIndex = [&](long long x) {
            // 1-indexed for Fenwick
            return static_cast<int>(std::lower_bound(vals.begin(), vals.end(), x) - vals.begin()) + 1;
        };
        auto upperIndex = [&](long long x) {
            // first index strictly greater than x (1-indexed)
            return static_cast<int>(std::upper_bound(vals.begin(), vals.end(), x) - vals.begin()) + 1;
        };

        std::vector<int> bit(static_cast<std::size_t>(vals.size() + 2), 0);
        long long ans = 0;

        // Process from left to right: at step j, count prior i with nums[i] > 2*nums[j]
        // countGreaterThan(2*nums[j]) among seen
        int seen = 0;
        for (int j = 0; j < n; ++j) {
            long long thr = static_cast<long long>(2) * static_cast<long long>(nums[j]);
            int idxGT = upperIndex(thr); // first index > thr
            int totalSeen = seen;
            int notGreater = sumPrefix(bit, idxGT - 1); // <= thr
            ans += static_cast<long long>(totalSeen - notGreater);

            // add current nums[j] into BIT
            int idxNum = getIndex(static_cast<long long>(nums[j]));
            add(bit, idxNum, 1);
            ++seen;
        }
        return static_cast<int>(ans);
    }
};

/*
Approach:
- Use coordinate compression on all values in nums and on doubled values (2*nums[i]).
- Traverse from left to right, maintaining a Fenwick Tree over seen nums[i].
- For each nums[j], the number of i < j such that nums[i] > 2*nums[j] equals:
  seen_count - count of values <= 2*nums[j], obtainable via BIT prefix sum with upper_bound(2*nums[j]).
- Add nums[j] into the BIT and continue.

Complexity:
- Time: O(n log n) due to sorting for compression and O(log n) updates/queries per element.
- Space: O(n) for compressed arrays and BIT.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::vector<int> a = {1,3,2,3,1};
    std::cout << sol.reversePairs(a) << "\n"; // 2
    std::vector<int> b = {2,4,3,5,1};
    std::cout << sol.reversePairs(b) << "\n"; // 3
    return 0;
}
#endif