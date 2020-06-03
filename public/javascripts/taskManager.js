var community_id;

$(function(){
    community_id = $("#community_id").text();

    $(".task").draggable({
        revert: "invalid",
        start: function() {
          $(this).addClass("selected");
        },
        stop: function() {
          $(this).removeClass("selected")
        }
      });
    
      $(".taskcolumn").droppable({
        accept: ".task",
        drop: function(event, ui) {
          ui.draggable
            .css("left", "0")
            .css("top", "0")
            .appendTo($(this).find(".taskbody"))
        }
      });
})