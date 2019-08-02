---
layout: doc
title: API
category: Essentials
order: 1
cenchat:
  id: mock-cloud-firestore_docs
  text: Get help
---

## MockFirebase

This accepts the following option:

- `isNaiveSnapshotListenerEnabled` - When true, changes to **any** data would cause the `onSnapshot()` to fire. Otherwise, `onSnapshot()` won't get realtime updates.

#### Params:

| Name        | Type   | Attributes | Description |
| ----------- | -------| ---------- | ----------- |
| fixtureData | Object |            |             |
| option      | Object | optional   |             |

---

[Next: Fixture Data »](fixture-data)
