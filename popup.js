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

  updateItem = {
    sku : "",
    name: "",
    price: "",
    isCraftable: "",
    type: "",
    quality: ""
  }
  
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    
    var url = tabs[0].url;
    var apiSku = "http://localhost:3000/item/" + url.replace('https://marketplace.tf/items/tf2/', '');
    var label = document.getElementById("spanInfo");
    
    if( url.includes("https://marketplace.tf/items/tf2/")){
        fetch(apiSku, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
            }
        })
        .then( (response) => response.json())
        .then( (data) => {
            if(data.message == "item does not exist"){
                document.getElementById("updateForm").style.display = "none";
                document.getElementById("add").style.display = "block";
                document.body.style.height = '60px';

                document.getElementsByClassName("btn")[0].onclick = function () { 
                    chrome.tabs.sendMessage(tabs[0].id, {"tabUrl": url})
                };
            }
            else{
                document.body.style.height = '60px';
                document.getElementById("edit").style.display = "block";
                document.getElementById("remove").style.display = "block";

                document.getElementsByClassName("btn")[1].onclick = function(){

                    document.getElementById("updateForm").style.display = "block";
                    document.body.style.height = '600px';

                    // get the actual data - every time after update to do not assign old fetched data
                    if(updateItem.name == ""){
                        document.getElementById("name").value = data.data[0].name;
                        document.getElementById("price").value = data.data[0].price;
                        document.getElementById("isCraftable").value = data.data[0].isCraftable;
                        document.getElementById("type").value = data.data[0].type;
                        document.getElementById("quality").value = data.data[0].quality;
                        document.getElementById("class").value = data.data[0].class;
                    }
                    else{
                        document.getElementById("name").value = updateItem.name;
                        document.getElementById("price").value = updateItem.price;
                        document.getElementById("isCraftable").value = updateItem.isCraftable;
                        document.getElementById("type").value = updateItem.type;
                        document.getElementById("quality").value = updateItem.quality;
                        document.getElementById("class").value = updateItem.class;
                    }

                    document.getElementById("update").onclick = function(){
                        fetch(apiSku, {
                            method: "PUT",
                            headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json;charset=UTF-8",
                            }, body: JSON.stringify({
                                "name": document.getElementById("name").value,
                                "price": parseFloat(document.getElementById("price").value),
                                "isCraftable": document.getElementById("isCraftable").value,
                                "type": document.getElementById("type").value,
                                "quality": document.getElementById("quality").value,
                                "classItem": document.getElementById("class").value
                              })
                        })
                        .then( (response) => response.json())
                        .then( (data) => { 
                            labelSet(label, data.message);
                            updateItem.name = document.getElementById("name").value;
                            updateItem.price = document.getElementById("price").value;
                            updateItem.isCraftable = document.getElementById("isCraftable").value;
                            updateItem.type = document.getElementById("type").value;
                            updateItem.quality = document.getElementById("quality").value;
                            updateItem.class = document.getElementById("class").value;                    
                        })
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
        .catch(() => { buttonsInnerHTML("Something went wrong") })
    }
    else
        buttonsInnerHTML("Select an Item on Marketplace.tf")
});

function buttonsInnerHTML(text){
    document.getElementById("updateForm").style.display = "none";
    document.getElementById("buttons").innerHTML = text;
    document.getElementById("buttons").style.fontSize = "medium";
}

function labelSet(label, text) {
    label.style.display = 'block';
    label.innerHTML = text;

    setTimeout(() => {
        label.style.display = 'none';
    }, 3000);
}