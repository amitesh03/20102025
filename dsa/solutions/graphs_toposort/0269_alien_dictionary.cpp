/*
LeetCode 269. Alien Dictionary
Link: https://leetcode.com/problems/alien-dictionary/

Question:
Given a list of words from an alien language's dictionary where the words are sorted lexicographically
by the rules of this language, derive the order of characters in this language. If the order is invalid
or cannot be determined, return an empty string.

Key points:
- You must derive a valid character ordering consistent with the provided lexicographic order.
- If word A is before word B, the first differing character of A and B determines the precedence.
- If A is a strict prefix of B, then it's valid only if A comes before B; otherwise invalid.
- Return any valid ordering; if none exists, return "".

Constraints:
- 1 <= words.length <= 100
- 1 <= words[i].length <= 100
- All words are lowercase English letters
- The answer may not be unique; return any one if multiple exist

Approach (Graph + Kahn's Topological Sort):
1) Nodes: all unique characters present in the word list.
2) Edges: for each adjacent pair (w1, w2), find first index j where w1[j] != w2[j]; add edge w1[j] -> w2[j].
   - If no differing char and size(w1) > size(w2), invalid (prefix rule violated) => return "".
3) Run Kahn's algorithm:
   - Initialize indegree for present chars; push indegree-0 chars into a queue.
   - Pop, append to ordering, decrease indegrees of neighbors, push new 0-indegree nodes.
4) If the output length != number of present chars, there's a cycle => return "".

Complexity:
- Let V be number of distinct chars (<= 26), E be edges derived from adjacent pairs.
- Time: O(total characters + V + E)
- Space: O(V + E)
*/

#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <queue>

class Solution {
public:
    std::string alienOrder(std::vector<std::string>& words) {
        // indeg[c] = -1 means 'c' absent; otherwise indegree value (>=0)
        std::vector<int> indeg(26, -1);
        std::unordered_map<char, std::unordered_set<char>> adj;

        // 1) Mark all characters present
        for (const auto& w : words) {
            for (char c : w) {
                if (indeg[c - 'a'] == -1) indeg[c - 'a'] = 0;
            }
        }

        // 2) Build edges from adjacent word pairs
        for (size_t i = 0; i + 1 < words.size(); ++i) {
            const std::string& a = words[i];
            const std::string& b = words[i + 1];
            size_t len = std::min(a.size(), b.size());
            size_t j = 0;
            while (j < len && a[j] == b[j]) ++j;

            if (j == len) {
                // One is a prefix of the other; invalid if a is longer than b
                if (a.size() > b.size()) return "";
                continue;
            }

            char u = a[j], v = b[j];
            // Add edge u -> v if not already present
            if (!adj[u].count(v)) {
                adj[u].insert(v);
                // Ensure indegree[v] exists
                if (indeg[v - 'a'] == -1) indeg[v - 'a'] = 0;
                if (indeg[u - 'a'] == -1) indeg[u - 'a'] = 0;
                ++indeg[v - 'a'];
            }
        }

        // 3) Kahn's algorithm
        std::queue<char> q;
        int present = 0;
        for (int i = 0; i < 26; ++i) {
            if (indeg[i] != -1) {
                ++present;
                if (indeg[i] == 0) q.push(static_cast<char>('a' + i));
            }
        }

        std::string order;
        order.reserve(present);

        while (!q.empty()) {
            char u = q.front(); q.pop();
            order.push_back(u);
            if (adj.count(u)) {
                for (char v : adj[u]) {
                    int& d = indeg[v - 'a'];
                    --d;
                    if (d == 0) q.push(v);
                }
            }
        }

        if (static_cast<int>(order.size()) != present) return "";
        return order;
    }
};