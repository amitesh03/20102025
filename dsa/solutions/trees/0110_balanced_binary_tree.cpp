/*
LeetCode 110. Balanced Binary Tree
Link: https://leetcode.com/problems/balanced-binary-tree/

Question:
Given a binary tree, determine if it is height-balanced.
A height-balanced binary tree is defined as one in which the left and right subtrees
of every node differ in height by no more than 1.

Constraints:
- The number of nodes in the tree is in the range [0, 5 * 10^4].
- -10^4 <= Node.val <= 10^4
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
    bool isBalanced(TreeNode* root) {
        return height(root) != -2;
    }
private:
    // Returns height if subtree is balanced, else returns -2 as a sentinel
    static int height(TreeNode* node) {
        if (!node) return 0;
        int lh = height(node->left);
        if (lh == -2) return -2;
        int rh = height(node->right);
        if (rh == -2) return -2;
        if (lh - rh > 1 || rh - lh > 1) return -2;
        return (lh > rh ? lh : rh) + 1;
    }
};

/*
Approach:
- Post-order compute heights; propagate sentinel on imbalance to avoid extra traversals.

Complexity:
- Time: O(n)
- Space: O(h) recursion stack, h = tree height
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // Balanced: [3,9,20,null,null,15,7]
    TreeNode* n15 = new TreeNode(15);
    TreeNode* n7 = new TreeNode(7);
    TreeNode* n20 = new TreeNode(20, n15, n7);
    TreeNode* n9 = new TreeNode(9);
    TreeNode* root = new TreeNode(3, n9, n20);

    Solution sol;
    std::cout << (sol.isBalanced(root) ? "true" : "false") << "\n"; // true

    // Cleanup
    delete n15; delete n7; delete n20; delete n9; delete root;
    return 0;
}
#endif