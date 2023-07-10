// JScript File -- Edit by Gud
//color operate
function CC_TenToHexChar(i) {
    switch (i) {
        case 10: return 'A';
        case 11: return 'B';
        case 12: return 'C';
        case 13: return 'D';
        case 14: return 'E';
        case 15: return 'F';
    }
    return '' + i;
}
function CC_TenToHexChar2(i) {
    if (i < 16)
        return '0' + CC_TenToHexChar(i);
    return CC_TenToHexChar(parseInt(i / 16, 10)) + CC_TenToHexChar(i % 16);
}
function CC_ToColor(i) {
    if (i < 0)
        i += 256 * 256 * 256;
    var r, g, b;
    r = i % 256;
    g = (i % (256 * 256) - r) / 256;
    b = parseInt(i / 256 / 256, 10);
    return CC_TenToHexChar2(r) + CC_TenToHexChar2(g) + CC_TenToHexChar2(b);
}
//end color operate