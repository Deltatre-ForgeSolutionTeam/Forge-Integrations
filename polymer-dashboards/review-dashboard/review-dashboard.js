(function () {
    "use strict";

    var api = ForgeWebComponents.Api;
    var config = ForgeWebComponents.Config;

    function ExistingEntityType(entityType, title, apiSlug, isCustom) {
        this.entityType = entityType;
        this.title = title;
        this.apiSlug = apiSlug;
        this.isCustom = isCustom;
    }

    function EntityTypeModel(entityType, title, icon, color, count, api) {
        this.entityType = entityType;
        this.title = title;
        this.icon = icon;
        this.color = color;
        this.count = count;
        this.api = api;
    }

    Polymer({
        is: "review-dashboard",
        properties: {
            _isDataLoading: {
                type: Boolean,
                value: true
            },
            _data: {
                type: Array,
                value: []
            },
            _existingEntityTypes: {
                type: Array,
                value: []
            }
        },

        ready: function () {
            this._initExistingEntityTypes();
            this._bindData(Date.now());
        },

        _checkExtractedEntities: function () {
            if (!this._data.length && this._isDataLoading)
                return true;
            else
                return false;
        },

        _initExistingEntityTypes: function () {
            if (this._existingEntityTypes.length != 0)
                this._existingEntityTypes = [];

            // Built-in Entities
            this._existingEntityTypes.push(new ExistingEntityType("story", "Story", "stories", false));
            this._existingEntityTypes.push(new ExistingEntityType("photo", "Photo", "photos", false));
            this._existingEntityTypes.push(new ExistingEntityType("album", "Album", "albums", false));
            this._existingEntityTypes.push(new ExistingEntityType("document", "Document", "documents", false));
            this._existingEntityTypes.push(new ExistingEntityType("selection", "Selection", "selections", false));
            this._existingEntityTypes.push(new ExistingEntityType("tag", "Tag", "tags", false));

            // Custom Entities
            for (var i = 0; i < config["deltatre.forge.wcm"].CustomEntitiesConfiguration.Definitions.length; i++) {
                var definition = config["deltatre.forge.wcm"].CustomEntitiesConfiguration.Definitions[i];

                this._existingEntityTypes.push(new ExistingEntityType(definition.Code, definition.Name, definition.Code, true));
            }
        },

        _createTitleFromType: function (entityType) {
            for (var i = 0; i < this._existingEntityTypes.length; i++) {
                if (this._existingEntityTypes[i].entityType === entityType)
                    return this._existingEntityTypes[i].title;
            }
        },

        _getApiFromType: function (entityType) {
            var retValue = "";

            for (var i = 0; i < this._existingEntityTypes.length; i++) {
                if (this._existingEntityTypes[i].entityType === entityType) {
                    if (this._existingEntityTypes[i].isCustom)
                        retValue = "/customentities/";

                    retValue += this._existingEntityTypes[i].apiSlug;
                }
            }

            return retValue;
        },

        _bindData: function (timeStamp) {
            var url = null;

            if (timeStamp != null)
                url = "/api/extensions/query/dashboards-wcm-stages-totals?" + timeStamp;
            else
                url = "/api/extensions/query/dashboards-wcm-stages-totals";

            this._clearData();

            var self = this;

            api.raw(url).then(function (result) {
                self._parseRequestResult(self, result);
                self._isDataLoading = false;
            }, function () {
                self._isDataLoading = false;
            });
        },

        _parseRequestResult: function (self, result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].WorkflowStatus === "waiting") {
                    var waitingEntities = result[i].ByEntity;

                    for (var j = 0; j < waitingEntities.length; j++) {
                        var item = waitingEntities[j];

                        var api = null;

                        var newItem = new EntityTypeModel(item.EntityType,
                            self._createTitleFromType(item.EntityType),
                            ForgeWebComponents.Helpers.EntityHelper.getEntityIcon(item.EntityType).icon,
                            ForgeWebComponents.Helpers.EntityHelper.getEntityIcon(item.EntityType).color,
                            item.Count,
                            this._getApiFromType(item.EntityType));

                        self.push("_data", newItem);
                    }
                }
            }
        },

        _refreshData: function () {
            this._isDataLoading = true;
            this._bindData(Date.now());
        },

        _clearData: function () {
            this._data = [];
            this.set("_data", []);
        }
    });
})();