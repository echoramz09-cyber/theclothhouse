# Security Specification - The Cloth House

## Data Invariants
- A product must have a non-empty name, a price greater than 0, and a valid image URL.
- Only an authenticated administrator can create, update, or delete products.
- Public users can only read products.

## The "Dirty Dozen" Payloads
1. **Unauthenticated Write**: Attempting to add a product without being logged in.
2. **Identity Spoofing**: Attempting to write a product as a non-admin user.
3. **Invalid Price**: Setting a product price to -10.
4. **Missing Fields**: Creating a product without an image.
5. **Ghost Field**: Adding `isPromoted: true` to a product when it's not in the schema.
6. **Large Document ID**: Using a 2KB string as a product ID.
7. **Type Poisoning**: Sending `price: "free"` (string instead of number).
8. **PII Leak**: Attempting to read unauthorized user data (if it existed).
9. **State Shortcut**: No state in this simple app, but generic: skipping a required step.
10. **Query Scrape**: Attempting to list products without proper authentication (if we restricted reads).
11. **ID Poisoning**: Injecting special characters in the product ID path.
12. **Denial of Wallet**: Sending massive 1MB strings in the description field.

## The Test Runner
A test file `firestore.rules.test.ts` will verify that unauthenticated and non-admin users cannot modify the `products` collection.
