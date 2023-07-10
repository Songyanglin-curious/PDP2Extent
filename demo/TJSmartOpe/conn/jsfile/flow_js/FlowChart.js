//
var DrawFlow = function () {
    this.click = null;
    this.dblClick = null;
    this.contextMenu = null;
    this.drag = null;
    this.dragStart = null;
    this.dragEnd = null;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    var shapeType = {
        "roundRect": 0,//圆角矩形
        "ellipse": 1,//椭圆
        "diamond": 2,//菱形
        "arrowLine": 3,//箭头折线
        "diamondLine": 4//菱形折线
    }
    var _this = this;
    this.flowStepInfo = null;
    this.flowActionInfo = null;
    //var scaleVector = 1;
    this.selectedObj = null;
    this.drawModel = 0;//默认连线模式，1为移动模式
    var action_new = null;
    var moveInfo_new = null;
    //初始化绘制环境
    this.initContainer = function (parentDom,backColor) {
        container = document.createElement('div');
        parentDom.appendChild(container);

        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 30000);
        this.camera.position.set(500, 500, 2300);
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x333333, 1.0);

        container.appendChild(this.renderer.domElement);

    }

    //更新相机位置
    this.updateCameraPos = function (flowStepInfo) {
        if (flowStepInfo.length == 0) return;
        var minX = flowStepInfo[0].position_X, maxX = flowStepInfo[0].position_X, minY = flowStepInfo[0].position_Y, maxY = flowStepInfo[0].position_Y;
        //找出区域变电站的坐标范围
        for (var i = 1, l = flowStepInfo.length; i < l; i++) {
            if (minX > flowStepInfo[i].position_X) { minX = flowStepInfo[i].position_X; }
            else if (maxX < flowStepInfo[i].position_X) { maxX = flowStepInfo[i].position_X; }
            if (minY > flowStepInfo[i].position_Y) { minY = flowStepInfo[i].position_Y; }
            else if (maxY < flowStepInfo[i].position_Y) { maxY = flowStepInfo[i].position_Y; }
        }
        var center = new THREE.Vector3((minX + maxX) * 0.5, (minY + maxY) * 0.5, 0);
        var position_W = new THREE.Vector2(center.x, center.y);// THREE.getWorldVecByScreenVec({ x: center.x, y: center.y }, _this.renderer, _this.camera);

        this.camera.position.x = position_W.x;
        this.camera.position.y = -position_W.y;
        //this.camera.position.z *= scaleVector;
    }
    //渲染
    this.render = function () {
        this.renderer.render(this.scene, this.camera);
    }

    //重置窗口windowResize
    this.windowResize = function (cWidth, cHeight) {
        this.camera.aspect = cWidth / cHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(cWidth, cHeight);
    }
    //绘制type类型图元
    this.addFlowShape = function (type, shapeInfo) {//shapeInfo 
        var flowShape = null;
        switch (shapeType[type]) {
            case 0: { flowShape = new THREE.RoundedRectShape(shapeInfo.width, shapeInfo.height, shapeInfo.roundRadius); break; }
            case 1: { flowShape = new THREE.EllipseShape(shapeInfo.width, shapeInfo.height); break; }
            case 2: { flowShape = new THREE.DiamondShape(shapeInfo.width, shapeInfo.height); break;}
            case 3: {
                var lineVecW = shapeInfo.connVec_W;
                flowShape = new THREE.ArrowLineShape (lineVecW); break;
            }
        }

        if (shapeType[type] < 3) {
            var flowObj = this.drawFlowShapeObj(flowShape.shape, shapeInfo.color, shapeInfo.borderColor, new THREE.Vector3(shapeInfo.position_X, shapeInfo.position_Y, 0), shapeInfo.scale, shapeType[type], shapeInfo.id);
            flowObj.userData.name = shapeInfo.name;
            flowObj.userData.id = shapeInfo.id;
            flowObj.userData.shapeType = shapeType[type];
            this.scene.add(flowObj);
            return flowObj;
        }
        else if (shapeType[type] == 3 || shapeType[type] == 4) {
            var flowObj = this.drawLine(flowShape.shape, shapeInfo.color, new THREE.Vector3(shapeInfo.position_X, shapeInfo.position_Y, 0), shapeInfo.scale, shapeType[type], shapeInfo.id, { width: shapeInfo.arrowWidth, height: shapeInfo.arrowHeight }, shapeInfo.isWait, { width: shapeInfo.start.width, height: shapeInfo.start.height });
            flowObj.userData.id = shapeInfo.id;
            flowObj.userData.shapePoints = shapeInfo.linePoints;
            flowObj.userData.name = shapeInfo.name;
            flowObj.userData.startID = shapeInfo.start.id;
            flowObj.userData.endID = shapeInfo.end ? shapeInfo.end.id : null;
            flowObj.userData.isWait = shapeInfo.isWait;
            flowObj.userData.drawDir = shapeInfo.drawDir;
            flowObj.userData.shapeType = shapeType[type];
            this.scene.add(flowObj);
            return flowObj;
        }
    }

    //画线
    this.drawLine = function (shape, color, position, s, type, shapeID, arrowInfo, isWait, sMeshInfo) {
        // lines
        var obj = null;
        var points = shape.createPointsGeometry().vertices;
        if (type == shapeType["arrowLine"]) {//
            obj = _this.drawLineWithArrow(shape, points, color, s, arrowInfo);
        } 
        if (isWait == 1)//始端菱形
        {
            obj = _this.drawLineWithDiamond(shape, points, color, s, arrowInfo, sMeshInfo);
        }
        obj.userData.shapeID = shapeID;
        obj.userData.type = type;
        return obj;
    }

    //起始端带菱形的连线
    this.drawLineWithDiamond = function (shape, points, color, s, arrowInfo, sMeshInfo) {
        var obj = new THREE.Object3D();
        var line = new THREE.FlowLine(shape, color);
        var flowShape = new THREE.DiamondShape(arrowInfo.width, arrowInfo.height);
        var flowMesh = new THREE.FlowShapeMesh(flowShape.shape, color);
        flowMesh.scale.set(s, s, s);
        flowMesh.position.set(points[0].x + sMeshInfo.width / 2, points[0].y - sMeshInfo.height / 2, 0);
        obj.add(flowMesh);
        obj.add(line);
        return obj;
    }
    //带箭头的连线
    this.drawLineWithArrow = function (shape, points, color, s, arrowInfo) {
        var obj = new THREE.Object3D();
        var line = new THREE.FlowLine(shape, color);
        var dir = new THREE.Vector3().subVectors(points[points.length - 1], points[points.length - 2]);
        dir.normalize();
        var length = 0;
        var origin = points[points.length - 1];
        var arrowHelper = drawArrowHepler(dir, origin, color, arrowInfo, 0);
        arrowHelper.scale.set(s, s, s);
        obj.add(arrowHelper);
        obj.add(line);
        return obj;
    }

    //图元添加外边框
    this.drawFlowShapeObj = function (shape, color,borderColor, position, s, type, shapeID) {
        var flowShapeMesh = new THREE.FlowShapeMesh(shape, color);
        var flowLine = new THREE.FlowLine(shape, borderColor);
        var flowObj = new THREE.Object3D();
        flowObj.add(flowLine);
        flowObj.add(flowShapeMesh);
        flowObj.position.set(position.x, -position.y, 0);
        return flowObj;
    }

    //画箭头
    var drawArrowHepler = function (dir, origin, color, arrowInfo, length)
    {
        if (length == undefined || length == 0) length = arrowInfo.width + 0.1;
        console.log(origin);
        dir.multiplyScalar(length);
        origin.sub(dir);
        console.log(origin);
        var arrowHelper = new THREE.ArrowHelper(dir, origin, length, color, arrowInfo.width, arrowInfo.height);
        return arrowHelper;
    }

    //画文字
    this.drawFontText = function (flowInfo) {
        var width = flowInfo.width ? flowInfo.width : 200;
        var height = flowInfo.height ? flowInfo.height : 150;
        for (var i = 0; i < flowInfo.length; i++) {
            var flow = flowInfo[i];
            var tempMesh = _this.drawText(flow.name, flow.position_X , flow.position_Y, width, height, 50, "#1d4ace");
            tempMesh.userData.id = flowInfo[i].id;
            tempMesh.userData.type = "planeText";
            tempMesh.userData.text = flow.name;
            _this.scene.add(tempMesh);
        }
    }

    //更新图元颜色
    this.updateShapeColor = function (type, shapeInfo) {
        var sceneChildren = this.scene.getObjectByMultUserData({ type: shapeType[type] });
        if (shapeType[type] == 3) {
            for (var i = 0; i < sceneChildren.length; i++) {
                if (sceneChildren[i].userData.shapeID == shapeInfo.id) {
                    var material = sceneChildren[i].children[0].material.clone();
                    material.color.set(shapeInfo.color);
                    sceneChildren[i].children[0].material = material;
                    sceneChildren[i].children[1].children.forEach(function (item) {
                        var material = item.material.clone();
                        material.color.set(shapeInfo.color);
                        item.material = material;
                    });
                    break;
                }
            }
        } else {
            for (var i = 0; i < sceneChildren.length; i++) {
                if (sceneChildren[i].userData.shapeID == shapeInfo.id) {
                    var material = sceneChildren[i].material.clone();
                    material.emissive.set(shapeInfo.color);
                    sceneChildren[i].material = material;
                    break;
                }
            }
        }
    }

    //更新图元大小
    this.updateShapeScale = function (type, shapeInfo) {
        var sceneChildren = this.scene.getObjectByMultUserData({ type: shapeType[type] });
        for (var i = 0; i < sceneChildren.length; i++) {
            if (sceneChildren[i].userData.shapeID == shapeInfo.id) {
                if (shapeInfo.scale_X)
                {
                    sceneChildren[i].scale.x = shapeInfo.scale_X;
                }
                if (shapeInfo.scale_Y) {
                    sceneChildren[i].scale.y = shapeInfo.scale_Y;
                }
                break;
            }
        }
    }

    //绘制流程图
    this.redrawFlow_bak = function (flowStepInfo, flowActionInfo) {
        this.removeAllObjectMesh();
       if (flowStepInfo)//绘制节点
       {
           this.flowStepInfo = flowStepInfo;
           for (var i = 0; i < flowStepInfo.length; i++)
           {
               var step = flowStepInfo[i];
               _this.addFlowShape(step.type, step);
           }
           this.drawFontText(flowStepInfo);//绘制文字
       }

       if (flowActionInfo)//绘制动作
       {
           this.flowActionInfo = flowActionInfo;
           for (var i = 0; i < flowActionInfo.length; i++) {
               var action = flowActionInfo[i];
               //var lineVecW = getConnLinePoints(action);
               //if (lineVecW.length == 0) continue;
               //action.connVec_W = lineVecW;
               if (action.linePoints == "") {//有绘制方向
                   var lineVecW = getConnLinePoints(action);
                   action.connVec_W = lineVecW;
               } else {//有绘制的连接点css字符串
                   var lineVecW = strConvertToVec3_W(action.linePoints);
                   action.connVec_W = lineVecW;
               }
               getTextPos_W(flowActionInfo[i]);
               _this.addFlowShape(action.type, action);
           }
           this.drawFontText(flowActionInfo);//绘制文字
       }
   }

    //绘制流程图
    this.redrawFlow = function (flowStepInfo, flowActionInfo) {
        this.removeAllObjectMesh();
        if (flowStepInfo)//绘制节点
        {
            this.flowStepInfo = flowStepInfo;
            for (var i = 0; i < flowStepInfo.length; i++) {
                var step = flowStepInfo[i];
                _this.addFlowShape(step.type, step);
            }
            this.drawFontText(flowStepInfo);//绘制文字
        }

        if (flowActionInfo)//绘制动作
        {
            this.flowActionInfo = flowActionInfo;
            for (var i = 0; i < flowActionInfo.length; i++) {
                var action = flowActionInfo[i];
                var lineVecW = getConnLinePoints(action);
                if (lineVecW.length == 0) continue;
                action.connVec_W = lineVecW;
                getTextPos_W(flowActionInfo[i]);
                _this.addFlowShape(action.type, action);
            }
            this.drawFontText(flowActionInfo);//绘制文字
        }
    }

   //根据绘制方向确定绘制线世界坐标连接点
   var getConnLinePoints_bak = function (flowActionInfo, updateInfo) {
        // var pts = flowActionInfo.flowobj.getActionPoints();
        //var connPoints = [];
        //for (var i = 0; i + 1 < pts.length; i += 2) {
        //    connPoints.push(new THREE.Vector3(pts[i], -pts[i + 1], 0));
        //}
        //return connPoints;

       var connPoints = [];
       var startVec_W = null, endVec_W = null;
       var drawDir = flowActionInfo.drawDir;
       var posArr = getFlowActionStartEndPos_W(flowActionInfo);
       startVec_W = new THREE.Vector3(posArr[0].x, posArr[0].y, 0);
       endVec_W = new THREE.Vector3(posArr[1].x, posArr[1].y, 0);

       if (drawDir == 3)//先垂直后水平3段
       {
           var centerY = (startVec_W.y + endVec_W.y) * 0.5;
           var secondVec_W = new THREE.Vector3(startVec_W.x, centerY, 0);
           var thirdVec_W = new THREE.Vector3(endVec_W.x, centerY, 0);
           connPoints.push(startVec_W);
           connPoints.push(secondVec_W);
           connPoints.push(thirdVec_W);
           connPoints.push(endVec_W);
       } else if (drawDir == 2)//先垂直后水平2段
       {
           var secondVec_W = new THREE.Vector3(endVec_W.x, startVec_W.y, 0);
           connPoints.push(startVec_W);
           connPoints.push(secondVec_W);
           connPoints.push(endVec_W);
       } else{//直连
           connPoints.push(startVec_W);
           connPoints.push(endVec_W);
       }
       return connPoints;
    }

   //根据绘制方向确定绘制线世界坐标连接点
   var getConnLinePoints = function (flowActionInfo, updateInfo) {
        var pts = flowActionInfo.flowobj.getActionPoints();
       var connPoints = [];
       for (var i = 0; i + 1 < pts.length; i += 2) {
           connPoints.push(new THREE.Vector3(pts[i], -pts[i + 1], 0));
       }
       return connPoints;
   }

   //根据始端末端的相对位置更新绘制方向
   var getDrawDir = function (flowActionInfo) {
       var start = flowActionInfo.start, end = flowActionInfo.end;
       var drawDir = flowActionInfo.drawDir;
       if (flowActionInfo.drawDir == 1)//原来直连
       {
           if (Math.abs(start.position_X - end.position_X) > start.width / 2) {
               flowActionInfo.drawDir = 2;
           } else {
               flowActionInfo.drawDir = 1;
           }
       } else if (flowActionInfo.drawDir == 2)
       {
           if (Math.abs(start.position_X - end.position_X) < start.width / 2) {
               flowActionInfo.drawDir = 1;
           }
       }
   }

    //根据绘制方向计算节点连接处位置
   var getFlowActionStartEndPos_W = function (flowActionInfo) {
       var start = flowActionInfo.start, end = flowActionInfo.end;
       var drawDir = flowActionInfo.drawDir;
       var startPos_X, startPos_Y, endPos_X, endPos_Y;
       if (drawDir == 3)//先垂直后水平3段
       {
           var flag = (start.position_Y - end.position_Y) > 0 ? -1 : 1;
           startPos_X = start.position_X;
           startPos_Y = start.position_Y + flag* start.height / 2;
           endPos_X = end.position_X;
           endPos_Y = end.position_Y - flag * end.height / 2 - flag * flowActionInfo.arrowHeight;
       } else if (drawDir == 2)//先水平后垂直2段
       {
           var flag = (start.position_X - end.position_X) > 0 ? -1 : 1;
           var flagY = (start.position_Y - end.position_Y) > 0 ? -1 : 1;
           startPos_X = start.position_X + flag * start.width / 2;
           startPos_Y = start.position_Y;
           endPos_X = end.position_X;
           endPos_Y = end.position_Y - flagY * end.height / 2 - flagY * flowActionInfo.arrowHeight;
       } else {//直连
           var flag = (start.position_Y - end.position_Y) > 0 ? -1 : 1;
           startPos_X = start.position_X;
           startPos_Y = start.position_Y + flag * start.height / 2;
           endPos_X = end.position_X;
           endPos_Y = end.position_Y - flag * end.height / 2 - flag * flowActionInfo.arrowHeight;
           if (start.type == "diamond") {
               endPos_X = startPos_X;
           } else if (end.type == "diamond")
           {
               startPos_X = endPos_X;

           }
           //if (startPos_X != endPos_X) startPos_X = endPos_X;
       }
       var startVec2_W = new THREE.Vector2(startPos_X, -startPos_Y);// THREE.getWorldVecByScreenVec({ x: startPos_X, y: startPos_Y }, _this.renderer, _this.camera);
       var endVec2_W = new THREE.Vector2(endPos_X, -endPos_Y);//THREE.getWorldVecByScreenVec({ x: endPos_X, y: endPos_Y }, _this.renderer, _this.camera);
       return [startVec2_W, endVec2_W];
   }

   //根据绘制方向计算文字位置
   var getTextPos_W = function (flowActionInfo) {
       var start = flowActionInfo.start, end = flowActionInfo.end;
       var drawDir = flowActionInfo.drawDir;
       if (flowActionInfo.drawDir == 3)//先垂直后水平3段
       {
           if (flowActionInfo.isWait == 0) {
               flowActionInfo.position_X = end.position_X;
               flowActionInfo.position_Y = (end.position_Y + start.position_Y) * 0.5;
           } else if (flowActionInfo.isWait == 1) {
               flowActionInfo.position_X = start.position_X;
               flowActionInfo.position_Y = (end.position_Y + start.position_Y) * 0.5;
           }
       } else if (flowActionInfo.drawDir == 2)//先垂直后水平2段
       {
           var flag = (start.position_X - end.position_X) > 0 ? -1 : 1;
           flowActionInfo.position_X = start.position_X + flag * start.width;
           flowActionInfo.position_Y = start.position_Y;
       } else {//直连
           flowActionInfo.position_X = (start.position_X + end.position_X) / 2;
           flowActionInfo.position_Y = (start.position_Y + end.position_Y) / 2;
       }
   }

    //移动步骤节点
   this.moveFlowStep = function (flowStepMesh, newPosition) {
       moveInfo_new = [];
       var flowStep = null;
       //更新节点新位置
       if (_this.flowStepInfo) {
           for (var i = 0; i < _this.flowStepInfo.length; i++) {
               if (flowStepMesh.userData.id == _this.flowStepInfo[i].id) {
                   flowStep = _this.flowStepInfo[i];
                   _this.updateFlowStepInfo(_this.flowStepInfo[i], { "position_X": newPosition.x, "position_Y": newPosition.y });
                   //var position_W = THREE.getWorldVecByScreenVec({ x: _this.flowStepInfo[i].position_X, y: _this.flowStepInfo[i].position_Y }, _this.renderer, _this.camera);
                   flowStepMesh.position.set(newPosition.x, newPosition.y, 0);
                   moveInfo_new.push(_this.flowStepInfo[i]);
                   break;
               }
           }
       }

       //更新节点文字新位置
       var text = _this.scene.getObjectByMultUserData({ type: "planeText" });
       for (var i = 0, l = text.length; i < l; i++) {
           var flowtext = text[i];
           if (flowtext.userData.id == flowStepMesh.userData.id) {
               //var position_W = THREE.getWorldVecByScreenVec({ x: newFlowStepInfo.position_X, y: newFlowStepInfo.position_Y }, _this.renderer, _this.camera);
               if (flowStep)
               flowtext.position.set(newPosition.x + flowStep.width * 0.5, newPosition.y - flowStep.height * 0.5, 0);
               break;
           }
       }

       //更新连线新位置
       var sceneChildren = _this.scene.getObjectByMultUserData({ type: shapeType["arrowLine"] });
       for (var i = 0, l = sceneChildren.length; i < l;i++)
       {
           var flowAction = sceneChildren[i];
           if (flowAction.userData.startID == flowStepMesh.userData.id|| flowAction.userData.endID == flowStepMesh.userData.id)
           {
               for (var j = 0, m = text.length; j < m; j++) {
                   var flowtext = text[j];
                   if (flowtext.userData.id == flowAction.userData.id) {
                       _this.scene.remove(flowtext);//清除原来的
                       break;
                   }
               }
               _this.scene.remove(flowAction);//清除原来的
               var actionnew = _this.redrawFlowActionAgain(flowAction);//重画连接线
               moveInfo_new.push(actionnew);
           }
       } 
   }

  //更新节点信息
   this.updateFlowStepInfo = function (flowStepInfo, updateInfo) {
       for (var key in updateInfo) {
           if (key == "position_Y") {
               //var screenPos = THREE.getScreenVecByWorldVec(updateInfo[key], _this.camera);
               flowStepInfo.position_Y = -updateInfo[key];
           } else {
               flowStepInfo.position_X = updateInfo[key];
           }
       }
   }
    //重画动作线坐标
   this.redrawFlowActionAgain_bak = function (flowActionObj) {
       var action_new = null;
       if (_this.flowActionInfo)
       {
           for (var i = 0; i < _this.flowActionInfo.length; i++)
           {
               if (flowActionObj.userData.id == _this.flowActionInfo[i].id)
               {
                   var lineVecW = getConnLinePoints(_this.flowActionInfo[i]);
                   //if (lineVecW.length == 0) continue;
                   // _this.flowActionInfo[i].connVec_W = lineVecW;
                   getDrawDir(this.flowActionInfo[i]);
                   if (_this.flowActionInfo[i].linePoints == "") {
                       var lineVecW = getConnLinePoints(_this.flowActionInfo[i]);
                       _this.flowActionInfo[i].connVec_W = lineVecW;
                   } else {
                       var lineVecW = strConvertToVec3_W(_this.flowActionInfo[i].linePoints);
                       _this.flowActionInfo[i].connVec_W = lineVecW;
                   }
                   getTextPos_W(this.flowActionInfo[i]);
                   _this.addFlowShape(_this.flowActionInfo[i].type, _this.flowActionInfo[i]);
                   _this.drawFontText([_this.flowActionInfo[i]]);
                   action_new = _this.flowActionInfo[i];
                   break;
               }
           }
       }
       return action_new;
   }

   //重画动作线坐标
   this.redrawFlowActionAgain = function (flowActionObj) {
       var action_new = null;
       if (_this.flowActionInfo) {
           for (var i = 0; i < _this.flowActionInfo.length; i++) {
               if (flowActionObj.userData.id == _this.flowActionInfo[i].id) {
                   var lineVecW = getConnLinePoints(_this.flowActionInfo[i]);
                   if (lineVecW.length == 0) continue;
                    _this.flowActionInfo[i].connVec_W = lineVecW;
                   getTextPos_W(this.flowActionInfo[i]);
                   _this.addFlowShape(_this.flowActionInfo[i].type, _this.flowActionInfo[i]);
                   _this.drawFontText([_this.flowActionInfo[i]]);
                   action_new = _this.flowActionInfo[i];
                   break;
               }
           }
       }
       return action_new;
   }


    //右键menu：修改步骤，添加新步骤，删除步骤；修改动作，添加新动作，删除动作
   //修改步骤
   this.updateFlowStep = function (updateFlowStepInfo) {
       var sceneChildren = _this.scene.getObjectByMultUserData({ id: updateFlowStepInfo.id });
       if (sceneChildren.length > 0) {
           _this.scene.remove(sceneChildren[0]);//删除原来步骤
           var text = _this.scene.getObjectByMultUserData({ type: "planeText" });
           for (var i = 0, l = text.length; i < l; i++) {
               var flowtext = text[i];
               if (flowtext.userData.id == sceneChildren[0].userData.id) {
                   _this.scene.remove(flowtext);//删除步骤文字
                   break;
               }
           }
           //添加新步骤
           _this.addNewFlowStep(updateFlowStepInfo);
           return 1;//更新成功
       }
       return 0;//更新不成功
   }
   
   //添加新的步骤
   this.addNewFlowStep = function (newFlowStepInfo) {
       _this.addFlowShape(newFlowStepInfo.type, newFlowStepInfo);
       _this.drawFontText([newFlowStepInfo]);
       //更新当前步骤数组
       _this.flowStepInfo.forEach(function (item, index) {
           if (item.id == newFlowStepInfo.id) {
               _this.flowStepInfo.splice(index, 1);
           }
       });
       _this.flowStepInfo.push(newFlowStepInfo);
   }
   //删除步骤
   this.removeFlowStep = function (flowStepMesh) {
       var actions = _this.scene.getObjectByMultUserData({ type: shapeType["arrowLine"] });
       var steps = _this.scene.getObjectByMultUserData({ type: flowStepMesh.userData.shapeType });
       var text = _this.scene.getObjectByMultUserData({ type: "planeText" });
       for (var i = 0, l = steps.length; i < l; i++) {
           var step = steps[i];
           if (step.userData.id == flowStepMesh.userData.id) {
               for (var j = 0, m = text.length; j < m; j++) {
                   var flowtext = text[j];
                   if (flowtext.userData.id == flowStepMesh.userData.id) {
                       _this.scene.remove(flowtext);//清除文字
                       break;
                   }

               }
               for (var k = 0, n = actions.length; k < n; k++) {
                   var flowAction = actions[k];
                   if (flowAction.userData.startID == step.userData.id || flowAction.userData.endID == step.userData.id) {
                       for (var j = 0, m = text.length; j < m; j++) {
                           var flowtext = text[j];
                           if (flowtext.userData.id == flowAction.userData.id) {
                               _this.scene.remove(flowtext);//清除关联的动作文字
                               break;
                           }
                       }
                       _this.scene.remove(flowAction);//清除关联的动作
                       this.flowActionInfo.forEach(function (item, index) {
                           if (item.id == flowAction.userData.id) {
                               _this.flowActionInfo.splice(index, 1);
                           }
                       });
                   }
               }
               _this.scene.remove(step);//清除节点
               break;
           }
       }
       this.flowStepInfo.forEach(function (item, index) {
           if (item.id == flowStepMesh.userData.id) {
               _this.flowStepInfo.splice(index, 1);
           }
       });
   }

   //修改动作
   this.updateFlowAction = function (updateFlowActionInfo) {
       var sceneChildren = _this.scene.getObjectByMultUserData({ id: updateFlowActionInfo.id });
       if (sceneChildren.length > 0) {
           _this.scene.remove(sceneChildren[0]);//删除原来步骤
           var text = _this.scene.getObjectByMultUserData({ type: "planeText" });
           for (var i = 0, l = text.length; i < l; i++) {
               var flowtext = text[i];
               if (flowtext.userData.id == sceneChildren[0].userData.id) {
                   _this.scene.remove(flowtext);//删除步骤文字
                   break;
               }
           }
           //添加新动作
           _this.addNewFlowAction(updateFlowActionInfo);
           return 1;
       }
       return 0;
   }

   //右键添加新动作
   this.addNewFlowAction_bak = function (newFlowActionInfo) {
       //添加新动作
       //var lineVecW = getConnLinePoints(newFlowActionInfo);
       //newFlowActionInfo.connVec_W = lineVecW;
       if (newFlowActionInfo.linePoints == "") {
           var lineVecW = getConnLinePoints(newFlowActionInfo);
           newFlowActionInfo.connVec_W = lineVecW;
       } else {
           var lineVecW = strConvertToVec3_W(newFlowActionInfo.linePoints);
           newFlowActionInfo.connVec_W = lineVecW;
       }
       getTextPos_W(newFlowActionInfo);
       _this.addFlowShape(newFlowActionInfo.type, newFlowActionInfo);
       _this.drawFontText([newFlowActionInfo]);
       //更新当前动作数组
       _this.flowActionInfo.forEach(function (item, index) {
           if (item.id == newFlowActionInfo.id) {
               _this.flowActionInfo.splice(index, 1);
           }
       });
       _this.flowActionInfo.push(newFlowActionInfo);
   }

   //右键添加新动作
   this.addNewFlowAction = function (newFlowActionInfo) {
       //添加新动作
       var lineVecW = getConnLinePoints(newFlowActionInfo);
       newFlowActionInfo.connVec_W = lineVecW;
       getTextPos_W(newFlowActionInfo);
       _this.addFlowShape(newFlowActionInfo.type, newFlowActionInfo);
       _this.drawFontText([newFlowActionInfo]);
       //更新当前动作数组
       _this.flowActionInfo.forEach(function (item, index) {
           if (item.id == newFlowActionInfo.id) {
               _this.flowActionInfo.splice(index, 1);
           }
       });
       _this.flowActionInfo.push(newFlowActionInfo);
   }

   //删除动作
   this.removeFlowAction = function (flowActionObj) {
       var sceneChildren = _this.scene.getObjectByMultUserData({ type: shapeType["arrowLine"] });
       var text = _this.scene.getObjectByMultUserData({ type: "planeText" });
       for (var i = 0, l = sceneChildren.length; i < l; i++) {
           var action = sceneChildren[i];
           if (action.userData.id == flowActionObj.userData.id) {
               for (var j = 0, m = text.length; j < m; j++) {
                   var flowtext = text[j];
                   if (flowtext.userData.id == flowActionObj.userData.id) {
                       _this.scene.remove(flowtext);//清除文字
                       break;
                   }

               }
               _this.scene.remove(flowActionObj);//清除动作
               break;
           }
       }
       this.flowActionInfo.forEach(function (item,index) {
           if (item.id == flowActionObj.userData.id)
           {
               _this.flowActionInfo.splice(index, 1);
           }
       });
   }

   //连线模式下添加新动作
   this.addNewFlowActionByMouse = function (startSelStep, newPosition, endStep, startDragPosition) {
       clearNullFlowActions();

       var startStepInfo = null;
       _this.flowStepInfo.forEach(function (item) {
           if (item.id == startSelStep.userData.id) {
               startStepInfo = item;
           }
       });
       var arrowLineInfo = {
           "type": "arrowLine",
           "id": null,
           "name": "",
           "start": startStepInfo,
           "end": null,
           "linePoints": "",
           "drawDir": 1,
           "isWait": 0,
           "waitDuanzi": null,
           "color": 0xff8000,
           "scale": 5,
           "arrowWidth": 5,
           "arrowHeight": 5,
           "position_X": 400,
           "position_Y": 1260
       };
       var lineVecW = [startDragPosition, newPosition];
       arrowLineInfo.connVec_W = lineVecW;
       _this.addFlowShape(arrowLineInfo.type, arrowLineInfo);

       //if (endStep && endStep.userData.id != startSelStep.userData.id)//若有节点，添加新动作并显示出来
       //{
       //    var endStepInfo = null;
       //    _this.flowStepInfo.forEach(function (item) {
       //        if (item.id == endStep.userData.id) {
       //            endStepInfo = item;
       //        }
       //    });
       //    arrowLineInfo.end = endStepInfo;
       //    arrowLineInfo.id = startSelStep.userData.id + "_" + endStepInfo.id;
       //    //arrowLineInfo.drawDir = 2;
       //    _this.flowActionInfo.push(arrowLineInfo);//添加新的动作

       //    var actions = _this.scene.getObjectByMultUserData({ type: shapeType["arrowLine"] });
       //    actions.forEach(function (item) {
       //        if (item.userData.id == null) {
       //            _this.scene.remove(item);
       //        }
       //    });
       //    var lineVecW = getConnLinePoints(arrowLineInfo);
       //    arrowLineInfo.connVec_W = lineVecW;
       //    _this.addFlowShape(arrowLineInfo.type, arrowLineInfo);//显示新动作
       //    action_new = arrowLineInfo;
       //} else {
       //    action_new = null;
       //}
   } 

   var clearNullFlowActions = function () {
       var actions = _this.scene.getObjectByMultUserData({ type: shapeType["arrowLine"] });
       actions.forEach(function (item) {
           if (item.userData.id == null) {
               _this.scene.remove(item);
           }
       });
   }

   //字符串转为vec3
   function strConvertToVec3_W(pointStr) {
       var points = pointStr.split(",");
       var lineVecW = [];
       for (var i = 0; i < points.length / 2; i++) {
           var position_W = new THREE.Vector2(parseFloat(points[i * 2]), -points[i * 2 + 1]);// THREE.getWorldVecByScreenVec({ x: points[i * 2], y: points[i * 2 + 1] }, _this.renderer, _this.camera);
           lineVecW.push(position_W);
       }
       return lineVecW;
   }

    //事件处理
   this.addMouseEventFun = function () {
       var flowControls = new THREE.FlowControls(this.scene.children, this.camera, this.renderer.domElement);
       flowControls.addEventListener('dragstart', function (event) {//
           flowControls.drawModel = _this.drawModel;
           _this.selectedObj = event.object;
           if (_this.dragStart) {
               _this.dragStart(event.object);
           }
       });

       flowControls.addEventListener('drag', function (event) {
           if (_this.drawModel == 0) {//连线模式
               _this.addNewFlowActionByMouse(_this.selectedObj, event.newPosition, event.object, event.startDragPosition);
               if (_this.drag) {
                   _this.drag(_this.selectedObj, event.newPosition);
               }
           } else if (_this.drawModel == 1) //移动模式
           {
               _this.moveFlowStep(event.object, event.object.position);
               if (_this.drag) {
                   _this.drag(event.object, event.object.position);
               }
           }
       });
       flowControls.addEventListener('dragend', function (event) {
           if (_this.drawModel == 0) {//连线模式
               _this.selectedObj = null;
               clearNullFlowActions();
               if (_this.dragEnd) {
                   _this.dragEnd(action_new);//返回新添加的动作
               }
           } else if (_this.drawModel == 1) {//移动模式
               if (_this.dragEnd) {
                   _this.dragEnd(moveInfo_new);//返回新添加的动作
               }
           }
       });
       flowControls.addEventListener('click', function (event) {//单击
           clearNullFlowActions();
           if (_this.click) {
               _this.click(getSelObj(event.object));
           }
           //_this.selectedObj = getSelObj(event.object);
       });
       flowControls.addEventListener('contextMenu', function (event) {//右键菜单
           clearNullFlowActions();
           if (_this.contextMenu)
           {
               _this.contextMenu(getSelObj(event.object));
           }
           //_this.selectedObj = getSelObj(event.object);
       });
       flowControls.addEventListener('dblclick', function (event) {//双击
           clearNullFlowActions();
           if (_this.dblClick)
           {
               _this.dblClick(getSelObj(event.object));
           }
           //_this.selectedObj = getSelObj(event.object);
       });
   }

    //获取鼠标选中的物体
   var getSelObj = function (event) {
       var selObj = null;
       var intersects = GetIntersectObjects(event);
       if (intersects.length == 0) return;
       var flag = -1;
       if (intersects) {
           for (var i = 0; i < intersects.length; i++) {
               if (intersects[i].object.type == "Sprite" || intersects[i].object.parent.type == "Sprite")
                   continue;
               if (intersects[i].object.type == "FlowShapeMesh") {
                   selObj = intersects[i].object.parent;
                   flag = 1;
                   break;
               } else if (intersects[i].object.type == "FlowLine")
               {
                   selObj = intersects[i].object.parent;
                   flag = 0;
                   break;
               }
           }
           //console.log(selObj);
           if (selObj) {
               _this.selectedObj = selObj;
               if (flag == 1)//步骤节点
               {
                   for (var i = 0; i < _this.flowStepInfo.length; i++) {
                       if (_this.flowStepInfo[i].id == selObj.userData.id) {
                           selObj = _this.flowStepInfo[i];
                           break;
                       }
                   }
               } else if (flag == 0)//动作
               {
                   for (var i = 0; i < _this.flowActionInfo.length; i++) {
                       if (_this.flowActionInfo[i].id == selObj.userData.id) {
                           selObj = _this.flowActionInfo[i];
                           break;
                       }
                   }
               }
           }
          
       }
       return selObj;
   }

   var GetIntersectObjects = function (event) {
       var vector = new THREE.Vector3();//三维坐标对象   
       var Sx = event.offsetX;
       var Sy = event.offsetY;
       vector.set(
           (Sx / _this.renderer.domElement.clientWidth) * 2 - 1,
           - (Sy / _this.renderer.domElement.clientHeight) * 2 + 1,
           0.5);

       var vector = vector.unproject(_this.camera);
       var raycaster = new THREE.Raycaster(_this.camera.position, vector.sub(_this.camera.position).normalize());
       raycaster.linePrecision = 20;

       var intersects = [];
       var clock = new THREE.Clock();

       if (intersects.length == 0) {
           intersects = raycaster.intersectObjects(_this.scene.children, true);
       }
       return intersects;
   }

    //根据图元id获取图元
   this.getObjectMesh = function (id) {
       var sceneChildren = this.scene.getObjectByMultUserData({ id: id });
       if (sceneChildren.length == 0) return;
       return sceneChildren[0];
   }

   //删除所有图元
   this.removeAllObjectMesh = function () {
       var sceneChildren = this.scene.children;
       for (var i = 0; i < sceneChildren.length;) {
           if (sceneChildren[i].type == "Mesh" || sceneChildren[i].type == "Object3D" || sceneChildren[i].type == "Sprite") {
               _this.scene.remove(sceneChildren[i]);

           } else {
               i++;
           }
       }
   }

   //根据id更新边框颜色color，可设置"#fff"字符串形式
   this.updateFlowMeshLineColor = function (shapeID, color) {
       var shapeMesh = this.getObjectMesh(shapeID);
       if (shapeMesh)
       {
           for (var i = 0; i < shapeMesh.children.length; i++)
           {
               if (shapeMesh.children[i].type == "FlowLine")
               {
                   shapeMesh.children[i].updateLineColor(color);
                   break;
               }
           }
       }
   }

   //根据id更新图元颜色color，可设置"#fff"形式
   this.updateFlowMeshColor = function (shapeID, color) {
       var shapeMesh = this.getObjectMesh(shapeID);
       if (shapeMesh) {
           for (var i = 0; i < shapeMesh.children.length; i++) {
               if (shapeMesh.children[i].type == "FlowShapeMesh") {
                   shapeMesh.children[i].updateShapeColor(color);
                   break;
               }
           }
       }
   }

   //根据id更新文本颜色color，可设置"#fff"形式
   this.updateFlowTextColor = function (shapeID, color) {
       var sceneChildren = this.scene.getObjectByMultUserData({ id: shapeID });
       if (sceneChildren.length > 0) {
           for (var j = 0; j < sceneChildren.length; j++) {
               if (sceneChildren[j].type == "Sprite") {
                   var shapeMesh = sceneChildren[j];
                   var textCtx = shapeMesh.material.map.image.getContext("2d");
                   if (color != null && color != "") {
                       textCtx.fillStyle = color;
                       textCtx.fillText(shapeMesh.userData.text, textCtx.canvas.width / 2, textCtx.canvas.height / 2);
                   }
               }
           }
          
       }
   }
}

//获取场景中的图元
THREE.Object3D.prototype.getObjectByMultUserData = function (params) {
    var selInfo = [];
    var keyCount = 0;
    var sameCount = 0;
    for (var key in params) {
        keyCount++;
        if (this.userData[key] != params[key]) {
            continue;

        }
        else {
            sameCount++;
        }
    }
    if (keyCount == sameCount) {
        selInfo.push(this);
        return selInfo;
    }

    for (var i = 0, l = this.children.length; i < l; i++) {
        var child = this.children[i];
        if (!child.getObjectByMultUserData)
            continue;
        var object = child.getObjectByMultUserData(params);

        if (object.length > 0) {
            for (var k = 0; k < object.length; k++) {
                selInfo.push(object[k]);
            }
        }
    }
    return selInfo;

}

//世界坐标转屏幕坐标
THREE.getScreenVecByWorldVec = function (world_vector,camera) {
    var vector = world_vector.clone().project(camera);
    var halfWidth = renderer.domElement.clientWidth / 2,
        halfHeight = renderer.domElement.clientHeight / 2;
    return {
        x: Math.round(vector.x * halfWidth + halfWidth),
        y: Math.round(-vector.y * halfHeight + halfHeight)
    }; 
};
//屏幕坐标转世界坐标
THREE.getWorldVecByScreenVec = function (screenPoint, renderer, camera) {
    var pX = (screenPoint.x / renderer.domElement.clientWidth) * 2 - 1;
    var pY = - (screenPoint.y / renderer.domElement.clientHeight) * 2 + 1;
    var p = new THREE.Vector3(pX, pY, 0.5).unproject(camera);
    return new THREE.Vector2(p.x, p.y); 
};

//绘制文字
DrawFlow.prototype.drawText = function (text, x, y, width, height, fontsize, fillStyle) {
    //使用CANVAS纹理方式创建文本
    var font = "宋体";
    var bold = false;
    var rowInteval = 5;

    var tmpTextArr = text.split('\n');
    var textArr = [];
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = fontsize + "px " + font;
    //根据指定宽度，对text文本进行自动换行处理
    for (var i = 0; i < tmpTextArr.length; i++) {
        textWidth = context.measureText(tmpTextArr[i]).width;
        if (textWidth > width) {//文本超出限定宽度，需要进行换行处理
            var start = 0;
            var str, lastStr = tmpTextArr[i].substr(0, 1);
            for (var end = 0; end <= tmpTextArr[
                i].length; end++) {
                str = tmpTextArr[i].substr(start, end - start + 1);
                textWidth = context.measureText(str).width;
                if (textWidth > width) {//若已超宽，将end前的字符串存入未超限宽文本
                    textArr.push(tmpTextArr[i].substr(start, end - start));
                    start = end;
                }
                else if (end == tmpTextArr[i].length)//未超宽且已到尾部，剩余字符串存入未超限宽文本
                    textArr.push(tmpTextArr[i].substr(start, end - start + 1));
            }
        }
        else//存入未超限宽文本
            textArr.push(tmpTextArr[i]);
    }

    //在canvas中绘制文本
    canvas.width = width;
    canvas.height = (fontsize + rowInteval) * textArr.length;
    context.textAlign = "center";	//文本居中对齐
    context.textBaseline = "top";	//文本上对齐
    context.fillStyle = fillStyle;//字体颜色
    context.font = fontsize + "px " + font;
    for (var i = 0; i < textArr.length; i++)
        context.fillText(textArr[i], width / 2, i * (fontsize + rowInteval));

    //创建文本mesh
    var texture = new THREE.Texture(canvas);
    //var texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    //var material = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) });
    var material = new THREE.SpriteMaterial({ map: texture });
    var mesh = new THREE.Sprite(material);
    mesh.material.map.minFilter = THREE.LinearFilter;
    mesh.scale.set(canvas.width, canvas.height, 1);
    x = parseInt(x + canvas.width / 2);
    y = parseInt(-(y + (height == 0 ? 0 : (height - canvas.height) / 2) + canvas.height / 2));
    mesh.position.set(x, y, 0);
    this.scene.add(mesh);

    return mesh;
}