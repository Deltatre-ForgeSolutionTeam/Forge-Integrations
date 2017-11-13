(function () {

    var api = ForgeWebComponents.Api;

    function createImagePickedEvent(image) {
        return new CustomEvent('image-picked', { detail: { image: image } });
    }

    function createImageRemovedEvent(image) {
        return new CustomEvent('image-removed', { detail: { image: image } });
    }

    function Image() {
        this._entityId = null;
        this.type = null;
    }

    Polymer({
        is: "image-picker",
        behaviors: [
            ForgeWebComponents.Behaviors.ForgeLocalizeBehavior
        ],
        properties: {
            image: {
                type: Object,
                value: new Image(),
                observer: "_imageChanged"
            },
            published: {
                type: Boolean,
                value: true,
                observer: "_publishedChanged"
            },
            searchImageName: {
                type: String
            },
            searchResult: {
                type: Object
            },
            translationId: {
                type: String,
                value: null
            },
            thumbnailUrl: {
                type: String,
                value: null
            }
        },

        ready: function () {
            if (this.image._entityId != null &&
                this.image.type != null)
                this._loadExistingData();
        },

        _imageChanged: function (newValue, oldValue) {
            if (newValue === null)
                this.image = new Image();
        },

        _publishedChanged: function (newValue, oldValue) {
            if (this.published === null)
                this.published = true;
        },

        _searchData: function () {
            this.searchResult = null;

            var url = "/deltatre.forge.wcm/api/photos/working?language=nd-nd&terms=";

            url = this.searchImageName ? url + encodeURI(this.searchImageName) : url;

            var self = this;

            api.raw(url).then(function (result) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        result[i].thumbnailUrl = ForgeWebComponents.Helpers.EntityHelper.createThumbnailUrl(result[i].EntityType, result[i].Id);
                    }
                }

                self.searchResult = result;
            }, function () {
                self.searchResult = [];
            });
        },

        _startData: function () {
            this.searchResult = null;

            var url = "/deltatre.forge.wcm/api/photos/working?language=nd-nd&limit=10";

            var self = this;

            api.raw(url).then(function (result) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        result[i].thumbnailUrl = ForgeWebComponents.Helpers.EntityHelper.createThumbnailUrl(result[i].EntityType, result[i].Id);
                    }
                }

                self.searchResult = result;
            }, function () {
                self.searchResult = [];
            });
        },

        _loadExistingData: function () {
            var url = "/deltatre.forge.wcm/api/photos/working/culture/nd-nd/entityid/";

            url = this.image._entityId ? url + encodeURI(this.image._entityId) : null;

            if (url != null) {
                var self = this;

                api.raw(url).then(function (result) {
                    if (result != null) {
                        self.set("translationId", result.Id);
                        self.set("thumbnailUrl", ForgeWebComponents.Helpers.EntityHelper.createThumbnailUrl(self.image.type, result.Id));
                    }
                }, function () {
                    console.log("Image's data cannot be refreshed.")
                });
            }
        },

        _chooseImage: function () {
            this._startData();
            this._openDialog();
        },

        _searchChanged: function () {
            this._searchData();
        },

        _pickImageFromSearch: function (e) {
            this.image = new Image();

            var photoIndex = e.model.index;

            var pickedImage = this.searchResult[photoIndex];

            this.translationId = pickedImage.Id;
            this.image._entityId = pickedImage.EntityId;
            this.image.type = pickedImage.EntityType;
            this.thumbnailUrl = pickedImage.thumbnailUrl;

            this._closeDialog();

            this._callImagePicked(this.image);
        },

        _editPickedImage: function () {
            this._startData();
            this._openDialog();
        },

        _removePickedImage: function () {
            this._callImageRemoved(this.image);
            this._clear();
        },

        _goToPhotoDetails: function () {
            var link = ForgeWebComponents.Helpers.EntityHelper.createLink(this.image.type, this.image._entityId, this.translationId);

            window.location.href = link;
        },

        _openDialog: function () {
            this.$.searchModal.open();
        },

        _closeDialog: function () {
            this.$.searchModal.close();
        },

        _checkPublished: function () {
            var retValue = true;

            if (this.published === null)
                retValue = false;
            else
                retValue = this.published;

            return retValue;
        },

        _clear: function () {
            this.image = null;
            this.thumbnailUrl = null;
            this.published = null;
            this.searchImageName = null;
            this.searchResult = null;
        },

        _callImagePicked: function (imagePicked) {
            this.dispatchEvent(createImagePickedEvent(imagePicked));
            //this._clear();
        },

        _callImageRemoved: function (imageRemoved) {
            this.dispatchEvent(createImageRemovedEvent(imageRemoved));
            this._clear();
        }
    });
})();