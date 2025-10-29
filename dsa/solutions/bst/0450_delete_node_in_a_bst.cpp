/*
LeetCode 450. Delete Node in a BST
Link: https://leetcode.com/problems/delete-node-in-a-bst/

Question:
Given the root of a BST and an integer key, delete the node with the given key and return the new root.
The deletion rules:
- If the node is a leaf, delete it.
- If the node has one child, replace it with its child.
- If the node has two children, replace its value with its inorder successor (smallest in the right subtree),
  then delete the successor node from the right subtree.

Constraints:
- The number of nodes in the tree is in the range [0, 10^4].
- -10^5 <= Node.val <= 10^5
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
    TreeNode* deleteNode(TreeNode* root, int key) {
        if (!root) return nullptr;
        if (key < root->val) {
            root->left = deleteNode(root->left, key);
        } else if (key > root->val) {
            root->right = deleteNode(root->right, key);
        } else {
            // Found node to delete
            if (!root->left) {
                TreeNode* r = root->right;
                delete root;
                return r;
            } else if (!root->right) {
                TreeNode* l = root->left;
                delete root;
                return l;
            } else {
                // Both children: use inorder successor
                TreeNode* succ = root->right;
                while (succ->left) succ = succ->left;
                root->val = succ->val;
                root->right = deleteNode(root->right, succ->val);
            }
        }
        return root;
    }
};

/*
Approach:
- Recursive BST delete: descend to locate key; handle 0/1/2 child cases.
- For two-child case, copy inorder successor value (min of right subtree), then remove that successor.

Complexity:
- Time: O(h) average, O(n) worst-case when tree is skewed.
- Space: O(h) recursion stack.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // Example:
    //     5
    //    / \
    //   3   6
    //  / \
    // 2   4
    TreeNode* n2 = new TreeNode(2);
    TreeNode* n4 = new TreeNode(4);
    TreeNode* n3 = new TreeNode(3, n2, n4);
    TreeNode* n6 = new TreeNode(6);
    TreeNode* root = new TreeNode(5, n3, n6);
    Solution sol;
    root = sol.deleteNode(root, 3);
    std::cout << (root->left ? root->left->val : -1) << "\n"; // 4
    // Clean-up omitted
    return 0;
}
#endif