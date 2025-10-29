/*
LeetCode 98. Validate Binary Search Tree
Link: https://leetcode.com/problems/validate-binary-search-tree/

Question:
Given the root of a binary tree, determine if it is a valid binary search tree (BST).
A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys less than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- Both the left and right subtrees must also be binary search trees.

Constraints:
- The number of nodes in the tree is in the range [1, 10^4].
- -2^31 <= Node.val <= 2^31 - 1
*/

#include <climits>

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
    bool isValidBST(TreeNode* root) {
        return validate(root, LLONG_MIN, LLONG_MAX);
    }
private:
    static bool validate(TreeNode* node, long long low, long long high) {
        if (!node) return true;
        long long v = node->val;
        if (v <= low || v >= high) return false;
        return validate(node->left, low, v) && validate(node->right, v, high);
    }
};

/*
Approach:
- Use DFS with range constraints:
  - Each node must satisfy low < val < high.
  - For left child, high becomes parent val; for right child, low becomes parent val.

Complexity:
- Time: O(n)
- Space: O(h) recursion stack, worst-case O(n) for skewed tree.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // Valid BST: [2,1,3]
    TreeNode* n1 = new TreeNode(1);
    TreeNode* n3 = new TreeNode(3);
    TreeNode* root = new TreeNode(2, n1, n3);
    Solution sol;
    std::cout << std::boolalpha << sol.isValidBST(root) << "\n"; // true

    // Invalid BST: [5,1,4,null,null,3,6]
    TreeNode* a3 = new TreeNode(3);
    TreeNode* a6 = new TreeNode(6);
    TreeNode* a4 = new TreeNode(4, a3, a6);
    TreeNode* bad = new TreeNode(5, new TreeNode(1), a4);
    std::cout << sol.isValidBST(bad) << "\n"; // false

    // Cleanup omitted for brevity
    delete n1; delete n3; delete root; delete a3; delete a6; delete a4; delete bad;
    return 0;
}
#endif