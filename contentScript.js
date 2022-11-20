const url = "http://localhost:3000/item";

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      var tabUrl = request.tabUrl;
      var isCraftable = "Yes";
      var sku = tabUrl.replace('https://marketplace.tf/items/tf2/', '');
      var type = "Ext";
      var quality = "Unique";
      var price = parseFloat( document.body.getElementsByClassName("current-bid-amount")[0].innerHTML.replace(' each', '').replace('$','') );

      var name = document.body.getElementsByClassName("item-title")[0].getElementsByTagName("span")[0].innerHTML;
      
      if(name.includes("Taunt:"))
      {
        name = name.replace("Taunt: ", "");
        type = "Taunt";
      }

      if(name.includes("Strange Part:"))
      {
        name = name.replace("Strange Part: ", "");
        type = "Strange Part";
      }

      if(name.includes("Strange"))
      {
        if(name.includes("Vintage"))
        {
          name = name.replace("Vintage Strange ", "");
          quality = "Vintage Strange";
        }
        else if(name.includes("Haunted"))
        {
          name = name.replace("Haunted Strange " , "");
          quality = "Haunted Strange";
        }
        else if(name.includes("Genuine"))
        {
          name = name.replace("Genuine Strange " , "");
          quality = "Genuine Strange";
        }
        else
        {
          name = name.replace("Strange ", "" );
          quality = "Strange";
        }
      }
      else if(name.includes("Vintage"))
      {
        name = name.replace("Vintage ", "");
        quality = "Vintage";
      }
      else if(name.includes("Haunted"))
      {
        name = name.replace("Haunted " , "");
        quality = "Haunted";
      }
      else if(name.includes("Genuine"))
      {
        name = name.replace("Genuine " , "");
        quality = "Genuine";
      }


      if(tabUrl.includes("uncraftable"))
        isCraftable = "No";

        fetch(url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
            }, body: JSON.stringify({
              "sku": sku,
              "name": name,
              "price": price,
              "isCraftable": isCraftable,
              "type": type,
              "quality": quality
            })
        })
        .then((response)=> response.json())
        .then( (data) => {
          chrome.runtime.sendMessage({message: data.message})
          });
        })
