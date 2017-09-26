(function () {
    "use strict";

    var api = ForgeWebComponents.Api;

    function EntityModel() {
        this.title = null;
        this.type = null;
        this.url = null;
        this.icon = null;
        this.last_update_user = null;
        this.last_update_date = null;
    }

    Polymer({
        is: "review-dashboard",
        properties: {
            _isDataLoading: {
                type: Boolean,
                value: true
            },
            _isDataReady: {
                type: Boolean,
                value: false
            },
            _data: {
                type: Array,
                value: new Array()
            }
        },

        ready: function () {
            this._bindData();
        },

        _bindData: function () {
            var url = "deltatre.forge.wcm/api/stories/working?language=en-us&stage=unpublished&Workflows.WorkflowStatus=waiting";

            var self = this;

            self._isDataLoading = true;
            self._isDataReady = false;

            api.raw(url).then(function (result) {
                self._data = [];
                self._parseRequestResult(self, result);
                self._isDataLoading = false;
                self._isDataReady = true;
            }, function () {
                self._data = [];
                self._isDataLoading = true;
                self._isDataReady = false;
            });
        },

        _parseRequestResult: function (self, result) {
            for (var i = 0; i < result.length; i++) {
                var item = result[i];

                var newItem = new EntityModel();
                newItem.title = item.Title;
                newItem.type = item.EntityType;
                newItem.url = ForgeWebComponents.Helpers.EntityHelper.createLink(item.EntityType, item.EntityId, item.Id);
                newItem.icon = ForgeWebComponents.Helpers.EntityHelper.getEntityIcon(item.EntityType);
                newItem.last_update_user = item.LastUpdateUser;
                newItem.last_update_date = item.LastUpdateDate;

                self.push('_data', newItem);
            }
        },

        _openItem: function (e) {
            var url = e.target.href;

            if (url)
                location.href = url;
        }
    });
})();