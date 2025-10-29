# Trie (Prefix Tree) — Practice Overview

Scope:
- Concepts: prefix matching, word search, autocomplete, dictionary replace
- Language: C++ STL
- Each solution file includes the problem statement at the top in comments and uses idiomatic STL.

Syllabus source: [syllabus/syllabus.md](../../syllabus/syllabus.md)

## Problems and Status

- [x] 208. Implement Trie (Prefix Tree)
  - LeetCode: https://leetcode.com/problems/implement-trie-prefix-tree/
  - Solution: [solutions/trie/0208_implement_trie_prefix_tree.cpp](./0208_implement_trie_prefix_tree.cpp)
- [x] 211. Design Add and Search Words Data Structure
  - LeetCode: https://leetcode.com/problems/design-add-and-search-words-data-structure/
  - Solution: [solutions/trie/0211_design_add_and_search_words_data_structure.cpp](./0211_design_add_and_search_words_data_structure.cpp)
- [x] 212. Word Search II
  - LeetCode: https://leetcode.com/problems/word-search-ii/
  - Solution: [solutions/trie/0212_word_search_ii.cpp](./0212_word_search_ii.cpp)
- [x] 720. Longest Word in Dictionary
  - LeetCode: https://leetcode.com/problems/longest-word-in-dictionary/
  - Solution: [solutions/trie/0720_longest_word_in_dictionary.cpp](./0720_longest_word_in_dictionary.cpp)
- [x] 648. Replace Words
  - LeetCode: https://leetcode.com/problems/replace-words/
  - Solution: [solutions/trie/0648_replace_words.cpp](./0648_replace_words.cpp)

## Notes

- Implementations use fixed-size arrays or std::unordered_map<char,int> for children where appropriate, favoring constant-time transitions.
- For 212 (Word Search II), DFS backtracking over the board with Trie pruning ensures early exits and avoids repeated scanning.
- For 648 (Replace Words), building a Trie of dictionary roots and greedy prefix scanning per token yields linear time over text length.