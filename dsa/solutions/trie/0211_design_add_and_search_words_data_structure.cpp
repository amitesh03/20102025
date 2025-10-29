/*
LeetCode 211. Design Add and Search Words Data Structure
Link: https://leetcode.com/problems/design-add-and-search-words-data-structure/

Question:
Design a data structure that supports adding new words and finding if a string matches any previously added string.
Implement the WordDictionary class:
- WordDictionary() Initializes the object.
- void addWord(word) Adds word to the data structure.
- bool search(word) Returns true if there is any string in the data structure that matches word or false otherwise.
  word may contain dots '.' where dots can be matched with any letter.

Constraints:
- 1 <= word.length, searchWord.length <= 25
- word and searchWord consist of lowercase English letters.
- At most 3 * 10^4 calls in total to addWord and search.
*/

#include <string>
#include <cstddef>

class WordDictionary {
private:
    struct Node {
        Node* child[26];
        bool end;
        Node(): child{nullptr}, end(false) {
            for (int i = 0; i < 26; ++i) child[i] = nullptr;
        }
    };
    Node* root;

    static bool dfs(const Node* node, const std::string& w, std::size_t idx) {
        if (!node) return false;
        if (idx == w.size()) return node->end;
        char c = w[idx];
        if (c == '.') {
            for (int k = 0; k < 26; ++k) {
                if (dfs(node->child[k], w, idx + 1)) return true;
            }
            return false;
        } else {
            int t = c - 'a';
            if (t < 0 || t >= 26) return false;
            return dfs(node->child[t], w, idx + 1);
        }
    }

public:
    WordDictionary() {
        root = new Node();
    }

    void addWord(const std::string& word) {
        Node* cur = root;
        for (std::size_t i = 0; i < word.size(); ++i) {
            int idx = word[i] - 'a';
            if (idx < 0 || idx >= 26) continue;
            if (cur->child[idx] == nullptr) cur->child[idx] = new Node();
            cur = cur->child[idx];
        }
        cur->end = true;
    }

    bool search(const std::string& word) const {
        return dfs(root, word, 0);
    }
};

/*
Approach:
- Pointer-based trie with fixed 26-ary branching for lowercase a-z.
- search uses DFS to handle '.' wildcard by trying all 26 branches when encountered.

Complexity:
- Time: addWord O(L); search O(26^d * L) worst-case with d wildcards, typically O(L) for non-wildcard.
- Space: O(total inserted characters) for allocated nodes.
*/