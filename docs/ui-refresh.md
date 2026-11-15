# UI refresh

15 November 2026. Baseline: `662fdc2c1ff50bf1b2141b2b00522fe9da19912b`.

Adapted from the accompanying OpenDesignMD reference. Existing project stack, copy, data, routing, authentication and business logic are preserved. Application changes are a presentation stylesheet and its import only. No new runtime dependency. Existing dark themes and reduced-motion preferences are retained. Original reference assets/fonts/logos are not copied.

Verified: `npm run build` passed. Desktop and mobile Chromium smoke checks passed for the landing page, responsive width and signup navigation. Business source hashes match the baseline after removing the single CSS import. All existing theme tokens remain in use. Backend authentication/payment/chat behavior was not re-tested end to end.

The user authorized committing and pushing this UI-only change. Deployment status is tracked in Portfolio V3 context/ui-refresh-status.md.
