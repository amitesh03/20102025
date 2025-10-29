/*
LeetCode 2. Add Two Numbers
Link: https://leetcode.com/problems/add-two-numbers/

Question:
You are given two non-empty linked lists representing two non-negative integers. The digits are stored
in reverse order, and each of their nodes contains a single digit. Add the two numbers and return
the sum as a linked list.

Constraints:
- The number of nodes in each list is in the range [1, 100].
- 0 <= Node.val <= 9
- It is guaranteed that the list represents a number that does not have leading zeros.
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
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        int carry = 0;
        while (l1 || l2 || carry) {
            int sum = carry;
            if (l1) { sum += l1->val; l1 = l1->next; }
            if (l2) { sum += l2->val; l2 = l2->next; }
            carry = sum / 10;
            int digit = sum % 10;
            tail->next = new ListNode(digit);
            tail = tail->next;
        }
        return dummy.next;
    }
};

/*
Approach:
- Iterate both lists while maintaining a carry. Create nodes for each resulting digit.

Complexity:
- Time: O(max(m, n))
- Space: O(max(m, n)) for the output list
*/

#ifdef LOCAL_TEST
// Helper to build list from initializer_list (reverse order digits)
ListNode* build(initializer_list<int> digits) {
    ListNode* head = nullptr;
    ListNode* tail = nullptr;
    for (int d : digits) {
        if (!head) {
            head = tail = new ListNode(d);
        } else {
            tail->next = new ListNode(d);
            tail = tail->next;
        }
    }
    return head;
}

void print(ListNode* head) {
    while (head) {
        cout << head->val << (head->next ? "->" : "\n");
        head = head->next;
    }
}

int main() {
    // Example: (2 -> 4 -> 3) + (5 -> 6 -> 4) = 7 -> 0 -> 8
    ListNode* a = build({2,4,3});
    ListNode* b = build({5,6,4});
    Solution sol;
    ListNode* c = sol.addTwoNumbers(a, b);
    print(c);
    // Cleanup omitted for brevity
    return 0;
}
#endif