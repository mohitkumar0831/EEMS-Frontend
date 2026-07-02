---
name: codebase-audit
description: Runs a structured audit across an entire codebase or plugin project. Use when you need a health snapshot of the whole project — not a single PR or change. Use on inherited codebases, before a major refactor, before a public release, or on a regular scheduled cadence. Produces a prioritised findings report with actionable remediation steps.
---

# Codebase Audit

## Overview

A codebase audit is a full-project scan, not a per-change review. Where `plugin-code-review` asks "is this change safe to merge?", this skill asks "is this project healthy?". The output is a prioritised findings report the team can act on immediately or schedule into a backlog.

**Audit scope covers six areas:** structure & size, dependency health, security posture, dead code & hygiene, test coverage, and plugin-specific contracts (if applicable).

---

## When to Run

- Inheriting an unfamiliar or legacy codebase
- Before a major refactor or architecture change
- Before a public plugin release or marketplace submission
- After a long period without structured review
- On a regular cadence (quarterly is a reasonable default)
- After onboarding a large batch of AI-generated code

---

## Preparation

Before starting, gather:

```
1. Project root and entry points
2. Target host / runtime version (for plugins)
3. Package manifest (package.json, pyproject.toml, plugin.xml, etc.)
4. Existing test suite location
5. Any known problem areas flagged by the team
```

State your scope clearly at the top of the report:
- What was included in the audit
- What was explicitly excluded and why
- Which tools or checks were run

---

## The Six Audit Areas

### 1. Structure & Size

Assess whether the project is organised in a way that a new engineer (or agent) can navigate without a guide.

**Check for:**
- Files exceeding ~1000 lines — flag each one with its actual line count
- Modules or directories with unclear or overlapping responsibilities
- Deeply nested directory structures (>4 levels is a signal)
- Inconsistent naming conventions across files and folders
- Monolithic files doing more than one job
- Missing or misleading entry point documentation (README, index files)

**Output:** List of oversized or poorly-bounded files, with a recommended decomposition per file.

---

### 2. Dependency Health

Every dependency is a liability. Audit each one.

**Check for:**
- Dependencies with known vulnerabilities (`npm audit`, `pip-audit`, `gradle dependencyCheckAnalyze`, etc.)
- Outdated major versions with breaking changes upstream
- Unused or redundant dependencies (installed but not imported anywhere)
- Duplicate dependencies serving the same purpose
- Dependencies incompatible with the target host or runtime version
- Dependencies with licenses incompatible with the project's distribution terms
- Dependencies that are unmaintained (last commit >12 months, no active issues response)

**Output:** Dependency table — name, current version, status (OK / Outdated / Vulnerable / Unused / License risk), and recommended action.

---

### 3. Security Posture

A security audit across the whole project surface, not just changed lines.

**Check for:**
- Secrets, tokens, or credentials hardcoded anywhere in the codebase (including config files and test fixtures)
- User input that reaches logic, queries, or rendering without validation or sanitisation
- Parameterised queries — any string-concatenated SQL or query builder usage
- Output encoding — any user-controlled content rendered into the UI without escaping
- Over-privileged permission declarations in manifests or scopes
- External data (API responses, file content, user uploads) used without boundary validation
- Authentication or authorisation checks missing on sensitive operations
- Sensitive data written to logs
- Third-party scripts or resources loaded without integrity checks (SRI)

**Output:** Security findings table — location, issue type, severity (Critical / High / Medium / Low), and remediation step.

---

### 4. Dead Code & Hygiene

Orphaned code misleads future readers and agents.

**Check for:**
- Exported functions, classes, or constants with no callers
- Commented-out code blocks (delete or restore — not both)
- `TODO` / `FIXME` / `HACK` comments older than one release cycle
- Feature flags or environment branches that are permanently enabled or disabled
- Legacy compatibility shims for host versions no longer supported
- Duplicate utility functions across different modules
- Variables assigned but never read
- Imports that are unused

**Output:** Dead code inventory — location, type, and recommended action (delete / restore / consolidate).

---

### 5. Test Coverage

Coverage numbers are a floor, not a ceiling. Audit the quality of tests, not just the percentage.

**Check for:**
- Overall coverage percentage — note anything below 60% as a risk
- Critical paths (entry points, hooks, data mutations) with zero or minimal coverage
- Tests that only test implementation details, not observable behaviour
- Tests with no assertions or trivially passing assertions
- Error paths and edge cases absent from the test suite
- Flaky tests (non-deterministic, time-dependent, order-dependent)
- Missing integration or end-to-end tests for user-facing flows
- Test fixtures that are outdated or no longer reflect real data shapes

**Output:** Coverage gap map — which modules or flows are undertested, with a recommended test type (unit / integration / e2e) for each gap.

---

### 6. Plugin-Specific Contracts *(skip if not a plugin project)*

Plugins have obligations to their host that standalone apps do not.

**Check for:**
- Manifest / schema validity against the target host's current spec
- All declared permissions actually used — remove any that are not
- Lifecycle hooks (activate, deactivate, uninstall) present and correct
- Event listeners, timers, and subscriptions cleaned up in the deactivation path
- No writes to global state, native prototypes, or shared namespaces
- Correct handling of optional host APIs that may be absent
- Plugin version declared and follows semantic versioning
- Changelog up to date with breaking changes clearly marked

**Output:** Contract compliance table — each contract item, pass/fail, and remediation if failed.

---

## Severity Classification

Every finding gets a severity so the team can triage:

| Severity | Meaning | Typical SLA |
|----------|---------|-------------|
| **Critical** | Data loss, security vulnerability, broken core functionality | Fix before next release |
| **High** | Significant risk or user impact; not immediately breaking | Fix within current sprint |
| **Medium** | Quality or reliability risk; workarounds exist | Schedule in next sprint |
| **Low** | Hygiene, readability, minor debt | Backlog or batch fix |
| **Info** | Observation with no required action | Log for future reference |

---

## Audit Report Format

Produce the report in this structure:

```markdown
# Codebase Audit Report
**Project:** [Name]
**Date:** [Date]
**Auditor:** [Agent / Human name]
**Scope:** [What was audited]
**Excluded:** [What was skipped and why]
**Tools run:** [List of automated checks]

---

## Executive Summary
[2–4 sentences: overall health, top 3 findings, recommended immediate actions]

## Critical Findings
[Each finding: location, description, impact, remediation]

## High Findings
[Same format]

## Medium Findings
[Same format]

## Low / Info Findings
[Grouped by area, lighter detail]

---

## Area Summaries

### Structure & Size
[Findings + oversized file list]

### Dependency Health
| Package | Version | Status | Action |
|---------|---------|--------|--------|
| ...     | ...     | ...    | ...    |

### Security Posture
| Location | Issue | Severity | Remediation |
|----------|-------|----------|-------------|
| ...      | ...   | ...      | ...         |

### Dead Code & Hygiene
| Location | Type | Action |
|----------|------|--------|
| ...      | ...  | ...    |

### Test Coverage
| Module / Flow | Coverage | Gap Type | Recommended Test |
|---------------|----------|----------|-----------------|
| ...           | ...      | ...      | ...             |

### Plugin Contracts *(if applicable)*
| Contract Item | Status | Remediation |
|---------------|--------|-------------|
| ...           | ...    | ...         |

---

## Recommended Actions

### Do immediately (Critical / High)
1. [Specific action]
2. ...

### Schedule this sprint (Medium)
1. [Specific action]
2. ...

### Backlog (Low)
1. [Specific action]
2. ...

---

## Next Audit
Recommended cadence: [quarterly / before next major release / other]
Suggested focus areas for next audit: [based on patterns found]
```

---

## Running the Audit

### Automated checks to run first

Run these before any manual inspection. Record the raw output and attach it or summarise it in the report.

```bash
# Dependency vulnerabilities (Node)
npm audit --audit-level=moderate

# Dependency vulnerabilities (Python)
pip-audit

# Unused dependencies (Node)
npx depcheck

# Dead code / unused exports (TypeScript/JS)
npx ts-prune
npx unimported

# Secret scanning
npx secretlint "**/*"
# or
trufflehog filesystem .

# Test coverage
npm test -- --coverage
# or
pytest --cov=. --cov-report=term-missing
```

### Manual inspection order

1. Start with the manifest / entry point — understand the declared surface area
2. Scan the directory structure for obvious shape problems
3. Read the automated check output and triage findings
4. Spot-check the highest-risk modules manually (auth, data mutation, external API calls)
5. Review the test suite for quality, not just existence
6. Compile the report

---

## Honesty Standards

An audit is only useful if it is honest.

- **Don't soften findings to avoid discomfort.** A Critical is a Critical.
- **Don't inflate findings to seem thorough.** A Low is a Low.
- **Distinguish confirmed findings from suspicions.** If you couldn't verify something, say so.
- **Don't list a finding without a remediation.** "This is bad" without guidance is noise.
- **Quantify where possible.** "14 files exceed 1000 lines" is more useful than "many files are too large."

---

## Common Pitfalls

| Pitfall | Correction |
|---------|-----------|
| Treating coverage % as a proxy for quality | Read the tests — passing tests with no assertions are worthless |
| Fixing every Low before any Critical | Triage by severity, not by ease |
| Running only automated tools and calling it done | Automated tools miss logic errors, design smells, and contextual security issues |
| Auditing without a defined scope | State what's in and out before you start |
| Producing a report with no prioritised actions | Every finding needs a recommended action and a severity |
| Re-running the same audit without acting on the last one | An unread audit report is waste — schedule remediation before scheduling another audit |

---

## Verification Sign-Off

- [ ] All six areas covered (or exclusions documented)
- [ ] Automated checks run and output recorded
- [ ] Every finding has a severity and a remediation step
- [ ] Executive summary written last, after all findings are known
- [ ] Recommended actions prioritised and assigned (or ready to assign)
- [ ] Next audit cadence set