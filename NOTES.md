# Notes

## Open Questions

- do we need schemas for internal types, eg Errors?
- how do we versioning well?
  - do require in older versions and delegate to them somehow?
    - sub folder with own package.json?
- ChooseOnePoll and ChooseOnePosition vs ChooseOne types in types.js 
  - With choose one, some of the code nicer. Trade off is perhaps collisions.
- also applies to PollDetails and PositionDetails types. They could just be details.
- should getters use backlinks or links2?

## Out process / patterns

These are a short-hand for what we think have been good patterns in this project. We should expand them so others following can benefit from our learning. Please shoulder tap us if you want them expanding.


- Vertical slice
- Design for front end dev
- Decorate
- Opinionated folder structure. Human readable API.
- Testing
- Linting with ale
- Give your test files *.test.js filenames. It helps with readability when there are errors.
- the inject pattern
- prefer passing a single object rather than ordered args
- don't modify data passed into a function
