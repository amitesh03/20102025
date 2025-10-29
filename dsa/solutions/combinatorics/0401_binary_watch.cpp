/*
LeetCode 401. Binary Watch
Link: https://leetcode.com/problems/binary-watch/

Question:
A binary watch has 4 LEDs on the top to represent the hours (0-11) and 6 LEDs on the bottom to represent the minutes (0-59).
Given an integer turnedOn representing the number of LEDs that are currently on, return all possible times the watch could represent.
You may return the answer in any order.

Constraints:
- 0 <= turnedOn <= 10

Approach (Enumerate and count bits):
- Enumerate all hours h in [0..11] and minutes m in [0..59].
- If popcount(h) + popcount(m) == turnedOn, format the time as "h:mm" (minutes zero-padded to 2 digits).
- Use Brian Kernighan’s algorithm for popcount to avoid compiler-specific intrinsics.

Complexity:
- Time: O(12 * 60) = O(1) constant
- Space: O(1) extra (excluding output)
*/

#include <vector>
#include <string>

class Solution {
public:
    std::vector<std::string> readBinaryWatch(int turnedOn) {
        std::vector<std::string> res;
        for (int h = 0; h <= 11; ++h) {
            for (int m = 0; m <= 59; ++m) {
                if (popcount(h) + popcount(m) == turnedOn) {
                    res.push_back(formatTime(h, m));
                }
            }
        }
        return res;
    }

private:
    static int popcount(int x) {
        int c = 0;
        while (x) {
            x &= (x - 1);
            ++c;
        }
        return c;
    }

    static std::string formatTime(int h, int m) {
        std::string s = std::to_string(h) + ":";
        if (m < 10) s.push_back('0');
        s += std::to_string(m);
        return s;
    }
};