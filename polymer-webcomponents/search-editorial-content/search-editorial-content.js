(function () {

    var api = ForgeWebComponents.Api;

    function createContentSelectedEvent(content) {
        return new CustomEvent('content-selected', { detail: { editorialContent: content } });
    }


    function enrichResultItems(result){
        for(var i =0; i < result.length; i++){
            var item = result[i];
            var type = item.EntityType;
            if(item.EntityType == "customentity"){
                type = item.EntityType + '.' + item.EntityCode;
            }

            item.thumbnailUrl =  ForgeWebComponents.Helpers.EntityHelper.createThumbnailUrl(type, item.Id);
        }
        return result;
    }

    Polymer({
        is: "search-editorial-content",
        properties: {
            search: {
                type: String,
                notify: true,
                observer: '_searchChanged'
            },
            editorialTypeContent: {
                type: Object,
                value: {}
            }
        },


        ready: function () {
            this.search = null;
            this._results = [];
            this._selectedContent = null;
        },

        _getData: function () {
            var url = "deltatre.forge.wcm/api/stories/working?language=en-us&stage=published&terms=";

            if (this.editorialTypeContent.typeContent === "video") {
                url = "deltatre.forge.wcm/api/customEntities/video/working?language=en-us&stage=published&terms=";
            }

            url = this.search ? url + encodeURI(this.search) : url;

            var self = this;

            self._hideLoading = false;

            api.raw(url).then(function (result) {
                self._hideLoading = true;
                self._results = enrichResultItems(result);
            }, function () {
                self._hideLoading = true;
                self._results = [];
                console.error(arguments);
            });

        },

        _searchChanged: function () {
            this.debounce('_searchChangedDebouce', this._getData, 500);
        },

        _select: function (e) {
            var item = e.model.item;
            this._selectedContent = item;
        },
        _selectAndConfirm: function (e) {
            this.$.searchModal.close();
            this.dispatchEvent(createContentSelectedEvent(this._selectedContent));
            this._selectedContent = null;
            this.search = null;
            this._results = [];
    
        },

        _onSearchModalClose: function (e) {
            if (e.detail.confirmed) {
                this.dispatchEvent(createContentSelectedEvent(this._selectedContent));
                this._selectedContent = null;
                this.search = null;
                this._results = [];
            }
        },

        open: function (editorialTypeContent) {
            this.editorialTypeContent = editorialTypeContent;
            this.search = null;
            this._selectedContent = null;
            this._getData();
            this.$.searchModal.open();
        }
    });

})();