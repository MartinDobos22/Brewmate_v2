# Privacy nutrition labels

The answers to fill into App Store Connect (_App Privacy_) and Google Play
(_Data safety_), each one traced to the code that makes it true.

The rule this document is written to: **every row here names a table or a
request that exists.** A label that describes an intention rather than the
build is a label that will be wrong by the next release, and Apple treats a
wrong one as a misrepresentation rather than as a mistake.

---

## 1. Data the app collects

| App Store category    | Collected | Linked to identity | Used for tracking | Purpose           | Where it lives                                                                                 |
| --------------------- | --------- | ------------------ | ----------------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| Email Address         | Yes       | Yes                | No                | App Functionality | `users.email`, written by `provisionFromIdentity` from the Firebase token                      |
| User ID               | Yes       | Yes                | No                | App Functionality | `users.id`, `users.firebase_uid`                                                               |
| Name                  | Yes       | Yes                | No                | App Functionality | `users.display_name`, only when a provider supplies one                                        |
| Photos                | Yes       | Yes                | No                | App Functionality | Bag photographs uploaded to Cloud Storage; the URL is stored on `coffee_bags.image_url`        |
| Other User Content    | Yes       | Yes                | No                | App Functionality | `recipe_chat_messages.content` - what somebody writes about a cup                              |
| Product Interaction   | Yes       | Yes                | No                | Analytics         | `analytics_events`, the named flow steps in `ANALYTICS_EVENT_NAMES`                            |
| Crash Data            | Yes       | **No**             | No                | App Functionality | The error tracker sends the error, the platform, the release and a screen name. No account id. |
| Other Diagnostic Data | Yes       | **No**             | No                | App Functionality | The same reports: release name and platform                                                    |

**Nothing is used for tracking.** `NSPrivacyTracking` is `false` and
`NSPrivacyTrackingDomains` is empty, which is only honest because there is no
advertising SDK, no attribution SDK and no third-party analytics in the bundle.
Adding one changes this page and the manifest together, or the answers become
false.

### Two rows worth defending

**Crash Data is not linked to identity.** The frontend tracker
(`lib/errorTracking/sentryErrorTracker.ts`) sends `exception`, `platform`,
`release`, a screen name and a domain name. It has no code path that reads the
signed-in user. The server's tracker does attach the internal account id, but
that is the server's own reporting and not data collected _by the app_ - the
distinction Apple's form draws.

**Product Interaction is linked.** `analytics_events.user_id` is a real column
with a real foreign key, and pretending otherwise by calling the rows anonymous
would be the same data wearing a different name - one that could then be
neither exported nor deleted when somebody asks.

---

## 2. Data the app does **not** collect

Say so explicitly in review notes; these are the categories reviewers expect an
app like this to have and are worth pre-empting.

- **Precise or coarse location.** No location permission is requested anywhere.
- **Contacts, calendar, health, financial info.** None requested, none stored.
- **Advertising data, device identifiers for advertising.** No IDFA access, no
  `AppTrackingTransparency` prompt, because there is nothing to track for.
- **Search history, browsing history.** The grinder search term travels in a
  query string and is never stored.

---

## 3. Third parties that receive data

| Recipient                           | What reaches it                                                                                  | Why                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Google Firebase (Auth)              | Email, provider identity                                                                         | Signing in                                                                     |
| Google Firebase (Cloud Storage)     | Bag photographs                                                                                  | The photo the scanner reads                                                    |
| Neon (PostgreSQL)                   | Everything the API stores                                                                        | It is the database                                                             |
| Anthropic                           | The bag photograph, the coffee's fields, the brew's numbers, and what somebody wrote about a cup | Reading a label, writing a verdict, writing a recipe, answering a chat message |
| Error reporting provider (optional) | Crash type, message, stack, platform, release, screen                                            | Diagnosing crashes                                                             |

Anthropic is the one worth spelling out in the privacy policy rather than
listing: photographs of coffee bags and sentences somebody wrote about a cup
both go to a model provider, and a policy that only said "third-party service
providers" would not be describing that to anybody who could recognise it.

The error reporting provider is optional and absent unless `SENTRY_DSN` /
`EXPO_PUBLIC_SENTRY_DSN` are set. A build without them reports nothing
anywhere, and this row comes off the list.

---

## 4. Deletion and export

Both are in the app, and both are answers to the same question about what an
account _is_.

- **Delete:** Profile → account card → delete. `DELETE /me` erases the stored
  data first and the Firebase identity second, so a failure halfway cannot
  strand personal data behind an identity nobody can sign in as.
- **Export:** Profile → _Náklady a limity_ → _Stiahnuť moje dáta_.
  `GET /me/export` returns every user-owned table whole, in the same JSON the
  API speaks.

The two lists are deliberately identical. `accountExportService` and the
cascade behind `DELETE /me` describe the same set of rows, and if they ever
disagreed one of them would be lying.

Two things survive a deletion, and the policy has to say why: a grinder
catalogue entry somebody contributed (kept, with the attribution nulled) and
the coffee bag label cache (which has no `user_id` at all). Both hold public
information about a product on a shelf and nothing about who photographed it.
