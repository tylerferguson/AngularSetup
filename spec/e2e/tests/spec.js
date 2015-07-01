// spec.js
describe('Mobile', function() {

    beforeEach(function() {
        browser.get('http://localhost:63342/AngularSetup/app/index.html');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Angular Mobile Setup');
    });

    it('copies and outputs your input', function() {
        var typedMessage = element(by.model('typedMessage'));
        var outputMessage = element(by.binding('typedMessage'));

        var testMessage = 'This is pretty cool!';
        typedMessage.sendKeys(testMessage);
        expect(outputMessage.getText()).toBe(testMessage);
    });
});