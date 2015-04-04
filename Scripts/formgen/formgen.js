(function ($) {
    var myApp = angular.module('myApp', []);
    myApp.controller('FormToolBox', ['$scope', '$http', function ($scope, $http) {
        debugger;
        var target = $('body');
        $scope.defs = [

                        {
                            'type': 'Label',
                            'tag': '<label></label>',
                            'html': 'Label',
                            'icon': 'new_label.png',
                            'props': {
                            }
                        },
                        {
                            'type': 'Image',
                            'tag': '<img></img>',
                            'html': 'Image',
                            'icon': 'new_image.png',
                            'props': {
                            }
                        },
                        {
                            'type': 'InputText',
                            'tag': '<input type="text" />',
                            'icon': 'new_text.png',
                            'label': 'InputText',
                            'props': {
                            }
                        },
                        {
                            'type': 'Password',
                            'tag': '<input type="password" />',
                            'html': 'Password',
                            'icon': 'new_password.png',
                            'props': {
                            }
                        },
                        {
                            'type': 'Link',
                            'tag': '<a></a>',
                            'html': 'Link',
                            'icon': 'new_link.png',
                            'props': {
                                'href': '#',
                            }
                        },
                        {
                            'type': 'Textarea',
                            'tag': '<textarea />',
                            'html': 'TextArea',
                            'icon': 'new_textarea.png',
                            'label': '',
                            'props': {
                            }
                        },
                        {
                            'type': 'Radiobutton',
                            'tag': '<input type="radio" />',
                            'html': 'Radiobutton',
                            'icon': 'new_radio.png',
                            'label': '',
                            'props': {
                            }
                        },
                        {
                            'type': 'Checkbox',
                            'tag': '<input type="checkbox" />',
                            'html': 'Checkbox',
                            'icon': 'new_checkbox.png',
                            'label': '',
                            'props': {
                            }
                        },
                        {
                            'type': 'DropDown',
                            'tag': '<Select></Select>',
                            'html': 'Select',
                            'icon': 'new_select.png',
                            'props': {
                            }
                        },
                        {
                            'type': 'List',
                            'tag': '<Select ></Select>',
                            'html': 'List',
                            'icon': 'new_list.png',
                            'props': {
                            }
                        },
                        {
                            'type': 'File',
                            'tag': '<input type="file" />',
                            'icon': 'new_file.png',
                            'label': '',
                            'props': {
                            }
                        },
                        {
                            'type': 'DatePicker',
                            'tag': '<input type="date" />',
                            'html': 'DatePicker',
                            'icon': 'new_date_picker.png',
                            'props': {
                            }
                        },
                        {
                            'type': 'Button',
                            'tag': '<input type="date" />',
                            'html': 'Button',
                            'icon': 'new_button.png',
                            'props': {
                                'href': '#',
                            }
                        },
                        {
                            'type': 'Panel',
                            'tag': '<div />',
                            'html': 'Panel',
                            'icon': 'new_wizard.png',
                            'label': '',
                            'props': {
                            }
                        }

        ];

        function initElements() {
            //for (elem in $scope.defs) {
            //    //var icon = $('<span class="icon '+defs[elem].iconClass+'" create_action="createElement" type="'+elem+'"></span>');
            //    //$(icon).appendTo('#elements');
            //}

            $('.icon').draggable({
                revert: false,
                helper: "clone",
                containment: "#stage",
                cursor: "move",
                cursorAt: { left: -10, top: 10 },
                stop: function (event, ui) {
                    debugger;
                    eval($(this).attr('create_action') + '("' + $(this).attr('type') + '");');
                },
                helper: function (event) {
                    return $("<div class='tooptip'>" + $(this).attr('type') + "</div>");
                }
            });

        }

        function createElement(element) {
            debugger;
            //var elObj = $scope.defs[element];
           
            var elObj = $.grep($scope.defs, function (e) { return e.type == element; })[0];

            var newElem = $(elObj.tag);
            if (elObj.html != '')
                newElem.html(elObj.html);

            for (prop in elObj.props) {
                newElem.attr(prop, elObj.props[prop]);
            }
            newElem.addClass('form-element');
            var container = $('<div style="position:relative; padding-top:5px; display:inline;"></div>').appendTo($(target));
            var moveHandle = $('<div class="handle"></div>').appendTo($(container));
            newElem.appendTo($(container));

            newElem.on('mousedown', function (e) {
                if (e.button == 2) {
                    editElement(newElem, elObj);
                    return false;
                }
            });

            container.on('mouseover', function () {
                moveHandle.css({
                    'left': newElem.width() + 'px',
                    'top': newElem.height() / 2 + 'px'
                });
                moveHandle.fadeIn(300);
            });

            container.on('mouseleave', function () {
                setTimeout(function () {
                    moveHandle.hide();
                }, 500)

            });
            $(container).draggable({
                revert: false,
                helper: "clone",
                handle: $(moveHandle),
                containment: "#stage",
                cursor: "move",
                cursorAt: { left: newElem.width() + 10, top: 10 },
                cancel: null,
                stop: function (event, ui) {
                    moveElement(newElem, target);
                }
            });

            editElement(newElem, elObj);
        }

        function editElement(target, elObj) {
            var props = new Array;

            properties = $('<div id="prop-form" title="Properties"></div>');
            propForm = $('<form></form>');

            var openForm = false; /*open the properties windows if we have more than one input*/

            if (typeof elObj.html != 'undefined') {
                $('<textarea id="html">' + target.html() + '</textarea>').appendTo($(propForm));
                openForm = true;
            }

            for (prop in elObj.props) {
                $('<input class="elem-prop" id="' + prop + '" value="' + target.attr(prop) + '" />').appendTo($(propForm));
                openForm = true;
            }

            if (!openForm) return false;
            $(propForm).appendTo($(properties));
            $(properties).appendTo('body');
            $(function () {
                $("#prop-form").dialog({
                    modal: true,
                    buttons: {
                        "Ok": function () {
                            if (typeof $('#html').val() != 'undefined')
                                target.html($('#html').val());
                            $('.elem-prop').each(function () {
                                target.attr($(this).attr('id'), $(this).val());
                            });
                            $(this).dialog("close");
                        }
                    },
                    close: function () {
                        $('#prop-form').remove();
                    }
                });
            });
        }

        function moveElement(element, target) {
            $(element).parent().appendTo($(target));
        }

        initElements();

        var shade = "#556b2f";
        var settings;
        $.fn.formGen = function (options) {
            settings = $.extend({
                grid: true,
                gridWidth: 2,
                gridHeight: 5
            }, options);

            initIDE($(this));
            return this;
        };

        function initIDE(IDE) {

            jQuery('ul#rbMenu li').draggable(
                {
                    cursor: 'move',
                    helper: 'clone',
                    opacity: '0.5',
                    zIndex: 1000,
                    revert: 'invalid'
                }
            );

            //Toolbar
            var toolbar = $('<div id="toolbar"></div>');
            toolbar.appendTo($(IDE));
            var tableToolbar = '<table id="toolbox">' +
                    '<tbody>' +
                        '<tr>' +
                            '<td>' +
                                '<input type="button" value="Merge" class="button" onclick="redips.merge()" ' +
                                'title="Merge marked table cells horizontally and verically"/>' +
                            '</td>' +
                            '<td>' +
                                '<input type="button" value="|" class="button" onclick="redips.split(\'h\')" ' +
                                'title="Split marked table cell horizontally"/>' +
                                '<input type="button" value="&#9135;&#9135;&#9135;" class="button" onclick="redips.split(\'v\')" ' +
                                'title="Split marked table cell vertically"/>' +
                            '</td>' +
                            '<td>' +
                                '<input type="button" value="Row +" class="button" onclick="redips.row(\'insert\')" title="Add table row"/>' +
                                '<input type="button" value="Row -" class="button" onclick="redips.row(\'delete\')" title="Delete table row"/>' +
                            '</td>' +
                            '<td>' +
                                '<input type="button" value="Col +" class="button" onclick="redips.column(\'insert\')" title="Add table column"/>' +
                                '<input type="button" value="Col -" class="button" onclick="redips.column(\'delete\')" title="Delete table column"/>' +
                            '</td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>';
            $(tableToolbar).appendTo(toolbar);
            //End toolbar

            //Stage
            var stage = $('<div id="stage" style="float:left;"></div>');
            stage.appendTo($(IDE));
            //End stage

            //Elements
            var elements = $('<div id="elements" style="float:left;"></div>');
            elements.appendTo($(IDE));
            //$.getScript('scripts/formgen/formgen.Elements.js')
            //	.done(function (script, textStatus) {
            //	    console.log('Elements Loaded');
            //	})
            //.fail(function (jqxhr, sets, exception) {
            //    console.log(exception);
            //});
            //End Elements

            //Grid
            if (settings.grid) {
                var grid = $('<table id="mainTable" width="100%" border="1" class="resizable"></table>');

                for (i = 0; i < settings.gridHeight; i++) {
                    var row = $('<tr></tr>').appendTo($(grid));
                    for (x = 0; x < settings.gridWidth; x++) {
                        $('<td class="elem-container" id="x' + i + '_' + x + '">&nbsp;</td>').appendTo($(row));
                    }
                }
                $(grid).appendTo($(stage));
                //$('.resizable th div').resizable();

                $scope.initElementContainers($('.elem-container'));
            }
            //End Grid


        }

        $scope.initElementContainers = function (selector) {
            debugger;
            $(selector).droppable(
	          {
	              cursor: 'move',
	              accept: 'ul#rbMenu li',
	              helper: 'clone',
	              opacity: '0.5',
	              drop: function (event, ui) {
	                  debugger;
	                  createElement($(ui.draggable).attr('type'))
	                  //addNewElement(ui, this);
	              }
	          }
	        );
            $(selector).on('mouseover', function () {
                /*
                    Determines element placement.
                */
                target = $(this);
                /*
                    Show spanning controls
                */
                $('#spanningControlsLeft').css({
                    'left': $(this).offset().left + 'px',
                    'top': $(this).offset().top + ($(this).height() / 2) - 5 + 'px',
                });
                $('#spanningControlsRight').css({
                    'left': ($(this).offset().left + $(this).width() - 8) + 'px',
                    'top': $(this).offset().top + ($(this).height() / 2) - 5 + 'px',
                });
                $('#spanningControlsUp').css({
                    'left': $(this).offset().left + ($(this).width() / 2) + 'px',
                    'top': $(this).offset().top + 'px',
                });
                $('#spanningControlsDown').css({
                    'left': $(this).offset().left + ($(this).width() / 2) + 'px',
                    'top': $(this).offset().top + ($(this).height() - 8) + 'px',
                });
                $('.spanning-controls').show();
            });
        }

        $scope.span = function (direction) {
            var destination;
            var temp;
            var foundSibling = false;

            if (direction == 'left' || direction == 'right') {
                $(target).attr('span', 'colspan2');
                $('#stage table').colSpan();
            }

            if (direction == 'up' || direction == 'down') {
                $(target).attr('span', 'rowspan2');
                $('#stage table').rowSpan();
            }
            return false;


            if (direction == 'left' || direction == 'right') {
                /*find nearest sibling*/
                if (direction == 'right') {
                    temp = target;
                    target = $(target).next('td');
                    destination = temp;
                    if (target.length > 0)
                        foundSibling = true;
                }
                if (direction == 'left') {
                    destination = $(target).prev('td');
                    if (destination.length > 0)
                        foundSibling = true;
                }

                /*If sibling is found, copy elements, span and remove cell*/
                if (foundSibling) {
                    cloneElements(destination, target);
                    destination.remove();

                    var leftSpanValue = destination.attr('colspan');
                    if (typeof leftSpanValue == 'undefined') leftSpanValue = 0;

                    var rightSpanValue = target.attr('colspan');
                    if (typeof rightSpanValue == 'undefined') rightSpanValue = 0;
                    var spanValue = parseInt(leftSpanValue) + parseInt(rightSpanValue);
                    spanValue = (spanValue == 0) ? spanValue = 2 : spanValue + 1;

                    target.attr('colspan', spanValue);
                }
            }

            if (direction == 'up' || direction == 'down') {
                var indexOfCurrentCell = $(target).index();
                var indexOfCurrentRow = $(target).parent().index();
                var currentRowSpan;
                if (typeof $(target).attr('rowspan') == 'undefined')
                    currentRowSpan = 1;
                else
                    currentRowSpan = parseInt($(target).attr('rowspan'));

                var indexOfTargetRow = indexOfCurrentRow + currentRowSpan
                var targetRow = $('#stage').find('tr:eq(' + indexOfTargetRow + ')');

                console.log(indexOfTargetRow);

                if (direction == 'down') {
                    //var targetRow = $(target).parent().next();
                    destination = $(targetRow).children('td:eq(' + indexOfCurrentCell + ')');
                    if (targetRow.length > 0)
                        foundSibling = true;
                }

                /*If sibling is found, copy elements, span and remove cell*/
                if (foundSibling) {
                    cloneElements(destination, target);
                    destination.remove();

                    var leftSpanValue = destination.attr('rowspan');
                    if (typeof leftSpanValue == 'undefined') leftSpanValue = 0;

                    var rightSpanValue = target.attr('rowspan');
                    if (typeof rightSpanValue == 'undefined') rightSpanValue = 0;
                    var spanValue = parseInt(leftSpanValue) + parseInt(rightSpanValue);
                    spanValue = (spanValue == 0) ? spanValue = 2 : spanValue + 1;

                    target.attr('rowspan', spanValue);
                }
            }
        }

        function cloneElements(from, to) {

            from.children().each(function () {
                $(this).appendTo(to);
            });
        }
    }]);


}(jQuery));