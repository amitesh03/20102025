/*
LeetCode 701. Insert into a Binary Search Tree
Link: https://leetcode.com/problems/insert-into-a-binary-search-tree/

Question:
You are given the root of a binary search tree (BST) and a value to insert into the tree. Return the root of the BST after the insertion. It is guaranteed that the new value does not exist in the original BST.

Constraints:
- The number of nodes in the tree is in the range [0, 10^4].
- -10^8 <= Node.val, val <= 10^8
- All the values of the tree are unique.
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
    TreeNode* insertIntoBST(TreeNode* root, int val) {
        if (!root) return new TreeNode(val);
        if (val < root->val) {
            root->left = insertIntoBST(root->left, val);
        } else {
            root->right = insertIntoBST(root->right, val);
        }
        return root;
    }
};

/*
Approach:
- Standard recursive BST insertion: descend left/right based on comparison and link the returned subtree.

Complexity:
- Time: O(h) where h is tree height (O(log n) average, O(n) worst-case).
- Space: O(h) recursion stack.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // Build:    4
    //          / \
    //         2   7
    // Insert 5 -> becomes right child of 4's left subtree's right.
    TreeNode* n2 = new TreeNode(2);
    TreeNode* n7 = new TreeNode(7);
    TreeNode* n4 = new TreeNode(4, n2, n7);
    Solution sol;
    TreeNode* root = sol.insertIntoBST(n4, 5);
    std::cout << root->right->val << "\n"; // 7
    std::cout << root->left->right->val << "\n"; // 5
    // Cleanup omitted
    return 0;
}
#endif