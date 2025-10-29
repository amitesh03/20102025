/*
LeetCode 230. Kth Smallest Element in a BST
Link: https://leetcode.com/problems/kth-smallest-element-in-a-bst/

Question:
Given the root of a binary search tree and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.

Constraints:
- The number of nodes in the tree is in the range [1, 10^4].
- 1 <= k <= number of nodes
- -10^9 <= Node.val <= 10^9
*/

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
    int kthSmallest(TreeNode* root, int k) {
        std::stack<TreeNode*> st;
        TreeNode* cur = root;
        while (cur || !st.empty()) {
            while (cur) {
                st.push(cur);
                cur = cur->left;
            }
            cur = st.top();
            st.pop();
            if (--k == 0) return cur->val;
            cur = cur->right;
        }
        return -1; // Should not happen if 1 <= k <= n
    }
};

/*
Approach:
- Inorder traversal of BST yields nodes in ascending order.
- Perform iterative inorder using an explicit stack, decrement k upon visiting each node; when k reaches 0, return current value.

Complexity:
- Time: O(h + k) where h is tree height; visits up to k nodes and descends along a path.
- Space: O(h) for the stack.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // Tree:    3
    //         / \
    //        1   4
    //         \
    //          2
    TreeNode* n2 = new TreeNode(2);
    TreeNode* n1 = new TreeNode(1, nullptr, n2);
    TreeNode* n4 = new TreeNode(4);
    TreeNode* root = new TreeNode(3, n1, n4);

    Solution sol;
    std::cout << sol.kthSmallest(root, 1) << "\n"; // 1
    std::cout << sol.kthSmallest(root, 2) << "\n"; // 2
    std::cout << sol.kthSmallest(root, 3) << "\n"; // 3
    std::cout << sol.kthSmallest(root, 4) << "\n"; // 4

    // Cleanup omitted
    return 0;
}
#endif