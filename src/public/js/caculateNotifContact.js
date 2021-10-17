function increaseNumberNotifContact(className){
    // + : Convert string to Number
    let currentValue=+$(`.${className}`).find("em").text();
    currentValue+=1;

    if(currentValue===0){
        $(`.${className}`).html("");
    }
    else{
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}

function decreaseNumberNotifContact(className){
    // + : Convert string to Number
    let currentValue=+$(`.${className}`).find("em").text();
    currentValue-=1;

    if(currentValue===0){
        $(`.${className}`).html("");
    }
    else{
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}