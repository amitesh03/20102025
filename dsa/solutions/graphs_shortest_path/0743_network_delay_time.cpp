/*
LeetCode 743. Network Delay Time
Link: https://leetcode.com/problems/network-delay-time/

Question:
You are given a list of travel times as directed edges times[i] = [u, v, w],
where u sends a signal to v with travel time w. From a starting node k, compute
the time it takes for all nodes to receive the signal. If it is impossible, return -1.

Constraints:
- 1 <= n <= 100
- 1 <= k <= n
- 1 <= times.length <= 6000
- 1 <= w <= 100

Approach (Dijkstra's algorithm):
- Build adjacency list graph for nodes 1..n.
- Use a min-heap to expand the node with the smallest known distance.
- Track distances; after processing, take the maximum distance among 1..n if all reachable.

Complexity:
- Time: O((n + m) log n), m = times.length
- Space: O(n + m)
*/

#include <vector>
#include <queue>
#include <utility>
#include <limits>
#include <functional>

class Solution {
public:
    int networkDelayTime(std::vector<std::vector<int>>& times, int n, int k) {
        std::vector<std::vector<std::pair<int,int>>> g(n + 1);
        g.reserve(n + 1);
        for (const auto& e : times) {
            int u = e[0], v = e[1], w = e[2];
            g[u].emplace_back(v, w);
        }

        const int INF = std::numeric_limits<int>::max() / 4;
        std::vector<int> dist(n + 1, INF);
        dist[k] = 0;

        using P = std::pair<int,int>; // (d, node)
        std::priority_queue<P, std::vector<P>, std::greater<P>> pq;
        pq.emplace(0, k);

        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();
            if (d > dist[u]) continue;
            for (const auto& [v, w] : g[u]) {
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.emplace(dist[v], v);
                }
            }
        }

        int ans = 0;
        for (int i = 1; i <= n; ++i) {
            if (dist[i] == INF) return -1;
            if (dist[i] > ans) ans = dist[i];
        }
        return ans;
    }
};