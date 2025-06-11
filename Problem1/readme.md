# Sum to N Function Implementations

## Problem Description

This project implements three different approaches to calculate the sum of integers from 1 to n, where n is any integer.

The function signature is:
```javascript
function sum_to_n(n) {
    // Returns the sum of all integers from 1 to n inclusive
    // i.e., 1 + 2 + 3 + ... + n
}
```

## Implementations

### 1. Iterative Approach (sum_to_n_a)

This implementation uses a simple loop to add each number from 1 to n:

```javascript
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};
```

**Time Complexity**: O(n) - We need to iterate through all numbers from 1 to n
**Space Complexity**: O(1) - We only use a single variable to track the sum

### 2. Mathematical Formula (sum_to_n_b)

This implementation uses the arithmetic sequence formula: n * (first + last) / 2

```javascript
var sum_to_n_b = function(n) {
    return n * (1 + n) / 2;
};
```

**Time Complexity**: O(1) - Direct calculation with no loops
**Space Complexity**: O(1) - No additional space needed

### 3. Recursive Approach (sum_to_n_c)

This implementation uses recursion to break down the problem:

```javascript
var sum_to_n_c = function(n) {
    if (n <= 0) return 0;
    return n + sum_to_n_c(n - 1);
};
```

**Time Complexity**: O(n) - We make n recursive calls
**Space Complexity**: O(n) - The call stack grows to size n

## Testing

The implementations are tested with various inputs including edge cases:

- n = 1 (smallest positive integer)
- n = 5 (small positive integer)
- n = 10 (medium positive integer)
- n = 100 (larger positive integer)

To run the tests:

```
node test_sumton.js
```

## Mathematical Proof

The formula n*(n+1)/2 works because:

Consider the sum: S = 1 + 2 + 3 + ... + n

We can write this sum in reverse order: S = n + (n-1) + (n-2) + ... + 1

Adding these two equations:
```
S = 1 + 2 + 3 + ... + (n-1) + n
S = n + (n-1) + (n-2) + ... + 2 + 1
```

Adding vertically:
```
2S = (1+n) + (2+n-1) + (3+n-2) + ... + (n+1)
2S = (n+1) + (n+1) + (n+1) + ... + (n+1) [n times]
2S = n * (n+1)
```

Therefore:
```
S = n * (n+1) / 2
```

## Performance Considerations

- The mathematical formula approach (sum_to_n_b) is the most efficient for large values of n
- The recursive approach (sum_to_n_c) may cause stack overflow for very large values of n
- The iterative approach (sum_to_n_a) is straightforward but less efficient than the mathematical formula