/*
LeetCode 805. Split Array With Same Average
Link: https://leetcode.com/problems/split-array-with-same-average/

Question:
Given an integer array nums, split it into two non-empty subsets A and B such that the average of A equals the average of B.
Return true if such a split is possible, or false otherwise.

Constraints:
- 1 <= nums.length <= 30
- 0 <= nums[i] <= 10^4

Approach (Meet-in-the-Middle with sum normalization):
- Let n = nums.size(), S = sum(nums). A split with equal averages exists iff there is a non-empty proper subset
  with size k (1 <= k <= n-1) and sum Sk such that Sk / k = S / n -> n*Sk - k*S = 0.
- Transform each value: a[i] = nums[i] * n - S. Then the condition reduces to finding a non-empty proper subset whose sum is 0.
- Use meet-in-the-middle:
  - Split a into left and right halves.
  - Enumerate all subset sums in each half grouped by subset size.
  - If any non-empty subset in a half sums to 0 and its size is not n (always true within a half), return true.
  - Otherwise, check pairs of subset sizes (kL, kR) with 1 <= kL + kR <= n-1 such that sumL + sumR = 0 using hash sets.

Complexity:
- Time: O(2^(n/2) * n) to enumerate and check sums with hashing
- Space: O(2^(n/2)) to store sums
*/

#include <vector>
#include <unordered_set>
#include <algorithm>
#include <numeric>

class Solution {
public:
    bool splitArraySameAverage(std::vector<int>& nums) {
        const int n = static_cast<int>(nums.size());
        if (n <= 1) return false;

        // Sum and normalization
        const int S = std::accumulate(nums.begin(), nums.end(), 0);
        // Quick pruning: if no k in [1..n-1] makes (S * k) % n == 0, impossible
        bool feasibleK = false;
        for (int k = 1; k < n; ++k) {
            if ((S * k) % n == 0) { feasibleK = true; break; }
        }
        if (!feasibleK) return false;

        std::vector<int> a(nums.size());
        for (int i = 0; i < n; ++i) a[i] = nums[i] * n - S;

        // Split into two halves
        int mid = n / 2;
        std::vector<int> left(a.begin(), a.begin() + mid);
        std::vector<int> right(a.begin() + mid, a.end());
        const int nL = static_cast<int>(left.size());
        const int nR = static_cast<int>(right.size());

        // Enumerate subset sums grouped by count
        std::vector<std::vector<int>> sumsL(nL + 1);
        std::vector<std::vector<int>> sumsR(nR + 1);
        enumSumsByCount(left, sumsL);
        enumSumsByCount(right, sumsR);

        // If any non-empty subset in a half sums to 0, valid split exists (non-empty proper subset overall)
        for (int k = 1; k <= nL; ++k) {
            for (int s : sumsL[k]) {
                if (s == 0) return true;
            }
        }
        for (int k = 1; k <= nR; ++k) {
            for (int s : sumsR[k]) {
                if (s == 0) return true;
            }
        }

        // Build hash sets for right sums by count for O(1) lookups
        std::vector<std::unordered_set<int>> setR(nR + 1);
        for (int k = 0; k <= nR; ++k) {
            setR[k].reserve(sumsR[k].size() * 2 + 1);
            for (int s : sumsR[k]) setR[k].insert(s);
        }

        // Try combining left and right counts ensuring total subset size is in [1..n-1]
        for (int kL = 1; kL <= nL; ++kL) {
            // total size kL + kR <= n-1 -> kR <= n-1-kL
            int maxKR = std::min(nR, n - 1 - kL);
            if (maxKR < 0) continue;
            // Also allow kR >= 0
            for (int sL : sumsL[kL]) {
                // Need sR = -sL
                for (int kR = 0; kR <= maxKR; ++kR) {
                    if (setR[kR].find(-sL) != setR[kR].end()) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

private:
    static void enumSumsByCount(const std::vector<int>& arr, std::vector<std::vector<int>>& outByCount) {
        const int m = static_cast<int>(arr.size());
        const int total = 1 << m;
        for (int mask = 0; mask < total; ++mask) {
            int sum = 0;
            int cnt = 0;
            // Accumulate sum and count for this mask
            for (int i = 0; i < m; ++i) {
                if (mask & (1 << i)) {
                    sum += arr[i];
                    ++cnt;
                }
            }
            outByCount[cnt].push_back(sum);
        }
    }
};