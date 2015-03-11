
///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>

module catavolt.fp {

    describe("Future", function () {
        it("should be created successfully with Try", function () {
            var f:Future<string> = Future.createCompletedFuture("test", new Success<string>("successfulValue"));
        });
    });

}