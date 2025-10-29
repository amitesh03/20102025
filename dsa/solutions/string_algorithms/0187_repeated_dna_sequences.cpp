/*
LeetCode 187. Repeated DNA Sequences
Link: https://leetcode.com/problems/repeated-dna-sequences/

Question:
Given a string s that represents a DNA sequence (only characters 'A', 'C', 'G', 'T'), return all the 10-letter-long sequences
(substrings) that occur more than once in a DNA molecule. You may return the answers in any order.

Constraints:
- 1 <= s.length <= 1e5
- s consists of only 'A', 'C', 'G', 'T'.

Approach:
- Encode each character into 2 bits: A=0, C=1, G=2, T=3.
- Maintain a 20-bit rolling hash (for 10 characters): shift left by 2, add new char, and mask to keep only 20 bits.
- Track hashes seen in an unordered_set; when a hash repeats, add the corresponding substring if not already added.
- This avoids storing all substrings and runs in linear time.

Complexity:
- Time: O(n)
- Space: O(n) for sets of seen/added hashes.
*/

#include <string>
#include <vector>
#include <unordered_set>
#include <cstddef>

class Solution {
public:
    std::vector<std::string> findRepeatedDnaSequences(const std::string& s) {
        const std::size_t n = s.size();
        std::vector<std::string> result;
        if (n < 10) return result;

        auto enc = [](char c) -> int {
            switch (c) {
                case 'A': return 0;
                case 'C': return 1;
                case 'G': return 2;
                case 'T': return 3;
                default:  return 0;
            }
        };

        int code = 0;
        const int mask = (1 << 20) - 1; // 20 bits for 10 chars
        std::unordered_set<int> seen;
        std::unordered_set<int> added;

        for (std::size_t i = 0; i < n; ++i) {
            code = ((code << 2) & mask) | enc(s[i]);
            if (i >= 9) { // we have a 10-char window
                if (seen.find(code) != seen.end()) {
                    if (added.insert(code).second) {
                        result.push_back(s.substr(i - 9, 10));
                    }
                } else {
                    seen.insert(code);
                }
            }
        }
        return result;
    }
};

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    auto ans1 = sol.findRepeatedDnaSequences("AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT");
    for (const auto& x : ans1) std::cout << x << " ";
    std::cout << "\n"; // ["AAAAACCCCC","CCCCCAAAAA"]

    auto ans2 = sol.findRepeatedDnaSequences("AAAAAAAAAAAAA");
    for (const auto& x : ans2) std::cout << x << " ";
    std::cout << "\n"; // ["AAAAAAAAAA","AAAAAAAAAA"]

    return 0;
}
#endif