/*
LeetCode 239. Sliding Window Maximum
Link: https://leetcode.com/problems/sliding-window-maximum/

Question:
You are given an array of integers nums, and there is a sliding window of size k which is
moving from the very left of the array to the very right. You can only see the k numbers
in the window. Each time the sliding window moves right by one position. Return the max
sliding window.

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
- 1 <= k <= nums.length

Approach (Monotonic Deque of indices):
- Maintain a deque of indices with values in decreasing order.
- For each index i:
  * Pop front if it is out of the current window (i - dq.front() >= k).
  * Pop back while nums[dq.back()] <= nums[i] to keep values decreasing.
  * Push i to back.
  * When the first full window forms (i + 1 >= k), record nums[dq.front()] as the maximum.
- Each index is pushed/popped at most once, giving linear complexity.

Complexity:
- Time: O(n)
- Space: O(k) for the deque, O(n) for the result
*/

#include <vector>
#include <deque>

class Solution {
public:
    std::vector<int> maxSlidingWindow(std::vector<int>& nums, int k) {
        int n = (int)nums.size();
        std::deque<int> dq; // stores indices, values are in decreasing order
        std::vector<int> res;
        res.reserve(n > 0 ? n - k + 1 : 0);

        for (int i = 0; i < n; ++i) {
            // Remove indices out of window
            if (!dq.empty() && dq.front() <= i - k) dq.pop_front();

            // Maintain decreasing order
            while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();

            dq.push_back(i);

            // Record result when window is full
            if (i + 1 >= k) {
                res.push_back(nums[dq.front()]);
            }
        }
        return res;
    }
};