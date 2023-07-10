// JScript File
function ChartObject(pegoweb) {
    this.chart = pegoweb;
    this.bMouseDown = false;
    this.rect = [0,0,0,0];
    this.IsInChart = function(x,y) {
        if (x < this.rect[0]) return false;
        if (x > this.rect[1]) return false;
        if (y < this.rect[2]) return false;
        return y <= this.rect[3];
    }
    this.CursorMoved = function() { }
    this.DataHotSpot = function(DblClk, SubsetIndex, PointIndex) { }
    this.GraphHotSpot = function(DblClk,SubsetIndex, x, y) { }
    this.MouseMove = function(Button, Shift, nX, nY) { }
    this.MouseUp = function(Button, Shift, nX, nY) { }
    this.KeyDown = function(keyCode,keyFunc) { }
    this.TableAnnotation = function(DblClk,nIndex,nRow,nColumn) { }
    this.Refresh = function(force) {
        this.chart.PEresetimage(0,0);
        this.chart.PEinvalidate();
        this.CursorMoved();
    }
}