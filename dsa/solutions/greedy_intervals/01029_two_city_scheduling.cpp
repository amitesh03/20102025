/*
LeetCode 1029. Two City Scheduling
Link: https://leetcode.com/problems/two-city-scheduling/

Question:
There are 2n people planning to fly to two cities A and B. The cost of flying the i-th person to city A is costs[i][0],
and the cost of flying the i-th person to city B is costs[i][1]. Return the minimum cost to fly exactly n people to city A
and exactly n people to city B.

Constraints:
- costs.length == 2n
- 2 <= costs.length <= 100
- 0 <= costs[i][0], costs[i][1] <= 1000

Approach (Greedy by cost difference):
- Sort by (costA - costB) ascending.
- Send the first n to city A, the remaining n to city B.
- Intuition: pick people who are cheaper for A earlier, those cheaper for B later.

Complexity:
- Time: O(n log n)
- Space: O(1) extra
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    int twoCitySchedCost(std::vector<std::vector<int>>& costs) {
        int n2 = static_cast<int>(costs.size());
        std::sort(costs.begin(), costs.end(),
                  [](const std::vector<int>& a, const std::vector<int>& b) {
                      return (a[0] - a[1]) < (b[0] - b[1]);
                  });
        int n = n2 / 2;
        int total = 0;
        for (int i = 0; i < n2; ++i) {
            if (i < n) total += costs[i][0];
            else total += costs[i][1];
        }
        return total;
    }
};