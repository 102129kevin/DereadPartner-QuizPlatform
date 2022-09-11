/* global AFRAME, THREE */
window.addEventListener('load', function () {

  let schema = {
    longitude: 0,
    lonMode: "basic",
    lonDataSet: {
      lon0: {
        lonName: "本初經線",
        lonTime: "標準時間:UTC+0、夏令時間:UTC+1",
        lonCnty: {
          pic: "UnitedKingdom",
          name: "英國",
          timezone: "Europe/Belfast",
          time: "",
        },
      },
      lon15: {
        lonName: "東經15度",
        lonTime: "標準時間:UTC+1、夏令時間:UTC+2",
        lonCnty: {
          pic: "Norway",
          name: "挪威",
          timezone: "Europe/Oslo",
          time: "",
        },
      },
      lon30: {
        lonName: "東經30度",
        lonTime: "標準時間:UTC+2",
        lonCnty: {
          pic: "Egypt",
          name: "埃及",
          timezone: "Africa/Cairo",
          time: "",
        },
      },
      lon45: {
        lonName: "東經45度",
        lonTime: "標準時間:UTC+3",
        lonCnty: {
          pic: "Somalia",
          name: "索馬利亞",
          timezone: "Africa/Mogadishu",
          time: "",
        },
      },
      lon60: {
        lonName: "東經60度",
        lonTime: "標準時間:UTC+3.5、夏令時間:UTC+4.5",
        lonCnty: {
          pic: "Iran",
          name: "伊朗",
          timezone: "Asia/Tehran",
          time: "",
        },
      },
      lon75: {
        lonName: "東經75度",
        lonTime: "標準時間:UTC+6",
        lonCnty: {
          pic: "Kyrgyzstan",
          name: "吉爾吉斯",
          timezone: "Asia/Bishkek",
          time: "",
        },
      },
      lon90: {
        lonName: "東經90度",
        lonTime: "標準時間:UTC+6",
        lonCnty: {
          pic: "Bangladesh",
          name: "孟加拉",
          timezone: "Asia/Dacca",
          time: "",
        },
      },
      lon105: {
        lonName: "東經105度",
        lonTime: "標準時間:UTC+7",
        lonCnty: {
          pic: "Vietnam",
          name: "越南",
          timezone: "Asia/Ho_Chi_Minh",
          time: "",
        },
      },
      lon120: {
        lonName: "東經120度",
        lonTime: "標準時間:UTC+8",
        lonCnty: {
          pic: "Taiwan",
          name: "臺灣",
          timezone: "Asia/Taipei",
          time: "",
        },
      },
      lon135: {
        lonName: "東經135度",
        lonTime: "標準時間:UTC+9",
        lonCnty: {
          pic: "Japan",
          name: "日本",
          timezone: "Asia/Tokyo",
          time: "",
        },
      },
      lon150: {
        lonName: "東經150度",
        lonTime: "標準時間:UTC+10、夏令時間:UTC+11",
        lonCnty: {
          pic: "Australia",
          name: "澳大利亞",
          timezone: "Australia/ACT",
          time: "",
        },
      },
      lon165: {
        lonName: "東經165度",
        lonTime: "標準時間:UTC+12",
        lonCnty: {
          pic: "MarshallIslands",
          name: "馬紹爾群島",
          timezone: "Pacific/Kwajalein",
          time: "",
        },
      },
      lon180: {
        lonName: "國際換日線",
        lonTime: "標準時間:UTC+12、夏令時間:UTC+13",
        lonCnty: {
          pic: "Fiji",
          name: "斐濟(瓦努阿島)",
          timezone: "Pacific/Fiji",
          time: "",
        },
      },
      lon195: {
        lonName: "西經165度",
        lonTime: "標準時間:UTC-9、夏令時間:UTC-8",
        lonCnty: {
          pic: "USA",
          name: "阿拉斯加(美國)",
          timezone: "America/Juneau",
          time: "",
        },
      },
      lon210: {
        lonName: "西經150度",
        lonTime: "標準時間:UTC+12",
        lonCnty: {
          pic: "Kiribati",
          name: "吉里巴斯",
          timezone: "Pacific/Tarawa",
          time: "",
        },
      },
      lon225: {
        lonName: "西經135度",
        lonTime: "標準時間:UTC-5、夏令時間:UTC-4",
        lonCnty: {
          pic: "Canada",
          name: "加拿大",
          timezone: "America/Toronto",
          time: "",
        },
      },
      lon240: {
        lonName: "西經120度",
        lonTime: "標準時間:UTC-5、夏令時間:UTC-4",
        lonCnty: {
          pic: "USA",
          name: "美國",
          timezone: "America/New_York",
          time: "",
        },
      },
      lon255: {
        lonName: "西經105度",
        lonTime: "標準時間:UTC-6、夏令時間:UTC-5",
        lonCnty: {
          pic: "Mexico",
          name: "墨西哥",
          timezone: "America/Mexico_City",
          time: "",
        },
      },
      lon270: {
        lonName: "西經90度",
        lonTime: "標準時間:UTC-6",
        lonCnty: {
          pic: "Guatemala",
          name: "瓜地馬拉",
          timezone: "America/Guatemala",
          time: "",
        },
      },
      lon285: {
        lonName: "西經75度",
        lonTime: "標準時間:UTC-5",
        lonCnty: {
          pic: "Colombia",
          name: "哥倫比亞",
          timezone: "America/Bogota",
          time: "",
        },
      },
      lon300: {
        lonName: "西經60度",
        lonTime: "標準時間:UTC-3",
        lonCnty: {
          pic: "Argentina",
          name: "阿根廷",
          timezone: "America/Argentina/Cordoba",
          time: "",
        },
      },
      lon315: {
        lonName: "西經45度",
        lonTime: "標準時間:UTC-3、夏令時間:UTC-2",
        lonCnty: {
          pic: "Greenland",
          name: "格陵蘭",
          timezone: "America/Nuuk",
          time: "",
        },
      },
      lon330: {
        lonName: "西經30度",
        lonTime: "標準時間:UTC-3、夏令時間:UTC-2",
        lonCnty: {
          pic: "Greenland",
          name: "皮里地(格陵蘭)",
          timezone: "America/Nuuk",
          time: "",
        },
      },
      lon345: {
        lonName: "西經15度",
        lonTime: "標準時間:UTC+0",
        lonCnty: {
          pic: "Iceland",
          name: "冰島",
          timezone: "Iceland",
          time: "",
        },
      },
    }
  };

  function init() {
    //let nft2 = document.querySelector("#nft2");

    //--------------------------------testzone--------------------------------
    //this.myModel = document.getElementById("earthModel");    

    // let earthTest = document.getElementById("earthTest");
    // let dogTest = document.getElementById("dogTest");
    // let frankTest = document.getElementById("frankTest");
    // let hologram_consoleTest = document.getElementById("hologram_consoleTest");
    // let blender_chanTest = document.getElementById("blender_chanTest");
    // let japanTest = document.getElementById("japanTest");

    // earthTest.addEventListener(
    //   "click",
    //   this.changeModelTest.bind(this, "earth")
    // );

    // dogTest.addEventListener(
    //   "click",
    //   this.changeModelTest.bind(this, "shiba")
    // );

    // frankTest.addEventListener(
    //   "click",
    //   this.changeModelTest.bind(this, "frank")
    // );

    // hologram_consoleTest.addEventListener(
    //   "click",
    //   this.changeModelTest.bind(this, "hologram_console")
    // );

    // blender_chanTest.addEventListener(
    //   "click",
    //   this.changeModelTest.bind(this, "blender_chan")
    // );

    // japanTest.addEventListener(
    //   "click",
    //   this.changeModelTest.bind(this, "japan")
    // );
    //--------------------------------testzone--------------------------------
    // let camera = document.getElementById("#mycamera");
    let top = document.getElementById("#top");
    let down = document.getElementById("#down");

    let manualTime = document.getElementById("manualTime");
    let autoTime = document.getElementById("autoTime");
    let timeData = document.getElementById("timeData");
    let setConfirm = document.getElementById("setConfirm");

    //nft2.addEventListener("markerFound", () => {


    //top - nft2Info
    //create parent node
    // let nft2Info = document.createElement("div");
    // nft2Info.setAttribute("id", "nft2Info");

    //create lonBoard in nft2Info
    // let lonBoard = document.createElement("div");
    // lonBoard.setAttribute("id", "lonBoard");

    //create board in lonBoard
    // let board = document.createElement("div");
    // board.setAttribute("id", "board");

    //create node in board
    // let lonTag = document.createElement("div");
    // lonTag.setAttribute("id", "lonTag");
    // lonTag.setAttribute("class", "item1");
    // lonTag.innerHTML = "目前位置";

    // let lonData = document.createElement("div");
    // lonData.setAttribute("id", "lonData");
    // lonData.setAttribute("class", "item2");

    // let timeTag = document.createElement("div");
    // timeTag.setAttribute("id", "timeTag");
    // timeTag.setAttribute("class", "item1");
    // timeTag.innerHTML = "時區";

    // timeData = document.createElement("div");
    // timeData.setAttribute("id", "timeData");
    // timeData.setAttribute("class", "item2");

    // let countryTag = document.createElement("div");
    // countryTag.setAttribute("id", "countryTag");
    // countryTag.setAttribute("class", "item1");
    // countryTag.innerHTML = "代表國家";

    //create countryData and its detail
    // let countryData = document.createElement("div");
    // countryData.setAttribute("id", "countryData");
    // countryData.setAttribute("class", "item2");

    // let countryPic = document.createElement("div");
    // countryPic.setAttribute("id", "countryPic");

    // let countryName = document.createElement("div");
    // countryName.setAttribute("id", "countryName");

    //add
    // countryData.appendChild(countryPic);
    // countryData.appendChild(countryName);

    // board.appendChild(lonTag);
    // board.appendChild(lonData);
    // board.appendChild(timeTag);
    // board.appendChild(timeData);
    // board.appendChild(countryTag);
    // board.appendChild(countryData);

    // lonBoard.appendChild(board);
    // nft2Info.appendChild(lonBoard);
    // top.appendChild(nft2Info);

    //down - nft2Control
    //create div
    // let nft2Control = document.createElement("div");
    // nft2Control.setAttribute("id", "nft2Control");

    //create slider
    // let slider = document.createElement("input");
    // slider.setAttribute("id", "nft2Slider");
    // slider.setAttribute("type", "range");
    // slider.setAttribute("min", "0");
    // slider.setAttribute("max", "360");
    // slider.setAttribute("step", "1");
    // slider.setAttribute("value", "0");

    //create controlButton - west
    // let btnWest = document.createElement("button");
    // btnWest.setAttribute("id", "btnWest");
    // btnWest.innerHTML = "往西15度";

    //create controlButton - east
    // let btnEast = document.createElement("button");
    // btnEast.setAttribute("id", "btnEast");
    // btnEast.innerHTML = "往東15度";

    //create <a> tag call "aSetTime" for btnSetTime
    // let aSetTime = document.createElement("a");
    // aSetTime.setAttribute("href", "#setTimeLightbox");

    //create controlButton - btnSetTime
    // let btnSetTime = document.createElement("button");
    // btnSetTime.setAttribute("id", "btnSetTime");
    // btnSetTime.innerHTML = "設定時區";

    //使用 function.bind() 綁定變數函數，這樣可以使用event變數，也可傳遞參數
    //綁定slider事件
    // slider.addEventListener(
    //   "mousemove",
    //   this.refreshRotation.bind(null, nft2modelInfo)
    // );
    // slider.addEventListener(
    //   "touchmove",
    //   this.refreshRotation.bind(null, nft2modelInfo)
    // );
    //綁定btnEast事件
    let btnEast = document.getElementById("btnEast");
    btnEast.addEventListener(
      "click",
      btnEarthRotation(nft2modelInfo, "east") //go east 30
    );
    //綁定btnWest事件
    let btnWest = document.getElementById("btnWest");
    btnWest.addEventListener(
      "click",
      btnEarthRotation(nft2modelInfo, "west") //2=go west 30
    );

    //add
    // aSetTime.appendChild(btnSetTime);

    // nft2Control.appendChild(slider);
    // nft2Control.appendChild(btnWest);
    // nft2Control.appendChild(btnEast);
    // nft2Control.appendChild(aSetTime);
    // down.appendChild(nft2Control);

    //更新lonboard資料
    this.refreshLonBoardInfo(this.data.longitude);
    //});

    nft2.addEventListener("markerLost", () => {
      //remove camera text
      // let textnode = document.querySelector("#Hello");
      // camera.removeChild(textnode);

      //remove top area
      let nft2Info = document.querySelector("#nft2Info");
      nft2Info.remove();

      //remove down area
      let nft2Control = document.querySelector("#nft2Control");
      nft2Control.remove();
    });

    //intial setTimeZone event in lightbox
    manualTime.addEventListener("change", () => {
      if (manualTime.checked) {
        timeData.disabled = false;
      }
    });

    autoTime.addEventListener("change", () => {
      if (autoTime.checked) {
        timeData.disabled = true;
      }
    });

    setConfirm.addEventListener("click", () => {
      let time;
      if (manualTime.checked) {
        let timeValue = timeData.value;

        //Check if timeValue is entered
        if (timeValue === "") {
          alert("未設定成功，請輸入指定時間");
        } else {
          let splitTime = timeValue.split(":");
          console.log(splitTime);
          let today = new Date();
          time = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            Number(splitTime[0]),
            Number(splitTime[1]),
            0
          );
          this.refreshLonData(time);
        }
      }
      if (autoTime.checked) {
        time = new Date();

        //clean time's "second" then pass
        time.setSeconds(0);
        this.refreshLonData(time);
      }
    });
  }

  //slider control earth's model rotation
  function refreshRotation(modelInfo) {
    //console.log(id);
    let nft2model = document.querySelector("#" + modelInfo.id);
    let newRotationY = Number(event.target.value) + modelInfo.rotation.y;
    var newRotation =
      modelInfo.rotation.x + " " + newRotationY + " " + modelInfo.rotation.z;
    console.log(newRotation);
    nft2model.setAttribute("rotation", newRotation);
  }

  //btnRotationEarthMethod
  function btnEarthRotation(modelInfo, direction) {
    console.log("hi");
    //declaration
    let nft2model = document.querySelector("#" + modelInfo.id);
    let lon0board = document.getElementById("lon0BoardModel");
    let lon180board = document.getElementById("lon180BoardModel");

    //direction(go east)
    if (direction === "east") {
      //判斷旋轉值"範圍"
      if (this.data.longitude < 360) {
        //更新旋轉值
        this.data.longitude += 15;

        //是否已轉過一圈?
        if (this.data.longitude === 360) {
          //歸零
          this.data.longitude = 0;
        }

        //alert(this.data.longitude);
        //是否為330~30
        // if (this.data.longitude >= 330 || this.data.longitude <= 30) {
        //   lon0board.object3D.visible = true;
        // }else{
        //   lon0board.object3D.visible = false;
        // }

        this.checkLon0(lon0board);
        this.checkLon180(lon180board);

        let newRotationY = this.data.longitude;

        //更新lonBoard資訊
        this.refreshLonBoardInfo(newRotationY);

        //更新 模型旋轉值-10 e.g. 0-> -90 ; 30-> -60
        var newRotation =
          modelInfo.rotation.x +
          " " +
          (-90 - newRotationY) +
          " " +
          modelInfo.rotation.z;

        //更新模型
        //console.log(newRotation);
        nft2model.setAttribute("rotation", newRotation);
      }
    }

    //direction(go west)
    if (direction === "west") {
      //判斷旋轉值"範圍"
      if (this.data.longitude >= 0) {
        //更新旋轉值
        this.data.longitude -= 15;

        //是否準轉往迴轉?
        if (this.data.longitude < 0) {
          //回到西經15 = lon345
          this.data.longitude = 345;
        }

        this.checkLon0(lon0board);
        this.checkLon180(lon180board);

        let newRotationY = this.data.longitude;

        //更新lonBoard資訊
        this.refreshLonBoardInfo(newRotationY);

        //更新 模型旋轉值-10 e.g. 0-> -90 ; 30-> -60
        var newRotation =
          modelInfo.rotation.x +
          " " +
          (-90 - newRotationY) +
          " " +
          modelInfo.rotation.z;

        //更新模型
        //console.log(newRotation);
        nft2model.setAttribute("rotation", newRotation);
      }
    }
  }

  function checkLon0(targetBoard) {
    //alert(this.data.longitude);
    let nowLon = this.data.longitude;

    if (nowLon >= 330 || nowLon <= 30) {
      //get board's info(NOT Board element!!!)
      let targetBoardInfo = this.getObjectInfo(targetBoard);

      //set Board Visible
      targetBoard.object3D.visible = true;

      //set Board Rotate
      targetBoard.object3D.rotation.y = THREE.Math.degToRad(
        0 - nowLon
      );
    } else {
      targetBoard.object3D.visible = false;
    }
  }

  function checkLon180(targetBoard) {
    //alert(this.data.longitude);
    let nowLon = this.data.longitude;

    if (nowLon >= 150 && nowLon <= 210) {
      //get board's info(NOT Board element!!!)
      let targetBoardInfo = this.getObjectInfo(targetBoard);

      //set Board Visible
      targetBoard.object3D.visible = true;

      //set Board Rotate
      targetBoard.object3D.rotation.y = THREE.Math.degToRad(
        -180 - nowLon
      );
    } else {
      targetBoard.object3D.visible = false;
    }
  }

  function getLonData(mylon) {
    let lonWhere = "lon" + mylon;
    return this.data.lonDataSet[lonWhere];
  }

  function refreshLonData(myTime) {
    var i = 0;
    for (i = 0; i < 360; i += 15) {
      let lon = "lon" + i;
      let UTCtime = myTime.toLocaleString("zh-tw", {
        timeZone: this.data.lonDataSet[lon].lonCnty.timezone,
      });
      let splitUTCTime = UTCtime.split(" ");
      let splitDay = splitUTCTime[0].split("/");
      let splitTime = splitUTCTime[1].replace(":00", "");
      this.data.lonDataSet[lon].lonCnty.time =
        splitDay[1] + "月" + splitDay[2] + "日 " + splitTime;
    }
    this.data.lonMode = "userSet";
    this.refreshLonBoardInfo(this.data.longitude);
  }

  function refreshLonBoardInfo(lon) {
    //取得該經經度資料
    let newlonData = this.getLonData(lon);

    //取得欲更新元件
    let lonData = document.getElementById("lonData");
    let timeData = document.getElementById("timeData");
    let countryPic = document.getElementById("countryPic");
    let countryName = document.getElementById("countryName");

    //組成更新圖片位置 國旗圖片都是.png
    let picAdr = "assest/image/" + newlonData.lonCnty.pic + ".png";

    //更新
    lonData.innerHTML = newlonData.lonName;

    // according lonMode to decide what to show.
    // basic:"show utc rule"
    // userSet"show user's setting time."
    if (this.data.lonMode === "basic") {
      timeData.innerHTML = newlonData.lonTime;
    }
    if (this.data.lonMode === "userSet") {
      timeData.innerHTML = newlonData.lonCnty.time;
    }

    countryPic.style.backgroundImage = "url(" + picAdr + ")";
    countryName.innerHTML = newlonData.lonCnty.name;
  }

  function getObjectInfo(object) {
    // find id,position,rotation,scale info and return an object
    let info = {
      id: object.id,
      position: {
        x: object.components.position.attrValue.x,
        y: object.components.position.attrValue.y,
        z: object.components.position.attrValue.z,
      },
      rotation: {
        x: object.components.rotation.attrValue.x,
        y: object.components.rotation.attrValue.y,
        z: object.components.rotation.attrValue.z,
      },
      scale: {
        x: object.components.scale.attrValue.x,
        y: object.components.scale.attrValue.y,
        z: object.components.scale.attrValue.z,
      },
    };
    return info;
  }
  //--------------------------------testzone-------------------------------- 
  // changeModelTest: function (target) {
  //   //let aaa = "#" + target;
  //   let myModel = document.getElementById("earthModel");
  //   myModel.removeAttribute("gltf-model");
  //   myModel.setAttribute("gltf-model", "#" + target);

  // },
  //--------------------------------testzone--------------------------------
  init();
});