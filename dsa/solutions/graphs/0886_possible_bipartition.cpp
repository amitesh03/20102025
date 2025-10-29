/*
LeetCode 886. Possible Bipartition
Link: https://leetcode.com/problems/possible-bipartition/

Question:
Given a graph of n people (labeled from 1 to n), and an array dislikes where dislikes[i] = [a, b] indicates that
person a and person b dislike each other, return true if it is possible to split everyone into two groups such that
each person dislikes nobody in their own group.

Constraints:
- 1 <= n <= 2000
- 0 <= dislikes.length <= 10^4
- dislikes[i].length == 2
- 1 <= ai, bi <= n
- ai != bi

Approach (Bipartite Check via BFS):
- Build an undirected graph from the dislikes edges.
- Use a color array with values {0, 1, -1}. 0 = uncolored; 1 and -1 are the two groups.
- For each uncolored node, BFS and color it 1, then color neighbors with -1, etc.
- If a conflict is found (neighbor already colored with same color), return false.
- If BFS completes without conflicts for all components, the graph is bipartite => return true.

Complexity:
- Time: O(n + m), where m = dislikes.length
- Space: O(n + m) for graph and BFS structures
*/

#include <vector>
#include <queue>

class Solution {
public:
    bool possibleBipartition(int n, std::vector<std::vector<int>>& dislikes) {
        std::vector<std::vector<int>> g(n + 1);
        g.reserve(n + 1);
        for (const auto& e : dislikes) {
            int u = e[0], v = e[1];
            g[u].push_back(v);
            g[v].push_back(u);
        }
        std::vector<int> color(n + 1, 0); // 0 = uncolored, 1 and -1 are two colors
        std::queue<int> q;
        for (int i = 1; i <= n; ++i) {
            if (color[i] != 0) continue;
            color[i] = 1;
            q.push(i);
            while (!q.empty()) {
                int u = q.front(); q.pop();
                for (int v : g[u]) {
                    if (color[v] == 0) {
                        color[v] = -color[u];
                        q.push(v);
                    } else if (color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
};