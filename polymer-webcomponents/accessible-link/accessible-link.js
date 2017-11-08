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
            value: {
                type: Object,
                value: new AccessibleLink(),
                observer: "_valueChanged"
            },
            title: {
                type: String
            },
            entity: {
                type: Object,
                observer: "_entityChanged"
            },
            fieldName: {
                type: String,

            }
        },

        ready: function () {

        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue)
                this.set("value", new AccessibleLink());
        },

        _entityChanged: function (newValue, oldValue) {
            if (this.entity && this.fieldName &&
                typeof this.entity != "string") {
                var customEntitiesDefinitions = ForgeWebComponents.Config["deltatre.forge.wcm"].CustomEntitiesConfiguration.Definitions;

                for (var i = 0; i < customEntitiesDefinitions.length; i++) {
                    if (customEntitiesDefinitions[i].Code === this.entity.entityCode) {
                        this.title = customEntitiesDefinitions[i].JsonSchema.properties[this.fieldName].title;
                    }
                }
            }
        },

        _displayTextChanged: function (e) {
            this.value.displayText = e.target.value;
            this._callLinkChanged(this.value);
        },

        _accessibleTextChanged: function (e) {
            this.value.accessibleText = e.target.value;
            this._callLinkChanged(this.value);
        },

        _urlChanged: function (e) {
            this.value.url = e.target.value;
            this._callLinkChanged(this.value);
        },

        _openInNewTabChanged: function (e) {
            this.value.openInNewTab = e.target.checked;
            this._callLinkChanged(this.value);
        },

        _callLinkChanged: function (link) {
            this.dispatchEvent(createLinkChangedEvent(link));

            if (this.entity != null)
                this._callValueChanged();
        },

        _clear: function () {
            this.value = new AccessibleLink();
        },

        _callValueChanged: function () {
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
        }
    });
})();