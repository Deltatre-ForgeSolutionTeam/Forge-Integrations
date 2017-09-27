(function () {
    "use strict";

    var api = ForgeWebComponents.Api;

    function EntityModel(title, url, last_update_user, last_update_date) {
        this.title = title;
        this.url = url;
        this.last_update_user = last_update_user;
        this.last_update_date = last_update_date;
    }

    Polymer({
        is: "generic-entity-summary-card",
        properties: {
            _isDataLoading: {
                type: Boolean,
                value: true
            },
            type: {
                type: String,
                value: null
            },
            title: {
                type: String,
                value: null
            },
            icon: {
                type: String,
                value: null
            },
            color: {
                type: String,
                value: null
            },
            count: {
                type: String,
                value: null
            },
            api: {
                type: String,
                value: null
            },
            _data: {
                type: Array,
                value: new Array()
            },
            _enableViewAll: {
                type: Boolean,
                value: false
            }
        },

        ready: function () {
            this._bindData();
        },

        _bindData: function () {
            if (this.type) {
                var url = "deltatre.forge.wcm/api/" + this.api + "/working?language=en-us&WorkflowFields.approvalStatus=waiting&limit=5";

                var self = this;

                api.raw(url).then(function (result) {
                    self._data = [];
                    self._parseRequestResult(self, result);
                    self._isDataLoading = false;

                    if (self._data.length >= 5)
                        self._enableViewAll = true;
                }, function () {
                    self._data = [];
                    self._isDataLoading = false;
                    self._enableViewAll = false;
                });
            }
        },

        _parseRequestResult: function (self, result) {
            for (var i = 0; i < result.length; i++) {
                var item = result[i];

                var entityType = null;

                if (item.EntityType === "customentity")
                    entityType = item.EntityCode;
                else
                    entityType = item.EntityType;

                self.push('_data', new EntityModel(item.Title, ForgeWebComponents.Helpers.EntityHelper.createLink(entityType, item.EntityId, item.Id),
                    item.LastUpdateUser, item.LastUpdateDate));
            }
        },

        _openItem: function (e) {
            var url = e.target.href;

            if (url)
                location.href = url;
        },

        _viewAll: function (e) {
            var query = { };
            query["WorkflowFields.approvalStatus"] = "waiting";

            var href = ForgeWebComponents.Helpers.EntityHelper.createSearchLink(this.type, query);

            if (href) 
                location.href = href;
        }
    });
})();