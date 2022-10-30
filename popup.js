
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    
    if( url.includes("https://marketplace.tf/items/tf2/"))
    {
        var buttonAdd = document.createElement('button');
        buttonAdd.innerHTML = 'Add Item to Database';


        document.getElementsByClassName("btn")[1].style.visibility = "hidden";
        document.getElementsByClassName("btn")[2].style.visibility = "hidden";

        document.getElementsByClassName("btn")[0].onclick = function () { 
            chrome.tabs.sendMessage(tabs[0].id, {"message": "addItem"}); 
        };

        
        //document.getElementById("buttons")appendChild(buttonAdd);
    }
    else
        document.getElementById("buttons").innerHTML = "Need to be on Marketplace.tf";
});