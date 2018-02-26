# ssb-loomio

> Create and vote on polls on ssb

background details relevant to understanding what this module does

## ssb git repo
`ssb://%uUPqduvyGE2mUBIWdVwMg4jYcKUjxN+TF2wG4a7StM8=.sha256`

## Usage

```js
var ssbLoomio = require('ssb-loomio')

console.log('hello warld')
```

outputs

```
hello warld
```

## API

```js
var ssbLoomio = require('ssb-loomio')
```

See [api_formatting.md](api_formatting.md) for tips.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install ssb-loomio
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

ssb-loomio was inspired by loomio! Massive thanks to Rob Guthrie and James Kiesel for spending time giving us a brain dump of their data model.

## See Also


## License

MIT

