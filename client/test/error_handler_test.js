TestCase("FlashMessageTest", sinon.testCase({
    setUp: function () {
        this.root = document.createElement("div");
        document.body.appendChild(this.root);
        this.handler = new tddjs.ErrorHandler(this.root);
    },

    tearDown: function () {
        document.body.removeChild(this.root);
    },

    "test should append p.error element with provided text": function () {
        this.handler.handleError("Oh no!");

        assertTagName("p", this.root.firstChild);
        assertClassName("error", this.root.firstChild);
        assertEquals("Oh no!", this.root.firstChild.innerHTML);
    },

    "test should use provided message": function () {
        this.handler.handleError("Hell no");

        assertEquals("Hell no", this.root.firstChild.innerHTML);
    },

    "test should fade out element after 4secs": function () {
        this.handler.handleError("Hell no");
        var p = jQuery(this.root.firstChild);
        var height = p.height();

        this.clock.tick(4000);
        assertEquals(1, this.root.childNodes.length);

        this.clock.tick(160);
        assert(p.height() < height);

        this.clock.tick(160);
        assertEquals(0, p.height());
        assertEquals(0, this.root.childNodes.length);
    },

    "test should start fading after configured timeout": function () {
        this.handler.timeout = 3000;
        this.handler.handleError("Hell no");
        var p = jQuery(this.root.firstChild);
        this.stub(jQuery.prototype, "hide");

        this.clock.tick(2000);
        sinon.assert.notCalled(jQuery.prototype.hide);

        this.clock.tick(1000);
        sinon.assert.calledOnce(jQuery.prototype.hide);
    },

    "test should fade out for configured duration": function () {
        this.handler.timeout = 0;
        this.handler.fadeDuration = 3000;
        this.handler.handleError("Hell no");
        var p = jQuery(this.root.firstChild);

        this.clock.tick(2500);
        assertNotEquals(0, p.height());

        this.clock.tick(500);
        assertEquals(0, p.height());
    }
}));
