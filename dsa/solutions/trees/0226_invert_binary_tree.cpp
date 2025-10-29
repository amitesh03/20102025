/*
LeetCode 226. Invert Binary Tree
Link: https://leetcode.com/problems/invert-binary-tree/

Question:
Given the root of a binary tree, invert the tree and return its root.

Constraints:
- The number of nodes is in the range [0, 100].
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
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        TreeNode* leftInv = invertTree(root->left);
        TreeNode* rightInv = invertTree(root->right);
        root->left = rightInv;
        root->right = leftInv;
        return root;
    }
};

/*
Approach:
- Recursively invert left and right subtrees, then swap child pointers.

Complexity:
- Time: O(n)
- Space: O(h) recursion stack, h = tree height
*/

#ifdef LOCAL_TEST
#include <iostream>
void printPre(TreeNode* r) {
    if (!r) { std::cout << "null "; return; }
    std::cout << r->val << ' ';
    printPre(r->left);
    printPre(r->right);
}
int main() {
    // Build: [4,2,7,1,3,6,9] -> inverted: [4,7,2,9,6,3,1]
    TreeNode* n1 = new TreeNode(1);
    TreeNode* n3 = new TreeNode(3);
    TreeNode* n6 = new TreeNode(6);
    TreeNode* n9 = new TreeNode(9);
    TreeNode* n2 = new TreeNode(2, n1, n3);
    TreeNode* n7 = new TreeNode(7, n6, n9);
    TreeNode* root = new TreeNode(4, n2, n7);

    Solution sol;
    TreeNode* inv = sol.invertTree(root);
    printPre(inv); std::cout << '\n';

    // Cleanup omitted
    return 0;
}
#endif