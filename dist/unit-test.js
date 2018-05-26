function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const sinon = require('sinon');

const CollectionReference = require('./firebase/firestore/collection-reference');
const DocumentReference = require('./firebase/firestore/document-reference');
const DocumentSnapshot = require('./firebase/firestore/document-snapshot');
const FieldValue = require('./firebase/firestore/field-value');
const Firestore = require('./firebase/firestore');
const MockFirebase = require('./');
const QuerySnapshot = require('./firebase/firestore/query-snapshot');
const Query = require('./firebase/firestore/query');
const firebase = require('firebase');
const fixtureData = require('./utils/test-helpers/fixture-data');

let mockFirebase;

QUnit.module('Unit | mock-cloud-firestore', hooks => {
  hooks.beforeEach(() => {
    mockFirebase = new MockFirebase(fixtureData());
  });

  QUnit.module('CollectionReference', () => {
    QUnit.module('getter/setter: id', () => {
      QUnit.test('should return collection identifier', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').id;

        // Assert
        assert.equal(result, 'users');
      });
    });

    QUnit.module('getter/setter: firestore', () => {
      QUnit.test('should return the firestore the collection is in', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').firestore;

        // Assert
        assert.ok(result instanceof Firestore);
      });
    });

    QUnit.module('getter/setter: parent', () => {
      QUnit.test('should return DocumentReference if this is a subcollection', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').doc('user_a').collection('friends').parent;

        // Assert
        assert.ok(result instanceof DocumentReference);
      });

      QUnit.test('should return null if there is no parent', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').parent;

        // Assert
        assert.equal(result, null);
      });
    });

    QUnit.module('function: add', () => {
      QUnit.test('should add a new document', (() => {
        var _ref = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();

          // Act
          const ref = yield db.collection('users').add({ username: 'new_user' });

          // Assert
          const snapshot = yield ref.get();

          assert.deepEqual(snapshot.data(), { username: 'new_user' });
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: doc', () => {
      QUnit.test('should return the document reference using an ID', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').doc('user_a');

        // Assert
        assert.ok(result instanceof DocumentReference);
      });

      QUnit.test('should return the document reference using a path', assert => {
        assert.expect(2);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').doc('user_a/friends/user_b');

        // Assert
        assert.ok(result instanceof DocumentReference);
        assert.equal(result.id, 'user_b');
      });

      QUnit.test('should create document reference when not providing an ID', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').doc();

        // Assert
        assert.ok(result.id);
      });
    });

    QUnit.module('function: endAt', () => {
      QUnit.test('should return an instance of Query', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').orderBy('age').endAt(15);

        // Assert
        assert.ok(result instanceof Query);
      });
    });

    QUnit.module('function: endBefore', () => {
      QUnit.test('should return an instance of Query', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').orderBy('age').endBefore(15);

        // Assert
        assert.ok(result instanceof Query);
      });
    });

    QUnit.module('function: get', () => {
      QUnit.test('should return the query snapshot', (() => {
        var _ref2 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();

          // Act
          const result = yield db.collection('users').get();

          // Assert
          assert.ok(result instanceof QuerySnapshot);
        });

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: limit', () => {
      QUnit.test('should return an instance of Query', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').orderBy('age').limit(15);

        // Assert
        assert.ok(result instanceof Query);
      });
    });

    QUnit.module('function: onSnapshot', () => {
      QUnit.test('should return a function for unsubscribing', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').onSnapshot(() => {});

        // Assert
        assert.ok(typeof result === 'function');
      });

      QUnit.test('should fire callback', assert => {
        assert.expect(1);

        // Arrange
        const done = assert.async();
        const db = mockFirebase.firestore();

        // Act
        db.collection('users').onSnapshot(snapshot => {
          // Assert
          assert.ok(snapshot instanceof QuerySnapshot);
          done();
        });
      });
    });

    QUnit.module('function: orderBy', () => {
      QUnit.test('should return an instance of Query', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').orderBy('age');

        // Assert
        assert.ok(result instanceof Query);
      });
    });

    QUnit.module('function: startAfter', () => {
      QUnit.test('should return an instance of Query', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').orderBy('age').startAfter(15);

        // Assert
        assert.ok(result instanceof Query);
      });
    });

    QUnit.module('function: startAt', () => {
      QUnit.test('should return an instance of Query', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').orderBy('age').startAt(15);

        // Assert
        assert.ok(result instanceof Query);
      });
    });

    QUnit.module('function: where', () => {
      QUnit.test('should return an instance of Query', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').orderBy('age').where('name', '==', 'Foo');

        // Assert
        assert.ok(result instanceof Query);
      });
    });
  });

  QUnit.module('DocumentReference', () => {
    QUnit.module('getter/setter: id', () => {
      QUnit.test('should return document identifier', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').doc('user_a').id;

        // Assert
        assert.equal(result, 'user_a');
      });
    });

    QUnit.module('getter/setter: firestore', () => {
      QUnit.test('should return the firestore the document is in', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').doc('user_a').firestore;

        // Assert
        assert.ok(result instanceof Firestore);
      });
    });

    QUnit.module('getter/setter: parent', () => {
      QUnit.test('should return CollectionReference of which the DocumentReference belongs to', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').doc('user_a').parent;

        // Assert
        assert.ok(result instanceof CollectionReference);
      });
    });

    QUnit.module('function: collection', () => {
      QUnit.test('should return the collection reference of an ID', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').doc('user_a').collection('friends');

        // Assert
        assert.ok(result instanceof CollectionReference);
      });

      QUnit.test('should return the collection reference of a path', assert => {
        assert.expect(2);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').doc('user_a').collection('friends/user_b/wew_so_deep');

        // Assert
        assert.ok(result instanceof CollectionReference);
        assert.equal(result.id, 'wew_so_deep');
      });
    });

    QUnit.module('function: delete', () => {
      QUnit.test('should delete the document', (() => {
        var _ref3 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const ref = db.collection('users').doc('user_a');

          // Act
          yield ref.delete();

          // Assert
          const record = yield ref.get();

          assert.equal(record.exists, false);
        });

        return function (_x3) {
          return _ref3.apply(this, arguments);
        };
      })());

      QUnit.test('should delete the document coming from a query', (() => {
        var _ref4 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const querySnapshot = yield db.collection('users').where('age', '==', 15).get();

          // Act
          querySnapshot.forEach((() => {
            var _ref5 = _asyncToGenerator(function* (docSnapshot) {
              yield docSnapshot.ref.delete();
            });

            return function (_x5) {
              return _ref5.apply(this, arguments);
            };
          })());

          // Assert
          const docSnapshot = yield db.collection('users').doc('user_a').get();

          assert.equal(docSnapshot.exists, false);
        });

        return function (_x4) {
          return _ref4.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: get', () => {
      QUnit.test('should return the document snapshot', (() => {
        var _ref6 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();

          // Act
          const result = yield db.collection('users').doc('user_a').get();

          // Assert
          assert.ok(result instanceof DocumentSnapshot);
        });

        return function (_x6) {
          return _ref6.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: onSnapshot', () => {
      QUnit.test('should return a function for unsubscribing', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').doc('user_a').onSnapshot(() => {});

        // Assert
        assert.ok(typeof result === 'function');
      });

      QUnit.test('should fire callback', assert => {
        assert.expect(1);

        // Arrange
        const done = assert.async();
        const db = mockFirebase.firestore();

        // Act
        db.collection('users').doc('user_a').onSnapshot(snapshot => {
          // Assert
          assert.ok(snapshot instanceof DocumentSnapshot);
          done();
        });
      });
    });

    QUnit.module('function: set', () => {
      QUnit.test('should set the data using the default options when it exist', (() => {
        var _ref7 = _asyncToGenerator(function* (assert) {
          assert.expect(3);

          // Arrange
          const db = mockFirebase.firestore();
          const ref = db.collection('users').doc('user_a');

          // Act
          yield ref.set({
            name: 'user_a',
            dad: db.collection('users').doc('user_b'),
            modifiedOn: firebase.firestore.FieldValue.serverTimestamp()
          });

          // Assert
          const snapshot = yield ref.get();
          const { dad, modifiedOn, name } = snapshot.data();

          assert.deepEqual(dad, db.collection('users').doc('user_b'));
          assert.ok(modifiedOn.toDate() instanceof Date);
          assert.equal(name, 'user_a');
        });

        return function (_x7) {
          return _ref7.apply(this, arguments);
        };
      })());

      QUnit.test('should set the data using the default options when it does not exists', (() => {
        var _ref8 = _asyncToGenerator(function* (assert) {
          assert.expect(3);

          // Arrange
          const db = mockFirebase.firestore();
          const ref = db.collection('users').doc('user_100');

          // Act
          yield ref.set({
            dad: db.collection('users').doc('user_b'),
            modifiedOn: firebase.firestore.FieldValue.serverTimestamp(),
            username: 'user_100'
          });

          // Assert
          const snapshot = yield ref.get();
          const { dad, modifiedOn, username } = snapshot.data();

          assert.deepEqual(dad, db.collection('users').doc('user_b'));
          assert.ok(modifiedOn.toDate() instanceof Date);
          assert.equal(username, 'user_100');
        });

        return function (_x8) {
          return _ref8.apply(this, arguments);
        };
      })());

      QUnit.test('should set the data using the merge option', (() => {
        var _ref9 = _asyncToGenerator(function* (assert) {
          assert.expect(7);

          // Arrange
          const db = mockFirebase.firestore();
          const ref = db.collection('users').doc('user_a');

          // Act
          yield ref.set({
            dad: db.collection('users').doc('user_b'),
            modifiedOn: firebase.firestore.FieldValue.serverTimestamp(),
            name: 'user_a'
          }, { merge: true });

          // Assert
          const snapshot = yield ref.get();
          const {
            address,
            age,
            createdOn,
            dad,
            modifiedOn,
            name,
            username
          } = snapshot.data();

          assert.deepEqual(address, { home: 'San Francisco', work: 'Silicon Valley' });
          assert.equal(age, 15);
          assert.deepEqual(createdOn.toDate(), new Date('2017-01-01'));
          assert.deepEqual(dad, db.collection('users').doc('user_b'));
          assert.ok(modifiedOn.toDate() instanceof Date);
          assert.equal(name, 'user_a');
          assert.equal(username, 'user_a');
        });

        return function (_x9) {
          return _ref9.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: update', () => {
      QUnit.test('should update the data', (() => {
        var _ref10 = _asyncToGenerator(function* (assert) {
          assert.expect(7);

          // Arrange
          const db = mockFirebase.firestore();
          const ref = db.collection('users').doc('user_a');

          // Act
          yield ref.update({
            dad: db.collection('users').doc('user_b'),
            modifiedOn: firebase.firestore.FieldValue.serverTimestamp(),
            name: 'user_a'
          });

          // Assert
          const snapshot = yield ref.get();
          const {
            address,
            age,
            createdOn,
            dad,
            modifiedOn,
            name,
            username
          } = snapshot.data();

          assert.deepEqual(address, { home: 'San Francisco', work: 'Silicon Valley' });
          assert.equal(age, 15);
          assert.deepEqual(createdOn.toDate(), new Date('2017-01-01'));
          assert.deepEqual(dad, db.collection('users').doc('user_b'));
          assert.ok(modifiedOn.toDate() instanceof Date);
          assert.equal(name, 'user_a');
          assert.equal(username, 'user_a');
        });

        return function (_x10) {
          return _ref10.apply(this, arguments);
        };
      })());

      QUnit.test('should throw error when updating data that does not exist', (() => {
        var _ref11 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const ref = db.collection('users').doc('user_100');

          try {
            // Act
            yield ref.update({ name: 'user_100' });
          } catch (e) {
            // Assert
            assert.ok(true);
          }
        });

        return function (_x11) {
          return _ref11.apply(this, arguments);
        };
      })());
    });
  });

  QUnit.module('DocumentSnapshot', () => {
    QUnit.module('getter/setter: exists', () => {
      QUnit.test('should return true if data exists', (() => {
        var _ref12 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').doc('user_a').get();

          // Act
          const result = snapshot.exists;

          // Assert
          assert.equal(result, true);
        });

        return function (_x12) {
          return _ref12.apply(this, arguments);
        };
      })());

      QUnit.test('should return false if data does not exists', (() => {
        var _ref13 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').doc('user_100').get();

          // Act
          const result = snapshot.exists;

          // Assert
          assert.equal(result, false);
        });

        return function (_x13) {
          return _ref13.apply(this, arguments);
        };
      })());
    });

    QUnit.module('getter/setter: id', () => {
      QUnit.test('should return the identifier', (() => {
        var _ref14 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').doc('user_a').get();

          // Act
          const result = snapshot.id;

          // Assert
          assert.equal(result, 'user_a');
        });

        return function (_x14) {
          return _ref14.apply(this, arguments);
        };
      })());
    });

    QUnit.module('getter/setter: ref', () => {
      QUnit.test('should return the DocumentReference', (() => {
        var _ref15 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').doc('user_a').get();

          // Act
          const result = snapshot.ref;

          // Assert
          assert.ok(result instanceof DocumentReference);
        });

        return function (_x15) {
          return _ref15.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: get', () => {
      QUnit.test('should return the specific field', (() => {
        var _ref16 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').doc('user_a').get();

          // Act
          const result = snapshot.get('age');

          // Assert
          assert.equal(result, 15);
        });

        return function (_x16) {
          return _ref16.apply(this, arguments);
        };
      })());

      QUnit.test('should return the reference type field', (() => {
        var _ref17 = _asyncToGenerator(function* (assert) {
          assert.expect(3);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').doc('user_a').collection('friends').doc('user_b').get();

          // Act
          const reference = snapshot.get('reference');

          // Assert
          const referenceSnapshot = yield reference.get();
          const { age, createdOn, username } = referenceSnapshot.data();

          assert.equal(age, 10);
          assert.deepEqual(createdOn.toDate(), new Date('2017-01-01'));
          assert.equal(username, 'user_b');
        });

        return function (_x17) {
          return _ref17.apply(this, arguments);
        };
      })());

      QUnit.test('should return the specific field using dot notation', (() => {
        var _ref18 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').doc('user_a').get();

          // Act
          const result = snapshot.get('address.home');

          // Assert
          assert.equal(result, 'San Francisco');
        });

        return function (_x18) {
          return _ref18.apply(this, arguments);
        };
      })());

      QUnit.test('should return undefined when field does not exist', (() => {
        var _ref19 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').doc('user_a').get();

          // Act
          const result = snapshot.get('foobar');

          // Assert
          assert.equal(result, undefined);
        });

        return function (_x19) {
          return _ref19.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: data', () => {
      QUnit.test('should return the data', (() => {
        var _ref20 = _asyncToGenerator(function* (assert) {
          assert.expect(4);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').doc('user_a').get();

          // Act
          const {
            address,
            age,
            createdOn,
            username
          } = snapshot.data();

          // Assert
          assert.deepEqual(address, { home: 'San Francisco', work: 'Silicon Valley' });
          assert.equal(age, 15);
          assert.deepEqual(createdOn.toDate(), new Date('2017-01-01'));
          assert.equal(username, 'user_a');
        });

        return function (_x20) {
          return _ref20.apply(this, arguments);
        };
      })());

      QUnit.test('should return the data and match any reference type field appropriately', (() => {
        var _ref21 = _asyncToGenerator(function* (assert) {
          assert.expect(3);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').doc('user_a').collection('friends').doc('user_b').get();

          // Act
          const { reference } = snapshot.data();

          // Assert
          const referenceSnapshot = yield reference.get();
          const { age, createdOn, username } = referenceSnapshot.data();

          assert.equal(age, 10);
          assert.deepEqual(createdOn.toDate(), new Date('2017-01-01'));
          assert.equal(username, 'user_b');
        });

        return function (_x21) {
          return _ref21.apply(this, arguments);
        };
      })());

      QUnit.test('should return undefined when data does not exist', (() => {
        var _ref22 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').doc('user_100').get();

          // Act
          const result = snapshot.data();

          // Assert
          assert.equal(result, undefined);
        });

        return function (_x22) {
          return _ref22.apply(this, arguments);
        };
      })());
    });
  });

  QUnit.module('FieldValue', () => {
    QUnit.module('function: serverTimestamp', () => {
      QUnit.test('should return a new date', assert => {
        assert.expect(1);

        // Act
        const result = mockFirebase.firestore.FieldValue.serverTimestamp();

        // Assert
        assert.ok(result instanceof Date);
      });
    });
  });

  QUnit.module('Firestore', () => {
    QUnit.module('static getter/setter: FieldValue', () => {
      QUnit.test('should return an instance of FieldValue', assert => {
        assert.expect(1);

        // Act
        const result = mockFirebase.firestore.FieldValue;

        // Assert
        assert.ok(result instanceof FieldValue);
      });
    });

    QUnit.module('function: collection', () => {
      QUnit.test('should return the collection reference using a path', assert => {
        assert.expect(2);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.doc('users/user_a/friends');

        // Assert
        assert.ok(result instanceof CollectionReference);
        assert.equal(result.id, 'friends');
      });
    });

    QUnit.module('function: doc', () => {
      QUnit.test('should return the document reference using a path', assert => {
        assert.expect(2);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.doc('users/user_a');

        // Assert
        assert.ok(result instanceof DocumentReference);
        assert.equal(result.id, 'user_a');
      });
    });
  });

  QUnit.module('QuerySnapshot', () => {
    QUnit.module('getter/setter: docs', () => {
      QUnit.test('should return the documents for the query snapshot', (() => {
        var _ref23 = _asyncToGenerator(function* (assert) {
          assert.expect(3);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').get();

          // Act
          const result = snapshot.docs;

          // Assert
          assert.equal(result[0].id, 'user_a');
          assert.equal(result[1].id, 'user_b');
          assert.equal(result[2].id, 'user_c');
        });

        return function (_x23) {
          return _ref23.apply(this, arguments);
        };
      })());
    });

    QUnit.module('getter/setter: empty', () => {
      QUnit.test('should return true when there are no documents', (() => {
        var _ref24 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('foobar').get();

          // Act
          const result = snapshot.empty;

          // Assert
          assert.equal(result, true);
        });

        return function (_x24) {
          return _ref24.apply(this, arguments);
        };
      })());

      QUnit.test('should return false when there are documents', (() => {
        var _ref25 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').get();

          // Act
          const result = snapshot.empty;

          // Assert
          assert.equal(result, false);
        });

        return function (_x25) {
          return _ref25.apply(this, arguments);
        };
      })());
    });

    QUnit.module('getter/setter: size', () => {
      QUnit.test('should return the number of documents for the query snapshot', (() => {
        var _ref26 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').get();

          // Act
          const result = snapshot.size;

          // Assert
          assert.equal(result, 3);
        });

        return function (_x26) {
          return _ref26.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: forEach', () => {
      QUnit.test('should fire callback per each data', (() => {
        var _ref27 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const stub = sinon.stub();
          const db = mockFirebase.firestore();
          const snapshot = yield db.collection('users').get();

          // Act
          snapshot.forEach(stub);

          // Assert
          assert.ok(stub.calledThrice);
        });

        return function (_x27) {
          return _ref27.apply(this, arguments);
        };
      })());
    });
  });

  QUnit.module('Query', () => {
    QUnit.module('getter/setter: firestore', () => {
      QUnit.test('should return the firestore the query is in', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').limit(1).firestore;

        // Assert
        assert.ok(result instanceof Firestore);
      });
    });

    QUnit.module('function: endAt', () => {
      QUnit.test('should return documents satisfying the query', (() => {
        var _ref28 = _asyncToGenerator(function* (assert) {
          assert.expect(3);

          // Arrange
          const db = mockFirebase.firestore();

          // Act
          const snapshot = yield db.collection('users').orderBy('age').endAt(15).get();

          // Assert
          assert.equal(snapshot.docs.length, 2);
          assert.equal(snapshot.docs[0].id, 'user_b');
          assert.equal(snapshot.docs[1].id, 'user_a');
        });

        return function (_x28) {
          return _ref28.apply(this, arguments);
        };
      })());

      QUnit.test('should error when not doing orderBy()', (() => {
        var _ref29 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();

          try {
            // Act
            yield db.collection('users').endAt(15).get();
          } catch (e) {
            // Assert
            assert.ok(true);
          }
        });

        return function (_x29) {
          return _ref29.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: endBefore', () => {
      QUnit.test('should return documents satisfying the query', (() => {
        var _ref30 = _asyncToGenerator(function* (assert) {
          assert.expect(2);

          // Arrange
          const db = mockFirebase.firestore();

          // Act
          const snapshot = yield db.collection('users').orderBy('age').endBefore(15).get();

          // Assert
          assert.equal(snapshot.docs.length, 1);
          assert.equal(snapshot.docs[0].id, 'user_b');
        });

        return function (_x30) {
          return _ref30.apply(this, arguments);
        };
      })());

      QUnit.test('should error when not doing orderBy()', (() => {
        var _ref31 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();

          try {
            // Act
            yield db.collection('users').endBefore(15).get();
          } catch (e) {
            // Assert
            assert.ok(true);
          }
        });

        return function (_x31) {
          return _ref31.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: limit', () => {
      QUnit.test('should return documents satisfying the query', (() => {
        var _ref32 = _asyncToGenerator(function* (assert) {
          assert.expect(3);

          // Arrange
          const db = mockFirebase.firestore();

          // Act
          const snapshot = yield db.collection('users').limit(2).get();

          // Assert
          assert.equal(snapshot.docs.length, 2);
          assert.equal(snapshot.docs[0].id, 'user_a');
          assert.equal(snapshot.docs[1].id, 'user_b');
        });

        return function (_x32) {
          return _ref32.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: onSnapshot', () => {
      QUnit.test('should return a function for unsubscribing', assert => {
        assert.expect(1);

        // Arrange
        const db = mockFirebase.firestore();

        // Act
        const result = db.collection('users').orderBy('age').onSnapshot(() => {});

        // Assert
        assert.ok(typeof result === 'function');
      });

      QUnit.test('should fire callback', assert => {
        assert.expect(1);

        // Arrange
        const done = assert.async();
        const db = mockFirebase.firestore();

        // Act
        db.collection('users').orderBy('age').onSnapshot(snapshot => {
          // Assert
          assert.ok(snapshot instanceof QuerySnapshot);
          done();
        });
      });
    });

    QUnit.module('function: orderBy', () => {
      QUnit.test('should return documents satisfying the query', (() => {
        var _ref33 = _asyncToGenerator(function* (assert) {
          assert.expect(3);

          // Arrange
          const db = mockFirebase.firestore();

          // Act
          const snapshot = yield db.collection('users').orderBy('age').get();

          // Assert
          assert.equal(snapshot.docs[0].id, 'user_b');
          assert.equal(snapshot.docs[1].id, 'user_a');
          assert.equal(snapshot.docs[2].id, 'user_c');
        });

        return function (_x33) {
          return _ref33.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: startAfter', () => {
      QUnit.test('should return documents satisfying the query', (() => {
        var _ref34 = _asyncToGenerator(function* (assert) {
          assert.expect(2);

          // Arrange
          const db = mockFirebase.firestore();

          // Act
          const snapshot = yield db.collection('users').orderBy('age').startAfter(15).get();

          // Assert
          assert.equal(snapshot.docs.length, 1);
          assert.equal(snapshot.docs[0].id, 'user_c');
        });

        return function (_x34) {
          return _ref34.apply(this, arguments);
        };
      })());

      QUnit.test('should error when not doing orderBy()', (() => {
        var _ref35 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();

          try {
            // Act
            yield db.collection('users').startAfter(15).get();
          } catch (e) {
            // Assert
            assert.ok(true);
          }
        });

        return function (_x35) {
          return _ref35.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: startAt', () => {
      QUnit.test('should return documents satisfying the query', (() => {
        var _ref36 = _asyncToGenerator(function* (assert) {
          assert.expect(3);

          // Arrange
          const db = mockFirebase.firestore();

          // Act
          const snapshot = yield db.collection('users').orderBy('age').startAt(15).get();

          // Assert
          assert.equal(snapshot.docs.length, 2);
          assert.equal(snapshot.docs[0].id, 'user_a');
          assert.equal(snapshot.docs[1].id, 'user_c');
        });

        return function (_x36) {
          return _ref36.apply(this, arguments);
        };
      })());

      QUnit.test('should error when not doing orderBy()', (() => {
        var _ref37 = _asyncToGenerator(function* (assert) {
          assert.expect(1);

          // Arrange
          const db = mockFirebase.firestore();

          try {
            // Act
            yield db.collection('users').startAt(15).get();
          } catch (e) {
            // Assert
            assert.ok(true);
          }
        });

        return function (_x37) {
          return _ref37.apply(this, arguments);
        };
      })());
    });

    QUnit.module('function: where', () => {
      QUnit.test('should return documents satisfying the query', (() => {
        var _ref38 = _asyncToGenerator(function* (assert) {
          assert.expect(2);

          // Arrange
          const db = mockFirebase.firestore();

          // Act
          const snapshot = yield db.collection('users').where('age', '==', 15).get();

          // Assert
          assert.equal(snapshot.docs.length, 1);
          assert.equal(snapshot.docs[0].id, 'user_a');
        });

        return function (_x38) {
          return _ref38.apply(this, arguments);
        };
      })());
    });
  });

  QUnit.module('WriteBatch', () => {
    QUnit.module('function: commit', () => {
      QUnit.test('should commit all of the writes in the write batch', (() => {
        var _ref39 = _asyncToGenerator(function* (assert) {
          assert.expect(7);

          // Arrange
          const db = mockFirebase.firestore();
          const batch = db.batch();
          const ref1 = db.collection('users').doc();
          const ref2 = db.collection('users').doc('user_a');
          const ref3 = db.collection('users').doc('user_b');
          const ref4 = db.collection('users').doc('user_100');

          batch.set(ref1, { username: 'new_user' });
          batch.delete(ref2);
          batch.update(ref3, { name: 'user-b' });
          batch.set(ref4, { username: 'user_100' });

          // Act
          yield batch.commit();

          // Assert
          const snapshot1 = yield ref1.get();
          const snapshot2 = yield ref2.get();
          const snapshot3 = yield ref3.get();
          const snapshot4 = yield ref4.get();

          assert.deepEqual(snapshot1.data(), { username: 'new_user' });
          assert.equal(snapshot2.exists, false);

          const {
            age: snapshot3Age,
            createdOn: snapshot3CreatedOn,
            name: snapshot3Name,
            username: snapshot3Username
          } = snapshot3.data();

          assert.equal(snapshot3Age, 10);
          assert.deepEqual(snapshot3CreatedOn.toDate(), new Date('2017-01-01'));
          assert.equal(snapshot3Name, 'user-b');
          assert.equal(snapshot3Username, 'user_b');
          assert.deepEqual(snapshot4.data(), { username: 'user_100' });
        });

        return function (_x39) {
          return _ref39.apply(this, arguments);
        };
      })());
    });
  });
});