THREE.FlowControls = function (_objects, _camera, _domElement) {
    if (_objects instanceof THREE.Camera) {

        console.warn('THREE.FlowControls: Constructor now expects ( objects, camera, domElement )');
        var temp = _objects; _objects = _camera; _camera = temp;

    }

    var _plane = new THREE.Plane();
    var _raycaster = new THREE.Raycaster();

    var _mouse = new THREE.Vector2();
    var _offset = new THREE.Vector3();
    var _intersection = new THREE.Vector3();

    var _selected = null, _hovered = null;

    //

    var scope = this;

    var firstTime = 0;
    var lastTime = 0;

    function activate() {

        _domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        _domElement.addEventListener('mousedown', onDocumentMouseDown, false);
        _domElement.addEventListener('mouseup', onDocumentMouseCancel, false);
        _domElement.addEventListener('mouseleave', onDocumentMouseCancel, false);
        _domElement.addEventListener('click', onClick, false);
        _domElement.addEventListener('contextmenu', contextMenu, false);
        //_domElement.addEventListener( 'touchmove', onDocumentTouchMove, false );
        //_domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );
        //_domElement.addEventListener( 'touchend', onDocumentTouchEnd, false );

    }

    function deactivate() {

        _domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
        _domElement.removeEventListener('mousedown', onDocumentMouseDown, false);
        _domElement.removeEventListener('mouseup', onDocumentMouseCancel, false);
        _domElement.removeEventListener('mouseleave', onDocumentMouseCancel, false);
        _domElement.removeEventListener('click', onClick, false);
        _domElement.removeEventListener('contextmenu', contextMenu, false);
        //_domElement.removeEventListener( 'touchmove', onDocumentTouchMove, false );
        //_domElement.removeEventListener( 'touchstart', onDocumentTouchStart, false );
        //_domElement.removeEventListener( 'touchend', onDocumentTouchEnd, false );

    }

    function dispose() {

        deactivate();

    }

    function onDocumentMouseMove(event) {

        event.preventDefault();
       

        var rect = _domElement.getBoundingClientRect();

        _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        _mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

        _raycaster.setFromCamera(_mouse, _camera);
        if (_selected && scope.enabled) {
        if (scope.drawModel == 0) {//连线
            var intersects = _raycaster.intersectObjects(_objects);

            if (intersects.length > 0) {
                for (var i = 0; i < intersects.length; i++) {
                    if (intersects[i].object.type == "Sprite" || intersects[i].object.parent.type == "Sprite")
                        continue;
                    if (intersects[i].object.parent.type == "Object3D") {
                        _selected = intersects[i].object.parent;
                        if (intersects[i].object.parent.parent.type == "Object3D") {
                            _selected = selObj.parent;
                        }
                        break;
                    } else {
                        _selected = intersects[i].object;
                        break;
                    }
                }
                //_selected = intersects[ 0 ].object;
            }

        } else if (scope.drawModel == 1) {

                if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
                    _selected.position.copy(_intersection.sub(_offset));
                }

                //if (scope.drawModel == 1) {
                //}
                //else if (scope.drawModel == 0)
                //{
                //    scope.dispatchEvent({ type: 'move', object: _selected });
                //}


        }
        scope.dispatchEvent({ type: 'drag', object: _selected, newPosition: _raycaster.ray.intersectPlane(_plane, _intersection) });
        return;

        }
        
        _raycaster.setFromCamera(_mouse, _camera);

        var intersects = _raycaster.intersectObjects(_objects);

        if (intersects.length > 0) {

            var object = intersects[0].object;

            _plane.setFromNormalAndCoplanarPoint(_camera.getWorldDirection(_plane.normal), object.position);

            if (_hovered !== object) {

                scope.dispatchEvent({ type: 'hoveron', object: object });

                _domElement.style.cursor = 'pointer';
                _hovered = object;

            }

        } else {

            if (_hovered !== null) {

                scope.dispatchEvent({ type: 'hoveroff', object: _hovered });

                _domElement.style.cursor = 'auto';
                _hovered = null;

            }

        }

    }

    function onDocumentMouseDown(event) {

        event.preventDefault();

        firstTime = new Date().getTime();
       
        _raycaster.setFromCamera(_mouse, _camera);

        var intersects = _raycaster.intersectObjects(_objects);

        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[i].object.type == "Sprite" || intersects[i].object.parent.type == "Sprite")
                    continue;
                if (intersects[i].object.parent.type == "Object3D") {
                    _selected = intersects[i].object.parent;
                    if (intersects[i].object.parent.parent.type == "Object3D") {
                        _selected = selObj.parent;
                    }
                    break;
                } else {
                    _selected = intersects[i].object;
                    break;
                }
            }
            //_selected = intersects[ 0 ].object;
            if (_selected == null) return;
            if (_raycaster.ray.intersectPlane(_plane, _intersection)) {

                _offset.copy(_intersection).sub(_selected.position);

            }
            _domElement.style.cursor = 'move';

            scope.dispatchEvent({ type: 'dragstart', object: _selected });
        }
    }

    function onDocumentMouseCancel(event) {

        event.preventDefault();

        lastTime = new Date().getTime();

        if (_selected) {

            scope.dispatchEvent({ type: 'dragend', object: _selected });

            _selected = null;

        }

        _domElement.style.cursor = _hovered ? 'pointer' : 'auto';

}
    function onClick(event) {
        if (lastTime - firstTime < 300) {
            //_domElement.style.cursor = 'pointer';
            scope.dispatchEvent({ type: 'click', object: event });
        }
    }

    function contextMenu(event)
    {
        event.preventDefault();
        if (lastTime - firstTime < 300) {
            //_domElement.style.cursor = 'pointer';
            scope.dispatchEvent({ type: 'contextMenu', object: event });
        }
    }
    activate();

    // API

    this.enabled = true;
    this.drawModel = 0;
    this.activate = activate;
    this.deactivate = deactivate;
    this.dispose = dispose;

    // Backward compatibility

    this.setObjects = function () {

        console.error('THREE.FlowControls: setObjects() has been removed.');

    };

    this.on = function (type, listener) {

        console.warn('THREE.FlowControls: on() has been deprecated. Use addEventListener() instead.');
        scope.addEventListener(type, listener);

    };

    this.off = function (type, listener) {

        console.warn('THREE.FlowControls: off() has been deprecated. Use removeEventListener() instead.');
        scope.removeEventListener(type, listener);

    };

    this.notify = function (type) {

        console.error('THREE.FlowControls: notify() has been deprecated. Use dispatchEvent() instead.');
        scope.dispatchEvent({ type: type });

    };

};

THREE.FlowControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.FlowControls.prototype.constructor = THREE.FlowControls;
