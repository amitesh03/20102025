/*
LeetCode 1109. Corporate Flight Bookings
Link: https://leetcode.com/problems/corporate-flight-bookings/

Question:
There are n flights, numbered from 1 to n. You are given an array bookings where
bookings[i] = [first_i, last_i, seats_i] represents a booking for every flight from
first_i to last_i (inclusive) with seats_i seats reserved for each flight in the range.
Return an array answer of length n where answer[j] is the total number of seats reserved
for flight j.

Constraints:
- 1 <= n <= 2 * 10^4
- 1 <= bookings.length <= 2 * 10^4
- bookings[i].length == 3
- 1 <= first_i <= last_i <= n
- 1 <= seats_i <= 10^4

Approach (Difference Array + Prefix Sum):
- Maintain a difference array diff of length n + 1 initialized to 0.
- For each booking [l, r, seats], do:
  diff[l - 1] += seats; and diff[r] -= seats (if r < n), to mark range increment.
- Finally, compute prefix sums over diff into result vector of length n.

Complexity:
- Time: O(n + m), where m = bookings.length
- Space: O(n)
*/

#include <vector>

class Solution {
public:
    std::vector<int> corpFlightBookings(std::vector<std::vector<int>>& bookings, int n) {
        std::vector<int> diff(n + 1, 0);
        for (size_t i = 0; i < bookings.size(); ++i) {
            int l = bookings[i][0];
            int r = bookings[i][1];
            int seats = bookings[i][2];
            diff[l - 1] += seats;
            if (r < n) diff[r] -= seats;
        }
        std::vector<int> ans(n, 0);
        int run = 0;
        for (int i = 0; i < n; ++i) {
            run += diff[i];
            ans[i] = run;
        }
        return ans;
    }
};