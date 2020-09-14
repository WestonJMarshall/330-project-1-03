"use strict";
(function(){

window.onload = init;

let canvasWidth = 600, canvasHeight = 900;
let ctx;

function init(){
    
    ctx = canvas.getContext("2d");
    
    canvasHeight = window.innerHeight - 27;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    window.addEventListener("resize", sizeChanged);
    
    updateDetailsPanel();
    
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
    wjmPhylloData.n++;
    
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
    
    if(wjmPhylloData.sizeChange !== "true"){z = wjmPhylloData.sizeScale;}
    
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
}
    
function setupControls()
{
    document.querySelector("#generation-type").addEventListener('change', _ => { wjmPhylloData.drawType = document.querySelector("#generation-type").options[document.querySelector("#generation-type").selectedIndex].value; valueChanged();});
    
    document.querySelector("#divergence").addEventListener('change', _ => { wjmPhylloData.divergence = parseFloat(document.querySelector("#divergence").options[document.querySelector("#divergence").selectedIndex].value); valueChanged();});
    
    document.querySelector("#divergence-change").addEventListener('change', _ => { wjmPhylloData.divergenceChange = parseFloat(document.querySelector("#divergence-change").options[document.querySelector("#divergence-change").selectedIndex].value); valueChanged();});
    
    document.querySelector("#size-change").addEventListener('change', _ => { wjmPhylloData.sizeChange = document.querySelector("#size-change").options[document.querySelector("#size-change").selectedIndex].value; valueChanged();});
    
    document.querySelector("#generation-speed-slider").oninput = (e) => { wjmPhylloData.generationSpeed = e.target.value; valueChanged(); setTooltip("How fast points are generated", wjmPhylloData.generationSpeed,document.querySelector("#generation-speed-slider").parentElement.offsetTop,document.querySelector("#generation-speed-slider").offsetLeft + document.querySelector("#generation-speed-slider").clientWidth + 25);};
    document.querySelector("#generation-speed-slider").onmouseover = (e) => { setTooltip("How fast points are generated", wjmPhylloData.generationSpeed,document.querySelector("#generation-speed-slider").parentElement.offsetTop,document.querySelector("#generation-speed-slider").offsetLeft + document.querySelector("#generation-speed-slider").clientWidth + 25);};
    document.querySelector("#generation-speed-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#y-multiplicity-slider").oninput = (e) => { wjmPhylloData.yMultiplicity = e.target.value; valueChanged(); setTooltip("How many times the y value is multiplied by itself (y = N / Y)", wjmPhylloData.yMultiplicity,document.querySelector("#y-multiplicity-slider").parentElement.offsetTop,document.querySelector("#y-multiplicity-slider").offsetLeft + document.querySelector("#y-multiplicity-slider").clientWidth + 25);};
    document.querySelector("#y-multiplicity-slider").onmouseover = (e) => { setTooltip("How many times the Y value is multiplied by itself (y = N / Y)", wjmPhylloData.yMultiplicity,document.querySelector("#y-multiplicity-slider").parentElement.offsetTop,document.querySelector("#y-multiplicity-slider").offsetLeft + document.querySelector("#y-multiplicity-slider").clientWidth + 25);};
    document.querySelector("#y-multiplicity-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#n-multiplicity-slider").oninput = (e) => { wjmPhylloData.nMultiplicity = e.target.value; valueChanged(); setTooltip("How many times the N value is multiplied by itself (y = N / Y)", wjmPhylloData.nMultiplicity,document.querySelector("#n-multiplicity-slider").parentElement.offsetTop,document.querySelector("#n-multiplicity-slider").offsetLeft + document.querySelector("#n-multiplicity-slider").clientWidth + 25);};
    document.querySelector("#n-multiplicity-slider").onmouseover = (e) => { setTooltip("How many times the N value is multiplied by itself (y = N / Y)", wjmPhylloData.nMultiplicity,document.querySelector("#n-multiplicity-slider").parentElement.offsetTop,document.querySelector("#n-multiplicity-slider").offsetLeft + document.querySelector("#n-multiplicity-slider").clientWidth + 25);};
    document.querySelector("#n-multiplicity-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#c-value-slider").oninput = (e) => { wjmPhylloData.c = parseFloat(e.target.value); valueChanged(); setTooltip("(Basically) how far apart the particles will be spread", wjmPhylloData.c,document.querySelector("#c-value-slider").parentElement.offsetTop,document.querySelector("#c-value-slider").offsetLeft + document.querySelector("#c-value-slider").clientWidth + 25);};
    document.querySelector("#c-value-slider").onmouseover = (e) => { setTooltip("(Basically) how far apart the particles will be spread", wjmPhylloData.c,document.querySelector("#c-value-slider").parentElement.offsetTop,document.querySelector("#c-value-slider").offsetLeft + document.querySelector("#c-value-slider").clientWidth + 25);};
    document.querySelector("#c-value-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#size-multiplier-slider").oninput = (e) => { wjmPhylloData.sizeScale = e.target.value; valueChanged(); setTooltip("Number that the particle size will be multiplied by", wjmPhylloData.sizeScale,document.querySelector("#size-multiplier-slider").parentElement.offsetTop,document.querySelector("#size-multiplier-slider").offsetLeft + document.querySelector("#size-multiplier-slider").clientWidth + 25);};
    document.querySelector("#size-multiplier-slider").onmouseover = (e) => { setTooltip("Number that the particle size will be multiplied by", wjmPhylloData.sizeScale,document.querySelector("#size-multiplier-slider").parentElement.offsetTop,document.querySelector("#size-multiplier-slider").offsetLeft + document.querySelector("#size-multiplier-slider").clientWidth + 25);};
    document.querySelector("#size-multiplier-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#y-offset-slider").oninput = (e) => { wjmPhylloData.yOffset = parseFloat(e.target.value); valueChanged(); setTooltip("How far down the canvas the particles will be placed", wjmPhylloData.yOffset,document.querySelector("#y-offset-slider").parentElement.offsetTop,document.querySelector("#y-offset-slider").offsetLeft + document.querySelector("#y-offset-slider").clientWidth + 25);};
    document.querySelector("#y-offset-slider").onmouseover = (e) => { setTooltip("How far down the canvas the particles will be placed", wjmPhylloData.yOffset,document.querySelector("#y-offset-slider").parentElement.offsetTop,document.querySelector("#y-offset-slider").offsetLeft + document.querySelector("#y-offset-slider").clientWidth + 25);};
    document.querySelector("#y-offset-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#y-offset-intensity-slider").oninput = (e) => { wjmPhylloData.yOffsetIntensity = parseFloat(e.target.value); valueChanged(); setTooltip("Multiplier for y-value changes", wjmPhylloData.yOffsetIntensity,document.querySelector("#y-offset-intensity-slider").parentElement.offsetTop,document.querySelector("#y-offset-intensity-slider").offsetLeft + document.querySelector("#y-offset-intensity-slider").clientWidth + 25);};
    document.querySelector("#y-offset-intensity-slider").onmouseover = (e) => { setTooltip("Multiplier for y-value changes", wjmPhylloData.yOffsetIntensity,document.querySelector("#y-offset-intensity-slider").parentElement.offsetTop,document.querySelector("#y-offset-intensity-slider").offsetLeft + document.querySelector("#y-offset-intensity-slider").clientWidth + 25);};
    document.querySelector("#y-offset-intensity-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#color-offset-slider").oninput = (e) => { wjmPhylloData.colorOffset = parseFloat(e.target.value); valueChanged(); setTooltip("What hue to start at (0-255)", wjmPhylloData.colorOffset,document.querySelector("#color-offset-slider").parentElement.offsetTop,document.querySelector("#color-offset-slider").offsetLeft + document.querySelector("#color-offset-slider").clientWidth + 25);};
    document.querySelector("#color-offset-slider").onmouseover = (e) => { setTooltip("What hue to start at (0-255)", wjmPhylloData.colorOffset,document.querySelector("#color-offset-slider").parentElement.offsetTop,document.querySelector("#color-offset-slider").offsetLeft + document.querySelector("#color-offset-slider").clientWidth + 25);};
    document.querySelector("#color-offset-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#color-scale-slider").oninput = (e) => { wjmPhylloData.colorScale = parseFloat(e.target.value); valueChanged(); setTooltip("How fast the color changes (Lower is faster)", wjmPhylloData.colorScale,document.querySelector("#color-scale-slider").parentElement.offsetTop,document.querySelector("#color-scale-slider").offsetLeft + document.querySelector("#color-scale-slider").clientWidth + 25);};
    document.querySelector("#color-scale-slider").onmouseover = (e) => { setTooltip("How fast the color changes (Lower is faster)", wjmPhylloData.colorScale,document.querySelector("#color-scale-slider").parentElement.offsetTop,document.querySelector("#color-scale-slider").offsetLeft + document.querySelector("#color-scale-slider").clientWidth + 25);};
    document.querySelector("#color-scale-slider").onmouseout = (e) => { removeTooltip();};
    
    document.querySelector("#color-ramp-slider").oninput = (e) => { wjmPhylloData.colorRamp = parseFloat(e.target.value); valueChanged(); setTooltip("How many colors will be used (ie. red -> purple)", wjmPhylloData.colorRamp,document.querySelector("#color-ramp-slider").parentElement.offsetTop,document.querySelector("#color-ramp-slider").offsetLeft + document.querySelector("#color-ramp-slider").clientWidth + 25);};
    document.querySelector("#color-ramp-slider").onmouseover = (e) => { setTooltip("How many colors will be used (ie. red -> purple)", wjmPhylloData.colorRamp,document.querySelector("#color-ramp-slider").parentElement.offsetTop,document.querySelector("#color-ramp-slider").offsetLeft + document.querySelector("#color-ramp-slider").clientWidth + 25);};
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
    
function setTooltip(text, value, top, left)
{
    let tooltip = document.querySelector("#tooltip");
    //console.log(`${parseString(document.querySelector("#body-wrapper").width)}px`);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top - 22}px`;
    tooltip.style.display = "block";
    tooltip.innerHTML = `${text} <br>value: ${value}`;
}
    
function sizeChanged()
{
    resetPhylloVariables();
    wjmLIB.cls(ctx);
    canvasHeight = window.innerHeight - 27;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    
    updateDetailsPanel();
}
    
function updateDetailsPanel()
{
    let details = document.querySelector("#details-wrapper");
    details.style.width = `${window.innerWidth - canvasWidth - 74}px`;
    details.style.left = `${canvasWidth + 27}px`;
    details.style.height = `${canvasHeight - 27}px`;
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

