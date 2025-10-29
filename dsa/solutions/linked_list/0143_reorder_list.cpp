/*
LeetCode 143. Reorder List
Link: https://leetcode.com/problems/reorder-list/

Question:
You are given the head of a singly linked list. The list can be represented as:
L0 → L1 → … → Ln-1 → Ln
Reorder the list to be:
L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …
You may not modify the values in the list's nodes. Only nodes themselves may be changed.

Constraints:
- The number of nodes is in the range [1, 5 * 10^4].
- -10^5 <= Node.val <= 10^5
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
    void reorderList(ListNode* head) {
        if (!head || !head->next || !head->next->next) return;

        // 1) Find middle (slow ends at middle for odd, left middle for even)
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }

        // 2) Reverse second half starting at slow->next, and cut first half
        ListNode* second = reverseList(slow->next);
        slow->next = nullptr;

        // 3) Merge two halves alternately: first=head, second=second
        ListNode* first = head;
        while (second) {
            ListNode* t1 = first->next;
            ListNode* t2 = second->next;

            first->next = second;
            second->next = t1;

            first = t1;
            second = t2;
        }
    }

private:
    static ListNode* reverseList(ListNode* head) {
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
- Use fast/slow to find the midpoint.
- Reverse the second half of the list in-place and split the list.
- Merge the first half and the reversed second half by alternating nodes.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    // Build: 1->2->3->4->5 -> reorder -> 1->5->2->4->3
    ListNode* n5 = new ListNode(5);
    ListNode* n4 = new ListNode(4, n5);
    ListNode* n3 = new ListNode(3, n4);
    ListNode* n2 = new ListNode(2, n3);
    ListNode* n1 = new ListNode(1, n2);

    Solution().reorderList(n1);

    // Print list
    ListNode* cur = n1;
    while (cur) {
        cout << cur->val << (cur->next ? "->" : "\n");
        cur = cur->next;
    }

    // Cleanup
    while (n1) { ListNode* t = n1->next; delete n1; n1 = t; }
    return 0;
}
#endif