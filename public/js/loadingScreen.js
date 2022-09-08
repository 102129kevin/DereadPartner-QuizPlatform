window.addEventListener("load", function (event) {
  //loading state check
  let loadingNft = true;
  let loadingAsset = true;

  //use promise to check the resource loaded or not.
  let alldone = false;

  let connectTimeoutCheck = function () {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (alldone === false) {
          reject("已連線逾時，請重新載入頁面!");
        }
        if (alldone === true) {
          resolve("connected ok!");
        }
      }, 20000);
    });
  };

  //console.log("i am window load event.");

  //偵測 素材 是否載入完成
  let assets = document.getElementsByTagName("a-assets");
  assets[0].addEventListener("loaded", () => {
    //console.log("asset-ok!!");
    document.querySelector(".myloader div:nth-of-type(1)").innerHTML =
      "載入 assets......ok!";
    loadingAsset = false;

    //檢查NFT是否也載入完成
    alldone = checkLoaded(loadingNft, loadingAsset);
  });

  //偵測 nft的descripor(辨識點) 是否載入完成
  let numOfNft = document.getElementsByTagName("a-nft").length;
  let loadNFTState = document.querySelector(".myloader div:nth-of-type(2)");
  let loadedNFT = 0;

  window.addEventListener("arjs-nft-loaded", () => {
    //nft : the nft's quantity of this .html file.
    loadedNFT += 1;
    if (loadedNFT === numOfNft) {
      loadNFTState.innerHTML = "載入 nft......ok!";
      loadingNft = false;

      //檢查Asset是否也載入完成
      alldone = checkLoaded(loadingNft, loadingAsset);
    }
  });

  //use promise to implement connectTimeout and alert user reload the page.
  connectTimeoutCheck()
    .then(function (value) {
      console.log(value);
    })
    .catch(function (err) {
      alert(err);
    });
});

function checkLoaded(assetLoading, nftLoading) {
  if (!assetLoading && !nftLoading) {
    //after loaded, wait one second then remove loading screen.
    let aaa = window.setTimeout(function () {
      document.querySelector(".myloader").remove();
    }, 1000);
    return true;
  } else {
    return false;
  }
}