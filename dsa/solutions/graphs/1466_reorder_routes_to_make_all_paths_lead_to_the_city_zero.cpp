/*
LeetCode 1466. Reorder Routes to Make All Paths Lead to the City Zero
Link: https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/

Question:
You are given an undirected tree of n cities labeled from 0 to n - 1 and a list of directed edges connections
where connections[i] = [a_i, b_i] represents a directed edge from city a_i to city b_i. The network is a tree
if the directed edges were made undirected. You want to reorient some of the edges so that every city can reach
city 0. Return the minimum number of edges to be reversed.

Constraints:
- 2 <= n <= 5 * 10^4
- connections.length == n - 1
- connections[i].length == 2
- 0 <= a_i, b_i < n
- The graph is a tree when considering edges undirected.

Approach (DFS/BFS over augmented adjacency with direction cost):
- Build an adjacency list over the undirected tree but annotate direction cost:
  - For original directed edge a -> b, add (b, cost=1) to adj[a] (needs reversing when following from 0 outward),
    and (a, cost=0) to adj[b] (already correctly oriented towards 0 if traversed from b to a).
- Run a traversal (DFS using an explicit stack) starting at node 0, summing the cost for edges taken to discover
  new nodes. The sum is the minimum number of reversals required.

Complexity:
- Time: O(n) — each edge visited at most twice
- Space: O(n) — adjacency list and visited structure
*/

#include <vector>
#include <stack>
#include <utility>

class Solution {
public:
    int minReorder(int n, std::vector<std::vector<int>>& connections) {
        // adjacency with direction cost: 1 if original edge goes outwards (needs reversal), 0 otherwise
        std::vector<std::vector<std::pair<int,int>>> adj(n);
        for (size_t i = 0; i < connections.size(); ++i) {
            int a = connections[i][0];
            int b = connections[i][1];
            adj[a].push_back(std::make_pair(b, 1)); // a -> b needs reversal when moving from 0 outward
            adj[b].push_back(std::make_pair(a, 0)); // b -> a is already correct orientation towards 0
        }

        std::vector<char> seen(n, 0);
        std::stack<int> st;
        st.push(0);
        seen[0] = 1;
        int changes = 0;

        while (!st.empty()) {
            int u = st.top();
            st.pop();
            const std::vector<std::pair<int,int>>& nbrs = adj[u];
            for (size_t i = 0; i < nbrs.size(); ++i) {
                int v = nbrs[i].first;
                int cost = nbrs[i].second;
                if (!seen[v]) {
                    seen[v] = 1;
                    changes += cost;
                    st.push(v);
                }
            }
        }
        return changes;
    }
};