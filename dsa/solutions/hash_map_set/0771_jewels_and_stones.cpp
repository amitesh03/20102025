/*
LeetCode 771. Jewels and Stones
Link: https://leetcode.com/problems/jewels-and-stones/

Question:
You're given strings jewels representing the types of stones that are jewels, and stones representing the stones you have.
Each character in stones is a type of stone you have. You want to know how many of the stones you have are also jewels.

Constraints:
- 1 <= jewels.length, stones.length <= 50
- jewels and stones consist of English letters.
*/

#include <iostream>
#include <string>
#include <unordered_set>
using namespace std;

class Solution {
public:
    int numJewelsInStones(string jewels, string stones) {
        unordered_set<char> J;
        for (char c : jewels) J.insert(c);
        int count = 0;
        for (char c : stones) {
            if (J.find(c) != J.end()) ++count;
        }
        return count;
    }
};

/*
Approach:
- Insert all jewel characters into an unordered_set; count stones that appear in the set.

Complexity:
- Time: O(|jewels| + |stones|)
- Space: O(|jewels|)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << sol.numJewelsInStones("aA", "aAAbbbb") << "\n"; // 3
    cout << sol.numJewelsInStones("z", "ZZ") << "\n";       // 0
    return 0;
}
#endif