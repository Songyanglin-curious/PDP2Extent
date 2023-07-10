// JScript File -- Edit by Gud
function createXMLRoot(xml) {
    var xmlDoc = new ActiveXObject('MSXML2.DOMDocument');
    xmlDoc.async = false;
    xmlDoc.loadXML(xml);
    return xmlDoc.documentElement;
}

function getFirstTag(xmlNd, tagNm) {
    return xmlNd.getElementsByTagName(tagNm).item(0);
}

function getFirstTagAttr(xmlNd, tagNm, attrNm) {
    return xmlNd.getElementsByTagName(tagNm).item(0).getAttribute(attrNm);
}

function setFirstTagAttr(xmlNd, tagNm, attrNm, attrVar) {
    xmlNd.getElementsByTagName(tagNm).item(0).setAttribute(attrNm, attrVar);
}

function findNodeByAttr(nodes, tagNm, attrNm, attrV) {
    for (var i = 0; i < nodes.childNodes.length; i++) {
        var node = nodes.childNodes.item(i);
        var attrVar = getFirstTagAttr(node, tagNm, attrNm);
        if (attrVar == attrV)
            return node;
    }
    return null;
}

function removeNodeByAttr(nodes, tagNm, attrNm, attrV) {
    var node = findNodeByAttr(nodes, tagNm, attrNm, attrV);
    if (null == node)
        return false;
    nodes.removeChild(node);
    return true;
}

function getInnerXml(xmlNd) {
    var xml = "";
    for (var i = 0; i < xmlNd.childNodes.length; i++) {
        xml += xmlNd.childNodes[i].xml;
    }
    return xml;
}