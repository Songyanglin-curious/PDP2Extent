function isNewStationFlow(flowid) { return (flowid == "222") || (flowid == "10"); }
function getNewStationFlowId(depttype) {if (depttype == "1") return "10";  return "222"; }
function getRunStationFlowId(depttype) {if (depttype == "1") return "20";  return "223"; }
function getAllNewStationFlowIds() { return "222,10"; }
function getAllRunStationFlowIds() { return "223,20"; }