/*
LeetCode 1631. Path With Minimum Effort
Link: https://leetcode.com/problems/path-with-minimum-effort/

Question:
You are given an m x n grid heights, where heights[i][j] represents the height of cell (i, j).
A path's effort is defined as the maximum absolute difference in heights between two consecutive cells along the path.
Return the minimum effort required to travel from the top-left cell (0,0) to the bottom-right cell (m-1,n-1).

Constraints:
- 1 <= m, n <= 100
- 1 <= heights[i][j] <= 10^6

Approach (Dijkstra on grid with effort metric):
- Treat each move (i,j) -> (ni,nj) having cost w = |heights[i][j] - heights[ni][nj]|.
- Path cost to a cell is the minimum possible maximum edge cost along any path to it.
- Use Dijkstra: dist[i][j] stores best effort to reach cell; relax with ne = max(curr_effort, w).
- Min-heap drives expansion from the smallest current effort.

Complexity:
- Time: O(m * n * log(m * n))
- Space: O(m * n)
*/

#include <vector>
#include <queue>
#include <tuple>
#include <cmath>
#include <limits>
#include <algorithm>

class Solution {
public:
    int minimumEffortPath(std::vector<std::vector<int>>& heights) {
        const int m = static_cast<int>(heights.size());
        const int n = static_cast<int>(heights[0].size());
        const int INF = std::numeric_limits<int>::max() / 4;

        std::vector<std::vector<int>> dist(m, std::vector<int>(n, INF));
        dist[0][0] = 0;

        using State = std::tuple<int,int,int>; // (effort, i, j)
        std::priority_queue<State, std::vector<State>, std::greater<State>> pq;
        pq.emplace(0, 0, 0);

        static const int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};

        while (!pq.empty()) {
            auto [e, i, j] = pq.top();
            pq.pop();
            if (e > dist[i][j]) continue;
            if (i == m - 1 && j == n - 1) return e;

            for (int d = 0; d < 4; ++d) {
                int ni = i + dirs[d][0];
                int nj = j + dirs[d][1];
                if (ni < 0 || ni >= m || nj < 0 || nj >= n) continue;
                int w = std::abs(heights[i][j] - heights[ni][nj]);
                int ne = std::max(e, w);
                if (ne < dist[ni][nj]) {
                    dist[ni][nj] = ne;
                    pq.emplace(ne, ni, nj);
                }
            }
        }

        return dist[m - 1][n - 1];
    }
};