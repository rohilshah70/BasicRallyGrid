Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
   

    launch: function(){
		console.log("First app");

		this.pulldownContainer = Ext.create('Ext.container.Container', {

			layout: {
				type: 'hbox',
				align: 'stretch'
			}
		});

		this.add(this.pulldownContainer);
		this._loadRelease();
    },


    //Load Iteration
    _loadIterations: function(){
    	this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
    		FieldLabel: 'Iteration',
    		labelAlign: 'right', 
    		width: 350,
    		listeners: {
    			ready: function(combobox){
    				this._loadData();
    				//this._loadSeverity();
    			},
    			select: function(combobox, records){
    				this._loadData();
    			},
    			scope: this
    		}
    	});

    	//this.pulldownContainer.add(this.iterComboBox);
    },


_loadRelease: function(){
    	this.releaseComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
    		model: 'User Story',
    		field: 'Release',
    		fieldLabel: 'Release',
    		labelAlign: 'right',
    		listeners: {
    			ready: function(combobox){
    				//this._loadData();
    				this._loadState();
    			},
    			select: function(combobox, records){
    				this._loadData();
    			},
    			scope: this
    		}
    	});

    	this.pulldownContainer.add(this.releaseComboBox);
    },



    _loadState: function(){
    	this.stateComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
    		model: 'User Story',
    		field: 'ScheduleState',
    		fieldLabel: 'State',
    		labelAlign: 'right',
    		listeners: {
    			ready: function(combobox){
    				this._loadData();
    			},
    			select: function(combobox, records){
    				this._loadData();
    			},
    			scope: this
    		}
    	});

    	this.pulldownContainer.add(this.stateComboBox);
    },

/*_loadSeverity: function(){
    	this.severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
    		model: 'Defect',
    		field: 'Severity',
    		fieldLabel: 'Severity',
    		labelAlign: 'right',
    		listeners: {
    			ready: function(combobox){
    				this._loadData();
    			},
    			select: function(combobox, records){
    				this._loadData();
    			},
    			scope: this
    		}
    	});

    	//this.pulldownContainer.add(this.severityComboBox);
    },*/

    //Get Data from rally
    _loadData: function(){

    	//var selectedIterRef = this.iterComboBox.getRecord().get("_ref");
    	//var severityValue = this.severityComboBox.getRecord().get("value");
    	var releaseValue = this.releaseComboBox.getRecord().get("name");
    	var stateValue = this.stateComboBox.getRecord().get("value");

		var myFilters =[
        {
            property: 'Release.Name',
            operation: '=',
            value: releaseValue
        },
         {
            property: 'Project.Name',
            operation: '=',
            value: 'Mobile Team'
        },
        {
            property: 'ScheduleState',
            operation: '=',
            value: stateValue
        },
        
    	];

    //if store exist, just load new data
    if(this.defaultStore){

    	this.defaultStore.setFilter(myFilters);
    	this.defaultStore.load();
    }
    else{
    //create store
    this.defaultStore = Ext.create('Rally.data.wsapi.Store', {
    model: 'User Story',
    autoLoad: true,
    filters: myFilters,
    listeners: {
        load: function(myStore, myData, success) {
        console.log("got data!!", myStore, myData, success);
        if(!this.myGrid)
        this._createGrid(myStore);
	
        },
        scope: this
    },
    fetch: ['FormattedID','Name', 'Project', 'Release', 'ScheduleState']
});
}
    },


    //Create and show Grid of given stories
    _createGrid: function(myStoryStore){
    		this.myGrid = Ext.create('Rally.ui.grid.Grid', {
			store: myStoryStore,
 			columnCfgs: [
             'FormattedID', 'Name', 'ScheduleState'
             ]
			});

		this.add(this.myGrid);
    }


});
