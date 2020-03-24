function MyPanel(viewer, container, id, title, options){
	this.viewer = viewer;
	Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

	this.container.classList.add('docking-panel-container-solid-color-a');
	this.container.style.top = "100px";
	this.container.style.left = "100px";
	this.container.style.width = "300px";
	this.container.style.height = "300px";
	this.container.style.resize = "auto";

	var div = document.createElement('div');
	div.id = 'MainPanel';
	//div.style.margin = '20px';
	//div.innerText = "Hello world";
	this.container.appendChild(div);
	var html = [
      '<div class="uicomponent-panel-container">',
        '<div class="uicomponent-panel-controls-container">',
          '<div>',
            '<button class="btn btn-info" id="addBtn">',
              '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Item',
            '</button>',
            '<input class="uicomponent-panel-input" type="text" placeholder=" Name (default: Date/Time)" id="itemName">',
          '</div>',
          '<br>',
          '<div>',
            '<button class="btn btn-info" id="clearBtn">',
              '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span> <label> Clear  </label>',
            '</button>',
          '</div>',
        '</div>',
        '<div id="PanelContainerId" class="list-group uicomponent-panel-list-container">',
        '</div>',
      '</div>'
    ].join('\n');
	$('#MainPanel').html(html);
}


MyPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype)
MyPanel.prototype.constructor = MyPanel;

//------
function MyPanelExtension(viewer, options){
	Autodesk.Viewing.Extension.call(this, viewer, options);
	this.panel = null;
}

MyPanelExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype)
MyPanelExtension.prototype.constructor = MyPanelExtension;


MyPanelExtension.prototype.load = function(){
	if(this.viewer.toolbar){
		this.createUI();
	}else{
		this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
		this.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
	}
	return true;
}

MyPanelExtension.prototype.onToolbarCreated = function(){
	this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
	this.onToolbarCreatedBinded = null;
	this.createUI();
}

MyPanelExtension.prototype.createUI = function(){
	var viewer = this.viewer;
	var panel = this.panel;

	var toolbarButtonShowDockingPanel = new Autodesk.Viewing.UI.Button('ShowMyPanel');
	toolbarButtonShowDockingPanel.onClick = function(e){
		if(panel ==null){
			panel = new MyPanel(viewer, viewer.container, 'extensionpanel', 'myextension');
		}
		panel.setVisible(!panel.isVisible());
	}

	toolbarButtonShowDockingPanel.addClass('ShowPanelToolbarButton');
	toolbarButtonShowDockingPanel.setToolTip('Show Panelxxx');

	this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('CustomToolbar2');
	this.subToolbar.addControl(toolbarButtonShowDockingPanel);

	viewer.toolbar.addControl(this.subToolbar)
}

MyPanelExtension.prototype.unload = function(){
	this.viewer.toolbar.removeControl(this.subToolbar);
}


Autodesk.Viewing.theExtensionManager.registerExtension('MyPanelExtension',MyPanelExtension);

