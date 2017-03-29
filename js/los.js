var cs = null;


function lineIntersect2(x1, y1, x2, y2, x3, y3, x4, y4) {
    var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    console.log(x + '-' + y);
    if (isNaN(x) || isNaN(y)) {
        return false;
    }
    else {
        if (x1 >= x2) {
            if (!(x2 <= x && x <= x1)) {
                return false;
            }
        }
        else {
            if (!(x1 <= x && x <= x2)) {
                return false;
            }
        }
        if (y1 >= y2) {
            if (!(y2 <= y && y <= y1)) {
                return false;
            }
        }
        else {
            if (!(y1 <= y && y <= y2)) {
                return false;
            }
        }
        if (x3 >= x4) {
            if (!(x4 <= x && x <= x3)) {
                return false;
            }
        }
        else {
            if (!(x3 <= x && x <= x4)) {
                return false;
            }
        }
        if (y3 >= y4) {
            if (!(y4 <= y && y <= y3)) {
                return false;
            }
        }
        else {
            if (!(y3 <= y && y <= y4)) {
                return false;
            }
        }
    }
    return true;
}
console.log(lineIntersect2(4, 4, 12, 12, 0, 8, 8, 8));

function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    if (isNaN(x) || isNaN(y)) {
        return false;
    }
    else {
        if (x1 >= x2) {
            if (!(x2 <= x && x <= x1)) {
                return false;
            }
        }
        else {
            if (!(x1 <= x && x <= x2)) {
                return false;
            }
        }
        if (y1 >= y2) {
            if (!(y2 <= y && y <= y1)) {
                return false;
            }
        }
        else {
            if (!(y1 <= y && y <= y2)) {
                return false;
            }
        }
        if (x3 >= x4) {
            if (!(x4 <= x && x <= x3)) {
                return false;
            }
        }
        else {
            if (!(x3 <= x && x <= x4)) {
                return false;
            }
        }
        if (y3 >= y4) {
            if (!(y4 <= y && y <= y3)) {
                return false;
            }
        }
        else {
            if (!(y3 <= y && y <= y4)) {
                return false;
            }
        }
    }
    return true;
}


function CellBlock(x, y, w, h, fill) {
    // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
    // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else! We could put "Lalala" for the value of x
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = fill || '#ce3b55';
    this.cell_x = -1;
    this.cell_y = -1;
    this.isHero = false;
};

// Draws this shape to a given context
CellBlock.prototype.draw = function (ctx) {
    if (this.isHero) {
        ctx.beginPath();
        var lW = ctx.lineWidth;
        var sS = ctx.strokeStyle;
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#0080ff';
        ctx.arc(this.x + Math.floor(this.w / 2), this.y + Math.floor(this.h / 2), Math.floor(this.w / 2) - 3, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.lineWidth = lW;
        ctx.strokeStyle = sS;
        ctx.closePath();
    }
    else {
        ctx.fillStyle = this.fill;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
};

CellBlock.prototype.intersectLine = function (lineFromX, lineFromY, lineToX, lineToY) {

    var x = this.x + 1;
    var y = this.y + 1;
    var w = this.w - 2;
    var h = this.h - 2;

    var top = lineIntersect(x, y, x + w, y, lineFromX, lineFromY, lineToX, lineToY);
    var left = lineIntersect(x, y, x, y + h, lineFromX, lineFromY, lineToX, lineToY);
    var right = lineIntersect(x + w, y, x + w, y + h, lineFromX, lineFromY, lineToX, lineToY);
    var bottom = lineIntersect(x, y + h, x + w, y + h, lineFromX, lineFromY, lineToX, lineToY);

    return (top || left || right || bottom);


};

// Determine if a point is inside the shape's bounds
CellBlock.prototype.contains = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)

    var res = (this.x <= mx) && (this.x + this.w >= mx) &&
        (this.y <= my) && (this.y + this.h >= my);

    console.log('(' + this.x + '<=' + mx + ') && (' + this.x + '+' + this.w + '>=' + mx + ') && (' + this.y + ' <= ' + my + ') && (' + this.y + '+' + this.h + '>=' + my + ') => ' + res);

    return res;
};


function CanvasState(canvas, csize, cx, cy) {
    // **** First some setup! ****

    this.cell_size = csize;
    this.cx = cx;
    this.cy = cy;

    this.matrix = new Array(cx);
    for (var i = 0; i < cx; i++) {
        this.matrix[i] = new Array(cy);
        for (var j = 0; j < cy; j++) {
            this.matrix[i][j] = 0;
        }
    }
    this.drawDistance = false;
    this.hero = new CellBlock(Math.floor(cx / 2) * this.cell_size, (cy - 1) * this.cell_size, this.cell_size, this.cell_size);
    this.hero.cell_x = Math.floor(cx / 2);
    this.hero.cell_y = cy - 1;
    this.matrix[Math.floor(cx / 2)][cy - 1] = 2;
    this.hero.fill = '#00FF00';
    this.hero.isMoving = false;
    this.hero.isHero = true;

    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
        this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
        this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
        this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    // **** Keep track of state! ****

    this.valid = false; // when set to false, the canvas will redraw everything
    this.shapes = [];  // the collection of things to be drawn
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;

    // **** Then events! ****

    // This is an example of a closure!
    // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
    // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
    // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
    // This is our reference!
    var myState = this;

    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function (e) {
        e.preventDefault();
        return false;
    }, false);
    canvas.addEventListener('dbclick', function (e) {
        e.preventDefault();
        return false;
    }, false);
    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function (e) {
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        //myState.GetCell(mouse);

        myState.addShapeBlock(mouse);


        /*
         var shapes = myState.shapes;
         var l = shapes.length;
         for (var i = l-1; i >= 0; i--) {
         if (shapes[i].contains(mx, my)) {
         var mySel = shapes[i];
         // Keep track of where in the object we clicked
         // so we can move it smoothly (see mousemove)
         myState.dragoffx = mx - mySel.x;
         myState.dragoffy = my - mySel.y;
         myState.dragging = true;
         myState.selection = mySel;
         myState.valid = false;
         return;
         }
         }
         // havent returned means we have failed to select anything.
         // If there was an object selected, we deselect it
         if (myState.selection) {
         myState.selection = null;
         myState.valid = false; // Need to clear the old selection border
         }

         */
    }, true);


    this.selectionColor = '#CC0000';
    this.selectionWidth = 2;
    this.interval = 30;
    setInterval(function () {
        myState.draw();
    }, myState.interval);

};


CanvasState.prototype.resetShapes = function () {
    var l = this.shapes.length;
    for (var i = l - 1; i >= 0; i--) {
        this.matrix[this.shapes[i].cell_x][this.shapes[i].cell_y] = 0;
        this.shapes.splice(i, 1);
        //this.shapes.pop(this.shapes[i]);
    }
    this.valid = false;
};
CanvasState.prototype.addShapeBlock = function (mouse) {

    var cell_x = Math.floor(mouse.x / this.cell_size);
    var cell_y = Math.floor(mouse.y / this.cell_size);

    console.log(cell_x, cell_y);

    if (this.matrix[cell_x][cell_y] == 1) {
        var l = this.shapes.length;
        for (var i = l - 1; i >= 0; i--) {
            if (this.shapes[i].contains(mouse.x, mouse.y)) {
                //if ((this.shapes[i].cell_x==cell_x)&&(this.shapes[i].cell_y==cell_y)) {
                this.matrix[this.shapes[i].cell_x][this.shapes[i].cell_y] = 0;
                //this.shapes.pop(this.shapes[i]);
                this.shapes.splice(i, 1);
                this.valid = false;
                return;
            }
        }
    }
    else if (this.matrix[cell_x][cell_y] == 0) {
        if (this.hero.isMoving) {
            this.matrix[this.hero.cell_x][this.hero.cell_y] = 0;
            this.hero = new CellBlock(cell_x * this.cell_size, cell_y * this.cell_size, this.cell_size, this.cell_size);
            this.hero.cell_x = cell_x;
            this.hero.cell_y = cell_y;
            this.matrix[cell_x][cell_y] = 2;
            this.hero.fill = '#00FF00';
            this.hero.isMoving = false;
            this.hero.isHero = true;
            this.valid = false;
        }
        else {
            shape = new CellBlock(cell_x * this.cell_size, cell_y * this.cell_size, this.cell_size, this.cell_size);
            shape.cell_x = cell_x;
            shape.cell_y = cell_y;
            this.shapes.push(shape);
            this.matrix[cell_x][cell_y] = 1;
            this.valid = false;
        }
    }
};

CanvasState.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
};

CanvasState.prototype.draw = function () {
    // if our state is invalid, redraw and validate!
    if (!this.valid) {
        var ctx = this.ctx;
        var shapes = this.shapes;
        this.clear();

        this.MakeGrid(this.cell_size, this.cx, this.cy);
        // ** Add stuff you want drawn in the background all the time here **

        // draw all shapes
        var l = shapes.length;
        for (var i = 0; i < l; i++) {
            var shape = shapes[i];
            // We can skip the drawing of elements that have moved off the screen:
            if (shape.x > this.width || shape.y > this.height ||
                shape.x + shape.w < 0 || shape.y + shape.h < 0) {
                continue;
            }
            shapes[i].draw(ctx);
        }

        this.hero.draw(ctx);

        // draw selection
        // right now this is just a stroke along the edge of the selected Shape
        /*
         if (this.selection != null) {
         ctx.strokeStyle = this.selectionColor;
         ctx.lineWidth = this.selectionWidth;
         var mySel = this.selection;
         ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
         }
         */

        var lineFromX = this.hero.x + Math.floor(this.hero.w / 2);
        var lineFromY = this.hero.y + Math.floor(this.hero.h / 2);
        for (var i = 0; i < this.cx; i++) {
            for (var j = 0; j < this.cy; j++) {
                if (this.matrix[i][j] == 0) {
                    var lineToX = (i * this.cell_size) + Math.floor(this.cell_size / 2);
                    var lineToY = (j * this.cell_size) + Math.floor(this.cell_size / 2);

                    var s = shapes.length;
                    var intersect = false;
                    for (var s = 0; s < l; s++) {
                        intersect = intersect || shapes[s].intersectLine(lineFromX, lineFromY, lineToX, lineToY);
                    }

                    var cell_num = Math.abs(this.hero.cell_x - i) + Math.abs(this.hero.cell_y - j);

                    if (!intersect) {
                        /*
                         ctx.moveTo(lineFromX, lineFromY);
                         ctx.lineTo(lineToX, lineToY);
                         ctx.stroke();
                         */

                        var rx = (i * this.cell_size) + 3;
                        var ry = (j * this.cell_size) + 3;
                        var rs = this.cell_size - 6;
                        ctx.beginPath();
                        ctx.rect(rx, ry, rs, rs);
                        ctx.strokeStyle = '#2AAE61';
                        ctx.lineWidth = 1;
                        ctx.stroke();

                        if (this.drawDistance) {
                            //ctx.fillStyle = "#2AAE61";
                            //ctx.font = "15px sans-serif";
                            //ctx.fillText(cell_num, lineToX-7, lineToY+7);

                            ctx.beginPath();
                            ctx.font = "15px sans-serif";
                            ctx.lineWidth = 3;
                            ctx.strokeStyle = '#2AAE61';
                            ctx.strokeText(cell_num, lineToX - 7, lineToY + 6);
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillText(cell_num, lineToX - 7, lineToY + 6);
                            ctx.closePath();
                        }
                    }
                    else {
                        //ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                        //ctx.fillRect(i*this.cell_size, j*this.cell_size, this.cell_size, this.cell_size);

                        var rx = (i * this.cell_size) + 3;
                        var ry = (j * this.cell_size) + 3;
                        var rs = this.cell_size - 6;
                        ctx.beginPath();
                        ctx.rect(rx, ry, rs, rs);
                        ctx.strokeStyle = '#F3AC3F';
                        ctx.lineWidth = 3;
                        ctx.stroke();
                        ctx.moveTo(rx, ry);
                        ctx.lineTo(rx + rs, ry + rs);
                        ctx.stroke();
                        ctx.moveTo(rx + rs, ry);
                        ctx.lineTo(rx, ry + rs);
                        ctx.stroke();
                        ctx.closePath();
                        if (this.drawDistance) {
                            ctx.beginPath();
                            ctx.font = "15px sans-serif";
                            ctx.strokeStyle = '#F3AC3F';
                            ctx.strokeText(cell_num, lineToX - 7, lineToY + 6);
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillText(cell_num, lineToX - 7, lineToY + 6);
                            ctx.closePath();
                        }
                    }
                }
            }
        }

        // ** Add stuff you want drawn on top all the time here **

        this.valid = true;
    }
};

CanvasState.prototype.getMouse = function (e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        }
        while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    var div = $('div.los-responsive:first');
    if (div) {
        mx += div.scrollLeft();
    }

    if ($('.content:first')) {
        my += $('.content:first').scrollTop();
    }

    // We return a simple javascript object (a hash) with x and y defined
    console.log('Mouse: ' + mx + ':' + my + ' (' + div.scrollLeft() + '_' + $('.content:first').scrollTop() + ')');
    return {x: mx, y: my};
};


CanvasState.prototype.MakeGrid = function (c, cx, cy) {
    var ctx = this.ctx;

    this.width = c * cx;
    this.height = c * cy;

    $('#cnv').attr('width', c * cx);
    $('#cnv').attr('height', c * cy);
    $('#divcnv').attr('width', c * cx);
    $('#divcnv').attr('height', c * cy);

    ctx.strokeStyle = '#cccccc';
    ctx.strokeWidth = 0.5;
    return;
    ctx.beginPath();

    var iCount = null;
    var i = null;
    var x = null;
    var y = null;

    for (i = 1; i <= cx; i++) {
        x = (i * c);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, c * cy);
        ctx.stroke();
    }

    for (i = 1; i <= cy; i++) {
        y = (i * c);
        ctx.moveTo(0, y);
        ctx.lineTo(c * cx, y);
        ctx.stroke();
    }

    ctx.closePath();

};


function Start() {
    // alert(obj.detail.state.url);
    //
    // ctx = document.getElementById("cnv").getContext("2d");
    // MakeGrid(30,20,10);
    //if (cs==null)
    cs = new CanvasState(document.getElementById('cnv'), 69, 12, 12);
    console.log(cs.hero);
    // s.MakeGrid(30,20,10);
}

function clearSight() {
    if (cs) {
        cs.resetShapes();
    }
    else {
        Start();
    }
}

function showDistance(show) {
    if (cs) {
        cs.drawDistance = 1 && show;
        cs.valid = false;
    }
}

function toggleDistance() {
    if (cs) {
        cs.drawDistance = !cs.drawDistance;

        cs.valid = false;
    }
}

function moveHero() {
    cs.hero.isMoving = true;
}
