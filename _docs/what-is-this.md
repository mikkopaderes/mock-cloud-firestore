---
layout: doc
title: What's This Library?
category: Introduction
order: 1
cenchat:
  id: mock-cloud-firestore_docs
  text: Get help
---

This is a mock library for [Cloud Firestore](https://firebase.google.com/products/firestore/).

It aims to support the APIs of the JavaScript SDK for the browsers. For Node users, it'd be best for you to use the built-in [emulator](https://firebase.google.com/docs/firestore/security/test-rules-emulator) instead.

## Caveats

Not all APIs are supported. Here are some unsupported major ones

  - Transaction
  - `onSnapshot()` is supported but doesn't get realtime updates by default.
    - A naive listener is available in that changes to any data would cause it to fire.

Please file an [issue](https://github.com/mikkopaderes/mock-cloud-firestore/issues) should there be any APIs that isn't supported.

---

[Next: Getting Started »](getting-started)
