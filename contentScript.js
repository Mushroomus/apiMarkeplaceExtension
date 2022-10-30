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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "addItem" ) {
        fetch(url, {
            method: "POST",
            mode: "no-cors",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
            }, body: JSON.stringify({
              "sku": "sda",
              "name": "itemTest",
              "price": parseFloat( document.body.getElementsByClassName("current-bid-amount")[0].innerHTML.replace(' each', '').replace('$','') ),
              "isCraftable": "1",
              "quality": "Unique"
            })
        })
        .then(response => {
            return response.text()
            })
        }
    }
  );
