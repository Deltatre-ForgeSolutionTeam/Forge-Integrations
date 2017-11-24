(function () {

    var REFERENCE_FIELD_NAME = "eventLinkReferenceFields";
    var REFERENCE_FIELD_TYPE = "customentity.event";

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
        this._entityId = content.EntityId;
        this.entityType = content.EntityType;
        this.entityCode = content.EntityCode;
    }

    function ReferenceFieldItemsCommandBody(eventEntity, referenceEntity) {
        this.aggregateId = eventEntity.entityId;
        this.translationId = eventEntity.id;
        this.aggregateType = REFERENCE_FIELD_TYPE;
        this.fieldName = REFERENCE_FIELD_NAME;

        var referenceEntityType = referenceEntity.EntityCode == null ?
            referenceEntity.EntityType :
            referenceEntity.EntityType + "." + referenceEntity.EntityCode;

        this.referencedItems = [
            {
                entityType: referenceEntityType,
                entityId: referenceEntity.EntityId
            }
        ];
    }

    function AddReferenceFieldItemsCommand(eventEntity, referenceEntity) {
        this.commandName = "AddReferenceFieldItemsCommand";
        this.commandBody = new ReferenceFieldItemsCommandBody(eventEntity, referenceEntity);
    }

    function RemoveReferenceFieldItemsCommand(eventEntity, referenceEntity) {
        this.commandName = "RemoveReferenceFieldItemsCommand";
        this.commandBody = new ReferenceFieldItemsCommandBody(eventEntity, referenceEntity);
    }

    Polymer({
        is: "event-link",
        properties: {
            value: {
                type: Object,
                value: new EventLinkConfiguration(),
                observer: '_valueChanged'
            },
            entity: {
                type: Object
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
                }
                else
                    this.value.linkProperties = {};
            }

            if (typeLink === "externallink")
                this._externalLinkType = true;
            if (triggerChange && typeLink === "externallink")
                this.value.linkProperties = {};
            if (typeLink === "nolink" || typeLink === "empty")
                this.value.linkProperties = {};

            if (triggerChange)
                this._callValueChanged(0);
        },

        _loadContent: function (e) {
            this._loadEventTemplate(this.value.typeLink, false);
        },

        _itemSelected: function (e) {
            if (this.editorialContentSelected._entityId != null) {
                var referenceToRemove = {
                    EntityId: this.editorialContentSelected._entityId,
                    EntityCode: this.editorialContentSelected.entityCode,
                    EntityType: this.editorialContentSelected.entityType
                };

                debugger;
                this._removeContentToReferenceField(referenceToRemove);
            }

            this._loadEventTemplate(e.target.linkTypeValue, true);
        },

        _onExternalLinkInput: function () {
            this._callValueChanged(2000);
        },

        _onExternalLinkChange: function () {
            this._callValueChanged(0);
        },

        _openSearch: function (e) {
            this.$.searchEditorialContent.open(e.model.item);

            this._callValueChanged(0);
        },

        _editorialContentSelected: function (e) {
            if (this.editorialContentSelected._entityId != null) {
                var referenceToRemove = {
                    EntityId: this.editorialContentSelected._entityId,
                    EntityCode: this.editorialContentSelected.entityCode,
                    EntityType: this.editorialContentSelected.entityType
                };

                this._removeContentToReferenceField(referenceToRemove);
            }

            this._showEditorialContent = true;

            this.value.linkProperties.editorialContent = new EditorialContent(e.detail.editorialContent);
            this.editorialContentSelected = this.value.linkProperties.editorialContent;

            this._addContentToReferenceField(e.detail.editorialContent);

            this._callValueChanged(0);
        },

        _deleteSelectedContent: function () {
            if (this.editorialContentSelected._entityId != null) {
                var referenceToRemove = {
                    EntityId: this.editorialContentSelected._entityId,
                    EntityCode: this.editorialContentSelected.entityCode,
                    EntityType: this.editorialContentSelected.entityType
                };

                this._removeContentToReferenceField(referenceToRemove);
            }

            this._showEditorialContent = false;
            this.editorialContentSelected = {};
            this.value.linkProperties = {};

            this._callValueChanged(0);
        },

        _deleteTypeLink: function () {
            if (this.editorialContentSelected._entityId != null) {
                var referenceToRemove = {
                    EntityId: this.editorialContentSelected._entityId,
                    EntityCode: this.editorialContentSelected.entityCode,
                    EntityType: this.editorialContentSelected.entityType
                };

                this._removeContentToReferenceField(referenceToRemove);
            }

            this.value = new EventLinkConfiguration();
            this._linkToContentType = false;

            this._callValueChanged(0);
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
        },

        _callValueChanged: function (mills) {
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _addContentToReferenceField: function (content) {
            const command = new AddReferenceFieldItemsCommand(this.entity, content);
            this.fire('sendCommand', command);
        },

        _removeContentToReferenceField: function (content) {
            const command = new RemoveReferenceFieldItemsCommand(this.entity, content);
            this.fire('sendCommand', command);
        },

        _getEditorialContentTitle: function (entity) {
            var retValue = null;

            if (entity.referenceFields != null &&
                entity.referenceFields[REFERENCE_FIELD_NAME] != null &&
                entity.referenceFields[REFERENCE_FIELD_NAME][0] != null)
                retValue = entity.referenceFields[REFERENCE_FIELD_NAME][0].title;

            return retValue;
        },

        _getEditorialContentSlug: function (entity) {
            var retValue = null;

            if (entity.referenceFields != null &&
                entity.referenceFields[REFERENCE_FIELD_NAME] != null &&
                entity.referenceFields[REFERENCE_FIELD_NAME][0] != null)
                retValue = entity.referenceFields[REFERENCE_FIELD_NAME][0].slug;

            return retValue;
        },

        _getEditorialContentThumbnailUrl: function (entity) {
            var retValue = null;

            if (entity.referenceFields != null &&
                entity.referenceFields[REFERENCE_FIELD_NAME] != null &&
                entity.referenceFields[REFERENCE_FIELD_NAME][0] != null)
                retValue = ForgeWebComponents.Helpers.EntityHelper.createThumbnailUrl(entity.referenceFields[REFERENCE_FIELD_NAME][0].type,
                    entity.referenceFields[REFERENCE_FIELD_NAME][0].id);

            return retValue;
        },

        _getEditorialContentExternalLink: function (entity) {
            var retValue = null;

            if (entity.referenceFields != null &&
                entity.referenceFields[REFERENCE_FIELD_NAME] != null &&
                entity.referenceFields[REFERENCE_FIELD_NAME][0] != null)
                retValue = ForgeWebComponents.Helpers.EntityHelper.createLink(entity.referenceFields[REFERENCE_FIELD_NAME][0].type,
                    entity.referenceFields[REFERENCE_FIELD_NAME][0].entityId,
                    entity.referenceFields[REFERENCE_FIELD_NAME][0].id);

            return retValue;
        },

        _getEditorialContentPublishState: function (entity) {
            var retValue = false;

            if (entity.referenceFields != null &&
                entity.referenceFields[REFERENCE_FIELD_NAME] != null &&
                entity.referenceFields[REFERENCE_FIELD_NAME][0] != null)
                retValue = entity.referenceFields[REFERENCE_FIELD_NAME][0].stage == "published" ? true : false;

            return retValue;
        }
    });
})();