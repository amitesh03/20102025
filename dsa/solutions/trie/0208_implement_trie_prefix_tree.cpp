/*
LeetCode 208. Implement Trie (Prefix Tree)
Link: https://leetcode.com/problems/implement-trie-prefix-tree/

Question:
A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.
Implement the Trie class:
- Trie() Initializes the trie object.
- void insert(String word) Inserts the string word into the trie.
- boolean search(String word) Returns true if the string word is in the trie (i.e., was inserted), and false otherwise.
- boolean startsWith(String prefix) Returns true if there is a previously inserted string word that has the prefix prefix, and false otherwise.

Constraints:
- 1 <= word.length, prefix.length <= 2000
- word and prefix consist only of lowercase English letters.
- At most 3 * 10^4 calls in total to insert, search, and startsWith.
*/

#include <string>
#include <cstddef>

class Trie {
private:
    struct Node {
        Node* child[26];
        bool end;
        Node() : child{nullptr}, end(false) {
            for (int i = 0; i < 26; ++i) child[i] = nullptr;
        }
    };
    Node* root;

public:
    Trie() {
        root = new Node();
    }

    void insert(const std::string& word) {
        Node* cur = root;
        for (std::size_t i = 0; i < word.size(); ++i) {
            int idx = word[i] - 'a';
            if (cur->child[idx] == nullptr) {
                cur->child[idx] = new Node();
            }
            cur = cur->child[idx];
        }
        cur->end = true;
    }

    bool search(const std::string& word) const {
        const Node* cur = root;
        for (std::size_t i = 0; i < word.size(); ++i) {
            int idx = word[i] - 'a';
            if (idx < 0 || idx >= 26 || cur->child[idx] == nullptr) return false;
            cur = cur->child[idx];
        }
        return cur && cur->end;
    }

    bool startsWith(const std::string& prefix) const {
        const Node* cur = root;
        for (std::size_t i = 0; i < prefix.size(); ++i) {
            int idx = prefix[i] - 'a';
            if (idx < 0 || idx >= 26 || cur->child[idx] == nullptr) return false;
            cur = cur->child[idx];
        }
        return true;
    }
};

/*
Approach:
- Pointer-based trie nodes with fixed 26-ary branching for lowercase a-z to keep operations O(1) per character
  and avoid reliance on containers that may trigger local IntelliSense diagnostics.

Complexity:
- Time: O(L) per operation (L = length of word/prefix)
- Space: O(total inserted characters) for allocated nodes
*/