(function () {

    function createLinkChangedEvent(link) {
        return new CustomEvent('link-changed', { detail: { link: link } });
    }

    function AccessibleLink() {
        this.displayText = null;
        this.accessibleText = null;
        this.url = null;
        this.openInNewTab = false;
    }

    Polymer({
        is: "accessible-link",
        properties: {
            link: {
                type: Object,
                value: new AccessibleLink()
            },
            title: {
                type: String
            }
        },

        ready: function () {
            
        },

        _displayTextChanged: function (e) {
            this.link.displayText = e.target.value;
            this._callLinkChanged(this.link);
        },

        _accessibleTextChanged: function (e) {
            this.link.accessibleText = e.target.value;
            this._callLinkChanged(this.link);
        },

        _urlChanged: function (e) {
            this.link.url = e.target.value;
            this._callLinkChanged(this.link);
        },

        _openInNewTabChanged: function (e) {
            this.link.openInNewTab = e.target.checked;
            this._callLinkChanged(this.link);
        },

        _callLinkChanged: function (link) {
            this.dispatchEvent(createLinkChangedEvent(link));
        },

        _clear: function () {
            this.properties.link.value = new AccessibleLink();
        }
    });
})();