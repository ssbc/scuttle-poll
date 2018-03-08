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
