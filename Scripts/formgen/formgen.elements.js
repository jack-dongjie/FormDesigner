var target = $('body');
var defs = {
	'anchor':{
		'tag':'<a></a>',
		'html':'Link',
		'iconClass':'href',
		'props':{
			'href':'#',
		}
	},
	'textline':{
		'tag':'<input type="text" />',
		'iconClass':'text-line',
		'label':'',
		'props':{
		}
	},
	'Label':{
		'tag':'<label></label>',
		'html':'Label',
		'iconClass':'label',
		'props':{
		}
	}
};

function initElements(){	
	for(elem in defs){
		//var icon = $('<span class="icon '+defs[elem].iconClass+'" create_action="createElement" type="'+elem+'"></span>');
		//$(icon).appendTo('#elements');
	}
	
	$('.icon').draggable({ 
		revert: false, 
		helper: "clone" ,
		containment: "#stage",
		cursor: "move",
		cursorAt: {left: -10, top: 10},
		stop: function(event, ui) {
			eval($(this).attr('create_action')+'("'+$(this).attr('type')+'");');
		},
		helper: function( event ) {
			return $( "<div class='tooptip'>"+$(this).attr('type')+"</div>" );
		}
	});
}

function createElement(element){
	var elObj = defs[element];

	var newElem = $(elObj.tag);
	if(elObj.html!='')
		newElem.html(elObj.html);
	
	for(prop in elObj.props){
		newElem.attr(prop, elObj.props[prop]);
	}
	newElem.addClass('form-element');
	var container = $('<div style="position:relative; padding-top:5px; display:inline;"></div>').appendTo($(target));
	var moveHandle = $('<div class="handle"></div>').appendTo($(container));
	newElem.appendTo($(container));
	
	newElem.on('mousedown', function(e){
		if(e.button == 2) {
			editElement(newElem, elObj);
			return false; 
		}
	});
	
	container.on('mouseover', function(){
		moveHandle.css({
			'left':newElem.width()+'px',
			'top':newElem.height()/2+'px'
		});
		moveHandle.fadeIn(300);
	});
	container.on('mouseleave', function(){
		setTimeout(function(){
			moveHandle.hide();
		}, 500)
		
	});
	
	$(container).draggable({ 
		revert: false, 
		helper: "clone",
		handle: $(moveHandle),
		containment: "#stage",
		cursor: "move",
		cursorAt: {left: newElem.width()+10, top: 10},
		cancel: null,
		stop: function(event, ui){
			moveElement(newElem, target);
		}
	});
	
	editElement(newElem, elObj);
}

function editElement(target, elObj) {
    debugger;
	var props = new Array;

	properties = $('<div id="prop-form" title="Properties"></div>');
	propForm = $('<form></form>');
	
	var openForm = false; /*open the properties windows if we have more than one input*/

	if(typeof elObj.html!='undefined'){
		$('<textarea id="html">'+target.html()+'</textarea>').appendTo($(propForm));
		openForm = true;
	}
	
	/*If the element can have a label
	if(typeof elObj.label!='undefined'){
		$('<input class="elem-prop" id="elementLabel" placeholder="Label" />').appendTo($(propForm));
	}*/
	
	for (prop in elObj.props){
		$('<input class="elem-prop" id="'+prop+'" value="'+target.attr(prop)+'" />').appendTo($(propForm));
		openForm = true;
	}
	
	if(!openForm) return false;
	
	$(propForm).appendTo($(properties));
	$(properties).appendTo('body');
	
	$(function() {
		$( "#prop-form" ).dialog({
			modal: true,
			buttons: {
				"Ok": function() {
					if(typeof $('#html').val()!='undefined')
						target.html($('#html').val());
					$('.elem-prop').each(function(){
						target.attr($(this).attr('id'), $(this).val());
					});
					$( this ).dialog("close");
				}
			},
			close: function() {
				$('#prop-form').remove();
			}
		});
	});
}

function moveElement(element, target){
	$(element).parent().appendTo($(target));
}

initElements();