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
    
    wjmPhylloData.divergence -= (wjmPhylloData.n / wjmPhylloData.divergenceChange)
    
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
    
    document.querySelector("#generation-speed-slider").oninput = (e) => { wjmPhylloData.generationSpeed = e.target.value; valueChanged();};
    
    document.querySelector("#y-multiplicity-slider").oninput = (e) => { wjmPhylloData.yMultiplicity = e.target.value; valueChanged();};
    
    document.querySelector("#n-multiplicity-slider").oninput = (e) => { wjmPhylloData.nMultiplicity = e.target.value; valueChanged();};
    
    document.querySelector("#c-value-slider").oninput = (e) => { wjmPhylloData.c = parseFloat(e.target.value); valueChanged();};
    
    document.querySelector("#size-multiplier-slider").oninput = (e) => { wjmPhylloData.sizeScale = e.target.value; valueChanged();};
    
    document.querySelector("#y-offset-slider").oninput = (e) => { wjmPhylloData.yOffset = parseFloat(e.target.value); valueChanged();};
    
    document.querySelector("#y-offset-intensity-slider").oninput = (e) => { wjmPhylloData.yOffsetIntensity = parseFloat(e.target.value); valueChanged();};
    
    document.querySelector("#color-offset-slider").oninput = (e) => { wjmPhylloData.colorOffset = parseFloat(e.target.value); valueChanged();};
    
    document.querySelector("#color-scale-slider").oninput = (e) => { wjmPhylloData.colorScale = parseFloat(e.target.value); valueChanged();};
    
    document.querySelector("#color-ramp-slider").oninput = (e) => { wjmPhylloData.colorRamp = parseFloat(e.target.value); valueChanged();};
}
    
function valueChanged()
{
    resetPhylloVariables();
    wjmLIB.cls(ctx);
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
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
}
    
})();

