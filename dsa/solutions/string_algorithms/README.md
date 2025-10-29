# String Algorithms (KMP / Rolling Hash) — Practice Overview

Scope:
- Concepts: prefix-function (KMP), failure links, polynomial rolling hash, collision handling
- Language: C++ STL
- Each solution file includes the problem statement at the top in comments and uses idiomatic STL.

Syllabus source: [syllabus/syllabus.md](../../syllabus/syllabus.md)

## Problems and Status

- [x] 28. Implement strStr (KMP)
  - LeetCode: https://leetcode.com/problems/implement-strstr/
  - Solution: [solutions/string_algorithms/0028_implement_strstr_kmp.cpp](./0028_implement_strstr_kmp.cpp)
- [x] 1044. Longest Duplicate Substring
  - LeetCode: https://leetcode.com/problems/longest-duplicate-substring/
  - Solution: [solutions/string_algorithms/1044_longest_duplicate_substring.cpp](./1044_longest_duplicate_substring.cpp)
- [x] 187. Repeated DNA Sequences
  - LeetCode: https://leetcode.com/problems/repeated-dna-sequences/
  - Solution: [solutions/string_algorithms/0187_repeated_dna_sequences.cpp](./0187_repeated_dna_sequences.cpp)
- [x] 459. Repeated Substring Pattern
  - LeetCode: https://leetcode.com/problems/repeated-substring-pattern/
  - Solution: [solutions/string_algorithms/0459_repeated_substring_pattern.cpp](./0459_repeated_substring_pattern.cpp)
- [x] 686. Repeated String Match
  - LeetCode: https://leetcode.com/problems/repeated-string-match/
  - Solution: [solutions/string_algorithms/0686_repeated_string_match.cpp](./0686_repeated_string_match.cpp)

## Notes

- KMP: Precompute LPS (longest prefix-suffix) on the pattern, then linear scan the text for O(n + m) complexity.
- Rolling hash: Use base/mod and prefix hashes to compare substrings in O(1) with precomputed powers; when needed, use double hashing to reduce collision probability.
- 1044 uses binary search on length + hashing to detect duplicates efficiently.
- 187 leverages 2-bit encoding for compact rolling hash on A/C/G/T.