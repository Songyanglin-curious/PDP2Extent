function getV(o) { var v = Trim(o.value);o.value = v;return v; }
function TrimLeftZero(n) { var s = n;while ((s.substr(0,1) == "0")&&(s != "0")) {s = s.substring(1,s.length);};return s; }
function IsPositiveInt(s) { var v = parseInt(s,10);if (isNaN(v)) return false;return (Math.pow(10,s.length - 1) <= v); }
function IsPositiveIntEx(s) { return (s==0)||IsPositiveInt(s); }
function checkPositiveInt(o,m,bNull) { var s = Trim(o.value);o.value = s;if ((bNull)&&(s=="")) return true;var s0 = TrimLeftZero(s);if (IsPositiveInt(s0)) return true;alert(m);o.focus();o.select();return false; }