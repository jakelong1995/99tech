var sum_to_n_a = function(n) {
    // Implementation using a loop
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_b = function(n) {
    // Implementation using the arithmetic sequence formula
    return n * (1 + n) / 2;
};

var sum_to_n_c = function(n) {
    // Implementation using recursion
    if (n <= 0) return 0;
    return n + sum_to_n_c(n - 1);
};

// Export the functions to make them available for testing
module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };
