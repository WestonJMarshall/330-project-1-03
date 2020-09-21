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
    },
        
    setTooltip(text, value, top, left)
    {
        let tooltip = document.querySelector("#tooltip");
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top - 22}px`;
        tooltip.style.display = "block";
        tooltip.innerHTML = `${text} <br>value: ${value}`;
    },
        
    setupToolVisuals(wjmPhylloData)
    {
        //Dropdown menus

        let tags = ["#generation-type","#divergence","#divergence-change"];
        let values = [wjmPhylloData.drawType,wjmPhylloData.divergence,wjmPhylloData.divergenceChange]

        for(let j = 0; j < tags.length; j++)
        {
            for(let i = 0; i < document.querySelector(tags[j]).options.length; i++)
            {
                if(document.querySelector(tags[j]).options[i].value === values[j] || parseFloat(document.querySelector(tags[j]).options[i].value) === parseFloat(values[j]))
                {
                    document.querySelector(tags[j]).options.selectedIndex = i;
                    break;
                }
            }
        }

        //Check boxes

        tags = ["#size-change","#fade-away","#shadow"];
        values = [wjmPhylloData.sizeChange,wjmPhylloData.fadeAway,wjmPhylloData.shadows]

        for(let j = 0; j < tags.length; j++)
        {
            document.querySelector(tags[j]).checked = values[j];
        }

        //Sliders

        tags = ["#generation-speed-slider","#y-multiplicity-slider","#n-multiplicity-slider",
                "#c-value-slider","#size-multiplier-slider","#y-offset-slider",
                "#y-offset-intensity-slider","#color-offset-slider","#color-scale-slider","#color-ramp-slider"];

        values = [wjmPhylloData.generationSpeed,wjmPhylloData.yMultiplicity,wjmPhylloData.nMultiplicity,
                  wjmPhylloData.c,wjmPhylloData.sizeScale,wjmPhylloData.yOffset,
                  wjmPhylloData.yOffsetIntensity,wjmPhylloData.colorOffset,wjmPhylloData.colorScale,wjmPhylloData.colorRamp]

        for(let j = 0; j < tags.length; j++)
        {
            document.querySelector(tags[j]).value = values[j];
        }
    },
        
    updateDetailsPanel(canvasWidth, canvasHeight, horizInset, vertInset)
    {
        let details = document.querySelector("#details-wrapper");
        details.style.width = `${window.innerWidth - canvasWidth - horizInset}px`;
        details.style.left = `${canvasWidth + vertInset}px`;
        details.style.height = `${canvasHeight - vertInset}px`;
    }
        
    };
    
    let wjmPhylloData = {
        x : 0,
        y : 0,
        counter : 0,
        c : 68,
        n : 0,
        fadeAway : 0,
        shadows : 0,
        divergence : 137.5,
        divergenceChange : 0,
        generationSpeed : 3,
        colorScale : 10,
        colorRamp : 255,
        colorOffset : 0,
        yMultiplicity : 3,
        nMultiplicity : 3,
        yOffset : 400,
        yOffsetIntensity : -1,
        drawType : "Circle",
        sizeScale : 3,
        sizeChange : 1,
    };
    
    let wjmPresetOne = {
        c : 68,
        fadeAway : 0,
        shadows : 0,
        divergence : 137.5,
        divergenceChange : 0,
        generationSpeed : 3,
        colorScale : 10,
        colorRamp : 255,
        colorOffset : 0,
        yMultiplicity : 3,
        nMultiplicity : 3,
        yOffset : 400,
        yOffsetIntensity : -1,
        drawType : "Circle",
        sizeScale : 3,
        sizeChange : 1,
    };
    
    let wjmPresetTwo = {
        c : 139,
        fadeAway : 1,
        shadows : 1,
        divergence : 7.5,
        divergenceChange : 0,
        generationSpeed : 9,
        colorScale : 50,
        colorRamp : 113,
        colorOffset : 155,
        yMultiplicity : 8,
        nMultiplicity : 6,
        yOffset : 415,
        yOffsetIntensity : 2,
        drawType : "Line",
        sizeScale : 3,
        sizeChange : 1,
    };
    
    let wjmPresetThree = {
        c : 1,
        fadeAway : 0,
        shadows : 1,
        divergence : 137.5,
        divergenceChange : 0,
        generationSpeed : 10,
        colorScale : 22,
        colorRamp : 53,
        colorOffset : 6,
        yMultiplicity : 7,
        nMultiplicity : 4,
        yOffset : 800,
        yOffsetIntensity : 0.5,
        drawType : "Circle",
        sizeScale : 6,
        sizeChange : 0,
    };
    
    let wjmPresetFour = {
        c : 1,
        fadeAway : 0,
        shadows : 0,
        divergence : 7.5,
        divergenceChange : 0,
        generationSpeed : 28,
        colorScale : 54,
        colorRamp : 95,
        colorOffset : 163,
        yMultiplicity : 4,
        nMultiplicity : 3,
        yOffset : 675,
        yOffsetIntensity : -3,
        drawType : "Square",
        sizeScale : 3,
        sizeChange : 0,
    };
            
    let wjmPresetFive = {
        c : 172,
        fadeAway : 0,
        shadows : 0,
        divergence : 7.5,
        divergenceChange : 0,
        generationSpeed : 5,
        colorScale : 1,
        colorRamp : 35,
        colorOffset : 255,
        yMultiplicity : 2,
        nMultiplicity : 1,
        yOffset : 339,
        yOffsetIntensity : 12,
        drawType : "Line",
        sizeScale : 5,
        sizeChange : 0,
    };
    
    if(window){
        window["wjmLIB"] = wjmLIB;
        window["wjmPhylloData"] = wjmPhylloData;
        window["wjmPresetOne"] = wjmPresetOne;
        window["wjmPresetTwo"] = wjmPresetTwo;
        window["wjmPresetThree"] = wjmPresetThree;
        window["wjmPresetFour"] = wjmPresetFour;
        window["wjmPresetFive"] = wjmPresetFive;
    }
    else{
        throw "window is not defined!";
    }
})();