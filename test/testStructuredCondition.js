const roundtrip = require('./testHelper.js').roundtrip;

describe('ObjectModel', function() {
  
    describe('StructuredCondition', function() {
      it(`Topic.A = 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A > 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A >= 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A < 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A <= 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A <> 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A in \"XA\" `, function() { roundtrip(this.test.title) });
      it(`Topic.A exactin \"XA\"`, function() { roundtrip(this.test.title) });
      it(`IsBlank(Topic.A)`, function() { roundtrip(this.test.title) });
      it(`Not(IsBlank(Topic.A))`, function() { roundtrip(this.test.title) });
      it(`!IsBlank(Topic.A)`, function() { roundtrip(this.test.title) });
      it(`IsEmpty(Topic.A)`, function() { roundtrip(this.test.title) });
      it(`Not(IsEmpty(Topic.A))`, function() { roundtrip(this.test.title) });
      it(`!IsEmpty(Topic.A)`, function() { roundtrip(this.test.title) });
      it(`Topic.A = 5 || Topic.B = 5`, function() { roundtrip(this.test.title) });
      it(`IsEmpty(Topic.A) || !IsEmpty(Topic.B)`, function() { roundtrip(this.test.title) });
      it(`Topic.A = 5 && Topic.B = 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A = 5 Or Topic.B = 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A = 5 And Topic.B = 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A = 5 Or Topic.B = 5 Or Topic.C = 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A = 5 And Topic.B = 5 And Topic.C = 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A = 5 Or Topic.B = 5 And Topic.C = 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A = 5 And Topic.B = 5 Or Topic.C = 5`, function() { roundtrip(this.test.title) });
      it(`(Topic.A = 5 Or Topic.B = 5) And Topic.C = 5`, function() { roundtrip(this.test.title) });
      it(`Topic/*hi*/.A = 5`, function() { roundtrip(this.test.title) });
      it(`/*hi*/Topic.A = 5`, function() { roundtrip(this.test.title) });
      it(`Topic.A = 5/*hi*/`, function() { roundtrip(this.test.title) });
      it(`Topic.A = 5 // hi`, function() { roundtrip(this.test.title) });
      it(`Topic.A = 5 // hi`, function() { roundtrip(this.test.title) });
    });
  });
  