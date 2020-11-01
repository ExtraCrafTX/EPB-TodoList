let counter = 0;
$(function(){
    $("#add").submit(event => {
        event.preventDefault();
        console.log(event);
        console.log(event.target);
        let form = $(event.target);
        let item = $("#adding").val();
        console.log(item);
        let li = $("<li class='form-row form-inline justify-content-between mt-2'></li>");
        let col1 = $("<div class='custom-control custom-checkbox'></div>");
        li.append(col1);

        col1.append("<input type='checkbox' class='custom-control-input' id='" + counter + "' />");
        
        let label = $("<label class='custom-control-label ml-1'></label>");
        label.attr("for", counter);
        label.text(item);
        col1.append(label);

        let col2 = $("<div class='col-2'></div>");
        li.append(col2);
        
        let button = $("<button class='btn btn-danger w-100'>Delete</button>");
        button.click(event => {
            // console.log("deleting");
            console.log(event.target);
            $(event.target).parent().parent().remove();
        });
        col2.append(button);
        
        $("#list").append(li);
        $("#adding").val("");
        counter ++;
    });
});