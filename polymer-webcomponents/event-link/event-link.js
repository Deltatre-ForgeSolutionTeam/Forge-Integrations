(function () {

    var _editorialContentUnpublished = false;
    var api = ForgeWebComponents.Api;

    function EventLinkTypeList() {
        this.data = [];

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

    function EditorialContent(content) {
        this.entityId = content.EntityId;
        this.translationId = content.Id;
        this.contentType = content.EntityType;
        this.entityCode = content.EntityCode;
        this.slug = content.Slug;
        this.title = content.Title
        this.wcmThumbnailUrl = content.wcmThumbnailUrl;
        this.wcmlink = content.wcmlink;
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

        _getData: function () {
            var content = this.value.linkProperties.editorialContent;

            var url = "/deltatre.forge.wcm/api/stories/working/" + content.translationId;

            if (content.entityCode === "video") {
                url = "deltatre.forge.wcm/api/customEntities/video/working/culture/en-us/entityid/" + content.entityId;
            }

            var self = this;

            self._hideLoading = false;

            api.raw(url).then(function (result) {
                self._hideLoading = true;
                self._result = result;
                self._editorialContentUnpublished = result.Stage == 'unpublished' ? true : false;;
            }, function () {
                self._hideLoading = true;
                self._result = {};
            });

        },


        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value = new EventLinkConfiguration();
        },

        _loadEventTemplate: function (typeLink, triggerChange) {
            this._showEditorialContent = false;
            this._linkToContentType = false;
            this._externalLinkType = false;

            if (typeLink === "linktocontent") {
                this._linkToContentType = true;
                if (this.value.linkProperties.editorialContent != null) {

                    this._getData()
                    this._showEditorialContent = true;
                    this.editorialContentSelected = this.value.linkProperties.editorialContent;
                } else {
                    this.value.linkProperties = {};
                }
            }

            if (typeLink === "externallink") {
                this._externalLinkType = true;
            }
            if (triggerChange && typeLink === "externallink") {
                this.value.linkProperties = {};
            }

            if (typeLink === "nolink" || typeLink === "empty") {
                this.value.linkProperties = {};
            }

            if (triggerChange) {
                this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
            }
        },

        _loadContent: function (e) {
            this._loadEventTemplate(this.value.typeLink, false);
        },

        _itemSelected: function (e) {
            this._loadEventTemplate(e.target.linkTypeValue, true);
        },

        _getExternalLinkUrl: function () {
            if (this.value.linkProperties.externalLinkUrl) {
                return this.value.linkProperties.externalLinkUrl;
            }

            return null;
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
        },

        _editorialContentSelected: function (e) {
            this._showEditorialContent = true;
            this._editorialContentUnpublished = false;
            this.value.linkProperties.editorialContent = new EditorialContent(e.detail.editorialContent);
            this.editorialContentSelected = this.value.linkProperties.editorialContent;
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _deleteSelectedContent: function () {
            this._showEditorialContent = false;
            this._editorialContentUnpublished = false;
            this.editorialContentSelected = {};
            this.value.linkProperties = {};
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },
        
        _deleteTypeLink: function () {
            this.value = new EventLinkConfiguration();
            this._linkToContentType = false;
        }
    });
})();