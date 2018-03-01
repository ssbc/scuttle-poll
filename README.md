# scuttle-poll

> Create and vote on polls on ssb

background details relevant to understanding what this module does

repos:
- git-ssb: `ssb://%uUPqduvyGE2mUBIWdVwMg4jYcKUjxN+TF2wG4a7StM8=.sha256`
- github: `git@github.com:ssbc/scuttle-poll.git`

## Usage

```js
var isPoll = require('scuttle-poll/isPoll')

isPoll(msg)
// => Boolean
```

```js
var scuttle = require('scuttle-poll')(server)

var opts = {
  title: 'where shall we have our community meeting?'
  choices: [
    'in person',
    'talky.io',
    'mumble',
  ]
}
scuttle.poll.async.publishChooseOne(opts, (err, poll) => {
  if (err) throw err

  var myPosition 
  scuttle.position.async.publishPosition(myPosition, cb)
})
```
where `server` is a scuttlebot instance (or a remote connection provided by `ssb-client`)

Note - `server` can also be an observeable which resolves to a scuttlebot instance
(this is more experimental, it will turn your sync functions into obs functions)


## API

```js
var Scuttle = require('scuttle-poll')
var scuttle = Scuttle(server)
```

### Methods

#### `scuttle.poll.sync.isPoll(msg) => Boolean`

takes a msg or the contents of a msg

#### `scuttle.poll.async.publishChooseOne(opts, cb)`

where `opts` is an object of form:
```js
{
  title: String,    // (required)
  choices: Array,   // (required)
  text: String,
}
```
and `cb` is a callback of signature `(err, newPollMsg)`


## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install scuttle-poll
```

## Schemas

Poll message content
```
{
  type: 'poll', // required
  pollType: oneOf:[dot, proposal, score] , // required
  text: String, // required
  mentions, //optional
}

```

Dot vote pollType
```
{
  type: 'dot', // required
  maxStanceScore: 'Integer >= 0', // required
  maxChoiceScore: 'Integer >= 0', //optional
  choices: Array, // required
}
```

Proposal pollType
```
{
  type: 'proposal', // required
  proposal: String, // required
}
```

Score pollType
```
{
  type: 'score', // required
  maxChoiceScore: 'Integer >= 0', //required
  choices: Array, // required
}
```

Position
```

```

## Acknowledgments

`scuttle-poll` was inspired by [Loomio](https://www.github.com/loomio/loomio)! Massive thanks to Rob Guthrie and James Kiesel for spending time giving us a brain dump of their data model.



## See Also


## License

MIT

