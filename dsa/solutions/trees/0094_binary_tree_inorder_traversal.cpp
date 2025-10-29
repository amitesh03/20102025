/*
LeetCode 94. Binary Tree Inorder Traversal
Link: https://leetcode.com/problems/binary-tree-inorder-traversal/

Question:
Given the root of a binary tree, return the inorder traversal of its nodes' values.

Constraints:
- The number of nodes in the tree is in the range [0, 100].
- -100 <= Node.val <= 100
*/

#include <vector>
#include <stack>

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
    std::vector<int> inorderTraversal(TreeNode* root) {
        std::vector<int> res;
        std::stack<TreeNode*> st;
        TreeNode* cur = root;
        while (cur || !st.empty()) {
            while (cur) {
                st.push(cur);
                cur = cur->left;
            }
            cur = st.top(); st.pop();
            res.push_back(cur->val);
            cur = cur->right;
        }
        return res;
    }
};

/*
Approach:
- Iterative inorder using an explicit stack. Traverse left down, process current, then move right.

Complexity:
- Time: O(n)
- Space: O(n) worst-case due to stack
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    TreeNode* n3 = new TreeNode(3);
    TreeNode* n2 = new TreeNode(2, n3, nullptr);
    TreeNode* n1 = new TreeNode(1, nullptr, n2);

    Solution sol;
    std::vector<int> ans = sol.inorderTraversal(n1);
    for (std::size_t i = 0; i < ans.size(); ++i) {
        std::cout << ans[i] << (i + 1 < ans.size() ? ' ' : '\n');
    }

    // Cleanup
    delete n3; delete n2; delete n1;
    return 0;
}
#endif