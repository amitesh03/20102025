/*
LeetCode 23. Merge k Sorted Lists
Link: https://leetcode.com/problems/merge-k-sorted-lists/

Question:
You are given an array of k linked-lists, each linked-list is sorted in ascending order.
Merge all the linked-lists into one sorted linked-list and return it.

Constraints:
- k is in the range [0, 10^4]
- The total number of nodes in all lists is in the range [0, 10^5]
- -10^4 <= Node.val <= 10^4
*/

#include <vector>
#include <queue>
#include <functional>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(): val(0), next(nullptr) {}
    ListNode(int x): val(x), next(nullptr) {}
    ListNode(int x, ListNode* n): val(x), next(n) {}
};

struct Cmp {
    bool operator()(ListNode* a, ListNode* b) const {
        return a->val > b->val; // min-heap by value
    }
};

class Solution {
public:
    ListNode* mergeKLists(std::vector<ListNode*>& lists) {
        std::priority_queue<ListNode*, std::vector<ListNode*>, Cmp> pq;
        // Push initial heads
        int m = static_cast<int>(lists.size());
        for (int i = 0; i < m; ++i) {
            if (lists[i]) pq.push(lists[i]);
        }
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (!pq.empty()) {
            ListNode* node = pq.top(); pq.pop();
            tail->next = node;
            tail = node;
            if (node->next) pq.push(node->next);
        }
        tail->next = nullptr;
        return dummy.next;
    }
};

/*
Approach:
- Use a min-heap (priority_queue with custom comparator) keyed by node value.
- Initialize with all non-null list heads.
- Repeatedly extract the smallest node, append it to the result, and push its next if present.

Complexity:
- Time: O(N log k), where N is the total number of nodes and k is the number of lists.
- Space: O(k) for the heap.
*/