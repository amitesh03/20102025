/*
LeetCode 236. Lowest Common Ancestor of a Binary Tree
Link: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/

Question:
Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q.
The LCA of two nodes p and q is the lowest node in T that has both p and q as descendants
(where we allow a node to be a descendant of itself).

Constraints:
- The number of nodes is in [2, 10^5]
- -10^9 <= Node.val <= 10^9
- p and q are guaranteed to exist in the tree

Approach (Single-pass recursion):
- If root is null or matches p or q, return root.
- Recurse on left and right subtrees.
- If both sides return non-null, root is the LCA. Otherwise, return the non-null side.

Complexity:
- Time: O(n) to visit all nodes
- Space: O(h) recursion stack, h = tree height
*/

// Definition for a binary tree node (LeetCode compatible).
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r) : val(x), left(l), right(r) {}
};

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q) return root;
        TreeNode* L = lowestCommonAncestor(root->left, p, q);
        TreeNode* R = lowestCommonAncestor(root->right, p, q);
        if (L && R) return root;
        return L ? L : R;
    }
};