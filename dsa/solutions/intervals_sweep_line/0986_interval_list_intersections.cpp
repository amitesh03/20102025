/*
LeetCode 986. Interval List Intersections
Link: https://leetcode.com/problems/interval-list-intersections/

Question:
You are given two lists of closed intervals, firstList and secondList, where firstList[i] = [start_i, end_i] and
secondList[j] = [start_j, end_j]. Each list is pairwise disjoint and in sorted order. Return their intersections.

Constraints:
- 0 <= firstList.length, secondList.length <= 1e4
- firstList[i].length == 2, secondList[j].length == 2
- 0 <= start <= end <= 1e9

Approach (Two pointers):
- Maintain i over firstList and j over secondList.
- Current overlap is [max(a.start, b.start), min(a.end, b.end)] if start <= end.
- Advance the interval that ends first.

Complexity:
- Time: O(n + m)
- Space: O(1) extra (excluding the output)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> intervalIntersection(std::vector<std::vector<int>>& firstList,
                                                       std::vector<std::vector<int>>& secondList) {
        std::vector<std::vector<int>> res;
        int i = 0, j = 0;
        const int n = static_cast<int>(firstList.size());
        const int m = static_cast<int>(secondList.size());
        while (i < n && j < m) {
            int s = std::max(firstList[i][0], secondList[j][0]);
            int e = std::min(firstList[i][1], secondList[j][1]);
            if (s <= e) res.push_back({s, e});
            if (firstList[i][1] < secondList[j][1]) {
                ++i;
            } else {
                ++j;
            }
        }
        return res;
    }
};