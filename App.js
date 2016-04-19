Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
   

    launch: function(){
		console.log("First app");
		this._loadData();
    },

    //Get Data from rally
    _loadData: function(){
    	var myStore = Ext.create('Rally.data.wsapi.Store', {
    model: 'User Story',
    autoLoad: true,
    listeners: {
        load: function(myStore, myData, success) {
        console.log("got data!!", myStore, myData, success);
        this._loadGrid(myStore);
	
        },
        scope: this
    },
    fetch: ['FormattedID','Name', 'ScheduleState']
});
    },


    //Create and show Grid of given stories
    _loadGrid: function(myStoryStore){
    		var myGrid = Ext.create('Rally.ui.grid.Grid', {
			store: myStoryStore,
 			columnCfgs: [
             'FormattedID', 'Name','ScheduleState'
             ]
			});

		this.add(myGrid);
    }


});
