/*
LeetCode 370. Range Addition
Link: https://leetcode.com/problems/range-addition/

Question:
You are given an integer length and an array of updates where each update is
[startIndex, endIndex, inc]. You need to apply all updates to an initially
zero-initialized array of size length, where for each update you add inc to
every element in the subarray nums[startIndex..endIndex] inclusive. Return the
resulting array after all updates are applied.

Constraints:
- 1 <= length <= 10^5
- 0 <= updates.length <= 10^5
- updates[i].length == 3
- 0 <= startIndex <= endIndex < length
- -10^5 <= inc <= 10^5

Approach (Difference Array + Prefix Sum):
- Maintain diff of size length + 1 initialized to 0.
- For each update [l, r, inc]: diff[l] += inc; if (r + 1 < length) diff[r + 1] -= inc.
- The final array is the prefix sum over diff for indices [0..length-1].

Complexity:
- Time: O(length + |updates|)
- Space: O(length)
*/

#include <vector>

class Solution {
public:
    std::vector<int> getModifiedArray(int length, std::vector<std::vector<int>>& updates) {
        std::vector<int> diff(length + 1, 0);
        for (size_t i = 0; i < updates.size(); ++i) {
            int l = updates[i][0];
            int r = updates[i][1];
            int inc = updates[i][2];
            diff[l] += inc;
            if (r + 1 < length) diff[r + 1] -= inc;
        }
        std::vector<int> ans(length, 0);
        int run = 0;
        for (int i = 0; i < length; ++i) {
            run += diff[i];
            ans[i] = run;
        }
        return ans;
    }
};