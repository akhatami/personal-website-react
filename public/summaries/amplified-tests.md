# Shaken, Not Stirred: How Developers Like Their Amplified Tests

Our research team investigated how software developers select, edit, and judge automatically amplified tests before including them in their maintained test suites.

## Why This Matters

Test amplification is a promising technique to automatically generate new tests based on existing ones. However, it's unclear what changes developers need to make to these tests before accepting them. Understanding this can help improve test amplification tools and processes.

## What We Did

1. We used DSpot, a test amplification tool, to generate new tests for 52 open-source Java projects.
2. We manually selected and edited tests for these projects.
3. We submitted 39 pull requests with amplified tests to the original projects.
4. We analyzed the feedback and discussions from project maintainers about these tests.

## Key Findings

1. Selection Criteria:
   - Developers exclude tests that don't actually provide new coverage or test irrelevant scenarios.
   - Tests should check behavior related to the newly covered code.

2. Common Edits:
   - Aligning assertion style with existing tests
   - Removing unnecessary code
   - Improving test names and readability

3. Maintainer Feedback:
   - Most changes proposed by maintainers focused on adhering to code style conventions and removing unnecessary code.
   - Maintainers often asked about the purpose and added value of the new tests.
   - Tests for meaningful, previously untested scenarios were more likely to be accepted.

4. Developer Understanding:
   - Understanding the amplified test's behavior was crucial for developers to judge its value and make necessary edits.

## Implications

1. Test amplification tools should focus on generating tests that are easier for developers to understand and edit.
2. Tools should provide more context about the amplified changes and new coverage to aid developer comprehension.
3. Automated post-processing of amplified tests (e.g., adhering to code style, removing unnecessary code) could reduce manual editing efforts.
4. The process of incorporating amplified tests into a project's test suite should be seen as a collaboration between the tool and the developer.

## Why It Matters

By understanding how developers work with amplified tests, we can improve test amplification tools and processes. This can lead to more efficient test suite expansion and better software quality assurance practices.
