const test = require('tape')
const ChooseOne = require('../../../poll/sync/chooseOne')
const isPoll = require('../../../isPoll')
const { CHOOSE_ONE } = require('../../../types')

// this is for testing the attributes that are required for all polls

test('Poll - common requirements', function (t) {
  var missingTitle = ChooseOne({
    choices: [1, 2, 'three'],
    closesAt: new Date().toISOString()
  })
  t.false(isPoll(missingTitle), 'needs title')

  var missingClosesAt = ChooseOne({
    choices: [1, 2, 'three'],
    title: 'how many food'
  })
  t.false(isPoll(missingClosesAt), 'needs closes at')

  var malformedClosesAt = ChooseOne({
    choices: [1, 2, 'three'],
    title: 'how many food',
    closesAt: 'tomorrow'
  })
  t.false(isPoll(missingClosesAt), 'needs ISOString closes at')

  var missingDetails = {
    type: 'poll',
    pollDetails: undefined,
    title: 'how many food',
    closesAt: new Date().toISOString()
  }
  t.false(isPoll(missingDetails), 'needs details')
  t.true(isPoll.errors, 'failing validations have errors')

  var fullyFeatured = {
    type: 'poll',
    pollDetails: {
      type: CHOOSE_ONE,
      title: 'how many dogs?',
      choices: [1, 2, 3]
    },
    title: 'how many food',
    body: 'this is really important, please let me know',
    mentions: [
      {name: 'mix', link: '@ye+QM09iPcDJD6YvQYjoQc7sLF/IFhmNbEqgdzQo3lQ=.ed25519'},
      {name: 'sweet drawing', link: '&mwILr7kd1Tug/4vX5nW6YORhyununwkO4cF6jbiSyoA=.sha256'},
      {link: '%s8uVi560mwpE8ncjT+eMz5XBQBREdk4exvM3D6dIg9g=.sha256'}
    ],
    recps: [
      '@ye+QM09iPcDJD6YvQYjoQc7sLF/IFhmNbEqgdzQo3lQ=.ed25519',
      {name: 'mix', link: '@ye+QM09iPcDJD6YvQYjoQc7sLF/IFhmNbEqgdzQo3lQ=.ed25519'}
    ],
    closesAt: new Date().toISOString()
  }
  t.true(isPoll(fullyFeatured), 'fully featured')

  t.end()
})
