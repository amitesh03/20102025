/*
LeetCode 733. Flood Fill
Link: https://leetcode.com/problems/flood-fill/

Question:
An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image.
You are also given three integers sr, sc, and newColor. Perform a "flood fill" on the image starting from the
pixel image[sr][sc]. Replace the color of all pixels connected 4-directionally to image[sr][sc] that have the same
color as image[sr][sc] with newColor, and return the modified image.

Constraints:
- m == image.size, n == image[0].size
- 1 <= m, n <= 50
- 0 <= image[i][j], newColor < 2^16
- 0 <= sr < m, 0 <= sc < n

Approach (BFS flood fill):
- If the starting pixel already has newColor, return immediately.
- Otherwise, BFS from (sr, sc), changing each matching neighbor from oldColor to newColor and pushing it.
- Use 4-directional adjacency.

Complexity:
- Time: O(m * n) (each cell visited at most once)
- Space: O(m * n) in worst case for the queue
*/

#include <vector>
#include <queue>

class Solution {
public:
    std::vector<std::vector<int>> floodFill(std::vector<std::vector<int>>& image, int sr, int sc, int newColor) {
        int m = (int)image.size();
        if (m == 0) return image;
        int n = (int)image[0].size();
        int old = image[sr][sc];
        if (old == newColor) return image;

        std::queue<std::pair<int,int>> q;
        q.push({sr, sc});
        image[sr][sc] = newColor;

        static const int dr[4] = {1, -1, 0, 0};
        static const int dc[4] = {0, 0, 1, -1};

        while (!q.empty()) {
            auto cur = q.front(); q.pop();
            int r = cur.first;
            int c = cur.second;
            for (int k = 0; k < 4; ++k) {
                int nr = r + dr[k];
                int nc = c + dc[k];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && image[nr][nc] == old) {
                    image[nr][nc] = newColor;
                    q.push({nr, nc});
                }
            }
        }
        return image;
    }
};