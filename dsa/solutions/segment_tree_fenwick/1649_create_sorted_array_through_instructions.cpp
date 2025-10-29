/*
LeetCode 1649. Create Sorted Array through Instructions
Link: https://leetcode.com/problems/create-sorted-array-through-instructions/

Question:
Given an array instructions, process the elements in order. For each element instructions[i],
the cost is min(count of elements less than instructions[i], count of elements greater than instructions[i]).
Return the total cost modulo 1e9+7.

Constraints:
- 1 <= instructions.length <= 10^5
- 1 <= instructions[i] <= 10^5

Approach (Fenwick/BIT with coordinate compression):
- We need dynamic counts of values < x and > x among previously processed elements.
- Use coordinate compression on instructions to map values to ranks [1..M].
- Maintain a Fenwick Tree over ranks that stores counts of inserted elements.
- For each x (rank r):
  - less = bit.sum(r - 1)
  - greater = i - bit.sum(r)   (i = number of elements processed so far)
  - add min(less, greater) to answer, then bit.add(r, 1).
- Fenwick ops are O(log M), total O(n log n) including compression.

Complexity:
- Time: O(n log n)
- Space: O(n) for Fenwick and compression arrays
*/

#include <vector>
#include <algorithm>
#include <cstdint>

static constexpr int MOD = 1'000'000'007;

struct Fenwick {
    int n;
    std::vector<int> bit; // 1-indexed
    explicit Fenwick(int n_) : n(n_), bit(n_ + 1, 0) {}
    // add value v at index i
    void add(int i, int v) {
        for (; i <= n; i += i & -i) {
            bit[i] += v;
        }
    }
    // prefix sum [1..i]
    int sum(int i) const {
        int s = 0;
        for (; i > 0; i -= i & -i) {
            s += bit[i];
        }
        return s;
    }
};

class Solution {
public:
    int createSortedArray(std::vector<int>& instructions) {
        int n = static_cast<int>(instructions.size());
        if (n == 0) return 0;

        // Coordinate compression
        std::vector<int> vals = instructions;
        std::sort(vals.begin(), vals.end());
        vals.erase(std::unique(vals.begin(), vals.end()), vals.end());

        auto getRank = [&](int x) -> int {
            // ranks are 1-based
            return static_cast<int>(std::lower_bound(vals.begin(), vals.end(), x) - vals.begin()) + 1;
        };

        Fenwick fw(static_cast<int>(vals.size()));
        long long ans = 0;

        for (int i = 0; i < n; ++i) {
            int r = getRank(instructions[i]);
            int less = fw.sum(r - 1);
            int greater = i - fw.sum(r);
            ans += std::min(less, greater);
            if (ans >= MOD) ans %= MOD; // keep bounded
            fw.add(r, 1);
        }

        return static_cast<int>(ans % MOD);
    }
};