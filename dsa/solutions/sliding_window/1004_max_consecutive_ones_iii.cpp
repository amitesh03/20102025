/*
LeetCode 1004. Max Consecutive Ones III
Link: https://leetcode.com/problems/max-consecutive-ones-iii/

Question:
Given a binary array nums and an integer k, return the maximum number of consecutive 1s
in the array if you can flip at most k 0s.

Constraints:
- 1 <= nums.length <= 10^5
- nums[i] is either 0 or 1
- 0 <= k <= nums.length

Approach (Sliding Window with zero budget):
- Maintain a window [l..r] and a counter of zeros inside the window.
- Expand r; when zeros exceeds k, shrink l until zeros <= k.
- The window size is the current number of consecutive ones achievable with up to k flips.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    int longestOnes(std::vector<int>& nums, int k) {
        int n = (int)nums.size();
        int l = 0;
        int zeros = 0;
        int best = 0;

        for (int r = 0; r < n; ++r) {
            if (nums[r] == 0) ++zeros;
            while (zeros > k) {
                if (nums[l] == 0) --zeros;
                ++l;
            }
            best = std::max(best, r - l + 1);
        }
        return best;
    }
};