---
id: xqm080
title: Research citizen-science data and image sources for Bumble
status: todo
priority: high
labels:
  - liam-sprint
  - creative
  - research
  - api
  - bumble
createdAt: '2026-04-02T21:59:38.789Z'
updatedAt: '2026-04-02T22:00:23.814Z'
timeSpent: 0
parent: yfdpli
---
# Research citizen-science data and image sources for Bumble

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Evaluate lightweight external sources Bumble could draw from for future bee, pollinator, plant, or horticulture content. Focus on sources that are realistic to integrate through public APIs or openly reusable media libraries, and note licensing / reliability tradeoffs. Initial candidates should include iNaturalist, GBIF, Zooniverse / Panoptes, and Smithsonian Open Access.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Shortlist identifies at least 3 viable sources with API/media access notes
- [ ] #2 Research calls out licensing or attribution constraints for each source
- [ ] #3 Recommendation distinguishes between 'good for live in-product content' and 'good for internal reference only'
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Initial external research directions:
- iNaturalist: public observation API plus photos can support real bee / pollinator / plant examples with attribution-aware handling.
- GBIF: strong aggregate biodiversity API for species and occurrence data; useful for taxonomy / metadata, media availability varies by record.
- Zooniverse / Panoptes: relevant for project alignment and subject workflows, but likely weaker as a simple live image source.
- Smithsonian Open Access: useful open media/search API for reference assets, though less directly citizen-science-driven.
Research output should rank these by integration ease, media quality, and licensing clarity.
<!-- SECTION:NOTES:END -->

