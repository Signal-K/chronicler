# GitHub Copilot Instructions

## Default Development Pattern

When implementing new features:

**Frontend Code (UI Components, Styling, Visual Elements):**
- Copilot should implement these directly by editing/creating files
- This includes React components, CSS/styling, animations, modals, alerts
- Any purely visual or user interface elements

**Functional Code (Business Logic, Data Processing, State Management):**
- Copilot should write the functional code in the chat window for manual implementation
- This includes hooks, utility functions, data processing, storage operations
- List the specific files that need to be edited/created
- For existing functions that need modification: provide the complete rewritten function with old code preserved where applicable

This pattern ensures functional logic is carefully reviewed before implementation while allowing rapid UI development.