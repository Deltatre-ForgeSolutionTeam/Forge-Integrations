(function () {

    //var first_loading = true;
    var _editorialContentUnpublished = false;
    var api = ForgeWebComponents.Api;

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

    function EditorialContent(content){
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
                self._editorialContentUnpublished =  result.Stage == 'unpublished' ? true : false;;

            }, function () {
                self._hideLoading = true;
                self._result = {};

                console.error(arguments);
            });

        },

       
        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value = new EventLinkConfiguration();
        },

     
        _itemSelected: function (e) {

            var typeLink = e.target.linkTypeValue;
            this._showEditorialContent = false;
            this._linkToContentType = false;
            this._externalLinkType = false;

            /*
            if (first_loading) {
                this.editorialContentSelected = {}
            }
            */
            if (typeLink === "linktocontent") {
                this._linkToContentType = true;
                if (this.value.linkProperties.editorialContent != null) {

                   // if (first_loading) {
                        this._getData()
                        this._showEditorialContent = true;
                        this.editorialContentSelected = this.value.linkProperties.editorialContent;

                    /*} else {
                        this._editorialContentUnpublished = false;
                        this._showEditorialContent = true;
                        this.editorialContentSelected = this.value.linkProperties.editorialContent;
                    }*/
                }else{
                    this.value.linkProperties = {};
                }
            }

            if (typeLink === "externallink") {
                this._externalLinkType = true;
            }

            if (typeLink === "nolink" || typeLink === "empty" || typeLink === "externallink") {
                this.value.linkProperties = {};
            }

            //if (!first_loading) {
                this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
            /*} else {
                first_loading = false;
            }*/


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
            console.log(this.editorialContentSelected);
            this._showEditorialContent = true;
            this._editorialContentUnpublished = false;
            this.value.linkProperties.editorialContent = new EditorialContent(e.detail.editorialContent);
            this.editorialContentSelected = this.value.linkProperties.editorialContent;
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
            console.log(this.editorialContentSelected);
        },

        _deleteSelectedContent: function () {
            this._showEditorialContent = false;
            this._editorialContentUnpublished = false;
            this.editorialContentSelected = {};
            this.value.linkProperties = {};
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        }

    });
})();