const pull = require('pull-stream')
pull.merge = require('pull-merge')
pull.pMap = require('pull-paramap')

const fastStream = pull.values([1, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
const slowStream = pull(
  pull.values([4, 5, 20, 21, 22, 23, 24, 25, 26, 27]),
  pull.through(n => console.log('pulling ', n)),
  pull.pMap(asyncThing, 2)
)

pull(
  pull.merge(
    slowStream,
    fastStream,
    comparer
  ),
  pull.asyncMap((n, cb) => setTimeout(() => cb(null, n), 500)),
  pull.log(() => console.log('DONE'))
)

function asyncThing (n, cb) {
  setTimeout(() => cb(null, n), 1000)  // simulate some slow lookup
}

function comparer (a, b) {
  // console.log('comparing', a, b)
  return a < b ? -1 : 1
}
