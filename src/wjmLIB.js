"use strict";

(function(){
    
    let wjmLIB = {
        
    drawCircle(ctx,x,y,radius,color){
		ctx.save();
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x,y,radius,0,Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	},
        
    drawRectangle(ctx,x,y,width,height,color){
        ctx.save();
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.rect(x,y,width,height);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
    },
        
    getRandomColor()
    {
    const getByte = _ => 55 + Math.round(Math.random() * 200);
    return `rgba(${getByte()},${getByte()},${getByte()},.8)`
    },

    getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    },
        
    dtr(degrees){
		return degrees * (Math.PI/180);
	},
        
    cls(ctx){
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
        
    };
    
    let wjmPhylloData = {
        x : 0,
        y : 0,
        counter : 0,
        c : 4,
        n : 0,
        divergence : 137.5,
        divergenceChange : 20000,
        generationSpeed : 3,
        colorScale : 10,
        colorRamp : 285,
        colorOffset : 0,
        yMultiplicity : 3,
        nMultiplicity : 3,
        yOffset : 200,
        yOffsetIntensity : 30,
        drawType : "Circle",
        sizeScale : 3,
        sizeChange : "true",
    };
    
    if(window){
        window["wjmLIB"] = wjmLIB;
        window["wjmPhylloData"] = wjmPhylloData;
    }
    else{
        throw "window is not defined!";
    }
})();