/*
LeetCode 307. Range Sum Query - Mutable
Link: https://leetcode.com/problems/range-sum-query-mutable/

Question:
Given an integer array nums, handle multiple queries of the following types:
- Update the value of an element in nums.
- Calculate the sum of the elements of nums between indices left and right inclusive.
Implement class NumArray with:
- NumArray(vector<int>& nums) initializes the object with the integer array nums.
- void update(int index, int val) updates nums[index] to be val.
- int sumRange(int left, int right) returns the sum of the subarray nums[left...right] (inclusive).

Constraints:
- 1 <= nums.length <= 3 * 10^4
- -100 <= nums[i] <= 100
- 0 <= index < nums.length
- -100 <= val <= 100
- 1 <= number of calls to update and sumRange <= 3 * 10^4
*/

#include <vector>
#include <cstddef>

class NumArray {
private:
    int n;
    std::vector<int> bit;
    std::vector<int> a;

    static inline int lowbit(int x) { return x & -x; }

    void add(int idx, int delta) {
        for (int i = idx; i <= n; i += lowbit(i)) bit[i] += delta;
    }

    int sumPrefix(int idx) const {
        int s = 0;
        for (int i = idx; i > 0; i -= (i & -i)) s += bit[i];
        return s;
    }

public:
    NumArray(std::vector<int>& nums) {
        n = static_cast<int>(nums.size());
        bit.assign(n + 1, 0);
        a = nums;
        for (int i = 0; i < n; ++i) add(i + 1, a[i]);
    }

    void update(int index, int val) {
        int delta = val - a[index];
        a[index] = val;
        add(index + 1, delta);
    }

    int sumRange(int left, int right) {
        if (left > right) return 0;
        return sumPrefix(right + 1) - sumPrefix(left);
    }
};

/*
Approach:
- Use a Binary Indexed Tree (Fenwick Tree) to support point updates and prefix sums in O(log n).
- sumRange(l, r) = prefix(r) - prefix(l - 1), implemented via 1-indexed BIT.

Complexity:
- Build: O(n log n) due to n point-add operations
- update: O(log n)
- sumRange: O(log n)
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    std::vector<int> nums = {1, 3, 5};
    NumArray na(nums);
    std::cout << na.sumRange(0, 2) << "\n"; // 9
    na.update(1, 2);
    std::cout << na.sumRange(0, 2) << "\n"; // 8
    return 0;
}
#endif