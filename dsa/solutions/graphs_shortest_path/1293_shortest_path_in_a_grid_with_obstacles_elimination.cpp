/*
LeetCode 1293. Shortest Path in a Grid with Obstacles Elimination
Link: https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/

Question:
You are given an m x n integer matrix grid where each cell is either 0 (empty) or 1 (obstacle).
You can move up, down, left, or right, and you can eliminate up to k obstacles along the way.
Return the minimum number of steps to walk from (0,0) to (m-1,n-1). If not possible, return -1.

Constraints:
- 1 <= m, n <= 40
- 0 <= k <= m * n
- grid[i][j] is either 0 or 1

Approach (BFS with state [i, j, remaining_k] and dominance pruning):
- Classic BFS on grid but augment state with remaining obstacle eliminations.
- Maintain best remaining_k seen at each cell (i, j). If we revisit (i, j) with rem <= best[i][j], skip because we have
  already reached (i, j) with an equal/greater remaining budget which dominates current state.
- Start from (0,0,k). For each step, try 4 neighbors:
  - If obstacle and rem > 0, we can consume one elimination to proceed.
  - If empty, proceed without consuming.
- As soon as we pop (m-1,n-1) from the queue, return steps.

Optimization:
- If k >= (m - 1) + (n - 1), the Manhattan shortest path can always be achieved by eliminating in the way, so return that bound.

Complexity:
- Time: O(m * n * (k + 1)) in worst-case exploration
- Space: O(m * n) for best-remaining-k tracking and BFS queue
*/

#include <vector>
#include <queue>
#include <utility>
#include <algorithm>

class Solution {
public:
    int shortestPath(std::vector<std::vector<int>>& grid, int k) {
        const int m = static_cast<int>(grid.size());
        const int n = static_cast<int>(grid[0].size());
        if (m == 1 && n == 1) return 0;
        // Early exit: enough eliminations to walk Manhattan path
        if (k >= (m - 1) + (n - 1)) return (m - 1) + (n - 1);

        // best[i][j] = maximum remaining eliminations we've had when reaching (i,j)
        std::vector<std::vector<int>> best(m, std::vector<int>(n, -1));
        best[0][0] = k;

        std::queue<std::pair<int,int>> q;
        q.emplace(0, 0);

        int steps = 0;
        static const int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};

        while (!q.empty()) {
            int sz = static_cast<int>(q.size());
            ++steps;
            while (sz--) {
                auto [i, j] = q.front(); q.pop();
                for (int d = 0; d < 4; ++d) {
                    int ni = i + dirs[d][0];
                    int nj = j + dirs[d][1];
                    if (ni < 0 || nj < 0 || ni >= m || nj >= n) continue;

                    int need = grid[ni][nj];
                    int rem = best[i][j] - need; // consume 1 if obstacle
                    if (rem < 0) continue;

                    if (ni == m - 1 && nj == n - 1) return steps;

                    // If we've been at (ni,nj) with >= rem remaining, current path is dominated
                    if (best[ni][nj] >= rem) continue;
                    best[ni][nj] = rem;
                    q.emplace(ni, nj);
                }
            }
        }
        return -1;
    }
};