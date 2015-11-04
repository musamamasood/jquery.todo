var data = ( localStorage.getItem("todoData") ) ? JSON.parse( localStorage.getItem("todoData") ) : {};

(function ( data, $ ) {

	$.fn.todolist = function( settings ){

		$.extend(true, $.fn.todolist.defaults, settings);
		// Retrive task from localstorage.
		$.each(data, function(index, object) {
			$.fn.todolist.add( object );
		});
		var defaults = $.fn.todolist.defaults;
		var codes = $.fn.todolist.defaults.codes;

		this.find( defaults.todoTask ).draggable();
		this.find( defaults.formId + " :input" ).eq(1).datepicker();
		// Adding drop function to each category of task
		$.each(codes, function(index, value) {
		  $(value).droppable({
		    drop: function(event, ui) {
		      var element = ui.helper,
		          css_id = element.attr("id"),
		          id = css_id.replace(defaults.taskId, ""),
		          object = data[id];

		      // Removing old element
		      $.fn.todolist.destroy( object );

		      // Changing object code
		      object.code = index;

		      // Generating new element
		      $.fn.todolist.add( object );

		      // Updating Local Storage
		      data[id] = object;
		      localStorage.setItem("todoData", JSON.stringify(data));

		      // Hiding Delete Area
		      $( defaults.deleteDiv ).hide();
		    }
		  });
		});
		// Added drop functionality to delete div
		$(this).find( defaults.deleteDiv ).droppable({
			drop: function(event, ui) {
		      var element = ui.helper,
		          css_id = element.attr("id"),
		          id = css_id.replace(defaults.taskId, ""),
		          object = data[id];

		      // Remove object from tasklist
		      $.fn.todolist.destroy( object );

		      // Updating Local Storage
		      delete data[id];
		      localStorage.setItem("todoData", JSON.stringify(data));

		      // Hiding Delete Area
		      $( defaults.deleteDiv ).hide();
		    }
		});

		$(this).find( defaults.formId + " :button" ).on('click', addTask);
		$(this).find( ".btn-danger" ).on('click', function(){
			$.each(data, function(index, val) {
			  	var object = data[val.id];
				$.fn.todolist.destroy( object );
		      	delete data[val.id];
		      	localStorage.setItem("todoData", JSON.stringify(data));
				$( defaults.deleteDiv ).hide();
			});
		});

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
		deleteDiv: "#delete-div",
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
		var defaults = $.fn.todolist.defaults;
		var parent = $( $.fn.todolist.defaults.codes[params.code] ), wrapper;

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

		wrapper.draggable({
		    start: function() {
		      $( defaults.deleteDiv ).show();
		    },
		    stop: function() {
		      $( defaults.deleteDiv ).hide();
		    }
		});
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
		var defaults = $.fn.todolist.defaults;
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
}(data, jQuery));
