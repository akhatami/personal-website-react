# Beyond the YAML File: Understanding Real-World GitHub Actions Workflow Adoption

GitHub Actions (GHA) has become the dominant platform for automating CI/CD workflows in open-source software. While configuring a workflow is as simple as adding a YAML file, configuring it doesn't necessarily mean it's actually used. This study investigates the gap between workflow configuration and real-world adoption.

## What We Did

1. We analyzed 258,300 workflow executions across 952 open-source repositories on GitHub.
2. We examined how developers respond to workflow failures — whether they fix, ignore, or remove failing workflows.
3. We investigated the relationship between workflow intensity (how actively workflows are triggered) and workflow reliability.
4. We identified patterns in which configured workflows are actively used versus left dormant.

## What We Found

- There is a measurable **configuration-usage gap**: a significant portion of configured workflows are not actively used in practice — presence does not imply adoption.
- Distinct failure response patterns emerged: developers vary widely in how quickly and consistently they address workflow failures.
- Higher workflow intensity correlates with better reliability, suggesting that actively used workflows receive more maintenance attention.
- Workflow failure response behavior follows identifiable patterns that can be characterized as a theory of GHA workflow failure response.

## Why It Matters

Understanding how workflows are actually adopted — not just configured — is essential for teams trying to get value from their CI/CD investments. This research provides empirical evidence that organizations should audit not just what workflows exist, but which ones are genuinely integrated into their development process. The findings help teams prioritize workflow maintenance and make more informed decisions about CI/CD tooling.
