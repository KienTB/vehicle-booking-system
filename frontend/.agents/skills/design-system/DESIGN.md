# Carento Editorial Premium Design System

## 1. Mission

Create a premium, cinematic, editorial-inspired design system for Carento that transforms the vehicle rental experience into a refined mobility booking product.

Carento must feel like:

* a premium car rental marketplace,
* a modern mobility booking platform,
* an editorial vehicle showcase,
* a trustworthy consumer booking experience.

Carento must not feel like:

* an enterprise dashboard,
* a generic marketplace clone,
* a classified car listing site,
* a flat utility booking form.

This design system is inspired by the discipline, restraint, contrast, and editorial composition of luxury automotive websites, but it is fully reskinned for Carento’s rental-booking domain.

---

## 2. Brand Personality

Carento visual identity keywords:

* premium
* cinematic
* trustworthy
* spacious
* editorial
* modern mobility
* conversion-focused
* calm luxury

The UI must create a feeling of confidence before conversion.

Every page should make users feel:

* the service is reliable,
* the vehicles are high-quality,
* the booking flow is simple,
* the brand is modern and premium,
* the experience is curated rather than crowded.

---

## 3. Visual Theme & Atmosphere

Carento uses an editorial automotive rhythm:

* dark cinematic hero sections,
* clean light booking panels,
* premium vehicle imagery,
* strong typography hierarchy,
* restrained accent colors,
* spacious section pacing.

The visual rhythm should alternate between:

1. **Cinematic dark moments** for hero, premium vehicle showcase, brand storytelling.
2. **Clean light panels** for booking, forms, filters, details, pricing, and trust information.

This creates a luxury automotive browsing experience without sacrificing booking clarity.

---

## 4. Color System

Carento reuses the Ferrari-inspired color palette directly, but remaps its meaning for a premium car rental marketplace.

The palette must feel:

* cinematic,
* high-contrast,
* editorial,
* restrained,
* premium automotive.

### 4.1 Brand Colors

* `color.brand.primary=#DA291C`
* `color.brand.primaryHover=#B01E0A`
* `color.brand.primaryActive=#9D2211`
* `color.brand.secondary=#000000`
* `color.brand.accent=#FFF200`
* `color.brand.accentWarm=#F6E500`

### 4.2 Surface Colors

* `color.surface.black=#000000`
* `color.surface.dark=#303030`
* `color.surface.card=#FFFFFF`
* `color.surface.base=#FFFFFF`
* `color.surface.muted=#D2D2D2`
* `color.surface.overlay=hsla(0,0%,7%,0.8)`

### 4.3 Text Colors

* `color.text.primary=#181818`
* `color.text.secondary=#666666`
* `color.text.tertiary=#8F8F8F`
* `color.text.placeholder=#969696`
* `color.text.inverse=#FFFFFF`
* `color.text.brand=#DA291C`

### 4.4 Border Colors

* `color.border.subtle=#D2D2D2`
* `color.border.default=#CCCCCC`
* `color.border.dark=#303030`
* `color.border.inverse=#FFFFFF`
* `color.border.focus=#DA291C`

### 4.5 Feedback Colors

* `color.state.error=#F13A2C`
* `color.state.warning=#F6E500`
* `color.state.success=#03904A`
* `color.state.info=#4C98B9`
* `color.state.linkHover=#3860BE`

### 4.6 Color Usage Rules

Ferrari Red is now Carento's strongest conversion signal.
Use it sparingly for:

* primary booking CTA,
* submit actions,
* high-priority conversion moments,
* brand-critical highlights.

Black and white create the main editorial rhythm.
Use them for:

* cinematic hero sections,
* clean booking panels,
* premium contrast,
* vehicle showcase areas.

Yellow is a heritage/premium accent.
Use it only for:

* featured labels,
* special vehicle highlights,
* limited promotional markers,
* premium trust accents.

Gray scale supports hierarchy.
Use it for:

* secondary text,
* borders,
* muted panels,
* metadata,
* placeholders.

Do not turn every CTA or badge red.
Do not use yellow as a primary CTA.
Do not introduce blue as a brand color except for semantic info/link hover states.
Do not create colorful marketplace-style sections.

---

## 5. Typography System

### 5.1 Font Family

* `font.family.primary=Be Vietnam Pro`
* `font.family.secondary=Manrope`
* `font.family.stack=Be Vietnam Pro, Manrope, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, sans-serif`

### 5.2 Font Sizes

* `font.size.xs=12px`
* `font.size.sm=14px`
* `font.size.md=16px`
* `font.size.lg=20px`
* `font.size.xl=24px`
* `font.size.2xl=32px`
* `font.size.3xl=42px`
* `font.size.hero=56px`
* `font.size.display=64px`

### 5.3 Font Weights

* `font.weight.regular=400`
* `font.weight.medium=500`
* `font.weight.semibold=600`
* `font.weight.bold=700`

### 5.4 Line Heights

* `font.lineHeight.tight=1.15`
* `font.lineHeight.heading=1.2`
* `font.lineHeight.base=1.5`
* `font.lineHeight.loose=1.7`

### 5.5 Typography Rules

Hero headings must feel cinematic and confident.
Section headings must feel editorial and premium.
Body text must remain calm, readable, and customer-friendly.
Labels must be concise and functional.

Use uppercase micro-labels sparingly for:

* category labels,
* vehicle type tags,
* trust annotations,
* section eyebrow text.

Uppercase labels should use increased letter spacing.
Do not uppercase long sentences.

---

## 6. Spacing System

### 6.1 Spacing Tokens

* `space.1=4px`
* `space.2=8px`
* `space.3=12px`
* `space.4=16px`
* `space.5=20px`
* `space.6=24px`
* `space.7=32px`
* `space.8=40px`
* `space.9=48px`
* `space.10=64px`
* `space.11=80px`
* `space.12=96px`
* `space.13=120px`

### 6.2 Spacing Philosophy

Carento uses spacing as a premium signal.

Priority:

1. whitespace,
2. alignment,
3. grouping,
4. elevation,
5. borders.

Layouts must never feel compressed.
Booking forms should be grouped into digestible sections.
Vehicle listings should be scannable without feeling crowded.

---

## 7. Radius System

* `radius.xs=8px`
* `radius.sm=12px`
* `radius.md=16px`
* `radius.lg=24px`
* `radius.xl=32px`
* `radius.pill=999px`

### Radius Rules

Carento should feel softer and more consumer-friendly than Ferrari-inspired razor-sharp luxury.

Use:

* medium radius for cards,
* large radius for hero booking panels,
* pill radius for badges and chips,
* soft radius for input fields and buttons.

Do not use harsh square boxes for consumer pages.

---

## 8. Shadow & Elevation

### 8.1 Shadow Tokens

* `shadow.none=none`
* `shadow.sm=0 2px 8px rgba(15,23,42,0.06)`
* `shadow.md=0 8px 24px rgba(15,23,42,0.08)`
* `shadow.lg=0 16px 40px rgba(15,23,42,0.10)`
* `shadow.hover=0 20px 48px rgba(15,23,42,0.12)`
* `shadow.cinematic=0 24px 80px rgba(2,6,23,0.28)`

### 8.2 Elevation Rules

Use shadow softly.
Depth should come from:

* section contrast,
* premium imagery,
* surface layering,
* spacing,
* gentle elevation.

Do not add heavy shadows to every card.
Do not make UI look like floating admin boxes.

---

## 9. Motion System

* `motion.duration.instant=120ms`
* `motion.duration.fast=200ms`
* `motion.duration.normal=320ms`
* `motion.duration.slow=480ms`
* `motion.easing=cubic-bezier(0.4,0,0.2,1)`

Motion must feel:

* subtle,
* smooth,
* premium,
* responsive.

Use motion for:

* hover lift,
* CTA feedback,
* modal entrance,
* filter panel transitions,
* card refinement.

Avoid playful bounce, excessive parallax, or distracting animation.

---

## 10. Component Rules

## 10.1 Buttons

### Primary Button

Use for main booking/conversion actions.

* background: `color.brand.primary`
* hover: `color.brand.primaryHover`
* active: `color.brand.primaryActive`
* text: `color.text.inverse`
* radius: `radius.xs` or `radius.sm`
* border: transparent

Common labels:

* Đặt xe ngay
* Tiếp tục đặt xe
* Tiếp tục thanh toán
* Xác nhận đặt xe

Primary red CTA must be used with restraint.
A screen should normally have only one dominant red CTA zone.

### Secondary Button

Use for supportive actions.

* background: `color.surface.card`
* text: `color.text.primary`
* border: `color.border.default`

### Ghost Button

Use on dark cinematic sections.

* background: transparent
* text: `color.text.inverse`
* border: `color.border.inverse`

### Button State Requirements

Every button must define:

* default,
* hover,
* focus-visible,
* active,
* disabled,
* loading.

---

## 10.2 Inputs / Selects / Date Pickers

Inputs must feel spacious, trustworthy, and easy to complete.

Required states:

* default,
* hover,
* focus-visible,
* error,
* disabled,
* loading if async.

Rules:

* labels must be visible,
* placeholder must be short,
* error message must be near the field,
* focus ring must be obvious,
* tap target must be at least 44px high.

---

## 10.3 Vehicle Cards

Vehicle cards are a core Carento component.

Required content order:

1. vehicle image,
2. vehicle name,
3. quick specs,
4. location,
5. price,
6. CTA.

Visual rules:

* image must be prominent,
* metadata must be restrained,
* price must be clear,
* card must not feel crowded,
* hover may gently lift card using `shadow.hover`.

---

## 10.4 Booking Summary Panel

Used on detail and booking pages.

Must include:

* selected vehicle,
* rental date/time,
* price breakdown,
* trust note,
* primary booking CTA.

Should be sticky on desktop when useful.
Should collapse naturally on mobile.

---

## 10.5 Badges / Chips

Use badges sparingly.

* amber = featured / premium / recommended,
* green = available / success,
* red = unavailable / error,
* blue = info / selected.

Badges should be pill-shaped.
Do not spam badges across vehicle cards.

---

## 10.6 Modal / Drawer

Modals must:

* use elevated card surface,
* trap focus,
* close with Esc,
* include clear title,
* include clear CTA hierarchy.

Drawers are preferred for mobile filters and booking details.

---

## 10.7 Empty / Loading / Error States

Every data page must include:

* loading skeleton,
* empty state with helpful message,
* error state with recovery action.

Empty states should encourage users, not sound technical.

---

## 11. Page Composition Rules

## 11.1 Login / Register / Forgot Password

Auth pages must feel premium and calm.

Preferred layout:

* split-screen desktop,
* cinematic brand side,
* elevated form side,
* trust note,
* minimal but confident copy.

Avoid:

* small centered old login box,
* dense vertical form dump,
* social login clutter,
* admin wording.

---

## 11.2 Landing Page

Required sections:

* cinematic hero search,
* curated vehicle showcase,
* trust/service confidence strip,
* booking process explanation,
* CTA reinforcement.

Use dark/light section contrast with restraint.
Do not create endless marketing blocks.

---

## 11.3 Vehicle Listing Page

Must balance:

* filter discoverability,
* card browsing,
* pricing clarity,
* quick booking.

Preferred structure:

* top filter/search bar,
* optional category chips,
* responsive card grid,
* empty state if no vehicles.

---

## 11.4 Vehicle Detail Page

Must feel like a premium decision page.

Required:

* large image/gallery area,
* vehicle title and quick specs,
* feature sections,
* rental policy,
* trust note,
* sticky booking summary,
* strong CTA.

---

## 11.5 Booking Page

Must reduce user anxiety.

Required:

* progress stepper,
* selected car summary,
* grouped schedule selector,
* renter information form,
* payment summary,
* reassurance note,
* confirm CTA.

Never render one giant uninterrupted form.

---

## 11.6 Account / Dashboard

User account pages must feel service-oriented.

Use:

* booking history cards,
* profile summary,
* support quick links,
* account settings groups.

Avoid table-first admin aesthetics unless the page is specifically an admin page.

---

## 12. Navigation Rules

Navigation should be clean and premium.

Desktop:

* simple horizontal nav,
* clear active state,
* booking CTA visible.

Mobile:

* hamburger or bottom-friendly structure,
* large tap targets,
* no compressed desktop nav.

Header over dark hero may use inverse text.
Header over light surface uses primary text.

---

## 13. Image Treatment

Carento must use vehicle imagery as a premium trust signal.

Rules:

* use high-quality car images,
* prefer cinematic crop in hero/detail,
* use consistent aspect ratios in cards,
* avoid low-quality or distorted images,
* always include alt text.

Image must support booking clarity, not overpower the page.

---

## 14. Accessibility Rules

Target: WCAG 2.2 AA.

Mandatory:

* keyboard-first navigation,
* visible focus ring,
* all interactive elements reachable by Tab,
* all dialogs closable by Esc,
* all forms screen-reader labeled,
* all image cards include alt text,
* tap target minimum 44x44px,
* sufficient contrast for text and CTA.

Focus-visible rule:

* use `2px solid color.border.focus`,
* optional soft outer glow,
* never hide focus indicators.

---

## 15. Content Tone

Tone must be:

* concise,
* premium,
* friendly,
* reassuring,
* booking-focused.

Preferred CTA wording:

* Đặt xe ngay
* Xem chi tiết
* Chọn ngày nhận xe
* Tiếp tục đặt xe
* Tiếp tục thanh toán
* Hoàn tất đặt xe

Avoid:

* cold admin wording,
* vague actions,
* technical internal labels,
* overly playful copy.

---

## 16. Do / Don't

### Do

* Use Ferrari-inspired colors as Carento's final premium automotive palette.
* Use red sparingly for primary CTA and high-conversion moments.
* Use black/white editorial contrast for cinematic premium rhythm.
* Use yellow only for special premium accents and featured highlights.
* Use gray scale for hierarchy, metadata, borders, and muted surfaces.
* Use dark cinematic hero sections with restraint.
* Use clean light booking surfaces.
* Use premium vehicle imagery.
* Use clear CTA hierarchy.
* Define all component states.
* Maintain accessibility acceptance criteria.

### Don't

* Do not use blue as Carento's primary brand color.
* Do not scatter red everywhere as decoration.
* Do not use yellow as the main CTA color.
* Do not create colorful marketplace-style sections.
* Do not render enterprise/admin SaaS layouts for consumer pages.
* Do not use crowded marketplace cards.
* Do not overuse badges, shadows, or decorative accents.
* Do not ignore focus-visible states.
* Do not hard-code random visual values when tokens exist.
* Do not create one-off spacing or typography exceptions.

---

## 17. Responsive Behavior

### Mobile

* single-column layout,
* large tap targets,
* stacked booking surfaces,
* sticky CTA only when useful,
* no compressed desktop grid.

### Tablet

* reduce columns gracefully,
* preserve hierarchy,
* keep filter/search easy to use.

### Desktop

* use wide editorial composition,
* allow split layouts,
* use cinematic hero zones,
* keep booking modules clear and accessible.

---

## 18. Implementation Quality Gate

Before finalizing any UI, verify:

* Does it feel premium?
* Does it feel like Carento, not Ferrari?
* Does it support booking conversion?
* Is the primary CTA obvious?
* Is the layout spacious?
* Are component states defined?
* Is accessibility testable?
* Is mobile behavior app-like?
* Are tokens used consistently?

If any answer is no, revise before shipping.

---

