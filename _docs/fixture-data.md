---
layout: doc
title: Fixture Data
category: Essentials
order: 2
cenchat:
  id: mock-cloud-firestore_docs
  text: Get help
---

Here's a sample fixture data

```javascript
const fixtureData = {
  __collection__: {
    users: {
      __doc__: {
        user_a: {
          age: 15,
          username: 'user_a',

          __collection__: {
            friends: {
              __doc__: {
                user_b: {
                  reference: '__ref__:users/user_b'
                }
              }
            }
          }
        },

        user_b: {
          age: 10,
          username: 'user_b',

          __collection__: {
            friends: {
              __doc__: {
                user_a: {
                  reference: '__ref__:users/user_a'
                }
              }
            }
          }
        },

        user_c: {
          age: 20,
          username: 'user_c'
        }
      }
    }
  }
}
```

And here's whats going on with the example above:

  - There will be a `users` collection
  - There will be `user_a`, `user_b`, and `user_c` documents under `users` collection
  - There will be a `friends` subcollection under `user_a` and `user_b` documents
  - `__ref__:` indicates that this is a [`Reference`](https://firebase.google.com/docs/firestore/manage-data/data-types#data_types) data type to a document
    - `__ref__:users/user_a` will be equivalent to `firestore.collection('users').doc('user_a')`
