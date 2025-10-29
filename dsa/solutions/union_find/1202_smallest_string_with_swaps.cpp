/*
LeetCode 1202. Smallest String With Swaps
Link: https://leetcode.com/problems/smallest-string-with-swaps/

Question:
You are given a string s and an array of pairs where pairs[i] = [a, b] indicates that you can swap 
the characters at indices a and b (0-indexed). You can perform this swap operation any number of times. 
Return the lexicographically smallest string that s can be after performing the swaps.

Constraints:
- 1 <= s.length <= 10^5
- 0 <= pairs.length <= 10^5
- 0 <= a, b < s.length
- s consists of lowercase English letters.

Approach (Union-Find / DSU):
- Indices that are connected (by swaps directly or transitively) form a component; within each component 
  the characters can be arbitrarily permuted. To obtain the lexicographically smallest result, sort the 
  indices in a component and the characters from those indices, then place the smallest characters at 
  the smallest indices.
- Steps:
  1) Build DSU over [0..n-1] and union endpoints of each pair.
  2) Group indices by DSU representative.
  3) For each group, collect characters, sort both indices and chars, and assign back in order.

Complexity:
- Time: O(n α(n) + n log n) dominated by sorting within components.
- Space: O(n) for DSU/groups/temporary buffers.
*/

#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>

using std::string;
using std::vector;
using std::unordered_map;

class DSU {
public:
    vector<int> parent;
    vector<int> rankv;
    DSU(int n) : parent(n), rankv(n, 0) {
        for (int i = 0; i < n; ++i) parent[i] = i;
    }
    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
    void unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) return;
        if (rankv[a] < rankv[b]) {
            parent[a] = b;
        } else if (rankv[a] > rankv[b]) {
            parent[b] = a;
        } else {
            parent[b] = a;
            ++rankv[a];
        }
    }
};

class Solution {
public:
    string smallestStringWithSwaps(string s, vector<vector<int>>& pairs) {
        int n = (int)s.size();
        if (n <= 1 || pairs.empty()) return s;

        DSU dsu(n);
        for (size_t i = 0; i < pairs.size(); ++i) {
            int a = pairs[i][0];
            int b = pairs[i][1];
            if (a >= 0 && a < n && b >= 0 && b < n) {
                dsu.unite(a, b);
            }
        }

        // Group indices by representative
        unordered_map<int, vector<int>> groups;
        groups.reserve((size_t)n);
        for (int i = 0; i < n; ++i) {
            int r = dsu.find(i);
            groups[r].push_back(i);
        }

        string res = s;
        for (auto& kv : groups) {
            vector<int>& idxs = kv.second;
            vector<char> chars;
            chars.reserve(idxs.size());
            for (size_t k = 0; k < idxs.size(); ++k) {
                chars.push_back(s[idxs[k]]);
            }
            std::sort(idxs.begin(), idxs.end());
            std::sort(chars.begin(), chars.end());
            for (size_t k = 0; k < idxs.size(); ++k) {
                res[idxs[k]] = chars[k];
            }
        }

        return res;
    }
};