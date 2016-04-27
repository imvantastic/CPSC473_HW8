var main = function (toDoObjects) {
    "use strict";
	//ADD socket.io
	var socket = io.connect('http://localhost:3000');
    console.log("SANITY CHECK");
    var toDos = toDoObjects.map(function (toDo) {
          // we'll just return the description
          // of this toDoObject
          return toDo.description;
    });

    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // create a click handler for this element
		//socket.on('newToDo', function(newToDo){
        $element.on("click", function () {
            var $content,
                $input,
                $button,
                i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();
			
			//newest tab
            if ($element.parent().is(":nth-child(1)")) {
                
					
					//toDos = newToDo;
					console.log("in newest tab");
					console.log(toDos + "va");
					$content = $("<ul>");
					
						console.log("in socket of newset");
					for (i = toDos.length-1; i >= 0; i--) {
						
						$content.append($("<li>").text(toDos[i]));
					}
				
            } 
			//oldest tab
			else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                toDos.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });
			
			//tags tab
            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function (toDo) {
                    toDo.tags.forEach(function (tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function (tag) {
                    var toDosWithTag = [];

                    toDoObjects.forEach(function (toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return { "name": tag, "toDos": toDosWithTag };
                });

                console.log(tagObjects);

                tagObjects.forEach(function (tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul>");


                    tag.toDos.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });
			
			//add tab
            } else if ($element.parent().is(":nth-child(4)")) {
                var $input = $("<input>").addClass("description"),
                    $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: "),
                    $button = $("<span>").text("+");

                $button.on("click", function () {
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                        newToDo = {"description":description, "tags":tags};
						
					
                    $.post("todos", newToDo, function (result) {
                        console.log(result);

                        //toDoObjects.push(newToDo);
                        toDoObjects = result;

                        // update toDos
                        toDos = toDoObjects.map(function (toDo) {
							console.log(toDo.description + " |to do desc");
							
                            return toDo.description;
                        });

                        $input.val("");
                        $tagInput.val("");
                    });
					//add socket.io; I have created a new to do
					socket.emit('ntdAdded', newToDo);
                });
			
				//creates the form
                $content = $("<div>").append($inputLabel)
                                     .append($input)
                                     .append($tagLabel)
                                     .append($tagInput)
                                     .append($button);
            }

            $("main .content").append($content);

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
	
	//when socket signals a new to do item. update tabs
	    socket.on("vnewToDo", function(data) {
        var $oldToDos = $("#ol");
		var $newToDos = $("#nl");
        var $toDoTags = $("#tl");
        var $data = data.description;
        var $tags = data.tags;
        var $NTD = $("<li>").text($data).hide();
        
		//add to newest tab
		if ($newToDos.length > 0) {
            $newToDos.prepend($newItem);
            $NTD.slideDown();
        //add to oldest tab
		} else if ($oldToDos.length > 0) {
            $oldToDos.append($NTD);
            $NTD.slideDown();
        //add to tags tab
		} else if ($toDoTags.length > 0) {
            $("main .content").append($("<h3>").text($tags));
            $("main .content").append($NTD);
            $NTD.slideDown();
        }

        $.getJSON("todos.json", function(newToDoObjects) {
            toDoObjects = newToDoObjects;
            toDos = newToDoObjects.map(function(toDo) {
                return toDo.description;
            });
        });
		
		//alert user
		alert("A new ToDo item was added");
    });
};

$(document).ready(function () {
	//ADD socket.io
	//var socket = io();
	//console.log(socket);
	

    $.getJSON("todos.json", function (toDoObjects) {
        main(toDoObjects);
    });
});
