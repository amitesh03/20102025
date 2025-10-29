/*
LeetCode 101. Symmetric Tree
Link: https://leetcode.com/problems/symmetric-tree/

Question:
Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).

Constraints:
- The number of nodes in the tree is in the range [0, 1000].
- -100 <= Node.val <= 100
*/

#include <cstddef>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(): val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x): val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r): val(x), left(l), right(r) {}
};

class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        return isMirror(root ? root->left : nullptr, root ? root->right : nullptr);
    }
private:
    static bool isMirror(TreeNode* a, TreeNode* b) {
        if (!a && !b) return true;
        if (!a || !b) return false;
        if (a->val != b->val) return false;
        return isMirror(a->left, b->right) && isMirror(a->right, b->left);
    }
};

/*
Approach:
- Recursively verify that left and right subtrees are mirrors: values equal and children swapped.

Complexity:
- Time: O(n)
- Space: O(h) recursion stack
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // Symmetric: [1,2,2,3,4,4,3]
    TreeNode* n3L = new TreeNode(3);
    TreeNode* n4L = new TreeNode(4);
    TreeNode* n3R = new TreeNode(3);
    TreeNode* n4R = new TreeNode(4);
    TreeNode* n2L = new TreeNode(2, n3L, n4L);
    TreeNode* n2R = new TreeNode(2, n4R, n3R);
    TreeNode* root = new TreeNode(1, n2L, n2R);

    Solution sol;
    std::cout << (sol.isSymmetric(root) ? "true" : "false") << "\n"; // true

    // Cleanup
    delete n3L; delete n4L; delete n3R; delete n4R; delete n2L; delete n2R; delete root;
    return 0;
}
#endif