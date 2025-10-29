/*
LeetCode 875. Koko Eating Bananas
Link: https://leetcode.com/problems/koko-eating-bananas/

Question:
Koko loves to eat bananas. There are piles of bananas, piles[i] bananas in the i-th pile.
The guards have gone and will come back in h hours. Koko can decide her banana-eating speed k (bananas per hour).
Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas,
she eats all of them and will not eat any more bananas during this hour.
Return the minimum integer k such that she can eat all the bananas within h hours.

Constraints:
- 1 <= piles.length <= 1e5
- 1 <= piles[i] <= 1e9
- piles.length <= h <= 1e9

Approach (Binary Search on Answer):
- The feasible predicate: for a given speed k, total hours = sum(ceil(pile / k)) across piles; feasible if hours <= h.
- k is monotonic: if k works, any larger k also works. Binary search k in [1, max(piles)].

Complexity:
- Time: O(n log max(piles))
- Space: O(1)
*/

#include <vector>
#include <algorithm>
#include <cstdint>

class Solution {
public:
    int minEatingSpeed(const std::vector<int>& piles, int h) {
        int lo = 1;
        int hi = 0;
        for (int x : piles) hi = std::max(hi, x);
        auto feasible = [&](int k) {
            long long hours = 0;
            for (int x : piles) {
                hours += (x + k - 1) / k; // ceil division
                if (hours > h) return false;
            }
            return hours <= h;
        };
        while (lo < hi) {
            int mid = lo + ((hi - lo) >> 1);
            if (feasible(mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
};