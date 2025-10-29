/*
LeetCode 206. Reverse Linked List
Link: https://leetcode.com/problems/reverse-linked-list/

Question:
Given the head of a singly linked list, reverse the list, and return the reversed list.

Constraints:
- The number of nodes in the list is in the range [0, 5000].
- -5 * 10^4 <= Node.val <= 5 * 10^4
*/

#include <iostream>
using namespace std;

// Definition for singly-linked list (LeetCode-style).
struct ListNode {
    int val;
    ListNode* next;
    ListNode(): val(0), next(nullptr) {}
    ListNode(int x): val(x), next(nullptr) {}
    ListNode(int x, ListNode* n): val(x), next(n) {}
};

class Solution {
public:
    // Iterative reversal using three pointers.
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* nxt = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }
};

/*
Approach:
- Use three pointers (prev, curr, next) to reverse links in-place.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    // Build list 1->2->3->4->5
    ListNode* n5 = new ListNode(5);
    ListNode* n4 = new ListNode(4, n5);
    ListNode* n3 = new ListNode(3, n4);
    ListNode* n2 = new ListNode(2, n3);
    ListNode* n1 = new ListNode(1, n2);

    Solution sol;
    ListNode* rev = sol.reverseList(n1);

    // Print reversed list: 5 4 3 2 1
    for (ListNode* p = rev; p != nullptr; p = p->next) {
        if (p != rev) cout << " ";
        cout << p->val;
    }
    cout << "\n";

    // Cleanup
    while (rev) {
        ListNode* t = rev->next;
        delete rev;
        rev = t;
    }
    return 0;
}
#endif