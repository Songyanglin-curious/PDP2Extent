(function () {
    /**
     * 绘制基本图元圆角矩形
     * @param {any} shapeWidth  矩形宽度
     * @param {any} shapeHeight 矩形高度
     * @param {any} roundRadius 矩形圆角半径
     */
    function RoundedRectShape(shapeWidth, shapeHeight, roundRadius) {
        THREE.Shape.call(this);
        var scope = this;

        this.type = "RoundedRectShape";
        this.shapeWidth = shapeWidth;
        this.shapeHeight = shapeHeight;
        this.shape = drawRoundedRectShape(shapeWidth, shapeHeight, roundRadius);

        function drawRoundedRectShape(shapeWidth, shapeHeight, roundRadius) {
            var roundedRectShape = new THREE.Shape();
            (function roundedRect(ctx, x, y, width, height, radius) {
                //中心点
                //ctx.moveTo(-shapeWidth / 2, -shapeHeight / 2 + radius);
                //ctx.lineTo(-shapeWidth / 2, shapeHeight / 2 - radius);
                //ctx.quadraticCurveTo(-shapeWidth / 2, shapeHeight / 2, -shapeWidth / 2 + radius, shapeHeight / 2);
                //ctx.lineTo(shapeWidth / 2 - radius, shapeHeight / 2);
                //ctx.quadraticCurveTo(shapeWidth / 2, shapeHeight / 2, shapeWidth / 2, shapeHeight / 2 - radius);
                //ctx.lineTo(shapeWidth / 2, -shapeHeight / 2 + radius);
                //ctx.quadraticCurveTo(shapeWidth / 2, -shapeHeight / 2, shapeWidth / 2 - radius, -shapeHeight / 2);
                //ctx.lineTo(-shapeWidth / 2 + radius, -shapeHeight / 2);
                //ctx.quadraticCurveTo(-shapeWidth / 2, -shapeHeight / 2, -shapeWidth / 2, -shapeHeight/2 + radius);
                //左上点
                ctx.moveTo(x, y + radius - height);
                ctx.lineTo(x, y - radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y - radius);
                ctx.lineTo(x + width, y + radius - height);
                ctx.quadraticCurveTo(x + width, y - height, x + width - radius, y - height);
                ctx.lineTo(x + radius, y - height);
                ctx.quadraticCurveTo(x, y - height, x, y + radius - height);

            })(roundedRectShape, 0, 0, shapeWidth, shapeHeight, roundRadius);
            roundedRectShape.autoClose = false;
            return roundedRectShape;
        }   
       
    }
    RoundedRectShape.prototype = Object.create(THREE.Shape.prototype);
    RoundedRectShape.prototype.constructor = RoundedRectShape;
    /**
     * 绘制基本图元椭圆
     * @param {any} shapeWidth 宽度
     * @param {any} shapeHeight 高度
     */
    function EllipseShape(shapeWidth, shapeHeight) {
        THREE.Shape.call(this);
        var scope = this;

        this.type = "EllipseShape";
        this.shapeWidth = shapeWidth;
        this.shapeHeight = shapeHeight;
        this.shape = drawEllipseShape(shapeWidth, shapeHeight);

        function drawEllipseShape(shapeWidth, shapeHeight) {
            var ellipseShape = new THREE.Shape();
            //中心点
            //ellipseShape.moveTo(0, shapeHeight/2);
            //ellipseShape.quadraticCurveTo(shapeWidth/2, shapeHeight/2, shapeWidth/2, 0);
            //ellipseShape.quadraticCurveTo(shapeWidth/2, - shapeHeight/2, 0, - shapeHeight/2);
            //ellipseShape.quadraticCurveTo(- shapeWidth/2, - shapeHeight/2, - shapeWidth/2, 0);
            //ellipseShape.quadraticCurveTo(- shapeWidth / 2, shapeHeight / 2, 0, shapeHeight / 2);
            //左上点
            ellipseShape.moveTo(shapeWidth / 2, 0);
            ellipseShape.quadraticCurveTo(shapeWidth, 0, shapeWidth, - shapeHeight / 2);
            ellipseShape.quadraticCurveTo(shapeWidth, - shapeHeight, shapeWidth / 2, - shapeHeight);
            ellipseShape.quadraticCurveTo(0, - shapeHeight, 0, - shapeHeight / 2);
            ellipseShape.quadraticCurveTo(0, 0, shapeWidth / 2, 0);
            ellipseShape.autoClose = false;
            return ellipseShape;
        }
        
    }
    EllipseShape.prototype = Object.create(THREE.Shape.prototype);
    EllipseShape.prototype.constructor = EllipseShape;
    /**
     * 绘制基本图元菱形
     * @param {any} shapeWidth 宽度
     * @param {any} shapeHeight 高度
     */
    function DiamondShape(shapeWidth, shapeHeight) {
        THREE.Shape.call(this);
        var scope = this;

        this.type = "DiamondShape";
        this.shapeWidth = shapeWidth;
        this.shapeHeight = shapeHeight;
        this.shape = drawDiamondShape(shapeWidth, shapeHeight);
        function drawDiamondShape(shapeWidth, shapeHeight) {
            var diamondShape = new THREE.Shape();
            diamondShape.moveTo(0, - shapeHeight * 0.5);
            diamondShape.lineTo(shapeWidth * 0.5, 0);
            diamondShape.lineTo(shapeWidth, - shapeHeight * 0.5);
            diamondShape.lineTo(shapeWidth * 0.5, - shapeHeight);
            diamondShape.lineTo(0, -shapeHeight * 0.5);
            diamondShape.autoClose = false;
            return diamondShape;
        }
    }
    DiamondShape.prototype = Object.create(THREE.Shape.prototype);
    DiamondShape.prototype.constructor = DiamondShape;
    /**
     * 绘制折线
     * @param {any} linePoints 折线上的点坐标
     */
    function ArrowLineShape(linePoints) {
        THREE.Path.call(this);
        var scope = this;
        this.type = "ArrowLineShape";
        this.linePoints = linePoints;
        this.shape = drawArrowLineShape(linePoints);
        function drawArrowLineShape(linePoints) {
            if (linePoints.length < 2) return;
            var arrowLineShape = new THREE.Path();
            arrowLineShape.moveTo(linePoints[0].x, linePoints[0].y);
            for (var i = 1; i < linePoints.length; i++) {
                arrowLineShape.lineTo(linePoints[i].x, linePoints[i].y);
            }
            return arrowLineShape;
        }
    }
    ArrowLineShape.prototype = Object.create(THREE.Path.prototype);
    ArrowLineShape.prototype.constructor = ArrowLineShape;
    
    /**
     * 图元模型
     * @param {any} position

     * @param {any} uniforms
     */
     function FlowShapeMesh(shape, shapeColor) {
         THREE.Mesh.call(this);
         this.geometry = new THREE.ShapeBufferGeometry(shape);
         this.material = new THREE.MeshPhongMaterial({ emissive: shapeColor })
         //this.material.transparent = true;
         this.type = "FlowShapeMesh";
     }
     FlowShapeMesh.prototype = Object.create(THREE.Mesh.prototype);

     FlowShapeMesh.prototype.updateShapeColor = function (color) {
         //var cloneMaterial = this.material.clone();
         this.material.emissive.set(color);
         //this.material = cloneMaterial;
     }
     /**
     * 线
     * @param {any} shape
     */
     function FlowLine(shape,lineColor) {
         THREE.Line.call(this);
         var scope = this;
         this.type = "FlowLine";
         this.geometry = shape.createPointsGeometry();
         this.material = new THREE.LineBasicMaterial({ color: lineColor});
     }
     FlowLine.prototype = Object.create(THREE.Line.prototype);

     FlowLine.prototype.updateLineColor = function (color) {
         //var cloneMaterial = this.material.clone();
         this.material.color.set(color);
         //this.material = cloneMaterial;
     }
     /**
     * 带箭头的线
     * @param {any} shape
     */
     function FlowArrowLine(shape, lineColor, arrowInfo) {
         THREE.Object3D.call(this);
         var scope = this;
         this.type = "FlowArrowLine";
         this.Line = new THREE.FlowLine(shape, lineColor);
         this.Arrow = new THREE.ArrowHelper(arrowInfo.dir, arrowInfo.origin, arrowInfo.length, arrowInfo.color, arrowInfo.width, arrowInfo.height);
         this.add(this.Line);
         this.add(this.Arrow);
     }
     FlowArrowLine.prototype = Object.create(THREE.Line.prototype);


     /**
    * 带边框的模型
    * @param {any} shape
    */
     function FlowLineShape(shape, lineColor, shapeColor) {
         THREE.Object3D.call(this);
         var scope = this;
         this.type = "FlowLineShape";
         this.ShapeLine = new THREE.FlowLine(shape, lineColor);
         this.ShapeMesh = new THREE.FlowShapeMesh(shape, shapeColor);
         this.add(this.ShapeLine);
         this.add(this.ShapeMesh);
     }
     FlowLineShape.prototype = Object.create(THREE.Line.prototype);

     THREE.RoundedRectShape = RoundedRectShape;
     THREE.EllipseShape = EllipseShape;
     THREE.DiamondShape = DiamondShape;
     THREE.ArrowLineShape = ArrowLineShape;
     THREE.FlowShapeMesh = FlowShapeMesh;
     THREE.FlowLine = FlowLine;
     THREE.FlowArrowLine = FlowArrowLine;
     THREE.FlowLineShape = FlowLineShape;

})();