var currentUser;

$(function(){
    // database.ref("/todo").once('value').then(function(snapshot){
    //     snapshot.forEach(function(child){
    //         let item = child.val();
    //         console.log(item);
    //         createTodo(item.text, item.done, database.ref("/todo/" + child.key));
    //         counter ++;
    //     });
    //     // console.log(items);
    //     // for(let i = 0; i < items.length; i++) {
    //     //     if (items[i]){
    //     //         createTodo(items[i].text, items[i].done);
    //     //     }
    //     //     counter ++;
    //     // }
    // });

    // database.ref("/todo").on('child_added', function(snapshot){
    //     let item = snapshot.val();
    //     console.log("realtime", item);
    //     createTodo(item.text, item.done, database.ref("/todo/" + snapshot.key));
    // });
    // // database.ref("/todo").off('child_added');

    // database.ref("/todo").on('child_removed', function(snapshot){
    //     let id = snapshot.key;
    //     $("#" + id).parent().parent().remove();
    // });

    // database.ref("/todo").on('child_changed', function(snapshot){
    //     // console.log("change", snapshot.val());
    //     // console.log("id", snapshot.key);
    //     let checked = snapshot.val().done;
    //     $("#" + snapshot.key).attr("checked", checked);
    // });

    // Handle add button
    $("#add").submit(event => {
        event.preventDefault();
        console.log(event);
        console.log(event.target);
        let form = $(event.target);
        let item = $("#adding").val();
        console.log(item);

        if (currentUser) {
            let ref = database.ref("/todo/"+currentUser.uid).push();

            // createTodo(item, false, ref);
            $("#adding").val("");

            ref.set({text:item, done:false});
        }
    });

    $("#confirm-signup").click(event => {
        let email = $("#signup-email").val();
        let pwd = $("#signup-pwd").val();
        let confirm = $("#signup-pwd-confirm").val();
        if (pwd !== confirm) {
            alert("Your password and confirmation don't match!");
            return;
        }
        auth.createUserWithEmailAndPassword(email, pwd).then(function(result){
            console.log(result);
            $("#modal").modal('hide');
        }).catch(function(error){
            alert(error.message);
        });
    });

    $("#confirm-login").click(event => {
        let email = $("#email").val();
        let password = $("#pwd").val();
        auth.signInWithEmailAndPassword(email, password).then(function(result){
            console.log(result);
            $("#modal-login").modal('hide');
        }).catch(function(error){
            alert(error.message);
        });
    });

    $("#google").click(event => {
        auth.signInWithPopup(google).then(function(result){
            console.log(result);
            $("#modal-login").modal('hide');
        }).catch(function(error){
            alert(error.message);
        });
    });

    $("#github").click(event => {
        auth.signInWithPopup(github).then(function(result){
            console.log(result);
            $("#modal-login").modal('hide');
        }).catch(function(error){
            alert(error.message);
        });
    });

    auth.onAuthStateChanged(function(user){
        if (user) {
            console.log("We're signed in!", user);
            $("#signout-form").show();
            $("#signin-form").hide();
            $("#login-message").hide();
            $("#list").show();
            $("#add").show();

            let ref = database.ref("/todo/"+user.uid);
            ref.on('child_added', function(snapshot){
                let item = snapshot.val();
                console.log("realtime", item);
                createTodo(item.text, item.done, ref.child(snapshot.key));
            });
            // database.ref("/todo").off('child_added');

            ref.on('child_removed', function(snapshot){
                let id = snapshot.key;
                $("#" + id).parent().parent().remove();
            });

            ref.on('child_changed', function(snapshot){
                // console.log("change", snapshot.val());
                // console.log("id", snapshot.key);
                let checked = snapshot.val().done;
                $("#" + snapshot.key).attr("checked", checked);
            });
        } else {
            console.log("No one is signed in!");
            $("#signout-form").hide();
            $("#signin-form").show();
            $("#login-message").show();
            $("#list").hide().empty();
            $("#add").hide();
            let ref = database.ref("/todo/"+currentUser.uid);
            ref.off('child_added');
            ref.off('child_removed');
            ref.off('child_changed');
        }
        currentUser = user;
    });

    $("#signout-btn").click(event => {
        auth.signOut();
    });
});

function createTodo(item, checked, ref){
    let li = $("<li class='form-row form-inline justify-content-between mt-2'></li>");
    let col1 = $("<div class='custom-control custom-checkbox'></div>");
    li.append(col1);

    let id = ref.key;
    let input = $("<input type='checkbox' class='custom-control-input' id='" + id + "' />")
    input.change(function(e){
        ref.set({text:item, done:e.target.checked});
        console.log(e.target.checked);
    });
    input.attr('checked', checked);
    col1.append(input);

    let label = $("<label class='custom-control-label ml-1'></label>");
    label.attr("for", id);
    label.text(item);
    col1.append(label);

    let col2 = $("<div class='col-2'></div>");
    li.append(col2);

    let button = $("<button class='btn btn-danger w-100'>Delete</button>");
    button.click(event => {
        // console.log("deleting");
        console.log(event.target);
        // $(event.target).parent().parent().remove();
        ref.remove();
    });
    col2.append(button);

    $("#list").append(li);
}