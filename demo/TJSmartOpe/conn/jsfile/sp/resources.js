var uiResource = {
    toolBar: {
        zoom: {
            title: "缩放",
            zoomOption: {
                twentyFivePercentSize: "25%",
                fiftyPercentSize: "50%",
                seventyFivePercentSize: "75%",
                defaultSize: "100%",
                oneHundredTwentyFivePercentSize: "125%",
                oneHundredFiftyPercentSize: "150%",
                twoHundredPercentSize: "200%",
                threeHundredPercentSize: "300%",
                fourHundredPercentSize: "400%"
            }
        },
        clear: {
            title: "清除",
            clearActions: {
                clearAll: "全部清除",
                clearFormat: "清除格式"
            }
        },
        print:"打印",
        export: {
            title: "导出",
            exportActions: {
                //exportJson: "导出JSON",
                exportExcel: "导出Excel",
                exportPDF:"导出PDF"
            }
        },
        save:"保存",
        downloadTitle: "Save File",
        download: "Right Click To Download Linked File As...",
        showInspector: "Show Inspector",
        hideInspector: "Hide Inspector",
        importJson: "Import JSON",
        importFile: "导入文件",
        insertTable: "插入表格",
        insertPicture: "插入图片",
        insertComment: "插入批注",
        insertSparkline: "插入迷你图",
        insertChart: "插入图表",
        insertSlicer: "插入切片器"
    },
    tabs: {
        spread: "全局设置",
        sheet: "标签",
        cell: "单元格",
        table: "表格",
        data: "数据",
        comment: "批注",
        picture: "图片",
        sparklineEx: "迷你图",
        chartEx: "图表",
        slicer: "切片器"
    },
    spreadTab: {
        general: {
            title: "常规",
            allowDragDrop: "允许拖拽",
            allowDragFill: "允许拖拽填充",
            allowZoom: "允许缩放",
            allowOverflow: "允许单元格内容溢出",
            showDragFillSmartTag: "显示拖拽智能填充标记",
            allowDragMerge: "允许拖拽合并单元格",
            allowContextMenu: "允许使用右键菜单"
        },
        calculation: {
            title: "单元格计算方式",
            referenceStyle: {
                title: "参考类型",
                r1c1: "R1C1",
                a1: "A1"
            }
        },
        scrollBar: {
            title: "滚动条",
            showVertical: "显示垂直滚动条",
            showHorizontal: "显示水平滚动条",
            maxAlign: "滚动条最大对齐",
            showMax: "滚动条最大显示",
            scrollIgnoreHidden: "滚动时忽略隐藏行和列"
        },
        tabStip: {
            title: "工作表标签",
            visible: "显示标签",
            newTabVisible: "新建工作表可见",
            editable: "工作标签可编辑",
            showTabNavigation: "显示标签切换"
        },
        color: {
            title: "颜色",
            spreadBackcolor: "Spread Backcolor",
            grayAreaBackcolor: "Gray Area Backcolor"
        },
        tip: {
            title: "提示",
            showDragDropTip: "显示拖拽提示",
            showDragFillTip: "显示拖拽填充提示",
            scrollTip: {
                title: "滚动提示",
                values: {
                    none: "无",
                    horizontal: "水平",
                    vertical: "垂直",
                    both: "全部"
                }
            },
            resizeTip: {
                title: "重置宽高提示",
                values: {
                    none: "无",
                    column: "列",
                    row: "行",
                    both: "全部"
                }
            }
        },
        sheets: {
            title: "Sheets",
            sheetName: "Sheet name",
            sheetVisible: "Sheet Visible"
        },
        cutCopy: {
            title: "Cut / Copy",
            cutCopyIndicator: {
                visible: "Show Indicator",
                borderColor: "Indicator Border Color"
            },
            allowCopyPasteExcelStyle: "allowCopyPasteExcelStyle",
            allowExtendPasteRange: "allowExtendPasteRange",
            copyPasteHeaderOptions: {
                title: "HeaderOptions",
                option: {
                    noHeaders: "No Headers",
                    rowHeaders: "Row Headers",
                    columnHeaders: "Column Headers",
                    allHeaders: "All Headers"
                }
            }
        },
        spreadTheme: {
            title: "全局样式",
            theme: {
                title: "样式",
                option: {
                    spreadJS: "SpreadJS",
                    excel2013White: "Excel2013 White",
                    excel2013LightGray: "Excel2013 Light Gray",
                    excel2013DarkGray: "Excel2013 Dark Gray",
                    excel2016Colorful: "Excel2016 Colorful",
                    excel2016DarkGray: "Excel2016 Dark Gray"
                }
            }
        },
        resizeZeroIndicator: {
            title: "宽或高为0时样式",
            option: {
                defaultValue: "单线",
                enhanced: "双线"
            }
        }
    },
    sheetTab: {
        general: {
            title: "常规",
            rowCount: "行数",
            columnCount: "列数",
            name: "标签名称",
            tabColor: "标签颜色"
        },
        freeze: {
            title: "冻结行列",
            frozenRowCount: "表头行数",
            frozenColumnCount: "表头列数",
            trailingFrozenRowCount: "表尾行数",
            trailingFrozenColumnCount: "表尾列数",
            frozenLineColor: "冻结线颜色",
            freezePane: "冻结",
            unfreeze: "取消冻结"
        },
        gridLine: {
            title: "网格线",
            showVertical: "垂直网格线",
            showHorizontal: "水平网格线",
            color: "颜色"
        },
        header: {
            title: "行列标题",
            showRowHeader: "显示标题行",
            showColumnHeader: "显示标题列"
        },
        selection: {
            title: "选择",
            borderColor: "边框颜色",
            backColor: "背景色",
            hide: "隐藏选择",
            policy: {
                title: "选择方式",
                values: {
                    single: "单选",
                    range: "范围选择",
                    multiRange: "多范围选择"
                }
            },
            unit: {
                title: "选择单元格模式",
                values: {
                    cell: "单元格",
                    row: "行",
                    column: "列"
                }
            }
        },
        protection: {
            title: "保护",
            protectSheet: "保护单元格",
            selectLockCells: "选择被锁定的单元格",
            selectUnlockedCells: "选择未锁定的单元格",
            sort: "排序",
            useAutoFilter: "使用自动筛选",
            resizeRows: "调整行高",
            resizeColumns: "调整列宽",
            editObjects: "编辑",
            dragInsertRows: "Drag insert rows",
            dragInsertColumns: "Drag insert columns",
            insertRows: "插入行",
            insertColumns: "插入列",
            deleteRows: "删除行",
            deleteColumns: "删除列"
        }
    },
    cellTab: {
        style: {
            title: "单元格样式",
            fontFamily: "字体",
            fontSize: "字号",
            foreColor: "字体颜色",
            backColor: "背景色",
            waterMark: "水印标签",
            cellPadding: "单元格边距",
            cellLabel: {
                title: "水印设置",
                visibility: "设置显示",
                visibilityOption: {
                    auto: "自动",
                    visible: "显示",
                    hidden: "隐藏"
                },
                alignment: "对齐方式",
                alignmentOption: {
                    topLeft: "左上",
                    topCenter: "上居中",
                    topRight: "右上",
                    bottomLeft: "左下",
                    bottomCenter: "下居中",
                    bottomRight: "右下"
                },
                fontFamily: "字体",
                fontSize: "字号",
                foreColor: "颜色",
                labelMargin: "边距"
            },
            borders: {
                title: "边框",
                values: {
                    bottom: "底部",
                    top: "顶部",
                    left: "左边",
                    right: "右边",
                    none: "无",
                    all: "全部",
                    outside: "外边框",
                    thick: "Thick Box Border",
                    doubleBottom: "Bottom Double Border",
                    thickBottom: "Thick Bottom Border",
                    topBottom: "Top and Bottom Border",
                    topThickBottom: "Top and Thick Bottom Border",
                    topDoubleBottom: "Top and Double Bottom Border"
                }
            }
        },
        border: {
            title: "边框",
            rangeBorderLine: "线条",
            rangeBorderColor: "颜色",
            noBorder: "无",
            outsideBorder: "外部",
            insideBorder: "内部",
            allBorder: "全部",
            leftBorder: "左边",
            innerVertical: "内部垂直",
            rightBorder: "右边",
            topBorder: "顶部",
            innerHorizontal: "内部水平",
            bottomBorder: "底部",
            diagonalUpLine:"左斜线",
            diagonalDownLine:"右斜线"
        },
        alignment: {
            title: "文字对齐方式",
            top: "Top",
            middle: "Middle",
            bottom: "Bottom",
            left: "Left",
            center: "Center",
            right: "Right",
            wrapText: "文字换行",
            decreaseIndent: "Decrease Indent",
            increaseIndent: "Increase Indent"
        },
        format: {
            title: "单元格格式",
            commonFormat: {
                option: {
                    general: "常规",
                    number: "数字",
                    currency: "货币",
                    accounting: "会计",
                    shortDate: "短日期",
                    longDate: "长日期",
                    time: "时间",
                    percentage: "百分比",
                    fraction: "分数",
                    scientific: "科学计数",
                    text: "文本"
                }
            },
            percentValue: "0%",
            commaValue: "#,##0.00; (#,##0.00); \"-\"??;@",
            custom: "自定义",
            setButton: "Set"
        },
        merge: {
            title: "单元格合并",
            mergeCells: "合并",
            unmergeCells: "取消合并"
        },
        cellType: {
            title: "单元格类型"
        },
        conditionalFormat: {
            title: "条件格式",
            useConditionalFormats: "Conditional Formats"
        },
        protection: {
            title: "保护",
            lock: "锁定",
            sheetIsProtected: "标签已被锁定",
            sheetIsUnprotected: "标签未锁定"
        }
    },
    tableTab: {
        tableStyle: {
            title: "表格样式",
            light: {
                light1: "light1",
                light2: "light2",
                light3: "light3",
                light7: "light7"
            },
            medium: {
                medium1: "medium1",
                medium2: "medium2",
                medium3: "medium3",
                medium7: "medium7"
            },
            dark: {
                dark1: "dark1",
                dark2: "dark2",
                dark3: "dark3",
                dark7: "dark7"
            }
        },
        general: {
            title: "常规",
            tableName: "表格名称"
        },
        options: {
            title: "表格设置",
            filterButton: "筛选按钮",
            headerRow: "表头",
            totalRow: "添加统计行",
            bandedRows: "隔行换色",
            bandedColumns: "隔列换色",
            firstColumn: "第一列",
            lastColumn: "最后一列"
        }
    },
    dataTab: {
        sort: {
            title: "排序&筛选",
            asc: "升序",
            desc: "降序",
            filter: "筛选"
        },
        group: {
            title: "分组",
            group: "分组",
            ungroup: "取消分组",
            showDetail: "显示内容",
            hideDetail: "隐藏内容",
            showRowOutline: "显示行分组标记",
            showColumnOutline: "显示列分组标记"
        },
        dataValidation: {
            title: "Data Validation",
            setButton: "Set",
            clearAllButton: "Clear All",
            circleInvalidData: "Circle Invalid Data",
            setting: {
                title: "Setting",
                values: {
                    validatorType: {
                        title: "Validator Type",
                        option: {
                            anyValue: "Any Value",
                            number: "Number",
                            list: "List",
                            formulaList: "FormulaList",
                            date: "Date",
                            textLength: "Text Length",
                            custom: "Custom"
                        }
                    },
                    ignoreBlank: "IgnoreBlank",
                    validatorComparisonOperator: {
                        title: "Operator",
                        option: {
                            between: "Between",
                            notBetween: "NotBetween",
                            equalTo: "EqualTo",
                            notEqualTo: "NotEqualTo",
                            greaterThan: "GreaterThan",
                            lessThan: "LessThan",
                            greaterThanOrEqualTo: "GreaterThanOrEqualTo",
                            lessThanOrEqualTo: "LessThanOrEqualTo"
                        }
                    },
                    number: {
                        minimum: "Minimum",
                        maximum: "Maximum",
                        value: "Value",
                        isInteger: "Is Integer"
                    },
                    source: "Source",
                    date: {
                        startDate: "Start Date",
                        endDate: "End Date",
                        value: "Value",
                        isTime: "Is Time"
                    },
                    formula: "Formula"
                }
            },
            inputMessage: {
                title: "Input Message",
                values: {
                    showInputMessage: "Show when cell is selected",
                    title: "Title",
                    message: "Message"
                }
            },
            errorAlert: {
                title: "Error Alert",
                values: {
                    showErrorAlert: "Show after invalid data is entered",
                    alertType: {
                        title: "Alert Type",
                        option: {
                            stop: "Stop",
                            warning: "Warning",
                            information: "Information"
                        }
                    },
                    title: "Title",
                    message: "Message"
                }
            }
        }
    },
    commentTab: {
        general: {
            title: "常规",
            dynamicSize: "Dynamic Size",
            dynamicMove: "Dynamic Move",
            lockText: "Lock Text",
            showShadow: "Show Shadow"
        },
        font: {
            title: "Font",
            fontFamily: "Font",
            fontSize: "Size",
            fontStyle: {
                title: "Style",
                values: {
                    normal: "normal",
                    italic: "italic",
                    oblique: "oblique",
                    inherit: "inherit"
                }
            },
            fontWeight: {
                title: "Weight",
                values: {
                    normal: "normal",
                    bold: "bold",
                    bolder: "bolder",
                    lighter: "lighter"
                }
            },
            textDecoration: {
                title: "Decoration",
                values: {
                    none: "none",
                    underline: "underline",
                    overline: "overline",
                    linethrough: "linethrough"
                }
            }
        },
        border: {
            title: "Border",
            width: "Width",
            style: {
                title: "Style",
                values: {
                    none: "none",
                    hidden: "hidden",
                    dotted: "dotted",
                    dashed: "dashed",
                    solid: "solid",
                    double: "double",
                    groove: "groove",
                    ridge: "ridge",
                    inset: "inset",
                    outset: "outset"
                }
            },
            color: "Color"
        },
        appearance: {
            title: "Appearance",
            horizontalAlign: {
                title: "Horizontal",
                values: {
                    left: "left",
                    center: "center",
                    right: "right",
                    general: "general"
                }
            },
            displayMode: {
                title: "Display Mode",
                values: {
                    alwaysShown: "AlwaysShown",
                    hoverShown: "HoverShown"
                }
            },
            foreColor: "Forecolor",
            backColor: "Backcolor",
            padding: "Padding",
            zIndex: "Z-Index",
            opacity: "Opacity"
        }
    },
    pictureTab: {
        general: {
            title: "General",
            moveAndSize: "Move and size with cells",
            moveAndNoSize: "Move and don't size with cells",
            noMoveAndSize: "Don't move and size with cells",
            fixedPosition: "Fixed Position"
        },
        border: {
            title: "Border",
            width: "Width",
            radius: "Radius",
            style: {
                title: "Style",
                values: {
                    solid: "solid",
                    dotted: "dotted",
                    dashed: "dashed",
                    double: "double",
                    groove: "groove",
                    ridge: "ridge",
                    inset: "inset",
                    outset: "outset"
                }
            },
            color: "Color"
        },
        appearance: {
            title: "Appearance",
            stretch: {
                title: "Stretch",
                values: {
                    stretch: "Stretch",
                    center: "Center",
                    zoom: "Zoom",
                    none: "None"
                }
            },
            backColor: "Backcolor"
        }
    },
    sparklineExTab: {
        pieSparkline: {
            title: "PieSparkline Setting",
            values: {
                percentage: "Percentage",
                color: "Color ",
                setButton: "Set"
            }
        },
        areaSparkline: {
            title: "AreaSparkline Setting",
            values: {
                line1: "Line 1",
                line2: "Line 2",
                minimumValue: "Minimum Value",
                maximumValue: "Maximum Value",
                points: "Points",
                positiveColor: "Positive Color",
                negativeColor: "Negative Color",
                setButton: "Set"
            }
        },
        boxplotSparkline: {
            title: "BoxPlotSparkline Setting",
            values: {
                points: "Points",
                boxplotClass: "BoxPlotClass",
                scaleStart: "ScaleStart",
                scaleEnd: "ScaleEnd",
                acceptableStart: "AcceptableStart",
                acceptableEnd: "AcceptableEnd",
                colorScheme: "ColorScheme",
                style: "Style",
                showAverage: "Show Average",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        bulletSparkline: {
            title: "BulletSparkline Setting",
            values: {
                measure: "Measure",
                target: "Target",
                maxi: "Maxi",
                forecast: "Forecast",
                good: "Good",
                bad: "Bad",
                tickunit: "Tickunit",
                colorScheme: "ColorScheme",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        cascadeSparkline: {
            title: "CascadeSparkline Setting",
            values: {
                pointsRange: "PointsRange",
                pointIndex: "PointIndex",
                minimum: "Minimum",
                maximum: "Maximum",
                positiveColor: "ColorPositive",
                negativeColor: "ColorNegative",
                labelsRange: "LabelsRange",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        compatibleSparkline: {
            title: "CompatibleSparkline Setting",
            values: {
                data: {
                    title: "Data",
                    dataOrientation: "DataOrientation",
                    dateAxisData: "DateAxisData",
                    dateAxisOrientation: "DateAxisOrientation",
                    displayEmptyCellAs: "DisplayEmptyCellAs",
                    showDataInHiddenRowOrColumn: "Show data in hidden rows and columns"
                },
                show: {
                    title: "Show",
                    showFirst: "Show First",
                    showLast: "Show Last",
                    showHigh: "Show High",
                    showLow: "Show Low",
                    showNegative: "Show Negative",
                    showMarkers: "Show Markers"
                },
                group: {
                    title: "Group",
                    minAxisType: "MinAxisType",
                    maxAxisType: "MaxAxisType",
                    manualMin: "ManualMin",
                    manualMax: "ManualMax",
                    rightToLeft: "RightToLeft",
                    displayXAxis: "Display XAxis"
                },
                style: {
                    title: "Style",
                    negative: "Negative",
                    markers: "Markers",
                    axis: "Axis",
                    series: "Series",
                    highMarker: "High Marker",
                    lowMarker: "Low Marker",
                    firstMarker: "First Marker",
                    lastMarker: "Last Marker",
                    lineWeight: "Line Weight"
                },
                setButton: "Set"
            }
        },
        hbarSparkline: {
            title: "HbarSparkline Setting",
            values: {
                value: "Value",
                colorScheme: "ColorScheme",
                setButton: "Set"
            }
        },
        vbarSparkline: {
            title: "VarSparkline Setting",
            values: {
                value: "Value",
                colorScheme: "ColorScheme",
                setButton: "Set"
            }
        },
        paretoSparkline: {
            title: "ParetoSparkline Setting",
            values: {
                points: "Points",
                pointIndex: "PointIndex",
                colorRange: "ColorRange",
                highlightPosition: "HighlightPosition",
                target: "Target",
                target2: "Target2",
                label: "Label",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        // pieSparkline: {
        //     title: "PieSparkline Setting",
        //     values: {
        //         percentage: "Percentage",
        //         color: "Color",
        //         setButton: "Set"
        //     }
        // },
        scatterSparkline: {
            title: "ScatterSparkline Setting",
            values: {
                points1: "Points1",
                points2: "Points2",
                minX: "MinX",
                maxX: "MaxX",
                minY: "MinY",
                maxY: "MaxY",
                hLine: "HLine",
                vLine: "VLine",
                xMinZone: "XMinZone",
                xMaxZone: "XMaxZone",
                yMinZone: "YMinZone",
                yMaxZone: "YMaxZone",
                color1: "Color1",
                color2: "Color2",
                tags: "Tags",
                drawSymbol: "Draw Symbol",
                drawLines: "Draw Lines",
                dashLine: "Dash Line",
                setButton: "Set"
            }
        },
        spreadSparkline: {
            title: "SpreadSparkline Setting",
            values: {
                points: "Points",
                scaleStart: "ScaleStart",
                scaleEnd: "ScaleEnd",
                style: "Style",
                colorScheme: "ColorScheme",
                showAverage: "Show Average",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        stackedSparkline: {
            title: "StackedSparkline Setting",
            values: {
                points: "Points",
                colorRange: "ColorRange",
                labelRange: "LabelRange",
                maximum: "Maximum",
                targetRed: "TargetRed",
                targetGreen: "TargetGreen",
                targetBlue: "TargetBlue",
                targetYellow: "TargetYellow",
                color: "Color",
                highlightPosition: "HighlightPosition",
                textOrientation: "TextOrientation",
                textSize: "TextSize",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        variSparkline: {
            title: "VariSparkline Setting",
            values: {
                variance: "Variance",
                reference: "Reference",
                mini: "Mini",
                maxi: "Maxi",
                mark: "Mark",
                tickunit: "TickUnit",
                colorPositive: "ColorPositive",
                colorNegative: "ColorNegative",
                legend: "Legend",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        monthSparkline: {
            title: "MonthSparkline Setting"
        },
        yearSparkline: {
            title: "YearSparkline Setting"
        },
        monthYear: {
            data: "Data",
            month: "Month",
            year: "Year",
            emptyColor: "Empty Color",
            startColor: "Start Color",
            middleColor: "Middle Color",
            endColor: "End Color",
            colorRange: "Color Range",
            setButton: "set"
        },
        orientation: {
            vertical: "Vertical",
            horizontal: "Horizontal"
        },
        axisType: {
            individual: "Individual",
            custom: "Custom"
        },
        emptyCellDisplayType: {
            gaps: "Gaps",
            zero: "Zero",
            connect: "Connect"
        },
        boxplotClass: {
            fiveNS: "5NS",
            sevenNS: "7NS",
            tukey: "Tukey",
            bowley: "Bowley",
            sigma: "Sigma3"
        },
        boxplotStyle: {
            classical: "Classical",
            neo: "Neo"
        },
        paretoLabel: {
            none: "None",
            single: "Single",
            cumulated: "Cumulated"
        },
        spreadStyle: {
            stacked: "Stacked",
            spread: "Spread",
            jitter: "Jitter",
            poles: "Poles",
            stackedDots: "StackedDots",
            stripe: "Stripe"
        }
    },

    chartExTab: {
            fontSize: "字号",
            color: "文字颜色",
            lineColor: "线颜色",
            fontFamily: "字体",
            chartType: "图表类型",
            backColor: "背景色",
            values: {
                chartArea: {
                    title: "图表区域",
                    backColor: "背景色",
                    color: "文字颜色",
                    fontSize: "字号",
                    fontFamily: "字体"
                },
                chartTitle: {
                    title: "图表标题",
                    text: "显示文字",
                    chartType: "图表类型",
                    dataRange: "数据范围"
                },
                series: {
                    title: "系列",
                    seriesIndex:'系列名称',
                    axisGroup: "所属坐标轴",
                    lineWidth:"线宽",
                    primary:"主坐标轴",
                    secondary:"次坐标轴"
                },
                legend: {
                    title: "标题",
                    position: {
                        title: "标题位置",
                        values: {
                            left: "左对齐",
                            right: "右对齐",
                            top: "上对齐",
                            bottom: "下对齐"
                        }
                    },
                    showLegend: "显示标题"
                },
                dataLabels: {
                    title: "数据标记",
                    showValue: "显示标记",
                    showSeriesName: "显示系列名称",
                    showCategoryName: "显示类别名称",
                    position: {
                        title: "位置",
                        values: {

                        }
                    },
                    color: "颜色"
                },
                axes: {
                    title: "坐标轴",
                    axisType: {
                        title: "坐标轴类型",
                        values: {
                            primaryCategory: "主坐标轴类别",
                            primaryValue: "主坐标轴值",
                            secondaryCategory: "次坐标轴类别",
                            secondaryValue: "次坐标轴值"
                        }
                    },
                    aixsTitle: "标题",
                    titleColor: "标题颜色",
                    titleFontSize: "标题字号",
                    titleFontFamily: "标题字体",
                    showMajorGridline: "主网格线",
                    showMinorGridline: "小网格线",
                    showAxis: "显示坐标轴",
                    lineColor: "轴线颜色",
                    lineWidth: "轴线宽度",
                    TickPosition: {
                        majorTitle: "主网格标记位置",
                        minorTitle: "小网格标记位置",
                        values: {
                            cross: "穿过",
                            inside: "内部",
                            none: "无",
                            outside: "外部"
                        }
                    },
                    majorUnit: "Major Unit",
                    minorUnit: "Minor Unit",
                    majorGridlineWidth: "主网格宽度",
                    minorGridlineWidth: "小网格宽度",
                    majorGridlineColor: "主网格颜色",
                    minorGridlineColor: "小网格颜色",
                    tickLabelPosition: {
                        title: "文字标记位置",
                        values: {
                            none: "无",
                            nextToAxis: "紧挨坐标轴"
                        }
                    }

                }

            },
        setButton: "设置",
        combo: {
            title: "ClusteredColumn-LineChart Setting",
            value: {}
        }
    },

    slicerTab: {
        slicerStyle: {
            title: "切片器样式",
            light: {
                light1: "light1",
                light2: "light2",
                light3: "light3",
                light5: "light5",
                light6: "light6"
            },
            dark: {
                dark1: "dark1",
                dark2: "dark2",
                dark3: "dark3",
                dark5: "dark5",
                dark6: "dark6"
            }
        },
        general: {
            title: "常规",
            name: "名称",
            captionName: "标题",
            itemSorting: {
                title: "内容排序",
                option: {
                    none: "无",
                    ascending: "升序",
                    descending: "降序"
                }
            },
            displayHeader: "显示标题"
        },
        layout: {
            title: "布局",
            columnNumber: "行内按钮数",
            buttonHeight: "按钮高度",
            buttonWidth: "按钮宽度"
        },
        property: {
            title: "属性",
            moveAndSize: "Move and size with cells",
            moveAndNoSize: "Move and don't size with cells",
            noMoveAndSize: "Don't move and size with cells",
            locked: "Locked"
        }
    },
    colorPicker: {
        themeColors: "主题颜色",
        standardColors: "标准颜色",
        noFills: "不填充"
    },
    conditionalFormat: {
        setButton: "设置",
        ruleTypes: {
            title: "类型",
            highlightCells: {
                title: "单元格高亮",
                values: {
                    cellValue: "单元格数值",
                    specificText: "文本",
                    dateOccurring: "日期",
                    unique: "唯一的",
                    duplicate: "重复的"
                }
            },
            topBottom: {
                title: "最大/最小规则",
                values: {
                    top10: "Top10",
                    average: "平均值"
                }
            },
            dataBars: {
                title: "数据条",
                labels: {
                    minimum: "最小限度",
                    maximum: "最大限度",
                    type: "类型",
                    value: "值",
                    appearance: "外观",
                    showBarOnly: "只显示数据条",
                    useGradient: "使用渐变色",
                    showBorder: "显示边框",
                    barDirection: "数据条方向",
                    negativeFillColor: "相反数据条颜色",
                    negativeBorderColor: "相反数据条边框",
                    axis: "坐标轴",
                    axisPosition: "坐标轴位置",
                    axisColor: "坐标轴线颜色"
                },
                valueTypes: {
                    number: "数字",
                    lowestValue: "最小值",
                    highestValue: "最大值",
                    percent: "百分比",
                    percentile: "百分位数",
                    automin: "自动最小",
                    automax: "自动最大",
                    formula: "公式"
                },
                directions: {
                    leftToRight: "从左至右",
                    rightToLeft: "从右至左"
                },
                axisPositions: {
                    automatic: "自动",
                    cellMidPoint: "单元格中点",
                    none: "无"
                }
            },
            colorScales: {
                title: "色标",
                labels: {
                    minimum: "最小限度",
                    midpoint: "中点",
                    maximum: "最大限度",
                    type: "类型",
                    value: "值",
                    color: "颜色"
                },
                values: {
                    twoColors: "2种色标",
                    threeColors: "3种色标"
                },
                valueTypes: {
                    number: "数值",
                    lowestValue: "最小值",
                    highestValue: "最大值",
                    percent: "百分比",
                    percentile: "百分位数",
                    formula: "公式"
                }
            },
            iconSets: {
                title: "图标标记",
                labels: {
                    style: "图标样式",
                    showIconOnly: "只显示图标",
                    reverseIconOrder: "反转图标标记顺序",

                },
                types: {
                    threeArrowsColored: "三种彩色箭头",
                    threeArrowsGray: "三种灰色箭头",
                    threeTriangles: "三种三角形",
                    threeStars: "三种星星",
                    threeFlags: "三种小旗",
                    threeTrafficLightsUnrimmed: "三种交通灯",
                    threeTrafficLightsRimmed: "三种带背景的交通灯",
                    threeSigns: "三种形状",
                    threeSymbolsCircled: "三种圆形符号",
                    threeSymbolsUncircled: "三种符号",
                    fourArrowsColored: "四种彩色箭头",
                    fourArrowsGray: "四种灰色箭头",
                    fourRedToBlack: "四种红色至黑色",
                    fourRatings: "四种比例",
                    fourTrafficLights: "四种交通灯",
                    fiveArrowsColored: "五种彩色箭头",
                    fiveArrowsGray: "五种灰色箭头",
                    fiveRatings: "五种比例",
                    fiveQuarters: "五种时刻",
                    fiveBoxes: "五种格子"
                },
                valueTypes: {
                    number: "数值",
                    percent: "百分比",
                    percentile: "百分位数",
                    formula: "公式"
                }
            },
            removeConditionalFormat: {
                title: "无"
            }
        },
        operators: {
            cellValue: {
                types: {
                    equalsTo: "等于",
                    notEqualsTo: "不等于",
                    greaterThan: "大于",
                    greaterThanOrEqualsTo: "大于等于",
                    lessThan: "小于",
                    lessThanOrEqualsTo: "小于等于",
                    between: "介于两者时间",
                    notBetween: "不介于两者之间"
                }
            },
            specificText: {
                types: {
                    contains: "包含",
                    doesNotContain: "不包含",
                    beginsWith: "开始于",
                    endsWith: "结束于"
                }
            },
            dateOccurring: {
                types: {
                    today: "今天",
                    yesterday: "昨天",
                    tomorrow: "明天",
                    last7Days: "前7天",
                    thisMonth: "当月",
                    lastMonth: "上个月",
                    nextMonth: "下个月",
                    thisWeek: "本周",
                    lastWeek: "上周",
                    nextWeek: "下周"
                }
            },
            top10: {
                types: {
                    top: "前10",
                    bottom: "后10"
                }
            },
            average: {
                types: {
                    above: "大于平均值",
                    below: "小于平均值",
                    equalOrAbove: "大于等于平均值",
                    equalOrBelow: "小于等于平均值",
                    above1StdDev: "大于标准差",
                    below1StdDev: "小标准差",
                    above2StdDev: "大于2倍标准差",
                    below2StdDev: "小于2倍标准差",
                    above3StdDev: "大于3倍标准差",
                    below3StdDev: "小于3倍标准差"
                }
            }
        },
        texts: {
            cells: "单元格在以下标准格式化:",
            rankIn: "值在以下等级格式化:",
            inRange: "选中的值。",
            values: "格式化值:",
            average: "选中范围的平均值。",
            allValuesBased: "根据值格式化:",
            all: "格式化所有内容:",
            and: "至",
            formatStyle: "启用样式",
            showIconWithRules: "根据下面条件显示图标:"
        },
        formatSetting: {
            formatUseBackColor: "背景色",
            formatUseForeColor: "文字颜色",
            formatUseBorder: "边框"
        }
    },
    cellTypes: {
        title: "类型",
        buttonCellType: {
            title: "按钮",
            values: {
                marginTop: "上边距",
                marginRight: "右边距",
                marginBottom: "下边距",
                marginLeft: "左边距",
                text: "文本",
                backColor: "背景色"
            }
        },
        checkBoxCellType: {
            title: "复选框",
            values: {
                caption: "标题",
                textTrue: "勾选时文本",
                textIndeterminate: "不确定时文本",
                textFalse: "未勾选时文本",
                textAlign: {
                    title: "文字对齐",
                    values: {
                        top: "上",
                        bottom: "下",
                        left: "左",
                        right: "右"
                    }
                },
                isThreeState: "是否3种状态"
            }
        },
        comboBoxCellType: {
            title: "下拉菜单",
            values: {
                editorValueType: {
                    title: "获取值方式",
                    values: {
                        text: "文本",
                        index: "序号",
                        value: "值"
                    }
                },
                itemsText: "文本",
                itemsValue: "值"
            }
        },
        hyperlinkCellType: {
            title: "超链接",
            values: {
                linkColor: "链接颜色",
                visitedLinkColor: "访问后颜色",
                text: "文本",
                linkToolTip: "链接提示"
            }
        },
        clearCellType: {
            title: "无"
        },
        setButton: "设置"
    },
    sparklineDialog: {
        title: "SparklineEx Setting",
        sparklineExType: {
            title: "Type",
            values: {
                line: "Line",
                column: "Column",
                winLoss: "Win/Loss",
                pie: "Pie",
                area: "Area",
                scatter: "Scatter",
                spread: "Spread",
                stacked: "Stacked",
                bullet: "Bullet",
                hbar: "Hbar",
                vbar: "Vbar",
                variance: "Variance",
                boxplot: "BoxPlot",
                cascade: "Cascade",
                pareto: "Pareto",
                month: "Month",
                year: "Year"
            }
        },
        lineSparkline: {
            dataRange: "Data Range",
            locationRange: "Location Range",
            dataRangeError: "Data range is invalid!",
            singleDataRange: "Data range should be in a single row or column.",
            locationRangeError: "Location range is invalid!"
        },
        bulletSparkline: {
            measure: "Measure",
            target: "Target",
            maxi: "Maxi",
            forecast: "Forecast",
            good: "Good",
            bad: "Bad",
            tickunit: "Tickunit",
            colorScheme: "ColorScheme",
            vertical: "Vertical"
        },
        hbarSparkline: {
            value: "Value",
            colorScheme: "ColorScheme"
        },
        varianceSparkline: {
            variance: "Variance",
            reference: "Reference",
            mini: "Mini",
            maxi: "Maxi",
            mark: "Mark",
            tickunit: "TickUnit",
            colorPositive: "ColorPositive",
            colorNegative: "ColorNegative",
            legend: "Legend",
            vertical: "Vertical"
        },
        monthSparkline: {
            year: "Year",
            month: "Month",
            emptyColor: "Empty Color",
            startColor: "Start Color",
            middleColor: "Middle Color",
            endColor: "End Color",
            colorRange: "Color Range"
        },
        yearSparkline: {
            year: "Year",
            emptyColor: "Empty Color",
            startColor: "Start Color",
            middleColor: "Middle Color",
            endColor: "End Color",
            colorRange: "Color Range"
        }
    },
    chartDialog: {
        title: "chartEx Setting",
        chartExType: {
            title: "Type",
            values: {
                columnClustered: "Clustered Column",
                columnStacked: "Stacked Column",
                columnStacked100: "100% Stacked Column",
                line: "Line",
                lineStacked: "Stacked Line",
                lineStacked100: "100% Stacked Line",
                lineMarkers: "Line With Markers",
                lineMarkersStacked: "Stacked Line With Markers",
                lineMarkersStacked100: "100% Stacked Line With Markers",
                pie: "Pie",
                doughnut: "Doughnut",
                barClustered: "Clustered Bar",
                barStacked: "Stacked Bar",
                barStacked100: "100% Stacked Bar",
                area: "Area",
                areaStacked: "Stacked Area",
                areaStacked100: "100% Stacked Area",
                xyScatter: "Scatter",
                xyScatterSmooth: "Scatter with Smooth Lines and Markers",
                xyScatterSmoothNoMarkers: "Scatter with Smooth Lines",
                xyScatterLines: "Scatter with Straight Lines and Markers",
                xyScatterLinesNoMarkers: "Scatter with Straight Lines",
                bubble: "Bubble",
                stockHLC: "High-Low-Close",
                stockOHLC: "Open-High-Low-Close",
                stockVHLC: "Volumn-High-Low-Close-Stock",
                stockVOHLC: "Volumn-Open-High-Low-Close-Stock",
                combo: "Clustered Column-Line"
            }
        }
    },
    slicerDialog: {
        insertSlicer: "Insert Slicer"
    },
    passwordDialog: {
        title: "Password",
        error: "Incorrect Password!"
    },
    tooltips: {
        style: {
            fontBold: "Mark text bold.",
            fontItalic: "Mark text italic",
            fontUnderline: "Underline text.",
            fontOverline: "Overline text.",
            fontLinethrough: "Strikethrough text."
        },
        alignment: {
            leftAlign: "左对齐",
            centerAlign: "居中对齐",
            rightAlign: "右对齐",
            topAlign: "上对齐",
            middleAlign: "水平居中",
            bottomAlign: "下对齐",
            decreaseIndent: "左缩进",
            increaseIndent: "右缩进",
            verticalText:"文字垂直"
        },
        border: {
            outsideBorder: "外边框",
            insideBorder: "内边框",
            allBorder: "全部边框",
            leftBorder: "左边框",
            innerVertical: "内部垂直边框",
            rightBorder: "右边框",
            topBorder: "上边框",
            innerHorizontal: "内部水平边框",
            bottomBorder: "底边框",
            diagonalUpLine:"左斜线",
            diagonalDownLine:"右斜线"
        },
        format: {
            percentStyle: "Percent Style",
            commaStyle: "Comma Style",
            increaseDecimal: "Increase Decimal",
            decreaseDecimal: "Decrease Decimal"
        }
    },
    defaultTexts: {
        buttonText: "Button",
        checkCaption: "Check",
        comboText: "United States,China,Japan",
        comboValue: "US,CN,JP",
        hyperlinkText: "LinkText",
        hyperlinkToolTip: "Hyperlink Tooltip"
    },
    messages: {
        invalidImportFile: "Invalid file, import failed.",
        duplicatedSheetName: "Duplicated sheet name.",
        duplicatedTableName: "Duplicated table name.",
        rowColumnRangeRequired: "Please select a range of row or column.",
        imageFileRequired: "The file must be image!",
        duplicatedSlicerName: "Duplicated slicer name.",
        invalidSlicerName: "Slicer name is not valid."
    },
    dialog: {
        ok: "确定",
        cancel: "取消"
    },
    chartDataLabels:{
        center:'居中',
        insideEnd:'内部最后',
        outsideEnd:'外部最后',
        bestFit:'自动',
        above:'内容上面',
        below:'内容下面',
    }
};

