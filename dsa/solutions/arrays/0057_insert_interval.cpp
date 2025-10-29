/*
LeetCode 57. Insert Interval
Link: https://leetcode.com/problems/insert-interval/

Question:
You are given an array of non-overlapping intervals intervals where intervals[i] = [start_i, end_i]
represent the start and end of the i-th interval and intervals is sorted by start_i.
You are also given an interval newInterval = [start, end].
Insert newInterval into intervals such that intervals is still sorted by start_i and still does not have any overlapping intervals
(merge overlapping intervals if necessary). Return the new array of intervals.

Constraints:
- 0 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= start_i <= end_i <= 10^5
- 0 <= start <= end <= 10^5
*/

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int> > insert(vector<vector<int> >& intervals, vector<int>& newInterval) {
        vector<vector<int> > res;
        int n = static_cast<int>(intervals.size());
        int i = 0;

        // Add all intervals ending before newInterval starts
        while (i < n && intervals[i][1] < newInterval[0]) {
            res.push_back(intervals[i]);
            ++i;
        }

        // Merge all overlapping intervals into newInterval
        while (i < n && intervals[i][0] <= newInterval[1]) {
            if (intervals[i][0] < newInterval[0]) newInterval[0] = intervals[i][0];
            if (intervals[i][1] > newInterval[1]) newInterval[1] = intervals[i][1];
            ++i;
        }
        res.push_back(newInterval);

        // Add the remaining intervals
        while (i < n) {
            res.push_back(intervals[i]);
            ++i;
        }
        return res;
    }
};

/*
Complexity:
- Time: O(n)
- Space: O(1) extra (output not counted)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<vector<int> > intervals;
    intervals.push_back(vector<int>(2, 0)); intervals.back()[0] = 1; intervals.back()[1] = 3;
    intervals.push_back(vector<int>(2, 0)); intervals.back()[0] = 6; intervals.back()[1] = 9;
    vector<int> newInterval(2, 0); newInterval[0] = 2; newInterval[1] = 5;

    vector<vector<int> > ans = sol.insert(intervals, newInterval);
    for (int j = 0; j < static_cast<int>(ans.size()); ++j) {
        cout << "[" << ans[j][0] << "," << ans[j][1] << "]";
        if (j + 1 < static_cast<int>(ans.size())) cout << " ";
    }
    cout << "\n"; // Expected: [1,5] [6,9]
    return 0;
}
#endif