# AI Rules

1.  **NO HARDCODED VALUES**: 
    -   Do not hardcode IP addresses, URLs, API keys, secrets, or configuration values.
    -   Use environment variables (e.g., `process.env.VAR_NAME`) or a configuration service.
    -   Use constants for magic strings/numbers.

2.  **TypeScript Strictness**:
    -   Avoid `any` type. Use specific types or interfaces.
    -   Ensure strict null checks are respected.

3.  **Error Handling**:
    -   Catch errors specifically; avoid empty catch blocks.
    -   Use proper logging (e.g., `Logger.error`) instead of `console.log`.

4.  **Comments**:
    -   Remove `TODO`, `FIXME`, and commented-out code before finalizing.
