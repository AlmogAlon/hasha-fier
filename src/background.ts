import * as crypto_js from "crypto-js";

const ids = new Set();
function transferComplete(evt: any) {
  console.log("The transfer is complete.", evt);
}

function downloadFile(options: chrome.downloads.DownloadOptions) {
chrome.downloads.download(options, (downloadid)=>{
  console.log("downloaded ", downloadid);
  ids.add(downloadid);

})}

async function sha256_test(message: any) {
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', message);
  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // convert bytes to hex string                  
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function xhr(options: chrome.downloads.DownloadOptions){
  console.log("xhrrequest is created for ", options.url);
  var oReq = new XMLHttpRequest();
  oReq.responseType = "arraybuffer";
  oReq.onload = async function() {
    var arrayBuffer = oReq.response; 
    if (arrayBuffer){
      var byteArray = new Uint8Array(arrayBuffer);
      console.log(await sha256_test(byteArray))
    }

  }
  oReq.addEventListener("load", transferComplete);
  oReq.open("GET", options.url);
  oReq.send();
}

function arrayBufferToWordArray(i8a: Uint8Array) {
  var a = [];
  for (var i = 0; i < i8a.length; i += 4) {
    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
  }
  return crypto_js.lib.WordArray.create(a, i8a.length);
}

function fetch_test(option: chrome.downloads.DownloadOptions){
  var hasher = crypto_js.algo.SHA256.create();
  let charsReceived = 0;
  const consume = async( responseReader :any): Promise<any>=> {
    const result = await responseReader.read()
    if (result.done) { return; }
    const chunk = result.value;
    hasher.update(arrayBufferToWordArray(chunk));
    charsReceived += result.value.length;
    //console.log('Received ' + charsReceived + ' characters so far')
    return consume(responseReader);
    };

fetch(option.url).then(async response => {
  let now = Date.now()
  await consume(response.body?.getReader());
  console.log("result: ", hasher.finalize().toString(), "for " + option.filename + " took "  + (Date.now() - now) / 1000)
})
.catch(console.log.bind(console));
}


chrome.downloads.onCreated.addListener(
  (downloadItem) => {
    console.log(downloadItem.filename," file has been created");
    let options: chrome.downloads.DownloadOptions= {"url": downloadItem.url};
    fetch_test(options);
    //xhr(options);    
})

  