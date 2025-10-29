/*
LeetCode 1162. As Far from Land as Possible
Link: https://leetcode.com/problems/as-far-from-land-as-possible/

Question:
Given an n x n grid containing only values 0 and 1, where 0 represents water and 1 represents land,
find the water cell that is farthest from any land cell and return its distance to the nearest land cell.
If there is no land or no water, return -1.

Constraints:
- 1 <= n <= 100
- grid[i][j] is either 0 or 1

Approach (Multi-source BFS):
- Enqueue all land cells initially (multi-source).
- Perform BFS level by level; when visiting a water cell, mark it as land and enqueue it.
- The number of BFS layers expanded until the queue empties is the answer.
- If there is no land or no water to begin with, return -1.

Complexity:
- Time: O(n^2) — each cell enqueued at most once
- Space: O(n^2) for the queue in the worst case
*/

#include <vector>
#include <queue>

class Solution {
public:
    int maxDistance(std::vector<std::vector<int>>& grid) {
        const int n = static_cast<int>(grid.size());
        std::queue<std::pair<int,int>> q;
        int land = 0, water = 0;

        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 1) { q.emplace(i, j); ++land; }
                else ++water;
            }
        }
        if (land == 0 || water == 0) return -1;

        int dist = -1;
        static const int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};

        while (!q.empty()) {
            int sz = static_cast<int>(q.size());
            ++dist;
            while (sz--) {
                auto [i, j] = q.front(); q.pop();
                for (int d = 0; d < 4; ++d) {
                    int ni = i + dirs[d][0];
                    int nj = j + dirs[d][1];
                    if (ni < 0 || nj < 0 || ni >= n || nj >= n) continue;
                    if (grid[ni][nj] != 0) continue; // already land/visited
                    grid[ni][nj] = 1;                // mark visited
                    q.emplace(ni, nj);
                }
            }
        }
        return dist;
    }
};