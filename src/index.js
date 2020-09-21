"use strict";
(function(){

window.onload = init;

let canvasWidth = 600, canvasHeight = 900;
let ctx;
const horizOffset = 25;
const horizInset = 54;
const vertInset = 27;

function init(){
    
    ctx = canvas.getContext("2d");
    
    canvasHeight = window.innerHeight - 27;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    window.addEventListener("resize", sizeChanged);
    
    wjmLIB.updateDetailsPanel(canvasWidth, canvasHeight, horizInset, vertInset);
    
    setupControls();
    
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    requestAnimationFrame(loop);
}
    
function loop(){
    setTimeout(loop,1000/600);
    
    for(let i = 0; i < wjmPhylloData.generationSpeed; i++)
    {
        drawPhyllotaxis();
    }
}

function drawPhyllotaxis(){
    ctx.save();
    
    if(wjmPhylloData.fadeAway)
    {
        ctx.fillStyle = `rgba(0, 0, 0, 0.01)`;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    
    wjmPhylloData.n++;
    
    if(wjmPhylloData.shadows)
    {
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
    }
    
    if(wjmPhylloData.drawType === "Line")
    {
        ctx.beginPath();
        if(wjmPhylloData.x === 0){wjmPhylloData.x = canvasWidth/2;}
        if(wjmPhylloData.y === 0){wjmPhylloData.y = wjmPhylloData.yOffset;}
        ctx.moveTo(wjmPhylloData.x,wjmPhylloData.y);
    }
    
    if(wjmPhylloData.divergenceChange !== 0)
    {
        wjmPhylloData.divergence -= (1 / wjmPhylloData.divergenceChange)
    }
    
    let a = wjmPhylloData.n * wjmLIB.dtr(wjmPhylloData.divergence) / 4;
    
    let r = (wjmPhylloData.c * Math.sqrt(wjmPhylloData.n) + wjmPhylloData.n) / 20;
    wjmPhylloData.x = r * Math.cos(a) + canvasWidth/2;
    wjmPhylloData.y = r * Math.sin(a) + 500/2;
    
    let nMulti = wjmPhylloData.n;
    let yMulti = wjmPhylloData.y;
     for(let i = 0; i < wjmPhylloData.yMultiplicity; i++)
     {
         yMulti = wjmPhylloData.y * yMulti;
     }
     for(let i = 0; i < wjmPhylloData.nMultiplicity; i++)
     {
         nMulti = wjmPhylloData.n * nMulti;
     }
    
     if(wjmPhylloData.yOffsetIntensity === 0){wjmPhylloData.yOffsetIntensity = 0.5;}
     wjmPhylloData.y = wjmPhylloData.y - ((nMulti) / (yMulti));
     wjmPhylloData.y = - wjmPhylloData.y / wjmPhylloData.yOffsetIntensity;
     wjmPhylloData.y += Math.sqrt(Math.abs(wjmPhylloData.y));
    
     wjmPhylloData.y += wjmPhylloData.yOffset;
    
     let aDegrees = (wjmPhylloData.n * wjmPhylloData.divergence) % 2041;
    
    let color = `hsl(${wjmPhylloData.n / wjmPhylloData.colorScale % wjmPhylloData.colorRamp + wjmPhylloData.colorOffset},100%,${50}%)`;
    let z = (wjmPhylloData.n / 200) % 5 * wjmPhylloData.sizeScale;
    
    if(!wjmPhylloData.sizeChange){z = wjmPhylloData.sizeScale;}
    
    if(wjmPhylloData.drawType === "Line")
    {
         ctx.lineTo(wjmPhylloData.x,wjmPhylloData.y);
         ctx.lineWidth = z;
         ctx.strokeStyle = color;
         ctx.stroke();
    }
    else if(wjmPhylloData.drawType === "Circle")
    {
        wjmLIB.drawCircle(ctx,wjmPhylloData.x,wjmPhylloData.y,z,color);
    }
    else if(wjmPhylloData.drawType === "Square")
    {
        wjmLIB.drawRectangle(ctx,wjmPhylloData.x,wjmPhylloData.y,z,z,color);
    }
    
    ctx.restore();
}
    
//Add event listeners for all of the controls on the UI
function setupControls()
{
    document.querySelector("#generation-type").addEventListener('change', _ => { wjmPhylloData.drawType = document.querySelector("#generation-type").options[document.querySelector("#generation-type").selectedIndex].value; valueChanged();});
    
    document.querySelector("#divergence").addEventListener('change', _ => { wjmPhylloData.divergence = parseFloat(document.querySelector("#divergence").options[document.querySelector("#divergence").selectedIndex].value); valueChanged();});
    
    document.querySelector("#divergence-change").addEventListener('change', _ => { wjmPhylloData.divergenceChange = parseFloat(document.querySelector("#divergence-change").options[document.querySelector("#divergence-change").selectedIndex].value); valueChanged();});
    
    document.querySelector("#presets").addEventListener('change', _ => { setPreset(parseInt(document.querySelector("#presets").options[document.querySelector("#presets").selectedIndex].value)); valueChanged();});
    
    document.querySelector("#size-change").addEventListener('click', _ => { wjmPhylloData.sizeChange = document.querySelector("#size-change").checked; valueChanged();});
    
    document.querySelector("#fade-away").addEventListener('click', _ => { wjmPhylloData.fadeAway = document.querySelector("#fade-away").checked; valueChanged();});
    
    document.querySelector("#shadow").addEventListener('click', _ => { wjmPhylloData.shadows = document.querySelector("#shadow").checked; valueChanged();});
    
    document.querySelector("#generation-speed-slider").oninput = (e) => { wjmPhylloData.generationSpeed = e.target.value; valueChanged(); wjmLIB.setTooltip("How fast points are generated", wjmPhylloData.generationSpeed,document.querySelector("#generation-speed-slider").parentElement.offsetTop,document.querySelector("#generation-speed-slider").offsetLeft + document.querySelector("#generation-speed-slider").clientWidth + horizOffset);};
    document.querySelector("#generation-speed-slider").onmouseover = (e) => { wjmLIB.setTooltip("How fast points are generated", wjmPhylloData.generationSpeed,document.querySelector("#generation-speed-slider").parentElement.offsetTop,document.querySelector("#generation-speed-slider").offsetLeft + document.querySelector("#generation-speed-slider").clientWidth + horizOffset);};
    document.querySelector("#generation-speed-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#y-multiplicity-slider").oninput = (e) => { wjmPhylloData.yMultiplicity = e.target.value; valueChanged(); wjmLIB.setTooltip("How many times the y value is multiplied by itself (y = N / Y)", wjmPhylloData.yMultiplicity,document.querySelector("#y-multiplicity-slider").parentElement.offsetTop,document.querySelector("#y-multiplicity-slider").offsetLeft + document.querySelector("#y-multiplicity-slider").clientWidth + horizOffset);};
    document.querySelector("#y-multiplicity-slider").onmouseover = (e) => { wjmLIB.setTooltip("How many times the Y value is multiplied by itself (y = N / Y)", wjmPhylloData.yMultiplicity,document.querySelector("#y-multiplicity-slider").parentElement.offsetTop,document.querySelector("#y-multiplicity-slider").offsetLeft + document.querySelector("#y-multiplicity-slider").clientWidth + horizOffset);};
    document.querySelector("#y-multiplicity-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#n-multiplicity-slider").oninput = (e) => { wjmPhylloData.nMultiplicity = e.target.value; valueChanged(); wjmLIB.setTooltip("How many times the N value is multiplied by itself (y = N / Y)", wjmPhylloData.nMultiplicity,document.querySelector("#n-multiplicity-slider").parentElement.offsetTop,document.querySelector("#n-multiplicity-slider").offsetLeft + document.querySelector("#n-multiplicity-slider").clientWidth + horizOffset);};
    document.querySelector("#n-multiplicity-slider").onmouseover = (e) => { wjmLIB.setTooltip("How many times the N value is multiplied by itself (y = N / Y)", wjmPhylloData.nMultiplicity,document.querySelector("#n-multiplicity-slider").parentElement.offsetTop,document.querySelector("#n-multiplicity-slider").offsetLeft + document.querySelector("#n-multiplicity-slider").clientWidth + horizOffset);};
    document.querySelector("#n-multiplicity-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#c-value-slider").oninput = (e) => { wjmPhylloData.c = parseFloat(e.target.value); valueChanged(); wjmLIB.setTooltip("(Basically) how far apart the particles will be spread", wjmPhylloData.c,document.querySelector("#c-value-slider").parentElement.offsetTop,document.querySelector("#c-value-slider").offsetLeft + document.querySelector("#c-value-slider").clientWidth + 25);};
    document.querySelector("#c-value-slider").onmouseover = (e) => { wjmLIB.setTooltip("(Basically) how far apart the particles will be spread", wjmPhylloData.c,document.querySelector("#c-value-slider").parentElement.offsetTop,document.querySelector("#c-value-slider").offsetLeft + document.querySelector("#c-value-slider").clientWidth + 25);};
    document.querySelector("#c-value-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#size-multiplier-slider").oninput = (e) => { wjmPhylloData.sizeScale = e.target.value; valueChanged(); wjmLIB.setTooltip("Number that the particle size will be multiplied by", wjmPhylloData.sizeScale,document.querySelector("#size-multiplier-slider").parentElement.offsetTop,document.querySelector("#size-multiplier-slider").offsetLeft + document.querySelector("#size-multiplier-slider").clientWidth + horizOffset);};
    document.querySelector("#size-multiplier-slider").onmouseover = (e) => { wjmLIB.setTooltip("Number that the particle size will be multiplied by", wjmPhylloData.sizeScale,document.querySelector("#size-multiplier-slider").parentElement.offsetTop,document.querySelector("#size-multiplier-slider").offsetLeft + document.querySelector("#size-multiplier-slider").clientWidth + horizOffset);};
    document.querySelector("#size-multiplier-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#y-offset-slider").oninput = (e) => { wjmPhylloData.yOffset = parseFloat(e.target.value); valueChanged(); wjmLIB.setTooltip("How far down the canvas the particles will be placed", wjmPhylloData.yOffset,document.querySelector("#y-offset-slider").parentElement.offsetTop,document.querySelector("#y-offset-slider").offsetLeft + document.querySelector("#y-offset-slider").clientWidth + horizOffset);};
    document.querySelector("#y-offset-slider").onmouseover = (e) => { wjmLIB.setTooltip("How far down the canvas the particles will be placed", wjmPhylloData.yOffset,document.querySelector("#y-offset-slider").parentElement.offsetTop,document.querySelector("#y-offset-slider").offsetLeft + document.querySelector("#y-offset-slider").clientWidth + horizOffset);};
    document.querySelector("#y-offset-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#y-offset-intensity-slider").oninput = (e) => { wjmPhylloData.yOffsetIntensity = parseFloat(e.target.value); valueChanged(); wjmLIB.setTooltip("Multiplier for y-value changes", wjmPhylloData.yOffsetIntensity,document.querySelector("#y-offset-intensity-slider").parentElement.offsetTop,document.querySelector("#y-offset-intensity-slider").offsetLeft + document.querySelector("#y-offset-intensity-slider").clientWidth + horizOffset);};
    document.querySelector("#y-offset-intensity-slider").onmouseover = (e) => { wjmLIB.setTooltip("Multiplier for y-value changes", wjmPhylloData.yOffsetIntensity,document.querySelector("#y-offset-intensity-slider").parentElement.offsetTop,document.querySelector("#y-offset-intensity-slider").offsetLeft + document.querySelector("#y-offset-intensity-slider").clientWidth + horizOffset);};
    document.querySelector("#y-offset-intensity-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#color-offset-slider").oninput = (e) => { wjmPhylloData.colorOffset = parseFloat(e.target.value); valueChanged(); wjmLIB.setTooltip("What hue to start at (0-255)", wjmPhylloData.colorOffset,document.querySelector("#color-offset-slider").parentElement.offsetTop,document.querySelector("#color-offset-slider").offsetLeft + document.querySelector("#color-offset-slider").clientWidth + horizOffset);};
    document.querySelector("#color-offset-slider").onmouseover = (e) => { wjmLIB.setTooltip("What hue to start at (0-255)", wjmPhylloData.colorOffset,document.querySelector("#color-offset-slider").parentElement.offsetTop,document.querySelector("#color-offset-slider").offsetLeft + document.querySelector("#color-offset-slider").clientWidth + horizOffset);};
    document.querySelector("#color-offset-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#color-scale-slider").oninput = (e) => { wjmPhylloData.colorScale = parseFloat(e.target.value); valueChanged(); wjmLIB.setTooltip("How fast the color changes (Lower is faster)", wjmPhylloData.colorScale,document.querySelector("#color-scale-slider").parentElement.offsetTop,document.querySelector("#color-scale-slider").offsetLeft + document.querySelector("#color-scale-slider").clientWidth + horizOffset);};
    document.querySelector("#color-scale-slider").onmouseover = (e) => { wjmLIB.setTooltip("How fast the color changes (Lower is faster)", wjmPhylloData.colorScale,document.querySelector("#color-scale-slider").parentElement.offsetTop,document.querySelector("#color-scale-slider").offsetLeft + document.querySelector("#color-scale-slider").clientWidth + horizOffset);};
    document.querySelector("#color-scale-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#color-ramp-slider").oninput = (e) => { wjmPhylloData.colorRamp = parseFloat(e.target.value); valueChanged(); wjmLIB.setTooltip("How many colors will be used (ie. red -> purple)", wjmPhylloData.colorRamp,document.querySelector("#color-ramp-slider").parentElement.offsetTop,document.querySelector("#color-ramp-slider").offsetLeft + document.querySelector("#color-ramp-slider").clientWidth + horizOffset);};
    document.querySelector("#color-ramp-slider").onmouseover = (e) => { wjmLIB.setTooltip("How many colors will be used (ie. red -> purple)", wjmPhylloData.colorRamp,document.querySelector("#color-ramp-slider").parentElement.offsetTop,document.querySelector("#color-ramp-slider").offsetLeft + document.querySelector("#color-ramp-slider").clientWidth + horizOffset);};
    document.querySelector("#color-ramp-slider").onmouseout = (e) => { removeTooltip();};
}
    
function valueChanged()
{
    resetPhylloVariables();
    wjmLIB.cls(ctx);
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
}
    
function removeTooltip()
{
    document.querySelector("#tooltip").style.display = "none";
}
    
function setPreset(presetNum)
{
    let preset = wjmPresetOne;
    switch(presetNum) {
  case 1:
    preset = wjmPresetOne;
    break;
  case 2:
    preset = wjmPresetTwo;
    break;
  case 3:
    preset = wjmPresetThree
    break;
  case 4:
    preset = wjmPresetFour;
    break;
  case 5:
    preset = wjmPresetFive;
    break;
  default:
    preset = wjmPresetOne;
    }
    
    wjmPhylloData.c = preset.c;
    wjmPhylloData.fadeAway = preset.fadeAway;
    wjmPhylloData.shadows = preset.shadows;
    wjmPhylloData.divergence = preset.divergence;
    wjmPhylloData.divergenceChange = preset.divergenceChange;
    wjmPhylloData.generationSpeed = preset.generationSpeed;
    wjmPhylloData.colorScale = preset.colorScale;
    wjmPhylloData.colorRamp = preset.colorRamp;
    wjmPhylloData.colorOffset = preset.colorOffset;
    wjmPhylloData.yMultiplicity = preset.yMultiplicity;
    wjmPhylloData.nMultiplicity = preset.nMultiplicity;
    wjmPhylloData.yOffset = preset.yOffset;
    wjmPhylloData.yOffsetIntensity = preset.yOffsetIntensity;
    wjmPhylloData.drawType = preset.drawType;
    wjmPhylloData.sizeScale = preset.sizeScale;
    wjmPhylloData.sizeChange = preset.sizeChange;
    
    wjmLIB.setupToolVisuals(wjmPhylloData);
}
        
function sizeChanged()
{
    resetPhylloVariables();
    wjmLIB.cls(ctx);
    canvasHeight = window.innerHeight - vertInset;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    
    wjmLIB.updateDetailsPanel(canvasWidth, canvasHeight, horizInset, vertInset);
}
    
function resetPhylloVariables()
{
    wjmPhylloData.n = 0;
    wjmPhylloData.x = 0;
    wjmPhylloData.y = 0;
    wjmPhylloData.counter = 0;
    wjmPhylloData.divergence = parseFloat(document.querySelector("#divergence").options[document.querySelector("#divergence").selectedIndex].value);
}
    
})();

