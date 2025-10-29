/*
LeetCode 19. Remove Nth Node From End of List
Link: https://leetcode.com/problems/remove-nth-node-from-end-of-list/

Question:
Given the head of a linked list, remove the nth node from the end of the list and return its head.

Constraints:
- The number of nodes in the list is in the range [1, 10^4].
- 1 <= n <= number of nodes
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
    // Two-pointer with dummy head to simplify deleting the head.
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head);
        ListNode* fast = &dummy;
        ListNode* slow = &dummy;
        // Move fast n+1 steps ahead to keep gap of n between slow and fast
        for (int i = 0; i < n + 1; ++i) {
            fast = fast->next;
        }
        while (fast) {
            fast = fast->next;
            slow = slow->next;
        }
        // slow is before the node to delete
        ListNode* toDelete = slow->next;
        slow->next = slow->next ? slow->next->next : nullptr;
        // Optional: delete toDelete to free memory (LeetCode ignores)
        // delete toDelete;
        return dummy.next;
    }
};

/*
Approach:
- Use a dummy node pointing to head. Advance fast n+1 steps, then advance both until fast reaches null.
- slow->next is the node to remove; relink and return dummy.next.

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
    ListNode* res = sol.removeNthFromEnd(n1, 2); // remove 4 => 1->2->3->5
    for (ListNode* p = res; p; p = p->next) {
        if (p != res) cout << " ";
        cout << p->val;
    }
    cout << "\n";
    // Cleanup
    while (res) { ListNode* t = res->next; delete res; res = t; }
    return 0;
}
#endif