(function () {

    Polymer({
        is: "player-card",
        behaviors: [
            ForgeWebComponents.Behaviors.ForgeLocalizeBehavior
        ],
        properties: {
            player: {
                type: Object,
                observer: '_playerChanged',
                value: null
            }
        },

        ready: function () {

        },

        _playerChanged: function (player, oldPlayer) {
            if (!player) return;
        },

        _delete: function () {
            this.dispatchEvent(new CustomEvent('delete-player', {
                detail: {
                    player: this.player
                }
            }));
        },

        _getPlayerThumbnail: function (player) {
            var retValue = null;

            if (player.type != null &&
                player.id != null)
                retValue = ForgeWebComponents.Helpers.EntityHelper.createThumbnailUrl(player.type, player.id);

            return retValue;
        },

        _getPlayerLink: function (player) {
            var retValue = null;

            if (player.type != null &&
                player.id != null &&
                player.entityId != null)
                retValue = ForgeWebComponents.Helpers.EntityHelper.createLink(player.type, player.entityId, player.id)

            return retValue;
        },

        _getPlayerPublished: function (player) {
            var retValue = true;

            if (player.stage != "published")
                retValue = false;

            return retValue;
        }
    });

})();