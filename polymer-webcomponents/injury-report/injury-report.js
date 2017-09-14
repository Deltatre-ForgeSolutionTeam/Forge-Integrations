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
        this.status.push("Out");
    }

    function GameStatus() {
        this.status = [];
        this.status.push("Not Listed");
        this.status.push("Questionable");
        this.status.push("Doubtful");
        this.status.push("Out");
    }


    /*
        function ReferenceFieldItemsCommandBody(entityId, translationId, aggregateType, fieldName, refEntityId, refEntityType) {
            this.aggregateId = entityId;
            this.translationId = translationId;
            this.aggregateType = aggregateType;
            this.fieldName = fieldName;
            this.referencedItems = [
                {
                    entityType: refEntityType,
                    entityId: refEntityId
                }
            ];
        }
    
        function AddReferenceFieldItemsCommand(entity, player) {
    
            const entityType = player.EntityCode ? player.EntityType + "." + player.EntityCode : player.EntityType;
    
            this.commandName = "AddReferenceFieldItemsCommand";
            this.commandBody = new ReferenceFieldItemsCommandBody(entity.entityId, entity.id, entity.fullTypeName || entity.type, REFERENCE_FIELD_NAME, player.EntityId, entityType);
    
        }
    
        function RemoveReferenceFieldItemsCommand(entity, player) {
    
            this.commandName = "RemoveReferenceFieldItemsCommand";
            this.commandBody = new ReferenceFieldItemsCommandBody(entity.entityId, entity.id, entity.fullTypeName || entity.type, REFERENCE_FIELD_NAME, player.entityId, player.type);
    
        }*/

    function Player(player) {

        const entityType = player.EntityCode ? player.EntityType + "." + player.EntityCode : player.EntityType;

        this.entityId = player.EntityId;
        this.translationId = player.Id;
        this.title = player.Title;
        this.thumbnail = null;
        this.unpublished = null;
        this.link = ForgeWebComponents.Helpers.EntityHelper.createLink(entityType, player.EntityId, player.Id);
        this.days = [];
        this.gameStatus = null;
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
            entity: {
                type: Object,
                observer: '_entityChanged'
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
            console.log("ready");



        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value = new InjuryReport();
        },

        _entityChanged: function (entity, oldValue) {

            if (!entity || typeof entity === 'string') return;

            console.log(entity);

            /*
            const array = entity.referenceFields[REFERENCE_FIELD_NAME] || [];
            this._players = {};
            for (var i = 0; i < array.length; i++) {
                var player = array[i];
                this._players[player.entityId] = new PlayerReference(player.entityId, player.id, player.title, player.type, player.stage, player.thumbnailUrl);
            }*/

        },

        _addPlayer: function () {
            this.$.searchPlayers.open();
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _playerSelected: function (e) {
            const player = e.detail.player;

            const playerAlreadyInserted = this.value.playerList.indexOf(player.EntityId) > -1;
            if (playerAlreadyInserted) {
                // show warning
                toastWarningPlayerInserted.open();
                return;
            }

            var playerEntity = new Player(player);

            this.push("value.playerList", playerEntity);


            //const command = new AddReferenceFieldItemsCommand(this.entity, player, this.fieldName);
            //this.fire('sendCommand', command);

            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
            console.log(this.value);

        },

        _getDayValue: function (day, playerIndex) {

            var insertedDay = this.value.playerList[playerIndex].days.find(function (d) {
                if (d.day === day) {
                    return d;
                }
            });

            if (insertedDay) {
                return insertedDay.status;
            } else {
                return "Not Listed";
            }
        },

        _getStatusValue : function(playerIndex){
            return this.value.playerList[playerIndex].gameStatus ? this.value.playerList[playerIndex].gameStatus : "Not Listed";
        },

        _itemSelected: function (e) {

            console.log('item selected');
            
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

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
            console.log(this.value);
        },
    });
})();