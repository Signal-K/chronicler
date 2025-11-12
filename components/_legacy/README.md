# Legacy Components

This folder contains components that have been removed from the active game flow but are preserved for future reintegration.

## Classification System

The classification modal and related components were decoupled from the crop growth mechanics to simplify the core gameplay loop. Previously, players had to classify pollinators when crops reached stage 4 before they could proceed to stage 5.

### Components Preserved:

- **ClassificationModal.tsx** - Original classification UI
- **ClassificationModalV2.tsx** - Redesigned agricultural-themed classification UI with wooden frames and natural colors

### Future Integration Plans:

Classification will be reintroduced as a **bonus mechanic** that:
- Provides higher crop yields
- Improves crop quality
- May unlock additional garden plots
- Could provide special seeds or resources

The mechanic will be **optional** and not required for basic crop growth. This maintains the citizen science aspect of Bumble while keeping the core farming loop accessible and enjoyable.

### Related Files:

- Hook: `/hooks/_legacy/useClassification.ts`
- Types: Classification types are still in `/types/actions.ts`
- Database: Classification submission functions remain in the codebase

---

*Last updated: November 12, 2025*
