# scuttle-poll

> Create and vote on polls on ssb

background details relevant to understanding what this module does

repos:
- git-ssb: `ssb://%uUPqduvyGE2mUBIWdVwMg4jYcKUjxN+TF2wG4a7StM8=.sha256`
- github: `git@github.com:ssbc/scuttle-poll.git`

## Usage

### Init
```js
var Sbot = require('ssb-client')
Sbot((err, server) => {
  if (err) {
    return console.log(err)
  }
  var ScuttlePoll = require('scuttle-poll')
  var scuttlePoll = ScuttlePoll(server)
})
```
where `server` is a scuttlebot instance (or a remote connection provided by `ssb-client`)

Note - `server` can also be an observeable which resolves to a scuttlebot instance
(this is more experimental, it will turn your sync functions into obs functions)

This returns an object with methods defined in `methods.js` that looks like:

```js
{
  poll: {
    async: {
      chooseOne:  
      get:
    },
    sync: {
      isPoll:
      isChooseOnePoll:
    } 
  },
  position: {
    async: {
      chooseOne:
      position:
    
    },
    sync: {
      isPosition:
      chooseOneResults:
    } 
  }
}

```

## Dependencies

Requires a scuttlebutt server with the following plugins installed:
  - `ssb-backlinks`


## API

```js
var ScuttlePoll = require('scuttle-poll')
var scuttlePoll = ScuttlePoll(server)
```

### Methods

#### `scuttle.poll.sync.isPoll(msg) => Boolean`

Takes a msg or the contents of a msg

You can also check for subtypes of poll e.g.

```js
isPoll.chooseOne(msg)
// => Boolean
```

### `scuttle.poll.async.get(key, cb)`

fetches all the messages associated with a particular poll, and returns a delightfully accessible object:

```js
{
  key:        MessageKey,
  value:      MessageValue,

  author:     FeedId,
  title:      String,
  body:       (String|Null),

  positions:  Array,
  myPosition: Object,
  results:    Array,
  resolution: Msessage,
  errors:     Object

  heads:      Array
}
```


#### `scuttle.poll.async.publishChooseOne(opts, cb)`

// NOT BUILT YET

where `opts` is an object of form:
```js
{
  title: String,    // required
  choices: Array,   // required
  body: String,
}
```
and `cb` is a callback of signature `(err, newPollMsg)`


## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install scuttle-poll
```

## Schemas

### Poll

Poll message content
```js
{
  type:       'poll',          // required
  details: PollDetails     // required
  title:       String,         // required
  closesAt:    Integer         // required
  body:        String,
  channel,
  mentions,
  recps
}

```

Where `PollDetails` is an object which has the details needed for each type of poll: Dot, Proposal, Score

Dot vote PollDetails
```js
{
  type: 'dot', // required
  maxStanceScore: 'Integer >= 0', // required
  maxChoiceScore: 'Integer >= 0', //optional
  choices: Array, // required
}
```

Proposal PollDetails
```js
{
  type: 'proposal', // required
  proposal: String, // required
}
```

Score PollDetails
```js
{
  type: 'score', // required
  maxChoiceScore: 'Integer >= 0', //required
  choices: Array, // required
}
```

### Position

```js
{
  type:           'position',
  root:            MessageKey,
  details: Object
}
```

chooseOne details:
```js
{
  choice:

}
```

## Acknowledgments

`scuttle-poll` was inspired by [Loomio](https://www.github.com/loomio/loomio)! Massive thanks to Rob Guthrie and James Kiesel for spending time giving us a brain dump of their data model.



## See Also


## License

MIT

