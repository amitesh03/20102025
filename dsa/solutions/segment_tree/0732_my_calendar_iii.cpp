/*
LeetCode 732. My Calendar III
Link: https://leetcode.com/problems/my-calendar-iii/

Question:
Implement a class MyCalendarThree that can book events (start, end) and returns the maximum number of concurrent events (K-booking)
observed so far. A K-booking occurs if K events overlap at some time.

Constraints:
- 0 <= start < end <= 1e9
- At most 400 calls to book()
*/

#include <map>
#include <cstddef>

class MyCalendarThree {
private:
    // Sweep line: store +1 at start, -1 at end
    std::map<int, int> delta;

public:
    MyCalendarThree() = default;

    int book(int start, int end) {
        // Add sweep-line increments
        ++delta[start];
        --delta[end];

        // Recompute the running maximum overlap
        int ongoing = 0;
        int best = 0;
        for (const auto& kv : delta) {
            ongoing += kv.second;
            if (ongoing > best) best = ongoing;
        }
        return best;
    }
};

/*
Approach:
- Sweep line using ordered map of boundary deltas.
- Each booking contributes +1 at start and -1 at end.
- The maximum prefix sum over the ordered boundaries is the maximum concurrent bookings so far.

Complexity:
- Per booking: O(M log M) to update map + O(M) to scan, where M is the number of unique endpoints so far.
- Space: O(M).

Note:
- For tighter per-call bounds, a dynamic segment tree with lazy propagation can track range add/global max.
- This STL-based sweep-line solution is accepted within typical constraints (<= 400 bookings).
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    MyCalendarThree cal;
    std::cout << cal.book(10, 20) << "\n"; // 1
    std::cout << cal.book(50, 60) << "\n"; // 1
    std::cout << cal.book(10, 40) << "\n"; // 2
    std::cout << cal.book(5, 15) << "\n";  // 3
    std::cout << cal.book(5, 10) << "\n";  // 3
    std::cout << cal.book(25, 55) << "\n"; // 3
    return 0;
}
#endif