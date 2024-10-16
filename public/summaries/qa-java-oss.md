# Quality Assurance Practices in Java-based Open Source Software

Our research team conducted a large-scale study to understand how various quality assurance (QA) practices are used in Java-based open-source software projects on GitHub, both individually and in combination.

## Why This Matters

Quality assurance is crucial for software development, but it's unclear how different QA practices are used together in real-world projects. Understanding this can help improve software quality and guide best practices.

## What We Did

1. We analyzed 1454 popular Java projects on GitHub.
2. We looked at five key QA practices: local buildability, automated static analysis tools (ASATs), continuous integration (CI), code review, and testing.
3. We collected data on how these practices are used individually and in combination.
4. We also specifically examined more mature projects to see if they use QA practices differently.

## Key Findings

1. Individual QA Practices:
   - 63% of projects build successfully locally
   - 38% use at least one ASAT
   - 63% use CI, with 76% of those having a successful CI state
   - Code review intensity varies widely across projects
   - 68% of projects with measurable code coverage have low or very low test coverage

2. Combined QA Practices:
   - We found weak correlations between some practices, such as:
     - Higher code coverage and more intense code reviews
     - ASAT usage and CI usage
     - Code review intensity and CI/ASAT usage
   - Generally, projects don't use all QA practices together with high intensity

3. Mature Projects:
   - Tend to invest more in QA practices overall
   - Show higher ASAT usage (70% vs. 38% overall)
   - Have more intense code reviews
   - Have higher code coverage

## Implications

1. There's room for improvement in adopting and combining QA practices in open-source projects.
2. The weak correlations between practices suggest that projects might not be fully leveraging the complementary nature of different QA approaches.
3. Mature projects' higher adoption of QA practices could serve as a model for other projects to follow.

## Why It Matters

By understanding how QA practices are currently used in open-source projects, we can identify areas for improvement and guide future research and development of tools to support better software quality assurance.
