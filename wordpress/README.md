# WordPress theme source — `north-specs-labs`

The live storefront at **northspecs.ca** runs WordPress + WooCommerce with the
custom classic theme `north-specs-labs`. This directory version-controls the
theme files that this change set adds or modifies, so the PHP is reviewable in
a pull request rather than only living on the server.

It is **not** a full copy of the theme — only the files touched by the
researcher-account work are mirrored here. The authoritative copy is the one
deployed under `wp-content/themes/north-specs-labs/` on the host.

The Next.js application in `src/` is a separate prototype of the same business
and is unrelated to these files.

## What this change set adds

| Path | Purpose |
| --- | --- |
| `inc/account/analytics.php` | Privacy-safe self-service event layer (no customer data). |
| `inc/account/records.php` | Per-order-item lot capture and strict lot→COA association. |
| `inc/account/shipments.php` | ShipStation tracking capture, carrier links, order timeline. |
| `inc/account/experience.php` | Account entrance, workspace, order history, batch archive. |
| `inc/account/receipt.php` | Printable procurement receipt and invoice-request route. |
| `inc/account/security.php` | Login/reset throttling, recovery polish, Turnstile, admin 2FA. |
| `inc/account/admin.php` | Fulfilment UI: lot fields, tracking box, settings screen. |
| `woocommerce/**` | Template overrides for the account, recovery and tracking views. |
| `page-track-order.php` | Guest order-lookup page with staged guidance. |
| `assets/css/account.css` | Account, tracking and batch-record styling. |
| `assets/js/account.js` | Interaction events for tracking, receipt, COA and reorder. |
| `functions.php`, `header.php` | Bootstrap and the accessible account entrance. |

## Deploying

Files are written into the live theme directory over the Novamira MCP
connection. `functions.php` bumps `NSL_THEME_VERSION`, which busts the
stylesheet and script cache. Rewrite rules for the `batch-documents` account
endpoint and the `/order-receipt/{id}/` route are flushed once on version
change.
