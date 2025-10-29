/*
LeetCode 686. Repeated String Match
Link: https://leetcode.com/problems/repeated-string-match/

Question:
Given two strings a and b, return the minimum number of times you must repeat a so that b becomes a substring of the repeated string. If impossible, return -1.

Constraints:
- 1 <= a.length, b.length <= 10^4
- a and b consist of lowercase English letters.

Approach:
- Let r = ceil(|b| / |a|). Concatenate a r times and check if b is a substring. If not, check r+1 times (to cover overlap).
- If neither contains b, return -1.

Complexity:
- Time: O(|a| * repeats + |b|) for two finds (amortized linear in practice).
- Space: O(|a| * repeats).
*/

#include <string>
#include <cstddef>

class Solution {
public:
    int repeatedStringMatch(const std::string& a, const std::string& b) {
        if (b.empty()) return 0;
        const std::size_t na = a.size();
        const std::size_t nb = b.size();
        std::string s;
        s.reserve(nb + na); // at most r+1 copies

        int count = 0;
        while (s.size() < nb) {
            s += a;
            ++count;
        }
        if (s.find(b) != std::string::npos) return count;

        s += a;
        ++count;
        if (s.find(b) != std::string::npos) return count;

        return -1;
    }
};

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::cout << sol.repeatedStringMatch("abcd", "cdabcdab") << "\n"; // 3
    std::cout << sol.repeatedStringMatch("a", "aa") << "\n"; // 2
    std::cout << sol.repeatedStringMatch("abc", "w") << "\n"; // -1
    return 0;
}
#endif