/*
LeetCode 695. Max Area of Island
Link: https://leetcode.com/problems/max-area-of-island/

Question:
Given a 2D grid of 0s and 1s, return the maximum area of an island in the grid.
An island is a group of 1s connected 4-directionally (up/down/left/right). You may assume all four edges of the grid are surrounded by water.

Constraints:
- m == grid.size, n == grid[0].size
- 1 <= m, n <= 50
- grid[i][j] ∈ {0, 1}

Approach (Iterative DFS with stack):
- Iterate over all cells. When a cell with value 1 is found, start a DFS (using an explicit stack)
  to explore the whole island.
- During traversal, mark visited cells by setting them to 0 to avoid revisits.
- Track the size of the current island and update a global maximum.
- This avoids recursion depth issues and uses only STL containers.

Complexity:
- Time: O(m*n), each cell visited at most once
- Space: O(m*n) in worst case for the stack
*/

#include <vector>
#include <stack>
#include <utility>
#include <algorithm>

class Solution {
public:
    int maxAreaOfIsland(std::vector<std::vector<int>>& grid) {
        int m = (int)grid.size();
        if (m == 0) return 0;
        int n = (int)grid[0].size();
        int best = 0;

        static const int dr[4] = {1, -1, 0, 0};
        static const int dc[4] = {0, 0, 1, -1};

        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 1) {
                    int area = 0;
                    std::stack<std::pair<int,int>> st;
                    st.push({i, j});
                    grid[i][j] = 0; // mark visited
                    while (!st.empty()) {
                        auto cur = st.top();
                        st.pop();
                        int r = cur.first, c = cur.second;
                        ++area;
                        for (int k = 0; k < 4; ++k) {
                            int nr = r + dr[k];
                            int nc = c + dc[k];
                            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {
                                grid[nr][nc] = 0;
                                st.push({nr, nc});
                            }
                        }
                    }
                    if (area > best) best = area;
                }
            }
        }
        return best;
    }
};