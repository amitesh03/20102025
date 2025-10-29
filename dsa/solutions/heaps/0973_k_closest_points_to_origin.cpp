/*
LeetCode 973. K Closest Points to Origin
Link: https://leetcode.com/problems/k-closest-points-to-origin/

Question:
Given an array of points where points[i] = [xi, yi] representing a point on the X-Y plane and an integer k,
return the k closest points to the origin (0, 0).
The distance between two points on the X-Y plane is the Euclidean distance.
You may return the answer in any order.

Constraints:
- 1 <= k <= points.length <= 1e4
- -1e4 <= xi, yi <= 1e4

Approach (nth_element, O(n)):
- Compare by squared distance to avoid sqrt and preserve order of closeness.
- Use std::nth_element to partition so that first k elements are the k closest in arbitrary order.
- Resize to k and return.

Complexity:
- Time: O(n) average, O(n log n) worst case depending on implementation
- Space: O(1) extra (in-place)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> kClosest(std::vector<std::vector<int>>& points, int k) {
        auto dist2 = [](const std::vector<int>& p)->long long {
            return 1LL * p[0] * p[0] + 1LL * p[1] * p[1];
        };
        if (k <= 0) return {};
        if (k >= static_cast<int>(points.size())) return points;
        std::nth_element(points.begin(), points.begin() + k, points.end(),
                         [&](const std::vector<int>& a, const std::vector<int>& b) {
                             return dist2(a) < dist2(b);
                         });
        points.resize(k);
        return points;
    }
};