### Possible future bugs and edge cases

- What if an athlete is added to a contest result afterwards (when point calculation is already done). Points should be calculated from scratch
- What if the same contest (contest with a same name) is held more than once a year. ID's are generated with name-year tuple. So it wouldnt be unique any longer. (name-year tuple is a very simple and short human readible id. Try to keep that)
