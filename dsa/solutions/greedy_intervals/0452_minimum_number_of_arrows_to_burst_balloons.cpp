/*
LeetCode 452. Minimum Number of Arrows to Burst Balloons
Link: https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/

Question:
Given a set of balloons represented as intervals [start, end] on a horizontal axis,
determine the minimum number of arrows required to burst all balloons. An arrow shot at x
bursts all balloons with start <= x <= end.

Constraints:
- 1 <= points.length <= 10^5
- points[i].length == 2
- -2^31 <= points[i][0] <= points[i][1] <= 2^31 - 1

Approach (Greedy by end-coordinate):
- Sort intervals by their end value ascending.
- Shoot the first arrow at the end of the first interval; this bursts all intervals whose start <= arrow_x.
- For each subsequent interval, if its start > arrow_x, we need a new arrow at this interval's end.

Complexity:
- Time: O(n log n) for sorting
- Space: O(1) extra (in-place sort)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    int findMinArrowShots(std::vector<std::vector<int>>& points) {
        if (points.empty()) return 0;
        std::sort(points.begin(), points.end(), [](const std::vector<int>& a, const std::vector<int>& b){
            if (a[1] != b[1]) return a[1] < b[1];
            return a[0] < b[0];
        });
        long long arrowX = static_cast<long long>(points[0][1]);
        int arrows = 1;
        for (size_t i = 1; i < points.size(); ++i) {
            if (static_cast<long long>(points[i][0]) > arrowX) {
                ++arrows;
                arrowX = static_cast<long long>(points[i][1]);
            }
        }
        return arrows;
    }
};