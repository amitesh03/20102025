/*
LeetCode 21. Merge Two Sorted Lists
Link: https://leetcode.com/problems/merge-two-sorted-lists/

Question:
You are given the heads of two sorted linked lists list1 and list2.
Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.
Return the head of the merged linked list.

Constraints:
- The number of nodes in both lists is in the range [0, 50].
- -100 <= Node.val <= 100
- Both list1 and list2 are sorted in non-decreasing order.
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
    // Iterative merge using dummy head; reuses existing nodes and maintains stability.
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        ListNode* a = list1;
        ListNode* b = list2;
        while (a && b) {
            if (a->val <= b->val) {
                tail->next = a;
                a = a->next;
            } else {
                tail->next = b;
                b = b->next;
            }
            tail = tail->next;
        }
        tail->next = (a ? a : b);
        return dummy.next;
    }
};

/*
Approach:
- Use a dummy head and a tail pointer. Compare heads of both lists and append the smaller node.
- When one list is exhausted, append the remainder of the other list.

Complexity:
- Time: O(n + m)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    // Build list1: 1->2->4
    ListNode* l1 = new ListNode(1, new ListNode(2, new ListNode(4)));
    // Build list2: 1->3->4
    ListNode* l2 = new ListNode(1, new ListNode(3, new ListNode(4)));

    Solution sol;
    ListNode* merged = sol.mergeTwoLists(l1, l2);

    // Print merged: 1 1 2 3 4 4
    for (ListNode* p = merged; p; p = p->next) {
        if (p != merged) cout << " ";
        cout << p->val;
    }
    cout << "\n";

    // Cleanup
    while (merged) {
        ListNode* t = merged->next;
        delete merged;
        merged = t;
    }
    return 0;
}
#endif