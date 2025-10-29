/*
LeetCode 252. Meeting Rooms
Link: https://leetcode.com/problems/meeting-rooms/

Question:
Given an array of meeting time intervals where intervals[i] = [starti, endi],
determine if a person could attend all meetings. A person can attend all meetings
if and only if no two meetings overlap (i.e., for every adjacent pair after sorting by start,
end of previous <= start of next).

Constraints:
- 0 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= starti < 10^6
- 0 < endi <= 10^6
*/

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b){
            if (a[0] != b[0]) return a[0] < b[0];
            return a[1] < b[1];
        });
        for (int i = 1; i < static_cast<int>(intervals.size()); ++i) {
            if (intervals[i-1][1] > intervals[i][0]) return false;
        }
        return true;
    }
};

/*
Approach:
- Sort by start time and ensure each previous end <= next start.

Complexity:
- Time: O(n log n)
- Space: O(1) extra
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<vector<int>> a = {{0,30},{5,10},{15,20}};
    vector<vector<int>> b = {{7,10},{2,4}};
    cout << (sol.canAttendMeetings(a) ? "true" : "false") << "\n"; // false
    cout << (sol.canAttendMeetings(b) ? "true" : "false") << "\n"; // true
    return 0;
}
#endif