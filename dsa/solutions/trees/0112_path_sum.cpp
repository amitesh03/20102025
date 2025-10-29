/*
LeetCode 112. Path Sum
Link: https://leetcode.com/problems/path-sum/

Question:
Given the root of a binary tree and an integer targetSum, return true if the tree has a 
root-to-leaf path such that adding up all the values along the path equals targetSum.

Constraints:
- The number of nodes is in the range [0, 5000].
- -1000 <= Node.val <= 1000
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
    bool hasPathSum(TreeNode* root, int targetSum) {
        if (!root) return false;
        if (!root->left && !root->right) return root->val == targetSum;
        int next = targetSum - root->val;
        return hasPathSum(root->left, next) || hasPathSum(root->right, next);
    }
};

/*
Approach:
- DFS recursion: at each node, subtract its value from target and continue; true only at leaf match.

Complexity:
- Time: O(n)
- Space: O(h) recursion stack
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // Build tree: [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22
    TreeNode* n7 = new TreeNode(7);
    TreeNode* n2 = new TreeNode(2);
    TreeNode* n11 = new TreeNode(11, n7, n2);
    TreeNode* n4rightLeaf = new TreeNode(1);
    TreeNode* n13 = new TreeNode(13);
    TreeNode* n4right = new TreeNode(4, nullptr, n4rightLeaf);
    TreeNode* n4left = new TreeNode(4, n11, nullptr);
    TreeNode* n8 = new TreeNode(8, n13, n4right);
    TreeNode* root = new TreeNode(5, n4left, n8);

    Solution sol;
    std::cout << (sol.hasPathSum(root, 22) ? "true" : "false") << "\n"; // true

    // Cleanup (partial for brevity)
    delete n7; delete n2; delete n11; delete n4rightLeaf; delete n13; delete n4right; delete n4left; delete n8; delete root;
    return 0;
}
#endif