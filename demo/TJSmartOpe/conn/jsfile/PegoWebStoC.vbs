' VBScript File
DIM nVBChartLeft,nVBChartRight,nVBChartTop,nVBChartBottom
FUNCTION VBScreenToCtrlX(pwctrl,x,y)
	DIM xRet,yRet,axis
	xRet = 0
	yRet = 0
	pwctrl.PEconvpixeltographEx axis, x, y, xRet, yRet, false, false, false
	VBScreenToCtrlX = xRet
END FUNCTION
FUNCTION VBScreenToCtrlY(pwctrl,x,y)
	DIM xRet,yRet,axis
	xRet = 0
	yRet = 0
	pwctrl.PEconvpixeltographEx axis, x, y, xRet, yRet, false, false, false
	VBScreenToCtrlY = yRet
END FUNCTION
SUB VBGetChartRect(pwctrl)
    pwctrl.GetRectGraphEx nVBChartLeft, nVBChartTop, nVBChartRight, nVBChartBottom
END SUB
