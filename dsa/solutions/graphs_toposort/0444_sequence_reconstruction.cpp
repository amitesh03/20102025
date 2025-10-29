/*
LeetCode 444. Sequence Reconstruction
Link: https://leetcode.com/problems/sequence-reconstruction/

Question:
Given the original sequence org and a list of sequences seqs, return true if seqs can uniquely reconstruct org.
Uniqueness means there is only one sequence that can be constructed from seqs and it is equal to org.

Constraints:
- 1 <= org.length <= 1e4
- seqs[i][j] are integers; values must be within [1..org.length] to be valid
- seqs may be empty or contain empty lists

Approach (Graph + Unique Topological Sort check):
- Let n = org.size(). Values must be in 1..n.
- Build adjacency and indegree for graph edges implied by seqs:
  For each adjacent pair (u -> v) in every sequence, add edge if not already present; indegree[v]++.
- Track presence of each number from seqs; if any org value not present in seqs at least once, return false.
- Kahn’s algorithm for unique topo order:
  - Push zero-indegree nodes that are present into a queue.
  - At each step, if queue size > 1, multiple choices exist -> not unique -> return false.
  - Pop the single node; it must match org[idx]. If mismatch, return false.
  - Decrement indegrees of neighbors; push new zeros.
- Finally, ensure we consumed exactly n nodes in the order; otherwise return false.

Complexity:
- Time: O(E + V) where E is total adjacency pairs in seqs, V = n
- Space: O(E + V)
*/

#include <vector>
#include <queue>
#include <unordered_set>
#include <algorithm>

class Solution {
public:
    bool sequenceReconstruction(std::vector<int>& org, std::vector<std::vector<int>>& seqs) {
        const int n = static_cast<int>(org.size());
        if (n == 0) return seqs.empty(); // trivial case

        // Validate values and collect presence
        std::vector<char> present(n + 1, 0);
        bool any = false;
        for (const auto& s : seqs) {
            if (!s.empty()) any = true;
            for (int x : s) {
                if (x < 1 || x > n) return false; // invalid value
                present[x] = 1;
            }
        }
        // All values in org must appear at least once in seqs
        for (int x : org) {
            if (!present[x]) return false;
        }
        if (!any && n > 0) return false; // no edges and org non-empty can't be reconstructed

        // Build graph with duplicate edge avoidance
        std::vector<std::unordered_set<int>> adj(n + 1);
        std::vector<int> indeg(n + 1, 0);

        for (const auto& s : seqs) {
            for (size_t i = 1; i < s.size(); ++i) {
                int u = s[i - 1], v = s[i];
                if (u < 1 || u > n || v < 1 || v > n) return false; // guard though validated above
                if (!adj[u].count(v)) {
                    adj[u].insert(v);
                    ++indeg[v];
                }
            }
        }

        // Initialize queue with zero indegree nodes that are present
        std::queue<int> q;
        for (int x = 1; x <= n; ++x) {
            if (present[x] && indeg[x] == 0) q.push(x);
        }

        int idx = 0;
        while (!q.empty()) {
            if (q.size() > 1) return false; // not unique
            int u = q.front(); q.pop();

            // Must match org at this position
            if (idx >= n || u != org[idx]) return false;
            ++idx;

            for (int v : adj[u]) {
                if (--indeg[v] == 0) {
                    // Only push if it's part of the domain (present)
                    if (present[v]) q.push(v);
                }
            }
        }

        return idx == n;
    }
};