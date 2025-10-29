/*
LeetCode 56. Merge Intervals
Link: https://leetcode.com/problems/merge-intervals/

Question:
Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals,
and return an array of the non-overlapping intervals that cover all the intervals in the input.

Constraints:
- 1 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= start_i <= end_i <= 10^4
*/

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int> > merge(vector<vector<int> >& intervals) {
        if (intervals.empty()) {
            vector<vector<int> > empty;
            return empty;
        }
        sort(intervals.begin(), intervals.end(), cmp);

        vector<vector<int> > merged;
        merged.push_back(intervals[0]);

        for (int i = 1; i < static_cast<int>(intervals.size()); ++i) {
            vector<int>& last = merged.back();
            vector<int>& cur = intervals[i];
            if (cur[0] <= last[1]) {
                if (cur[1] > last[1]) last[1] = cur[1];
            } else {
                merged.push_back(cur);
            }
        }
        return merged;
    }

private:
    static bool cmp(const vector<int>& a, const vector<int>& b) {
        if (a[0] != b[0]) return a[0] < b[0];
        return a[1] < b[1];
    }
};

/*
Complexity:
- Time: O(n log n) due to sorting
- Space: O(1) extra (output not counted)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<vector<int> > intervals;
    intervals.push_back(vector<int>(2, 0)); intervals.back()[0] = 1; intervals.back()[1] = 3;
    intervals.push_back(vector<int>(2, 0)); intervals.back()[0] = 2; intervals.back()[1] = 6;
    intervals.push_back(vector<int>(2, 0)); intervals.back()[0] = 8; intervals.back()[1] = 10;
    intervals.push_back(vector<int>(2, 0)); intervals.back()[0] = 15; intervals.back()[1] = 18;

    vector<vector<int> > ans = sol.merge(intervals);
    for (int i = 0; i < static_cast<int>(ans.size()); ++i) {
        cout << "[" << ans[i][0] << "," << ans[i][1] << "]";
        if (i + 1 < static_cast<int>(ans.size())) cout << " ";
    }
    cout << "\n"; // Expected: [1,6] [8,10] [15,18]
    return 0;
}
#endif