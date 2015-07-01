describe("main.controller.js", function() {
    beforeEach(module('Mobile'));

    it("should set message on the scope", inject(function($controller) {
        var scope = {};
        var ctrl = $controller('MainCtrl', { $scope: scope });

        expect(scope.message).toEqual('Hello World!');
    }));
});
