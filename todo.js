$(function(){
    $("#add").submit(event => {
        event.preventDefault();
        console.log(event);
        console.log(event.target);
        let form = $(event.target);
        let item = $("#adding").val();
        console.log(item);
        let li = $("<li class='row'></li>");
        let col1 = $("<div class='col'></div>");
        li.append(col1);

        col1.append("<input type='checkbox' class='mr-2 mr-lg-3' />");
        
        let span = $("<span></span>");
        span.text(item);
        col1.append(span);

        let col2 = $("<div class='col-2'></div>");
        li.append(col2);
        
        let button = $("<button class='delete w-100'>Delete</button>");
        button.click(event => {
            // console.log("deleting");
            console.log(event.target);
            $(event.target).parent().parent().remove();
        });
        col2.append(button);
        
        $("#list").append(li);
        $("#adding").val("");
    });
});