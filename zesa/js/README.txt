These libraries are intended primarily for embedding Zeevex within a purchase page,
either as a button which opens a new page or as an IFRAME.

The Javascript libraries require JQuery 1.3 or newer.  They should be able to
co-exist with other libraries that use the '$' identifier, and with jQuery in
noConflict() mode.

Before using the Zeevex APIs, you must first initialize them.  The init() method takes
zero or one arguments: either none to use default settings in production, or an
options hash. Options include "sandbox" which, if true, tells the library to use
the Zeevex sandbox development server.

	Zeevex.init({sandbox: true});
	
You may initiate a purchase by using the ZESA API like so:

  purchase_attributes = {cmd: "_xclick", "business": "youracct@example.com", "iframe": 1, ...};
  Zeevex.zesa.submitPurchaseRequest(purchase_attributes, success_function, failure_function);
  
If the purchase request is successful, success_function will be called with one argument, a
hash which provides, among other things, the URL to which the user should be redirected.  An
example return hash:

  {
   "secret_token":"b36efb47d26b4f87_4c0935bd",
   "merchant_refnum":null,
   "url":"http://sandbox.zeevex.com/zesa/purchase/353?token=b36efb47d26b4f87_4c0935bd",
   "id":353,
   "invoice":"Inv_146465361_1275671910914"
  }

Those attributes are, respectively:

  1. The secret token for the order.
  2. A refnum, if provided in the purchase request.
  3. The URL to which the user should be redirected to complete the purchase, or
     if using IFRAME mode, used as the SRC of the IFRAME.
  4. The sequential Zeevex ID for the purchase request.
  5. The unique invoice identifier as supplied in the purchase request.

See http://docs.sandbox.zeevex.com/ for more information.

Example:

<html>
<head>
<script type="text/javascript" src="http://sandbox.zeevex.com/javascripts/jquery.js"></script>
<script type="text/javascript" src="http://hammerhead:4500/javascripts/zesa_client.js"></script>
</head>

<body>
  
<div id="container"></zeevex>
  
<script type="text/javascript">
function loadPurchase(purchase) {
  if (! purchase || ! purchase.url) {
    alert("No URL found for purchase");
    return;
  }
  iframe = document.createElement('IFRAME');
  iframe.id = 'zeevex_iframe';
  iframe.src = purchase.url;
  document.getElementById('container').appendChild(iframe);
}
 
Zeevex.init({sandbox: true});

Zeevex.zesa.submitPurchaseRequest({
        "cmd": "_xclick",
        "business": "admin@zeevex.com",
        "invoice": "Inv_" + Math.round(Math.random() * 1000000000)+"_"+(new Date().getTime()),
        "quantity": 1,
        "iframe": 1,
        "amount": 30,
        "item_name": "Leather Purse",
        "rm": 0,
        "currency_code": "ZXT",
        "item_number": "itemsku23591"
        },
    loadPurchase);
</script>

</body>
</html>
