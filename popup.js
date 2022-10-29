
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    
    if( url.includes("https://marketplace.tf/items/tf2/"))
    {
        var buttonAdd = document.createElement('button');
        buttonAdd.innerHTML = 'Add Item to Database';

        chrome.tabs.sendMessage(tabs[0].id, {"message": "start"});
        /*
        chrome.tabs.sendMessage(
          tabs[0].id,
          { test: "test" }
        );
        */

        /*
        const url = "http://localhost:3000/item";
        const options = {
          method: "POST",
          mode: "no-cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          }, body: JSON.stringify({
            "sku": "534;9",
            "name": "itemTest",
            "price": 12.34,
            "isCraftable": "1",
            "quality": "Unique"
          })
        };
        */
/*
        buttonAdd.onclick = function(){

            fetch(url, options)
            .then(response => {
                return response.text()
              })
        }
      */
        document.getElementById("buttons").appendChild(buttonAdd);
    }
    else
        document.getElementById("buttons").innerHTML = "Need to be on Marketplace.tf";
});