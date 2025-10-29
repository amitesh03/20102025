/*
LeetCode 862. Shortest Subarray with Sum at Least K
Link: https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/

Question:
Given an integer array nums and an integer k, return the length of the shortest non-empty
subarray of nums with a sum of at least k. If there is no such subarray, return -1.

Constraints:
- 1 <= nums.length <= 10^5
- -10^5 <= nums[i] <= 10^5
- 1 <= k <= 10^9

Approach (Prefix Sum + Monotonic Deque of indices):
- Compute prefix sums P[0..n], where P[i] = sum(nums[0..i-1]).
- Maintain a deque of indices with increasing prefix sums:
  * While current prefix sum P[i] - P[dq.front()] >= k, update answer and pop_front() to seek shorter window.
  * While deque is non-empty and P[i] <= P[dq.back()], pop_back() to keep the deque monotonic increasing.
- Push i into deque each iteration.
- Use long long for prefix sums to avoid overflow.

Complexity:
- Time: O(n), each index pushed/popped at most once
- Space: O(n) for prefix sums and deque
*/

#include <vector>
#include <deque>
#include <climits>
#include <algorithm>

class Solution {
public:
    int shortestSubarray(std::vector<int>& nums, int k) {
        int n = (int)nums.size();
        std::vector<long long> pref(n + 1, 0);
        for (int i = 0; i < n; ++i) {
            pref[i + 1] = pref[i] + (long long)nums[i];
        }

        std::deque<int> dq;
        int ans = n + 1;

        for (int i = 0; i <= n; ++i) {
            // Try to satisfy sum >= k using the smallest index at front
            while (!dq.empty() && pref[i] - pref[dq.front()] >= (long long)k) {
                ans = std::min(ans, i - dq.front());
                dq.pop_front();
            }
            // Maintain increasing prefix sums in deque
            while (!dq.empty() && pref[i] <= pref[dq.back()]) {
                dq.pop_back();
            }
            dq.push_back(i);
        }

        return ans <= n ? ans : -1;
    }
};