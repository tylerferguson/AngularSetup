// spec.js
describe('Mobile', function() {
    it('should have a title', function() {
        browser.get('http://localhost:63342/AngularSetup/app/index.html');

        expect(browser.getTitle()).toEqual('Angular Mobile Setup');
    });
});