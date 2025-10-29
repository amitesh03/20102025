/*
LeetCode 74. Search a 2D Matrix
Link: https://leetcode.com/problems/search-a-2d-matrix/

Question:
You are given an m x n integer matrix with the following properties:
- Each row is sorted in non-decreasing order.
- The first integer of each row is greater than the last integer of the previous row.
Given an integer target, return true if target is in the matrix or false otherwise.

Constraints:
- 1 <= m, n
- -1e9 <= matrix[i][j], target <= 1e9

Approach (Binary Search over flattened array):
- Treat the matrix as a single sorted array of length m * n.
- Binary search over indices [0 .. m*n).
- Map mid index to (mid / n, mid % n) to access the matrix cell.

Complexity:
- Time: O(log(m*n))
- Space: O(1)
*/

#include <vector>

class Solution {
public:
    bool searchMatrix(const std::vector<std::vector<int>>& matrix, int target) {
        const int m = static_cast<int>(matrix.size());
        const int n = static_cast<int>(matrix[0].size());
        int lo = 0, hi = m * n;
        while (lo < hi) {
            int mid = lo + ((hi - lo) >> 1);
            int r = mid / n;
            int c = mid % n;
            int val = matrix[r][c];
            if (val < target) lo = mid + 1;
            else hi = mid;
        }
        if (lo == m * n) return false;
        int r = lo / n, c = lo % n;
        return matrix[r][c] == target;
    }
};