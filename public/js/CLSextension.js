
function CLSExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

CLSExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
CLSExtension.prototype.constructor = CLSExtension;
var beSelectedElement = null;
var api_addr = "http://localhost:9453";
CLSExtension.prototype.onSelectionEvent = function(event) {
    var sel = this.viewer.getSelection();
    var view = this.viewer;
    beSelectedElement = null;
    if(sel){
      function isGoal(property){
        if((property.attributeName == 'LcIFCProperty:IFCString') && (property.displayName == 'TAG'))
          return true;
        return false;
      }
      function isParent(property){
        if(property.attributeName == 'parent')
          return true;
        return false;
      }
      function getGoal(v, target, deep){
        if(deep > 5) return;
        v.getProperties(target, function(ObjProps){
          if(ObjProps){
            for(var index in ObjProps.properties){
              var Prop = ObjProps.properties[index];
              //找到名字屬性
              if(findGoal && Prop.displayName == "NAME"){
                break;
              }
              //確定是目標元件
              if(isGoal(Prop)){
                findGoal = true;
                beSelectedElement = Prop;
                console.log(window.localStorage["ngStorage-tkn"].slice(1, -1))
                window.localStorage["ngStorage-selectItem"] = Prop.displayValue;
                //設定header
                $.ajaxSetup({
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('vic-token', window.localStorage["ngStorage-tkn"].slice(1, -1));
                    }
                });
                //向後端抓資料
                $.ajax({
                  type:"POST",
                  data:{
                    bimid: Prop.displayValue ,
                    pid:window.localStorage["ngStorage-selectProject"].slice(1, -1)
                  },
                  url:api_addr+"/api/check/checkitems",
                  success:function(data){
                    if(data["CODE"] == "SUC028-1"){

                    }
                    $('.picturewall').modal('show');
                    //更新view
                  }
                })
                break;
              }
              //如果是parent 優先權最低
              if(isParent(Prop)){
                target = parseInt(Prop.displayValue);
              }
            }
            getGoal(v, target, deep + 1);
          }
        })
      }

      var findGoal = false;
      var deep = 0;
      var target = sel[0];
      // do
      getGoal(view, target, deep);
    
    }
    
};
CLSExtension.prototype.onToolbarCreated = function() {
  this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  this.onToolbarCreatedBinded = null;
  this.createUI();
};

CLSExtension.prototype.createUI = function() {
  var viewer = this.viewer;
  // Button 1
  var clsBtn = new Autodesk.Viewing.UI.Button('my-view-front-button');
  clsBtn.onClick = function(e) {
    if(beSelectedElement){
      alert(beSelectedElement);
    }else{
      alert("u have not select anything")
    }
  };
  clsBtn.addClass('my-view-front-button');
  clsBtn.setToolTip('查看照片');


  // SubToolbar
  this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-view-toolbar');
  this.subToolbar.addControl(clsBtn);
  viewer.toolbar.addControl(this.subToolbar);
};

CLSExtension.prototype.load = function() {

	this.onSelectionBinded = this.onSelectionEvent.bind(this);
  this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);

  if (this.viewer.toolbar) {
    // Toolbar is already available, create the UI
    this.createUI();
  } else {
    // Toolbar hasn't been created yet, wait until we get notification of its creation
    this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
    this.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  }
  return true;
};


CLSExtension.prototype.unload = function() {
  this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
  this.onSelectionBinded = null;

  this.viewer.toolbar.removeControl(this.subToolbar);
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('CLSExtension', CLSExtension);


