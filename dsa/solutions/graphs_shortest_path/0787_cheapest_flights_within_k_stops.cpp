/*
LeetCode 787. Cheapest Flights Within K Stops
Link: https://leetcode.com/problems/cheapest-flights-within-k-stops/

Question:
Given a list of flights represented as edges flights[i] = [u, v, w] with cost w to fly from u to v,
find the cheapest price from src to dst with at most k stops (i.e., up to k intermediate nodes).

Constraints:
- 1 <= n <= 100
- 0 <= flights.length <= 1e4
- flights[i] = [u, v, w], 0 <= u, v < n, 1 <= w <= 1e4
- 0 <= k <= n - 1

Approach (Limited relaxations / Bellman-Ford):
- Perform k + 1 rounds of relaxation using distances from the previous round only.
- Using a copy ndist ensures each round uses paths with at most the current number of edges,
  thereby respecting the "at most k stops" constraint.

Complexity:
- Time: O((k + 1) * E), E = flights.length
- Space: O(n)
*/

#include <vector>
#include <limits>

class Solution {
public:
    int findCheapestPrice(int n, std::vector<std::vector<int>>& flights, int src, int dst, int k) {
        const int INF = std::numeric_limits<int>::max() / 4;
        std::vector<int> dist(n, INF);
        dist[src] = 0;
        for (int i = 0; i <= k; ++i) {
            std::vector<int> ndist = dist;
            for (const auto& e : flights) {
                int u = e[0], v = e[1], w = e[2];
                if (dist[u] != INF && dist[u] + w < ndist[v]) {
                    ndist[v] = dist[u] + w;
                }
            }
            dist.swap(ndist);
        }
        return dist[dst] >= INF ? -1 : dist[dst];
    }
};