/*
LeetCode 235. Lowest Common Ancestor of a Binary Search Tree
Link: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/

Question:
Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes p and q.
The LCA of two nodes p and q is the lowest node in T that has both p and q as descendants
(where we allow a node to be a descendant of itself).

Constraints:
- The number of nodes in the tree is in the range [2, 10^5].
- -10^9 <= Node.val <= 10^9
- All Node.val are unique.
*/

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
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        int a = p->val, b = q->val;
        while (root) {
            if (a < root->val && b < root->val) {
                root = root->left;
            } else if (a > root->val && b > root->val) {
                root = root->right;
            } else {
                return root;
            }
        }
        return nullptr;
    }
};

/*
Approach:
- Use BST ordering to walk down from root:
  - If both p and q are less than root, go left; if both greater, go right; else current root is LCA.

Complexity:
- Time: O(h) average; O(n) worst-case skewed tree.
- Space: O(1)
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // BST:    6
    //       /   \
    //      2     8
    //     / \   / \
    //    0   4 7   9
    //       / \
    //      3   5
    TreeNode* n3 = new TreeNode(3);
    TreeNode* n5 = new TreeNode(5);
    TreeNode* n4 = new TreeNode(4, n3, n5);
    TreeNode* n0 = new TreeNode(0);
    TreeNode* n2 = new TreeNode(2, n0, n4);
    TreeNode* n7 = new TreeNode(7);
    TreeNode* n9 = new TreeNode(9);
    TreeNode* n8 = new TreeNode(8, n7, n9);
    TreeNode* root = new TreeNode(6, n2, n8);

    Solution sol;
    TreeNode* lca = sol.lowestCommonAncestor(root, n2, n8);
    std::cout << (lca ? lca->val : -1) << "\n"; // 6
    return 0;
}
#endif