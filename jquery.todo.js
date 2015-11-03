(function ( $ ) {

	$.fn.todolist = function( settings ){

		$.extend(true, $.fn.todolist.defaults, settings);

		var data = JSON.parse( localStorage.getItem("todoData") );
		var defaults = $.fn.todolist.defaults;

		this.find( defaults.todoTask ).draggable();

		$(this).find( defaults.formId + " :button" ).on('click', );

		return this;
	};
	/*
	 * TODO default variable.
	 */
	$.fn.todolist.defaults = {
		todoTask: ".todo-task",
		todoHeader: "task-header",
		todoDate: "task-date",
		todoDescription: "task-description",
		taskId: "task-",
		formId: "#todo-form",
		dataAttribute: "data",
		deleteDiv: "delete-div",
		codes:  {
			"1": "#pending",
			"2": "#inProgress",
			"3": "#completed"
		}
	};
	/*
	 * TODO function to add todo item.
	 */
	$.fn.todolist.add = function( params ){
		var code  = $.fn.todolist.defaults.codes;
		var defaults = $.fn.todolist.defaults;
		var parent = $( code[params.code] ), wrapper;

		if( !parent ) return;

		wrapper = $("<div/>", {
			"class" : defaults.todoTask.replace('.', ''),
			"id" : defaults.taskId + params.id,
			"data" : params.id
		}).appendTo(parent);

		$("<div/>", {
			"class" : defaults.todoHeader,
			"text" : params.title,
		}).appendTo(wrapper);

		$("<div/>", {
			"class": defaults.todoDate,
			"text": params.date
		}).appendTo(wrapper);

		$("<div/>", {
			"class": defaults.todoDescription,
			"text": params.description,
		}).appendTo(wrapper);
	};

	/*
	 * TODO function to remove todo item.
	 */
	$.fn.todolist.destroy = function( params ){
		$("#" + $.fn.todolist.defaults.taskId + params.id).remove();
	};

	function addTask(event) {
		event.preventDefault();
		/* Act on the event */
		var inputs = $( defaults.formId + " :input"),
    	errorMessage = "Title can not be empty",
      	id, title, description, date, tempData;

		if (inputs.length !== 4)  return;

		title = inputs[0].value;
		date = inputs[1].value;
		description = inputs[2].value;

		if (!title) {
		    debug(errorMessage); // add error message in form later
		    return;
		}

	  	id = new Date().getTime();

	  	tempData = {
	    	id : id,
	    	code: "1",
	    	title: title,
	    	date: date,
	    	description: description
	  	};

	  	data[id] = tempData;
	  	localStorage.setItem("todoData", JSON.stringify(data));
	  	// Add todo Item in list.
	  	$.fn.todolist.add( tempData );

	  	// Reset Form
		inputs[0].value = "";
		inputs[1].value = "";
		inputs[2].value = "";
	}
	//Keep Private Functions Private
	function debug( obj ){
		if ( window.console && window.console.log ) {
			window.console.log("Todo pluign counts: " + obj.length);
			window.console.log("Todo pluign message: " + obj);
		};
	}
}(jQuery));
