module.exports = () => ({
  __collection__: {
    users: {
      __doc__: {
        user_a: {
          address: {
            home: 'San Francisco',
            work: 'Silicon Valley'
          },
          age: 15,
          createdOn: new Date('2017-01-01'),
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
          createdOn: new Date('2017-01-01'),
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
          createdOn: new Date('2017-01-01'),
          username: 'user_c'
        }
      }
    }
  }
});