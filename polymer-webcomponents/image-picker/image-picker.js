(function () {

    var api = ForgeWebComponents.Api;

    function createImagePickedEvent(image) {
        return new CustomEvent('image-picked', { detail: { image: image } });
    }

    function createImageRemovedEvent(image) {
        return new CustomEvent('image-removed', { detail: { image: image } });
    }

    function Image() {
        this.id = null;
        this.entityId = null;
        this.entityType = null;
        this.thumbnailUrl = null;
        this.title = null;
        this.fileName = null;
        this.published = true;
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
            searchImageName: {
                type: String
            },
            searchResult: {
                type: Object
            }
        },

        ready: function () {
            if (this.image != null &&
                this.image.id != null)
                this._refreshData();
        },

        _imageChanged: function (newValue, oldValue) {
            if (newValue == null)
                this.image = new Image();
        },

        _searchData: function () {
            var url = "/deltatre.forge.wcm/api/photos/working?language=en-us&terms=";

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

        _refreshData: function () {
            var url = "/deltatre.forge.wcm/api/photos/working/";

            url = this.image.id ? url + encodeURI(this.image.id) : null;

            if (url != null) {
                var self = this;

                api.raw(url).then(function (result) {
                    if (result != null) {
                        var imageDataRefreshed = result;

                        if (self.image.title != imageDataRefreshed.Title)
                            self.set("image.title", imageDataRefreshed.Title);

                        if (self.image.thumbnailUrl != ForgeWebComponents.Helpers.EntityHelper.createThumbnailUrl(self.image.entityType, self.image.id))
                            self.set("image.thumbnailUrl", ForgeWebComponents.Helpers.EntityHelper.createThumbnailUrl(self.image.entityType, self.image.id));

                        if (self.image.fileName != imageDataRefreshed.OriginalFileName)
                            self.set("image.fileName", imageDataRefreshed.OriginalFileName);

                        var refreshedStage = imageDataRefreshed.Stage == "published" ? true : false;

                        if (self.image.stage != refreshedStage)
                            self.set("image.published", refreshedStage);
                    }
                }, function () {
                    console.log("Image's data cannot be refreshed.")
                });
            }
        },

        _chooseImage: function () {
            this._openDialog();
        },

        _searchChanged: function () {
            this._searchData();
        },

        _pickImageFromSearch: function (e) {
            this.image = new Image();

            var photoIndex = e.model.index;

            var pickedImage = this.searchResult[photoIndex];

            this.image.id = pickedImage.Id;
            this.image.entityId = pickedImage.EntityId;
            this.image.entityType = pickedImage.EntityType;
            this.image.thumbnailUrl = pickedImage.thumbnailUrl;
            this.image.title = pickedImage.Title;
            this.image.fileName = pickedImage.OriginalFileName;
            this.image.published = pickedImage.Stage === "published" ? true : false;

            this._closeDialog();

            this._callImagePicked(this.image);
        },

        _editPickedImage: function () {
            this._openDialog();
        },

        _removePickedImage: function () {
            this._callImageRemoved(this.image);
            this._clear();
        },

        _openDialog: function () {
            this.$.searchModal.open();
        },

        _closeDialog: function () {
            this.$.searchModal.close();
        },

        _clear: function () {
            this.image = null;
            this.searchImageName = null;
            this.searchResult = null;
        },

        _callImagePicked: function (imagePicked) {
            this.dispatchEvent(createImagePickedEvent(imagePicked));
            this._clear();
        },

        _callImageRemoved: function (imageRemoved) {
            this.dispatchEvent(createImageRemovedEvent(imageRemoved));
            this._clear();
        }
    });
})();