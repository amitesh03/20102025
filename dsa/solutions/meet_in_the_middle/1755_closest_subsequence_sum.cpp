/*
LeetCode 1755. Closest Subsequence Sum
Link: https://leetcode.com/problems/closest-subsequence-sum/

Question:
Given an array nums and an integer goal, return the minimum absolute difference between the sum of any subsequence of nums and goal.
A subsequence can be empty. Choose subset sums to minimize |sum - goal|.

Constraints:
- 1 <= nums.length <= 40
- -10^7 <= nums[i] <= 10^7
- -10^9 <= goal <= 10^9

Approach (Meet-in-the-Middle without iterator dependencies):
- Split nums into two halves L and R of sizes nL and nR.
- Enumerate all subset sums of L -> sumsL (size 2^nL) and R -> sumsR (size 2^nR) using raw arrays.
- Sort sumsR; for each sumsL[x], binary search sumsR to find the closest to (goal - sumsL[x]).
- Track minimal absolute difference around the binary search pivot.
- Return the minimal difference; empty subset is naturally included.

Complexity:
- Time: O(2^(n/2)) for enumeration + sorting and searches
- Space: O(2^(n/2)) for subset sums
*/

#include <vector>
#include <algorithm>
#include <cstdint>
#include <cmath>
#include <memory>

static inline long long absll(long long x) { return x < 0 ? -x : x; }

class Solution {
public:
    int minAbsDifference(std::vector<int>& nums, int goal) {
        int n = (int)nums.size();
        int mid = n / 2;
        int nL = mid;
        int nR = n - mid;

        // Split into two raw arrays to avoid iterator-based constructions
        std::unique_ptr<int[]> left(new int[nL]);
        std::unique_ptr<int[]> right(new int[nR]);
        for (int i = 0; i < nL; ++i) left[i] = nums[i];
        for (int i = 0; i < nR; ++i) right[i] = nums[mid + i];

        int totalL = 1 << nL;
        int totalR = 1 << nR;
        std::unique_ptr<long long[]> sumsL(new long long[totalL]);
        std::unique_ptr<long long[]> sumsR(new long long[totalR]);

        // Enumerate subset sums for left half
        for (int mask = 0; mask < totalL; ++mask) {
            long long s = 0;
            for (int i = 0; i < nL; ++i) {
                if (mask & (1 << i)) s += left[i];
            }
            sumsL[mask] = s;
        }
        // Enumerate subset sums for right half
        for (int mask = 0; mask < totalR; ++mask) {
            long long s = 0;
            for (int i = 0; i < nR; ++i) {
                if (mask & (1 << i)) s += right[i];
            }
            sumsR[mask] = s;
        }

        // Sort sumsR with pointer range
        std::sort(sumsR.get(), sumsR.get() + totalR);

        long long ans = absll((long long)goal); // compare against empty subset sum = 0

        // Helper lambda: binary search first index with sumsR[idx] >= target
        auto lower_bound_idx = [&](long long target) -> int {
            int lo = 0, hi = totalR;
            while (lo < hi) {
                int m = lo + ((hi - lo) >> 1);
                if (sumsR[m] < target) lo = m + 1;
                else hi = m;
            }
            return lo;
        };

        // Scan all sumsL; check closest candidate(s) in sumsR
        for (int i = 0; i < totalL; ++i) {
            long long target = (long long)goal - sumsL[i];
            int idx = lower_bound_idx(target);
            if (idx < totalR) {
                long long diff = absll(target - sumsR[idx]);
                if (diff < ans) ans = diff;
            }
            if (idx > 0) {
                long long diff = absll(target - sumsR[idx - 1]);
                if (diff < ans) ans = diff;
            }
            if (ans == 0) return 0;
        }

        return (int)ans;
    }
};