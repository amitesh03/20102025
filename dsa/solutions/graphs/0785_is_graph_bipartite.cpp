/*
LeetCode 785. Is Graph Bipartite?
Link: https://leetcode.com/problems/is-graph-bipartite/

Question:
Given an undirected graph, determine if it is bipartite. A graph is bipartite if its vertices can be split 
into two disjoint sets so that every edge connects a vertex from one set to the other.

Constraints:
- graph.length == n, 1 <= n <= 100
- 0 <= graph[i].length <= n
- 0 <= graph[i][j] < n
- graph[i][j] != i
- graph[i] doesn't contain duplicate values

Approach (BFS coloring):
- Use an array 'color' initialized to -1 for all nodes. For each uncolored node, start BFS, assign color 0, 
  and alternate colors (0/1) for neighbors. If we ever find a neighbor already colored with the same color, 
  the graph is not bipartite.
- Handle disconnected graphs by scanning all nodes and launching BFS from each uncolored node.

Complexity:
- Time: O(V + E), Space: O(V) for color and BFS queue.
*/

#include <vector>
#include <queue>

class Solution {
public:
    bool isBipartite(std::vector<std::vector<int>>& graph) {
        int n = (int)graph.size();
        if (n <= 2) {
            // Trivially bipartite unless there is a self-loop (disallowed by constraints).
            return true;
        }

        std::vector<int> color(n, -1);
        std::queue<int> q;

        for (int start = 0; start < n; ++start) {
            if (color[start] != -1) continue;
            color[start] = 0;
            q.push(start);

            while (!q.empty()) {
                int u = q.front();
                q.pop();
                const std::vector<int>& nbrs = graph[u];
                for (size_t i = 0; i < nbrs.size(); ++i) {
                    int v = nbrs[i];
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
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