/*
LeetCode 435. Non-overlapping Intervals
Link: https://leetcode.com/problems/non-overlapping-intervals/

Question:
Given an array of intervals where intervals[i] = [start_i, end_i], return
the minimum number of intervals you need to remove to make the rest non-overlapping.

Constraints:
- 1 <= intervals.length <= 10^5
- intervals[i].length == 2
- -5 * 10^4 <= start_i < end_i <= 5 * 10^4
*/

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int> >& intervals) {
        if (intervals.empty()) return 0;
        sort(intervals.begin(), intervals.end(), cmp);
        int removals = 0;
        int lastEnd = intervals[0][1];
        for (int i = 1; i < static_cast<int>(intervals.size()); ++i) {
            if (intervals[i][0] < lastEnd) {
                ++removals;
                if (intervals[i][1] < lastEnd) lastEnd = intervals[i][1];
            } else {
                lastEnd = intervals[i][1];
            }
        }
        return removals;
    }
private:
    static bool cmp(const vector<int>& a, const vector<int>& b) {
        if (a[1] != b[1]) return a[1] < b[1];
        return a[0] < b[0];
    }
};

/*
Greedy strategy:
- Sort by end time ascending and always keep the interval with the smallest end.
- If the next interval starts before the current end, remove one (increment removals)
  and keep the one with the smaller end (minimize future conflicts).

Complexity:
- Time: O(n log n) due to sorting
- Space: O(1) extra (output not counted)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<vector<int> > a;
    a.push_back(vector<int>(2,0)); a.back()[0]=1; a.back()[1]=2;
    a.push_back(vector<int>(2,0)); a.back()[0]=2; a.back()[1]=3;
    a.push_back(vector<int>(2,0)); a.back()[0]=3; a.back()[1]=4;
    a.push_back(vector<int>(2,0)); a.back()[0]=1; a.back()[1]=3;
    cout << sol.eraseOverlapIntervals(a) << "\n"; // Expected: 1

    vector<vector<int> > b;
    b.push_back(vector<int>(2,0)); b.back()[0]=1; b.back()[1]=2;
    b.push_back(vector<int>(2,0)); b.back()[0]=1; b.back()[1]=2;
    b.push_back(vector<int>(2,0)); b.back()[0]=1; b.back()[1]=2;
    cout << sol.eraseOverlapIntervals(b) << "\n"; // Expected: 2
    return 0;
}
#endif