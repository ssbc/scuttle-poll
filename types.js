module.exports = {
  chooseOnePollType: 'chooseOnePoll',
  chooseOnePositionType: 'chooseOnePosition',
  ERROR_POSITION_TYPE: 'ERROR_POSITION_TYPE',
  ERROR_POSITION_LATE: 'ERROR_POSITION_LATE',
  ERROR_POSTITION_CHOICE: 'ERROR_POSTITION_CHOICE'
}

// Question: do these need to be different, could we just have 'chooseOne',
// because we already have:
// { type: 'poll', pollDetails: { type: 'chooseOne' } }
// { type: 'position', positionDetails: { type: 'chooseOne' } }
//
//
// to that end, perhaps we could prune these down to
// { type: 'poll', details: { type: 'chooseOne', choices } }
// { type: 'position', details: { type: 'chooseOne', choice } }

/// positions need to point at a poll right?
//  I wonder if a position could just be ... but this would mean we would have to have the parent poll, and then based o nthe type there, run a isOneChoicePostion validator... which I wthink could be good? Maybe I don't understandthe complexity of the other types of positions.
// { type: 'position', poll, choice }
//
//
//  I not that there's also a validation thing where
// { type: 'position', poll, choice: 9000 }
//
// is probably invalid, and that the choice should be an integer bound by the parent poll choices. Can probably think about that case later, but making out reducer we're gonna have to put some filtering logic somewhere. Could programatically generate a position schema based on a poll.... _WOAH there EASY MIX_
