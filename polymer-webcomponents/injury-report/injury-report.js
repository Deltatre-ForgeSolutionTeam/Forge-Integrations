(function () {

    const REFERENCE_FIELD_NAME = "injuryReportPlayers";

    var _first_loading = true;

    function InjuryReport() {
        this.playerList = [];
    }

    function InjuryDays() {
        this.days = [];
        this.days.push("Monday")
        this.days.push("Tuesday")
        this.days.push("Wednesday")
        this.days.push("Thursday")
        this.days.push("Friday")
        this.days.push("Saturday")
    }

    function InjuryDaysStatus() {
        this.status = [];

        this.status.push("Not Listed");
        this.status.push("Did Not Participate");
        this.status.push("Limited Participation");
        this.status.push("Full Participation");
        //this.status.push("Out");
    }

    function GameStatus() {
        this.status = [];
        this.status.push("NOT_LISTED");
        this.status.push("QUESTIONABLE");
        this.status.push("DOUBTFUL");
        this.status.push("OUT");
    }


    function Player(player) {
        
        const entityType = player.EntityCode ? player.EntityType + "." + player.EntityCode : player.EntityType;

        this.entityId = player.EntityId;
        this.translationId = player.Id;
        this.title = player.Title;
        this.thumbnail = ForgeWebComponents.Helpers.EntityHelper.createThumbnailUrl(entityType, player.Id);
        this.unpublished = null;
        this.link = ForgeWebComponents.Helpers.EntityHelper.createLink(entityType, player.EntityId, player.Id);
        this.days = [];
        this.gameStatus = null;
        this.injuryDescription = null;
        this.personId = player.ExtendedFields.personId;
    };

    function PlayerDayReport(day, status) {
        this.day = day;
        this.status = status;
    }

    Polymer({
        is: "injury-report",
        properties: {
            value: {
                type: Object,
                value: new InjuryReport(),
                observer: '_valueChanged'
            },
            label: {
                type: String
            },
            fieldName: {
                type: String
            },
            schema: {
                type: Object
            },
            disabled: {
                type: Boolean,
                value: false
            },
            injuryDays: {
                type: Object,
                value: new InjuryDays()
            },
            injuryDaysStatus: {
                type: Object,
                value: new InjuryDaysStatus()
            },
            injuryGameStatus: {
                type: Object,
                value: new GameStatus()
            }
        },


        ready: function () {

        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value = new InjuryReport();
        },

        _addPlayer: function () {
            this.$.searchPlayers.open();
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _playerSelected: function (e) {
            const player = e.detail.player;


            var playerAlreadyInserted = this.value.playerList.find(function(pl){
                if(pl.entityId === player.EntityId){
                    return pl;
                }
            });

            if (playerAlreadyInserted) {
                // show warning
                toastWarningPlayerInserted.open();
                return;
            }

            var playerEntity = new Player(player);

            this.push("value.playerList", playerEntity);
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);

        },

        _getDayValue: function (day, playerIndex) {

            var insertedDay = this.value.playerList[playerIndex].days.find(function (d) {
                if (d.day === day) {
                    return d;
                }
            });

            if (insertedDay) {
                return insertedDay.status;
            }
        },

        _getStatusValue : function(playerIndex){
            return this.value.playerList[playerIndex].gameStatus ? this.value.playerList[playerIndex].gameStatus : null;
        },

        _itemSelected: function (e) {            
            var day = e.target.attributes.day.value;
            var playerIndex = e.model.dataHost.playerIndex;
            var status = e.target.value;
            var path = "value.playerList." + playerIndex + ".days";


            if (day === 'game-status') {
                this.value.playerList[playerIndex].gameStatus = status;
            } else {

                var insertedDay = this.value.playerList[playerIndex].days.find(function (d) {
                    if (d.day === day) {
                        return d;
                    }
                });

                if (insertedDay) {
                    insertedDay.status = status;
                } else {
                    var day = new PlayerDayReport(day, status);
                    this.push(path, day);
                }
            }
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _onInjuryDescriptionInput: function () {
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 2000);
        },

        _onInjuryDescriptionChange: function () {
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _deletePlayer: function(e){
            var playerIndex = e.model.playerIndex;
            var path = 'value.playerList';
   
            var removedPlayer = this.splice(path, playerIndex,1);
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
            
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
        },
    });
})();