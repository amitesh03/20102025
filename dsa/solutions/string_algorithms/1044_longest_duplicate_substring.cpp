/*
LeetCode 1044. Longest Duplicate Substring
Link: https://leetcode.com/problems/longest-duplicate-substring/

Question:
Given a string s, return the longest substring of s that occurs at least twice. If no such substring exists, return "".

Constraints:
- 1 <= s.length <= 1e5
- s consists of lowercase English letters.

Approach:
- Binary search on substring length L combined with Rabin–Karp rolling hash.
- Use two mod hashes to minimize collision probability.
- Precompute powers and prefix hashes to query substring hash in O(1).
- For a fixed L, iterate all substrings of length L and add combined hash to an unordered_set.
  If a combined hash repeats, a duplicate of length L exists; record its start index.

Complexity:
- Time: O(n log n) due to binary search and linear scanning per check.
- Space: O(n) for powers, hashes, and the set per check.
*/

#include <string>
#include <vector>
#include <unordered_set>
#include <cstddef>

class Solution {
public:
    std::string longestDupSubstring(const std::string& s) {
        const int n = static_cast<int>(s.size());
        if (n <= 1) return "";

        const long long mod1 = 1000000007LL;
        const long long mod2 = 1000000009LL;
        const long long base1 = 91138233LL;
        const long long base2 = 97266353LL;

        std::vector<long long> p1(n + 1, 1), p2(n + 1, 1);
        std::vector<long long> h1(n + 1, 0), h2(n + 1, 0);
        for (int i = 0; i < n; ++i) {
            int v = s[i] - 'a' + 1;
            p1[i + 1] = (p1[i] * base1) % mod1;
            p2[i + 1] = (p2[i] * base2) % mod2;
            h1[i + 1] = (h1[i] * base1 + v) % mod1;
            h2[i + 1] = (h2[i] * base2 + v) % mod2;
        }

        auto getHash = [&](int l, int r) -> std::pair<long long,long long> {
            long long x1 = (h1[r] - (h1[l] * p1[r - l]) % mod1 + mod1) % mod1;
            long long x2 = (h2[r] - (h2[l] * p2[r - l]) % mod2 + mod2) % mod2;
            return {x1, x2};
        };

        auto check = [&](int len) -> int {
            if (len == 0) return 0;
            std::unordered_set<unsigned long long> seen;
            seen.reserve(static_cast<std::size_t>(n));
            for (int i = 0; i + len <= n; ++i) {
                auto [x1, x2] = getHash(i, i + len);
                unsigned long long key = (static_cast<unsigned long long>(x1) << 32) ^ static_cast<unsigned long long>(x2);
                if (!seen.insert(key).second) {
                    return i;
                }
            }
            return -1;
        };

        int lo = 1, hi = n - 1;
        int bestLen = 0, bestPos = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int pos = check(mid);
            if (pos != -1) {
                bestLen = mid;
                bestPos = pos;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }

        if (bestPos == -1) return "";
        return s.substr(bestPos, bestLen);
    }
};

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::cout << sol.longestDupSubstring("banana") << "\n"; // "ana"
    std::cout << sol.longestDupSubstring("abcd") << "\n";   // ""
    return 0;
}
#endif