/*
LeetCode 11. Container With Most Water
Link: https://leetcode.com/problems/container-with-most-water/

Question:
Given n non-negative integers height[i] representing the height of vertical lines on the x-axis,
find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water a container can store.

Constraints:
- n == height.length
- 2 <= n <= 10^5
- 0 <= height[i] <= 10^4

Approach (Two Pointers):
- Use two pointers i (left) and j (right). Area = min(height[i], height[j]) * (j - i).
- Move the pointer pointing to the smaller height inward, since moving the taller one cannot increase area if width shrinks.
- Track the maximum area encountered.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    int maxArea(std::vector<int>& height) {
        int i = 0, j = static_cast<int>(height.size()) - 1;
        long long best = 0;
        while (i < j) {
            int h = std::min(height[i], height[j]);
            long long area = 1LL * h * (j - i);
            if (area > best) best = area;
            if (height[i] < height[j]) {
                ++i;
            } else {
                --j;
            }
        }
        return static_cast<int>(best);
    }
};