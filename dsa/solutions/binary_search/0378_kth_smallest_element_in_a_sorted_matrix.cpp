/*
LeetCode 378. Kth Smallest Element in a Sorted Matrix
Link: https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/

Question:
Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.

Constraints:
- n == matrix.length == matrix[i].length
- 1 <= n <= 300
- -1e9 <= matrix[i][j] <= 1e9
- 1 <= k <= n*n

Approach (Binary Search on value + row-wise upper_bound):
- Search in value range [matrix[0][0], matrix[n-1][n-1]].
- For a candidate mid, count how many elements <= mid using per-row upper_bound.
- If count >= k, the answer is <= mid; move hi = mid. Else, move lo = mid + 1.

Complexity:
- Time: O(n log(range)) with O(n log n) per loop replaced by n * log n for upper_bound across rows; practically O(n log(range)).
- Space: O(1)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    int kthSmallest(std::vector<std::vector<int>>& matrix, int k) {
        const int m = static_cast<int>(matrix.size());
        const int n = static_cast<int>(matrix[0].size());
        int lo = matrix[0][0];
        int hi = matrix[m - 1][n - 1];
        auto countLE = [&](int x) -> long long {
            long long cnt = 0;
            for (int i = 0; i < m; ++i) {
                cnt += std::upper_bound(matrix[i].begin(), matrix[i].end(), x) - matrix[i].begin();
            }
            return cnt;
        };
        while (lo < hi) {
            int mid = lo + ((hi - lo) >> 1);
            if (countLE(mid) >= k) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
    }
};