/*
LeetCode 502. IPO
Link: https://leetcode.com/problems/ipo/

Question:
Suppose LeetCode will start its IPO soon. In order to sell a good price to the capital markets, 
LeetCode would like to work on some projects to increase its capital before the IPO. You are given 
n projects where the i-th project has a pure profit profits[i] and requires capital capital[i]. 
Initially, you have w capital. When you finish a project, you will gain profits[i] and hence your capital increases by profits[i].
Pick a maximum of k distinct projects to maximize your final capital. You can only pick a project 
i if you have at least capital[i] capital to start the project.

Constraints:
- 1 <= k <= 10^5
- 0 <= w <= 10^9
- n == profits.length == capital.length
- 1 <= n <= 10^5
- 0 <= profits[i] <= 10^4
- 0 <= capital[i] <= 10^9
*/

#include <vector>
#include <queue>
#include <algorithm>

class Solution {
public:
    int findMaximizedCapital(int k, int w, std::vector<int>& profits, std::vector<int>& capital) {
        int n = static_cast<int>(profits.size());
        std::vector<std::pair<int,int>> projects;
        projects.reserve(n);
        for (int i = 0; i < n; ++i) {
            projects.emplace_back(capital[i], profits[i]); // {required capital, profit}
        }
        std::sort(projects.begin(), projects.end()); // sort by required capital ascending
        std::priority_queue<int> maxProfit; // max-heap of feasible profits
        int idx = 0;
        long long cur = w;
        for (int t = 0; t < k; ++t) {
            // push all projects whose required capital <= current capital
            while (idx < n && projects[idx].first <= cur) {
                maxProfit.push(projects[idx].second);
                ++idx;
            }
            if (maxProfit.empty()) {
                // no feasible projects; cannot increase capital further
                break;
            }
            cur += maxProfit.top();
            maxProfit.pop();
        }
        return static_cast<int>(cur);
    }
};

/*
Approach:
- Sort projects by required capital.
- Iterate up to k rounds:
  - Add to a max-heap all projects that have become feasible (required capital <= current capital).
  - Pick the project with largest profit to maximize growth.
- Greedy plus priority queue ensures optimal choice each round among feasible options.

Complexity:
- Time: O(n log n + k log n) in worst case (heap ops up to n).
- Space: O(n) for storing and heap.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    std::vector<int> profits = {1,2,3};
    std::vector<int> capital = {0,1,2};
    Solution sol;
    std::cout << sol.findMaximizedCapital(2, 0, profits, capital) << "\n"; // 4
    return 0;
}
#endif