var xmldoc = require('./index');

const xmlString = `<?xml version="1.0" encoding="utf-8"?>
<root maxid="116" desc="空白页">

    <ctrls>
        <div id="div0" desc="根容器">
            <a s_height="100%" s_width="100%" s_background-color="#071E2C"></a>
            <c>
                <div id="div2_dl" desc="容器">

                    <label id="label68_dl" desc="华中环比值" from="col77[this.areaIndex['华中']]">
                        <a class="pdpLabel tbmargin" value="文字"></a>
                        <sa s_color="col77[this.areaIndex['华中']]"></sa>
                        <sf>
                            <value><![CDATA[parseFloat({0})>0? '#FB5656':'#11E5BB']]></value>
                        </sf>
                    </label>
                </div>
            </c>
        </div>
    </ctrls>
    <css>
    <![CDATA[.title{
  background-color: #1D3B55;
}

}]]>
  </css>
    <scripts>
        <script event="created">
            <list type="script">
                <value><![CDATA[
                    this.imageIf = function(value) {
              if(value){
                  if(value == 0 ) 
                      return false;
                                                                 else 
                      return true;
              }
          }
        ]]>
        </value>
            </list>
        </script>
        <script event="mounted">
            <list type="select" ds="ds91"></list>
            <list type="select" ds="ds95"></list>
            <list type="select" ds="ds99"></list>
            <list type="script">
                <value>
          <![CDATA[
            this.areaIndex = {};
                                            for(var i = 0; i < this.col73.length; i++){
              this.areaIndex[this.col73[i]] = i;
            }                    
          ]]>
        </value>
            </list>
        </script>
    </scripts>
</root>`
var document = new xmldoc.XmlDocument(xmlString);

console.log(document)