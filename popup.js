
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    
    var url = tabs[0].url;
    var apiSku = "http://localhost:3000/item/" + url.replace('https://marketplace.tf/items/tf2/', '');
    
    if( url.includes("https://marketplace.tf/items/tf2/"))
    {
        fetch(apiSku, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
            }
        })
        .then( (response) => response.json())
        .then( (data) => {
            if(data.message == "item does not exist")
            {
                document.getElementsByClassName("btn")[1].style.visibility = "hidden";
                document.getElementsByClassName("btn")[2].style.visibility = "hidden";
        
                document.getElementsByClassName("btn")[0].onclick = function () { 
                    chrome.tabs.sendMessage(tabs[0].id, {"message": "addItem", "tabUrl": url}); 
                };
            }
            else 
            {
                document.getElementsByClassName("btn")[0].style.visibility = "hidden";

                document.getElementsByClassName("btn")[2].onclick = function() {
                    fetch(apiSku, {
                        method: "DELETE",
                        headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json;charset=UTF-8",
                        }
                    })
                }
            }
        })
    }
    else
        document.getElementById("buttons").innerHTML = "Need to be on Marketplace.tf";
});