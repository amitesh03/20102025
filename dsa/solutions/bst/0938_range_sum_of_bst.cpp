/*
LeetCode 938. Range Sum of BST
Link: https://leetcode.com/problems/range-sum-of-bst/

Question:
Given the root of a Binary Search Tree (BST) and two integers low and high, return the sum of values of all nodes with a value in the inclusive range [low, high].

Constraints:
- The number of nodes in the tree is in the range [1, 2 * 10^4].
- 1 <= Node.val <= 10^5
- 1 <= low <= high <= 10^5
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
    int rangeSumBST(TreeNode* root, int low, int high) {
        if (!root) return 0;
        if (root->val < low) return rangeSumBST(root->right, low, high);
        if (root->val > high) return rangeSumBST(root->left, low, high);
        return root->val + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);
    }
};

/*
Approach:
- Use BST property to prune branches:
  - If node->val < low, ignore left subtree.
  - If node->val > high, ignore right subtree.
  - Else include node->val and recurse both sides.

Complexity:
- Time: O(n) worst-case when no pruning; average better with pruning.
- Space: O(h) recursion stack.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // Example: BST [10,5,15,3,7,13,18], low=7, high=15 -> 32
    TreeNode* n3 = new TreeNode(3);
    TreeNode* n7 = new TreeNode(7);
    TreeNode* n13 = new TreeNode(13);
    TreeNode* n18 = new TreeNode(18);
    TreeNode* n5 = new TreeNode(5, n3, n7);
    TreeNode* n15 = new TreeNode(15, n13, n18);
    TreeNode* root = new TreeNode(10, n5, n15);
    Solution sol;
    std::cout << sol.rangeSumBST(root, 7, 15) << "\n"; // 32
    return 0;
}
#endif