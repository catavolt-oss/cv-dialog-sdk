///<reference path="jasmine.d.ts"/>

import {Future} from '../src/catavolt'
import {Success} from '../src/catavolt'

xdescribe("Future", function () {
    it("should be created successfully with Try", function () {
        var f:Future<string> = Future.createCompletedFuture("test", new Success<string>("successfulValue"));
    });
});

