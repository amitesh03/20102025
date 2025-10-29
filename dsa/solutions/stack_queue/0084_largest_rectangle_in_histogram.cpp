/*
LeetCode 84. Largest Rectangle in Histogram
Link: https://leetcode.com/problems/largest-rectangle-in-histogram/

Question:
Given an array of integers heights representing the histogram's bar height where the width of each bar is 1,
return the area of the largest rectangle in the histogram.

Constraints:
- 1 <= heights.length <= 10^5
- 0 <= heights[i] <= 10^4
*/

#include <vector>
#include <stack>
#include <cstddef>

class Solution {
public:
    int largestRectangleArea(std::vector<int>& heights) {
        std::size_t n = heights.size();
        std::stack<std::size_t> st; // store indices of bars, heights increasing
        long long maxArea = 0;
        for (std::size_t i = 0; i <= n; ++i) {
            int h = (i < n) ? heights[i] : 0; // sentinel 0 at end to flush stack
            while (!st.empty() && h < heights[st.top()]) {
                std::size_t idx = st.top(); st.pop();
                int height = heights[idx];
                std::size_t leftBound = st.empty() ? 0 : st.top() + 1;
                std::size_t width = i - leftBound;
                long long area = 1LL * height * width;
                if (area > maxArea) maxArea = area;
            }
            st.push(i);
        }
        return static_cast<int>(maxArea);
    }
};

/*
Approach:
- Use a monotonic increasing stack storing indices. When current height is less than the height at stack top,
  pop and compute area using the popped bar as the smallest bar: width is between previous lower bar + 1
  and current index i - 1. Append a sentinel 0 height to flush all remaining bars.

Complexity:
- Time: O(n)
- Space: O(n)
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::vector<int> h1 = {2,1,5,6,2,3};
    std::cout << sol.largestRectangleArea(h1) << "\n"; // 10
    std::vector<int> h2 = {2,4};
    std::cout << sol.largestRectangleArea(h2) << "\n"; // 4
    std::vector<int> h3 = {0,0,0};
    std::cout << sol.largestRectangleArea(h3) << "\n"; // 0
    return 0;
}
#endif