(function () {

    var first_loading = true;

    function EventLinkTypeList() {
        this.data = [];

        this.data.push({ "value": "empty", "label": "Empty" });
        this.data.push({ "value": "linktocontent", "label": "Link To Content" });
        this.data.push({ "value": "externallink", "label": "External Link" });
        this.data.push({ "value": "nolink", "label": "No Link" });

    }

    function EditorialContentList() {
        this.data = [];

        this.data.push({ "icon": "av:videocam", "label": "Video", "typeContent": "video" });
        this.data.push({ "icon": "editor:insert-drive-file", "label": "Story", "typeContent": "story" });
    }

    function EventLinkConfiguration() {
        this.typeLink = null;
        this.linkProperties = {};
    }

    Polymer({
        is: "event-link",
        properties: {
            value: {
                type: Object,
                value: new EventLinkConfiguration(),
                observer: '_valueChanged'
            },
            linkTypes: {
                type: Object,
                value: new EventLinkTypeList()
            },
            editorialContentList: {
                type: Object,
                value: new EditorialContentList()
            },
            editorialContentSelected: {
                type: Object,
                value: {}
            }
        },


        ready: function () {
            this._linkToContentType = false;
            this._externalLinkType = false;
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value = new EventLinkConfiguration();
        },


        _itemSelected: function (e) {
            var typeLink = this.value.typeLink;
            this._showEditorialContent = false;
            this._linkToContentType = false;
            this._externalLinkType = false;

            if (first_loading) {
                this.editorialContentSelected = {};
            } else {
                this.value.linkProperties = {};
            }

            if (typeLink === "linktocontent") {
                this._linkToContentType = true;
                if (this.value.linkProperties.editorialContent != null) {
                    this._showEditorialContent = true;
                    this.editorialContentSelected = this.value.linkProperties.editorialContent;
                }
            }

            if (typeLink === "externallink") {
                this._externalLinkType = true;
            }

            if (!first_loading) {
                this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
            } else {
                first_loading = false;
            }


        },
        _onExternalLinkInput: function () {
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 2000);
        },

        _onExternalLinkChange: function () {
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _openSearch: function (e) {
            this.$.searchEditorialContent.open(e.model.item);
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
            console.log(this.value);
        },

        _editorialContentSelected: function (e) {
            this._showEditorialContent = true;
            this.editorialContentSelected = e.detail.editorialContent;
            this.value.linkProperties.editorialContent = this.editorialContentSelected;
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _deleteSelectedContent: function () {
            this._showEditorialContent = false;
            this.editorialContentSelected = {};
            this.value.linkProperties = {};
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        }

    });
})();