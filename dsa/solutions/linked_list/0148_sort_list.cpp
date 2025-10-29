/*
LeetCode 148. Sort List
Link: https://leetcode.com/problems/sort-list/

Question:
Given the head of a linked list, return the list after sorting it in ascending order.

Constraints:
- The number of nodes in the list is in the range [0, 5 * 10^5].
- -10^5 <= Node.val <= 10^5

Follow up: Can you sort the linked list in O(n log n) time and O(1) memory (i.e., constant extra space)?
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
    ListNode* sortList(ListNode* head) {
        if (!head || !head->next) return head;

        // Split list into two halves using slow/fast pointers
        ListNode* slow = head;
        ListNode* fast = head;
        ListNode* prev = nullptr;
        while (fast && fast->next) {
            prev = slow;
            slow = slow->next;
            fast = fast->next->next;
        }
        // Cut the list into two halves: head..prev and slow..end
        prev->next = nullptr;

        // Sort each half
        ListNode* left = sortList(head);
        ListNode* right = sortList(slow);

        // Merge sorted halves
        return mergeTwoLists(left, right);
    }

private:
    static ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
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
        tail->next = a ? a : b;
        return dummy.next;
    }
};

/*
Approach:
- Use merge sort on linked list: find middle with fast/slow, split, recursively sort each half, then merge.
- The merge operation reuses existing nodes, modifying next pointers in-place.

Complexity:
- Time: O(n log n) due to merge sort.
- Space: O(1) auxiliary (ignoring recursion stack), O(log n) recursion depth.
*/

#ifdef LOCAL_TEST
int main() {
    // Build: 4->2->1->3
    ListNode* n4 = new ListNode(3);
    ListNode* n3 = new ListNode(1, n4);
    ListNode* n2 = new ListNode(2, n3);
    ListNode* n1 = new ListNode(4, n2);

    Solution sol;
    ListNode* sorted = sol.sortList(n1);

    // Print sorted list: 1->2->3->4
    ListNode* cur = sorted;
    while (cur) {
        cout << cur->val << (cur->next ? "->" : "\n");
        cur = cur->next;
    }

    // Cleanup
    while (sorted) { ListNode* t = sorted->next; delete sorted; sorted = t; }
    return 0;
}
#endif