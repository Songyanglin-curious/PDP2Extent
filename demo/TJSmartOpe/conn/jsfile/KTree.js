// JScript File -- Edit by Gud
function KTree() {
    this.parent = null;
    this.arrChild = [];

    this.AddChild = function (item) {
        this.arrChild.push(item);
        item.parent = this;
    }
    this.RemoveChild = function (item) {
        for (var i = 0; i < this.arrChild.length; i++) {
            if (this.arrChild[i] == item) {
                this.arrChild.splice(i, 1);
                item.parent = null;
                return;
            }
        }
    }
    this.GetParent = function () {
        return this.parent;
    }
    this.GetChild = function (idx) {
        if (idx < 0) return null;
        if (idx >= this.arrChild.length) return null;
        return this.arrChild[idx];
    }
    this.FindChildIndex = function (item) {
        for (var i = 0; i < this.arrChild.length; i++) {
            if (this.arrChild[i] == item)
                return i;
        }
        return -1;
    }
    this.GetChildCount = function () {
        return this.arrChild.length;
    }
    this.GetPrevSibling = function () {
        if (this.parent == null)
            return null;
        return this.parent.GetChild(this.parent.FindChildIndex(this) - 1);
    }
    this.GetNextSibling = function () {
        if (this.parent == null)
            return null;
        return this.parent.GetChild(this.parent.FindChildIndex(this) + 1);
    }
}