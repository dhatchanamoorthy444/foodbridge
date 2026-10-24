# FoodBridge: Website Development, Legal Compliance & Premium UI/UX

## 1. Project Overview

Act as a senior full-stack engineer, elite UI/UX designer, accessibility specialist, and privacy-conscious software architect.

Build **FoodBridge: A Smart Food Expiry Monitoring and Surplus Redistribution System**, a college project that helps restaurants, hotels, supermarkets, grocery stores, and other food donors monitor food expiry and safely redistribute eligible surplus food to NGOs and recipients.

The website must be immersive, modern, accessible, trustworthy, responsive, and fully functional.

### Technology requirements

- **Frontend:** Preserve the existing React + TypeScript + Vite + Tailwind CSS stack.
- **Backend:** Java 21 and Spring Boot 3.x using Maven.
- **Database:** MySQL 8 with Spring Data JPA, Hibernate, and Flyway migrations.
- **Security:** Spring Security, role-based access control, secure authentication, server-side validation, and appropriate password hashing.
- **API documentation:** Springdoc OpenAPI.
- **Testing:** JUnit 5, Spring Boot testing, and frontend tests compatible with the existing project.
- **Visual experience:** Immersive 3D elements, purposeful motion, interactive product demonstrations, and a distinctive editorial layout.

Inspect the existing repository before changing anything. Preserve working features, existing dependencies, project structure, environment variables, and the established design wherever possible. Do not replace the application with an unrelated starter template.

## 2. Establish the Visual Identity Before Coding

Before writing functional components, establish the design system.

### FoodBridge visual direction

Create an immersive, premium, nature-inspired visual identity that communicates food security, sustainability, transparency, and community impact.

Use:
- A warm ivory or lightly tinted background instead of pure white.
- Deep forest green, restrained earthy orange, charcoal, and natural neutral tones.
- A distinctive typography pairing, such as **DM Sans for body text and Fraunces for editorial headings**, subject to font licensing and availability.
- An asymmetric editorial grid with deliberate negative space.
- Carefully composed food photography, realistic food imagery, and meaningful 3D objects.
- Custom SVG illustrations related to food redistribution, expiry monitoring, logistics, sustainability, and community support.
- Subtle transitions, tactile hover states, and purposeful motion.
- Clear visual hierarchy and consistent spacing.

Use licensed local fonts or properly licensed font providers. Include appropriate fallbacks if external fonts fail to load.

### Immersive 3D experience

Create a memorable landing page with a realistic 3D food crate, produce arrangement, or connected food redistribution scene.

The 3D experience should:
- Support subtle pointer interaction and controlled movement.
- Communicate the relationship between food donors, FoodBridge, and recipient organizations.
- Include accessible labels and a useful non-3D fallback.
- Load progressively without blocking important page content.
- Respect reduced-motion preferences.
- Work on mobile devices and lower-powered hardware.
- Avoid unnecessary GPU usage and oversized assets.

Use the existing compatible 3D library if one is already installed. Otherwise, consider React Three Fiber and Three.js only when the benefit justifies the additional dependencies.

## 3. Strictly Avoid These 30 UI/UX Mistakes

Apply all the following rules across the homepage, dashboards, forms, authentication pages, donation listings, inventory screens, and administrative interfaces.

1. Do not use harsh gradients on text, buttons, or backgrounds.
2. Avoid overusing generic Lucide icons. Prefer refined custom SVG icons and meaningful visual illustrations.
3. Never use pure white (#FFFFFF) as the main page background. Use warm or subtly tinted surfaces.
4. Avoid rainbow gradients and multicolored badges.
5. Avoid heavy, generic drop shadows. Use restrained borders, tonal separation, and subtle depth.
6. Do not arrange exactly three generic feature cards in a row. Use an asymmetric, varied composition.
7. Do not use emojis in headings, buttons, or bullet points.
8. Avoid liquid glass, glassmorphism, and blurred translucent panels.
9. Avoid excessive em dashes in body copy. Write naturally and clearly.
10. Do not use Inter, Geist, or Space Grotesk as the default typography.
11. Do not add colored left-side accent stripes to cards.
12. Never fabricate testimonials, customer reviews, endorsements, or stock-avatar quotations.
13. Avoid cliché bento grids unless a specific feature genuinely benefits from that layout.
14. Do not add decorative terminal windows or irrelevant code-themed graphics.
15. Avoid formulaic AI marketing copy. Use concrete, honest language that explains what FoodBridge actually does.
16. Replace repetitive default checkmark bullets with custom, accessible list markers.
17. Do not create a generic three-tier pricing table. Do not introduce pricing unless the business requirements establish it.
18. Include functional product previews, realistic dashboard data clearly marked as demo data, and interactive demonstrations rather than empty placeholders.
19. Avoid applying the same large corner radius to every element. Establish a deliberate shape system.
20. Do not use the default purple-and-black technology theme.
21. Implement proper skeleton loaders for asynchronous data and meaningful loading states for forms and API requests.
22. Do not use decorative radial light orbs as background effects.
23. Avoid generic background dot grids.
24. Do not use AI sparkle or magic icons.
25. Avoid gimmicky bouncing arrows and attention-grabbing CTA animations.
26. Include a working Terms of Service link in the footer.
27. Include a working Privacy Policy link in the footer.
28. Use subtle, tactile hover and focus states instead of gimmick animations.
29. Avoid oversaturated neon accents.
30. Avoid washed-out pastel palettes that weaken contrast and readability.

Do not treat these rules as suggestions. Review every page against them before declaring the implementation complete.

## 4. Legal, Privacy, and Launch-Readiness Requirements

Implement the following requirements throughout the website. Do not merely create a checklist or add empty links.

Important: Legal requirements depend on the jurisdictions, users, business model, and actual data practices involved. Identify the applicable requirements before launch. Do not claim the application is legally compliant or certified without appropriate verification.

### A. Legal and policy pages

Create dedicated, accessible pages for:

- Privacy Policy
- Terms of Service
- Cookie Policy
- Refund and Cancellation Policy, if payments or refundable transactions are actually supported

The Terms of Service should explain eligibility, account responsibilities, acceptable use, platform limitations, donation and collection responsibilities, prohibited conduct, dispute handling, and applicable terms.

The Privacy Policy should clearly explain:
- What personal data is collected.
- Why each category of data is needed.
- How the data is used and stored.
- Which service providers receive data.
- How long different categories of data are retained.
- What user rights and request mechanisms are available.
- How users can contact the responsible organization.

The Cookie Policy must reflect the cookies and tracking technologies actually used.

Do not invent a company registration number, office address, legal entity, certification, or legal contact. Use clearly marked configuration placeholders until verified details are provided.

### B. Cookie consent

Implement a cookie consent interface when applicable to the actual technologies and jurisdictions.

Requirements:
- Explain necessary, analytics, and marketing cookie categories where relevant.
- Provide a clear way to accept or reject optional cookies.
- Provide a settings option for granular preferences when required.
- Do not activate optional non-essential tracking before the required consent.
- Allow users to change or withdraw consent.
- Store consent preferences appropriately.
- Do not use misleading buttons, preselected optional categories, or manipulative layouts.

If the website only uses essential cookies, do not invent optional tracking functionality.

### C. Form consent

Every relevant form must explain its purpose and link to the applicable policy.

Implement:
- Clear notices for account registration.
- Appropriate acceptance of the Terms of Service where required.
- Privacy notices at the point of collection.
- Separate, optional marketing consent where relevant.
- Explicit consent for optional data processing when required.
- Server-side validation of submitted values.

Do not bundle unrelated marketing consent with account creation or make optional consent a condition of unrelated services.

### D. Data minimization

Collect only the information required for each function.

Examples:
- Account registration should not request unnecessary personal information.
- Food listings should collect the details needed to assess eligibility, quantity, storage conditions, and collection.
- Recipient organizations should provide only the information necessary for legitimate verification and distribution.
- Do not collect precise location, identity documents, or sensitive personal information without a justified requirement.

Define retention periods and delete or anonymize data when it is no longer required, subject to legitimate legal and operational retention obligations.

### E. Third-party SDK and dependency audit

Review existing packages, SDKs, external APIs, analytics tools, fonts, images, and embedded services.

For each integration:
- Explain its purpose.
- Identify data it collects or receives.
- Check licensing and relevant privacy terms.
- Remove unused integrations.
- Avoid exposing secret API keys in frontend code.
- Document necessary external services.
- Use environment variables for secrets and configuration.

Do not add advertising trackers, analytics SDKs, or unnecessary external dependencies merely to make the application appear more sophisticated.

### F. Dark patterns and honest claims

Prohibit:
- Hidden charges or unexpected fees.
- Misleading countdowns.
- Fake scarcity.
- Preselected marketing consent.
- Obstructive cancellation or deletion processes.
- Misleading consent buttons.
- Fake reviews or testimonials.
- Unsupported sustainability statistics.
- Unverified food-safety claims.
- Fabricated impact metrics.

All FoodBridge impact statistics must come from actual data or be explicitly labeled as illustrative demo values.

### G. Accessibility

Target WCAG 2.2 AA accessibility practices, subject to verification.

Implement:
- Meaningful alternative text for informative images.
- Empty alternative text for purely decorative images.
- Sufficient text and interface contrast.
- Complete keyboard navigation.
- Visible focus indicators.
- Semantic HTML landmarks and headings.
- Proper form labels and accessible validation messages.
- Accessible modal dialogs and dropdowns.
- Screen-reader announcements for important asynchronous updates.
- Reduced-motion support.
- Accessible status indicators that do not rely on color alone.

Do not use visual effects that make essential information unreadable or inaccessible.

### H. Business details

Provide a configurable contact and business-information section with verified details, including applicable:
- Organization or business name.
- Contact email.
- Physical or registered address, if required.
- Customer support information.
- Applicable legal entity information.
- Relevant registration or tax details where legally required.

Until real details are supplied, show clearly identified placeholders in development rather than invented information in production.

### I. Children and age-related requirements

Determine whether the service is intended for children or may process children's personal data.

Implement age-related notices, consent mechanisms, parental authorization, and additional safeguards when required by applicable law.

Do not collect a child's birth date or other age-verification information unless necessary and appropriately justified. Do not assume one universal age threshold applies everywhere.

### J. Email unsubscribe

For marketing emails:
- Include a working unsubscribe link.
- Record and honor unsubscribe requests.
- Avoid sending marketing emails to users who have opted out.
- Separate transactional notifications from marketing preferences.
- Protect unsubscribe tokens against misuse.

If email functionality is not yet implemented, document this as a launch dependency instead of creating a fake unsubscribe mechanism.

### K. Licensed fonts, images, and media

Use original assets or assets with suitable licenses.

- Document asset sources and licenses.
- Do not use unlicensed commercial photography.
- Do not copy protected illustrations or website designs.
- Ensure generated assets are suitable for the intended use.
- Prefer optimized, locally controlled assets where practical.

### L. Data deletion and privacy requests

Create a clear mechanism for users to request deletion of their accounts and associated personal data.

Implement:
- A deletion request form or authenticated account workflow.
- Identity and authorization checks proportionate to the risk.
- Server-side deletion or anonymization workflows.
- Appropriate handling of related records and foreign-key dependencies.
- Retention of records only where legally justified.
- A clear confirmation of request receipt and status.
- Documentation of exceptions, backups, and retention limitations.

Do not claim that data has been permanently deleted if it remains in backups or other retained systems.

## 5. FoodBridge-Specific Functional Requirements

Build actual workflows rather than static UI.

### Donor workflow
- Register and securely sign in.
- Add, edit, and manage food inventory.
- Record food name, category, quantity, unit, expiry date, storage requirements, and relevant food-safety information.
- View upcoming expiry alerts.
- Identify eligible surplus food.
- Submit donations and track their status.

### Recipient/NGO workflow
- Register and sign in.
- Submit relevant organization verification information.
- Browse eligible surplus food.
- Filter by category, quantity, collection location, and collection window.
- Request food donations.
- Track request approval and collection status.

### Administrator workflow
- Manage users and roles.
- Review organization verification requests.
- Moderate food listings and donation requests.
- View audit events and platform activity.
- Manage reported listings and suspicious activity.
- View verified system metrics.

### Food expiry monitoring
- Flag food approaching its expiry date using configurable thresholds.
- Display clear expiry status labels.
- Notify authorized users when notifications are enabled.
- Prevent expired food from being presented as eligible for redistribution.
- Apply documented eligibility rules that consider storage conditions, applicable food-safety requirements, and authorized human review when needed.

Do not assume every item is safe to redistribute solely because its expiry date has not passed. Food safety must be handled conservatively.

## 6. Backend and MySQL Architecture

Use Java 21, Spring Boot 3.x, Maven, and MySQL 8.

Organize the backend into maintainable layers:

- Controllers
- Services
- Repositories
- Entities
- DTOs
- Validation
- Security configuration
- Exception handling
- Database migrations
- Tests

Create appropriate relational tables for:
- Users
- Organizations or recipient profiles, where needed
- Inventory items
- Donations
- Donation requests
- Allocations or donation-request relationships
- Pickups or collection records
- Notifications, if supported
- Audit events
- Consent preferences, where needed

Use appropriate primary keys, foreign keys, indexes, constraints, timestamps, and status fields.

Implement REST endpoints for authentication, inventory management, donations, recipient requests, collection tracking, expiry alerts, administration, and relevant privacy requests.

Security requirements:
- Use a suitable password-hashing algorithm.
- Enforce authorization on the server for every protected resource.
- Prevent users from modifying other users' records without permission.
- Validate all inputs server-side.
- Use parameterized database access through supported ORM/repository mechanisms.
- Configure CORS explicitly.
- Protect against common web vulnerabilities.
- Do not expose secrets or sensitive information in API responses or logs.
- Use secure session or token handling appropriate to the chosen authentication design.
- Configure CSRF protection appropriately for the chosen authentication mechanism.
- Keep database credentials and signing secrets outside source control.

Use Flyway migrations and provide development configuration through environment variables. Never commit real credentials.

## 7. Frontend Integration

Connect the existing React frontend to the Spring Boot API.

Requirements:
- Centralize API requests in a reusable service layer.
- Configure the backend base URL through environment variables.
- Implement loading skeletons, empty states, success messages, error states, and retry options.
- Use typed TypeScript interfaces for API data.
- Implement real form validation and accessible error messages.
- Avoid hardcoded production data and fake successful API responses.
- Label seeded sample data as demonstration data.
- Ensure authentication state and permissions are handled consistently.
- Keep privacy notices and consent preferences synchronized with real application behavior.
- Add responsive navigation and accessible mobile layouts.
- Preserve the immersive design without sacrificing performance or usability.

## 8. Testing and Verification

Create tests for:
- Authentication and authorization.
- Input validation.
- Inventory CRUD operations.
- Donation creation and status changes.
- Request and allocation rules.
- Expiry eligibility.
- Privacy deletion workflows.
- Consent preferences.
- API error handling.
- Critical frontend interactions.
- Keyboard accessibility and responsive behavior.

Run the available build, lint, and test commands. Fix errors instead of claiming tests passed without running them.

Do not expose production user data in test output.

## 9. Required Deliverables

Deliver:

1. A working frontend integrated with the Java backend.
2. MySQL schema and Flyway migration files.
3. Documented REST endpoints and API examples.
4. A `.env.example` file containing placeholders only.
5. A README with setup, database configuration, migrations, startup commands, testing, and troubleshooting.
6. Privacy Policy, Terms of Service, Cookie Policy, and a conditional Refund/Cancellation Policy.
7. Working footer links and contact-information configuration.
8. Cookie consent and relevant form-consent functionality.
9. Account deletion and privacy-request workflows.
10. An asset licensing and third-party dependency inventory.
11. An accessibility and UI/UX review checklist.
12. A database ER diagram.
13. A list of remaining legal, security, or operational launch blockers.
14. A clear explanation of what is implemented, tested, and still requires external configuration or human review.

## 10. Implementation Rules

Work in the following order:

Phase 1: Inspect the repository, identify the current stack, and list existing features.

Phase 2: Establish the visual theme, typography, design tokens, and asymmetric layout before implementing components.

Phase 3: Build the responsive interface and immersive 3D experience.

Phase 4: Implement the Java backend, database schema, migrations, security, and API.

Phase 5: Integrate frontend workflows with the real backend.

Phase 6: Implement the privacy, legal, accessibility, consent, and deletion requirements.

Phase 7: Run tests, inspect the entire website against the 30 design constraints, and document outstanding issues.

Do not rewrite the whole project unnecessarily. Do not stop after producing mockups or code snippets. Implement changes in the existing repository wherever tools and permissions allow.

If a requirement depends on missing business details, legal review, credentials, or an external service, identify the dependency and provide the correct integration point without inventing facts.

**Final objective:** Deliver a distinctive, immersive, trustworthy FoodBridge website that combines useful food redistribution functionality, secure Java/MySQL integration, accessible UI/UX, privacy-conscious data handling, and a transparent launch-readiness process.

# foodbridge