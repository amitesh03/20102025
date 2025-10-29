/*
LeetCode 218. The Skyline Problem
Link: https://leetcode.com/problems/the-skyline-problem/

Question:
Given the positions and heights of several buildings along a 2D skyline, return the skyline formed by these buildings.
The skyline should be represented as a list of "key points" sorted by their x-coordinate. A key point is the left
endpoint of a horizontal line segment. There must be no consecutive horizontal lines of the same height.

Constraints:
- 1 <= buildings.length <= 10^4
- buildings[i].length == 3 and buildings[i] = [Li, Ri, Hi]
- 0 <= Li < Ri <= 2 * 10^9
- 1 <= Hi <= 2 * 10^9
*/

#include <vector>
#include <algorithm>
#include <set>
#include <cstddef>

class Solution {
public:
    std::vector<std::vector<int>> getSkyline(std::vector<std::vector<int>>& buildings) {
        std::vector<std::pair<int,int>> events;
        events.reserve(buildings.size() * 2);
        for (std::size_t i = 0; i < buildings.size(); ++i) {
            int L = buildings[i][0];
            int R = buildings[i][1];
            int H = buildings[i][2];
            events.emplace_back(L, -H); // building enters
            events.emplace_back(R, H);  // building leaves
        }
        std::sort(events.begin(), events.end(), [](const std::pair<int,int>& a, const std::pair<int,int>& b){
            if (a.first != b.first) return a.first < b.first;
            return a.second < b.second; // start (-H) before end (+H); among starts higher first
        });

        std::multiset<int> heights;
        heights.insert(0);
        int prev = 0;
        std::vector<std::vector<int>> res;
        res.reserve(events.size());

        for (std::size_t i = 0; i < events.size(); ++i) {
            int x = events[i].first;
            int h = events[i].second;
            if (h < 0) {
                heights.insert(-h);
            } else {
                auto it = heights.find(h);
                if (it != heights.end()) heights.erase(it);
            }
            int curr = *heights.rbegin();
            if (curr != prev) {
                if (!res.empty() && res.back()[0] == x) {
                    res.back()[1] = curr;
                } else {
                    res.push_back({x, curr});
                }
                prev = curr;
            }
        }
        return res;
    }
};

/*
Approach:
- Sweep line with events: for each building [L,R,H], create two events (L,-H) start, (R,H) end.
- Sort events by x asc, then height asc so starts come before ends at same x, and taller starts first.
- Maintain a multiset of active heights; after each event, the current max height is the skyline height.
- Add a key point whenever the max height changes; merge points at the same x.

Complexity:
- Time: O(n log n) due to sorting and multiset operations.
- Space: O(n) for events and multiset.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::vector<std::vector<int>> b = {{2,9,10},{3,7,15},{5,12,12},{15,20,10},{19,24,8}};
    auto ans = sol.getSkyline(b);
    for (std::size_t i = 0; i < ans.size(); ++i) {
        std::cout << "[" << ans[i][0] << "," << ans[i][1] << "] ";
    }
    std::cout << "\n"; // [2,10] [3,15] [7,12] [12,0] [15,10] [20,8] [24,0]
    return 0;
}
#endif