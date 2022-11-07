chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message == 'Item was added')
        window.location.reload();
      else{
        var label = document.getElementById("spanInfo");
        labelSet(label, request.message);
      }
    }
  );

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    
    var url = tabs[0].url;
    var apiSku = "http://localhost:3000/item/" + url.replace('https://marketplace.tf/items/tf2/', '');
    var label = document.getElementById("spanInfo");
    
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
                document.getElementById("updateForm").style.display = "none";
                document.getElementById("add").style.display = "block";
                document.body.style.height = '60px';

                document.getElementsByClassName("btn")[0].onclick = function () { 
                    chrome.tabs.sendMessage(tabs[0].id, {"tabUrl": url})
                };
            }
            else
            {
                document.body.style.height = '60px';
                document.getElementById("edit").style.display = "block";
                document.getElementById("remove").style.display = "block";

                document.getElementsByClassName("btn")[1].onclick = function(){

                    document.getElementById("updateForm").style.display = "block";
                    document.body.style.height = '600px';

                    document.getElementById("name").value = data.data[0].name;
                    document.getElementById("price").value = data.data[0].price;

                    if(data.data[0].isCraftable == "0")
                        document.getElementById("isCraftable").value = "No";
                    else
                        document.getElementById("isCraftable").value = "Yes";

                    document.getElementById("type").value = data.data[0].type;
                    document.getElementById("quality").value = data.data[0].quality;
                    document.getElementById("class").value = data.data[0].class;

                    document.getElementById("update").onclick = function(){

                        var isCraftable = "1";

                        if(document.getElementById("isCraftable") == "No")
                            isCraftable = "0";

                        fetch(apiSku, {
                            method: "PUT",
                            headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json;charset=UTF-8",
                            }, body: JSON.stringify({
                                "name": document.getElementById("name").value,
                                "price": parseFloat(document.getElementById("price").value),
                                "isCraftable": isCraftable,
                                "type": document.getElementById("type").value,
                                "quality": document.getElementById("quality").value,
                                "classItem": document.getElementById("class").value
                              })
                        })
                        .then( (response) => response.json())
                        .then( (data) => { labelSet(label, data.message) })
                    }

                    document.getElementById("cancel").onclick = function() {
                        document.getElementById("updateForm").style.display = "none";
                        document.body.style.height = '60px';
                    }
                }

                document.getElementsByClassName("btn")[2].onclick = function() {
                    fetch(apiSku, {
                        method: "DELETE",
                        headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json;charset=UTF-8",
                        }
                    })
                    .then( (response) => response.json())
                        .then( (data) => { 
                            if(data.message == 'Item was deleted')
                                window.location.reload();
                            else
                                labelSet(label, data.message);
                         })     
                }
            }
        })
        .catch(() => {
            document.getElementById("updateForm").style.display = "none";
            document.getElementById("buttons").innerHTML = "Something went wrong";
        })
    }
    else
    {
        document.getElementById("updateForm").style.display = "none";
        document.getElementById("buttons").innerHTML = "Select an Item on Marketplace.tf";
        document.getElementById("buttons").style.fontSize = "medium";
    }
});

function labelSet(label, text) {
    label.style.display = 'block';
    label.innerHTML = text;

    setTimeout(() => {
        label.style.display = 'none';
    }, 3000);
}