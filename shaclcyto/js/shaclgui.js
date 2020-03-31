	var cy = null;
	var posShacl = null;
	var origShacl = null;
	var nodes = new Map();
	document.addEventListener('DOMContentLoaded', function() {

		var cy = window.cy = cytoscape({
			container : document.getElementById('cy'),

			style : [ {
				selector : 'node',
				style : {
					'label' : 'data(label)',
					'width' : '60px',
					'height' : '60px',
					'color' : 'blue',
					'background-fit' : 'contain',
					'background-clip' : 'none'
				}
			}, {
				selector : 'edge',
				style : {
					'label' : 'data(label)',
					'text-background-color' : 'yellow',
					'text-background-opacity' : 0.4,
					'width' : '6px',
					'target-arrow-shape' : 'triangle',
					'control-point-step-size' : '140px'
				}
			} ],
			layout : {
				name : 'breadthfirst'
			},

			elements : {
				nodes : [],
				edges : []
			},
		});

		cy.on('click', 'node', function(evt) {
			printSelected();
		});

		var selectAllOfTheSameType = function(ele) {
			cy.elements().unselect();
			if (ele.isNode()) {
				cy.nodes().select();
			} else if (ele.isEdge()) {
				cy.edges().select();
			}
		};
		var unselectAllOfTheSameType = function(ele) {
			if (ele.isNode()) {
				cy.nodes().unselect();
			} else if (ele.isEdge()) {
				cy.edges().unselect();
			}
		};

		var removed;
		var removedSelected;
		var pos;
		var orig;
		var idnew;

		// demo your core ext
		var contextMenu = cy.contextMenus({
			menuItems : [ {
				id : 'addShaclShape',
				content : 'addShaclShape',
				selector : 'node, edge',
				coreAsWell : true,
				onClickFunction : function(event) {
					pos = event.position || event.cyPosition;
					orig = event.target || event.cyTarget;
					origShacl = orig;
					test = pos;
					showAddDiv("addShDiv");
				},
				hasTrailingDivider : true
			}, {
				id : 'remove',
				content : 'remove',
				selector : 'node, edge',
				onClickFunction : function(event) {
					var target = event.target || event.cyTarget;
					removed = target.remove();

					contextMenu.showMenuItem('undo-last-remove');
				},
				hasTrailingDivider : true
			}, {
				id : 'undo-last-remove',
				content : 'undo last remove',
				selector : 'node, edge',
				show : false,
				coreAsWell : true,
				onClickFunction : function(event) {
					if (removed) {
						removed.restore();
					}
					contextMenu.hideMenuItem('undo-last-remove');
				},
				hasTrailingDivider : true
			}, {
				id : 'hide',
				content : 'hide',
				selector : '*',
				onClickFunction : function(event) {
					var target = event.target || event.cyTarget;
					target.hide();
				},
				disabled : false
			}, {
				id : 'add-node',
				content : 'add node',
				coreAsWell : true,
				onClickFunction : function(event) {
					var data = {
						group : 'nodes'
					};

					var pos = event.position || event.cyPosition;

					cy.add({
						data : data,
						position : {
							x : pos.x,
							y : pos.y
						}
					});
				}
			}, {
				id : 'remove-selected',
				content : 'remove selected',
				coreAsWell : true,
				show : true,
				onClickFunction : function(event) {
					removedSelected = cy.$(':selected').remove();

					contextMenu.hideMenuItem('remove-selected');
					contextMenu.showMenuItem('restore-selected');
				}
			}, {
				id : 'restore-selected',
				content : 'restore selected',
				coreAsWell : true,
				show : false,
				onClickFunction : function(event) {
					if (removedSelected) {
						removedSelected.restore();
					}
					contextMenu.showMenuItem('remove-selected');
					contextMenu.hideMenuItem('restore-selected');
				}
			}, {
				id : 'select-all-nodes',
				content : 'select all nodes',
				selector : 'node',
				show : true,
				onClickFunction : function(event) {
					selectAllOfTheSameType(event.target || event.cyTarget);

					contextMenu.hideMenuItem('select-all-nodes');
					contextMenu.showMenuItem('unselect-all-nodes');
				}
			}, {
				id : 'unselect-all-nodes',
				content : 'unselect all nodes',
				selector : 'node',
				show : false,
				onClickFunction : function(event) {
					unselectAllOfTheSameType(event.target || event.cyTarget);

					contextMenu.showMenuItem('select-all-nodes');
					contextMenu.hideMenuItem('unselect-all-nodes');
				}
			}, {
				id : 'select-all-edges',
				content : 'select all edges',
				selector : 'edge',
				show : true,
				onClickFunction : function(event) {
					selectAllOfTheSameType(event.target || event.cyTarget);

					contextMenu.hideMenuItem('select-all-edges');
					contextMenu.showMenuItem('unselect-all-edges');
				}
			}, {
				id : 'unselect-all-edges',
				content : 'unselect all edges',
				selector : 'edge',
				show : false,
				onClickFunction : function(event) {
					unselectAllOfTheSameType(event.target || event.cyTarget);

					contextMenu.showMenuItem('select-all-edges');
					contextMenu.hideMenuItem('unselect-all-edges');
				}
			} ]
		});
	});
	function printNodes() {
		var p = JSON.stringify(cy.elements().jsons());
		document.getElementById('txtCode').innerHTML = p;
	}
	
	function printSelected() {
		document.getElementById('txtCode').innerHTML = "";
		document.getElementById("txtShacl").innerHTML = "";
		var id = cy.$(':selected').id();
		var classText = "" + nodes.get(id);
		try {
			if (classText.includes("sh:")) {
				document.getElementById('txtShacl').innerHTML = classText;
			} else {
				document.getElementById('txtCode').innerHTML = classText;
			}
		} catch (err) {
			document.getElementById("txtShacl").innerHTML = err.message;
		}
	}
	
	function showAddDiv(div) {
		var modal = document.getElementById(div);
		modal.style.display = "block";
	}
	
	function addClass() {
		var className = document.getElementById("txtClassName").value;
		var classExtend = document.getElementById("txtClassExtend").value;
		var prop1 = document.getElementById("txtProp1").value;
		var value1 = document.getElementById("txtValue1").value;
		var prop2 = document.getElementById("txtProp2").value;
		var value2 = document.getElementById("txtValue2").value;
		var ttl = new Turtle(className, classExtend);
		ttl.addProperty(prop1, value1);
		ttl.addProperty(prop2, value2);
		var txtTurtle = ttl.printTurtle();
		document.getElementById('txtCode').innerHTML = txtTurtle;
		
		var eles = cy.add([
		  { group: 'nodes', data: { id: className, label: className }, position: { x: 100, y: 100 } }
		]);
		nodes.set(className, txtTurtle);
		var modal = document.getElementById("addDiv");
	  	modal.style.display = "none";
	}
	
	// When the user clicks on <span> (x), close the modal
	function spanClick(div) {
		var modal = document.getElementById(div);
	  	modal.style.display = "none";
	}
	
	function addShacl(){
		var pos = origShacl.position;
		var orig = origShacl;
		
		var className = document.getElementById("txtShClassName").value;
		var targetClass = orig.id();
		var prop1 = document.getElementById("txtShProp1").value;
		var value1 = document.getElementById("txtShValue1").value;
		var prop2 = document.getElementById("txtShProp2").value;
		var value2 = document.getElementById("txtShValue2").value;
		var shacl = new ShaclData(className, targetClass);
		shacl.addProperty(prop1);
		shacl.addProperty(prop2);
		var v1 = [value1, value1];
		var v2 = [value2, value2];
		shacl.setPropertyValues(prop1, v1);
		shacl.setPropertyValues(prop2, v2);
		var txtShacl = shacl.printShacl();
		document.getElementById('txtShacl').innerHTML = txtShacl;
		
		console.log(targetClass);
		cy.add([ {
			group : 'nodes',
			data : {
				id : className,
				label : className
			},
			position : {
				x : 400,
				y : 100
			}
		}, {
			group : 'edges',
			data : {
				id : targetClass + '-' + className,
				label : 'validatedBy',
				source : targetClass,
				target : className
			}
		} ]);
		nodes.set(className, txtShacl);
		var modal = document.getElementById("addShDiv");
	  	modal.style.display = "none";
	}
	
	function shaclValidation(){
		alert("TODO: validate this");
	}