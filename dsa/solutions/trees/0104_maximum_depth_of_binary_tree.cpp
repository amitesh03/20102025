/*
LeetCode 104. Maximum Depth of Binary Tree
Link: https://leetcode.com/problems/maximum-depth-of-binary-tree/

Question:
Given the root of a binary tree, return its maximum depth.

Constraints:
- The number of nodes is in the range [0, 10^4].
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
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        int leftDepth = maxDepth(root->left);
        int rightDepth = maxDepth(root->right);
        return 1 + (leftDepth > rightDepth ? leftDepth : rightDepth);
    }
};

/*
Approach:
- Recursively compute max depth of left and right subtrees; answer is 1 + max(left, right).

Complexity:
- Time: O(n)
- Space: O(h) recursion stack, h = tree height
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    TreeNode* n3 = new TreeNode(3);
    TreeNode* n9 = new TreeNode(9);
    TreeNode* n20 = new TreeNode(20, new TreeNode(15), new TreeNode(7));
    TreeNode* root = new TreeNode(3, n9, n20);

    Solution sol;
    std::cout << sol.maxDepth(root) << "\n"; // 3

    // Cleanup
    delete root->right->left;
    delete root->right->right;
    delete root->right;
    delete root->left;
    delete root;
    return 0;
}
#endif