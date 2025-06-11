// Import the functions from sumton.js
const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require('./sumton.js');

// Test cases
const testCases = [
  { input: 1, expected: 1 },
  { input: 5, expected: 15 },
  { input: 10, expected: 55 },
  { input: 100, expected: 5050 }
];

// Function to run tests
function runTests() {
  console.log('Running tests for sum_to_n functions...\n');
  
  // Test sum_to_n_a
  console.log('Testing sum_to_n_a:');
  testFunction(sum_to_n_a, 'sum_to_n_a');
  
  // Test sum_to_n_b
  console.log('\nTesting sum_to_n_b:');
  testFunction(sum_to_n_b, 'sum_to_n_b');
  
  // Test sum_to_n_c
  console.log('\nTesting sum_to_n_c:');
  testFunction(sum_to_n_c, 'sum_to_n_c');
}

// Helper function to test a specific implementation
function testFunction(func, funcName) {
  let allPassed = true;
  
  testCases.forEach(test => {
    const result = func(test.input);
    const passed = result === test.expected;
    
    console.log(`  Input: ${test.input}, Expected: ${test.expected}, Got: ${result}, ${passed ? 'PASS' : 'FAIL'}`);
    
    if (!passed) {
      allPassed = false;
    }
  });
  
  console.log(`  ${funcName} tests: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'}`);
}

// Export the functions to make them available in Node.js
module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };

// Run the tests
runTests();
