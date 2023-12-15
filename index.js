//initialising variables for later use
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn")
const finalValue = document.getElementById("final-value")
const searchBar = document.getElementById("search-bar")

let rotationValues = [

];

let data = [];

var pieColors = [
    "#731010",
    "#707070",
    // "#731010",
    // "#707070",
    // "#731010",
    // "#707070",
]
let labels = []

//calculates the angles used for picking the final value, updates each time a new item is added to insure the angles always add up to 360 but are always unique
function updateRotationValues(){
    rotationValues = []

    let segmentSize = 360 / labels.length;

    for(let i = 0; i < labels.length; i++){
        let minDegree = segmentSize * i + 1;
        let maxDegree = segmentSize *(i + 1);

        rotationValues.push({
            minDegree: minDegree, maxDegree: maxDegree, value: labels[i]
        });
    }
}


// adds the segment names/numbers when enter is pressed after typing in the input box
function addLabel(item){
    labels.push(item)
    data.push(16)
    myChart.update()

    updateRotationValues()
    console.log(rotationValues)
};

//clears the search bar for ease of use when adding items
function clr(){
    searchBar.value = ""
}

// resets the pie chart so that there is no items present, for a clean slate
function reset(){
   while(labels.length > 0){
        rotationValues.pop()
        labels.pop()
        data.pop()
        myChart.update()
        console.log(rotationValues)
    }
}


//Config for the pie chart used as the wheel
let myChart = new Chart (wheel,{    
    plugins: [ChartDataLabels], 
    type: "pie",
    data: {
        labels: labels,
        datasets: [{
            backgroundColor: pieColors,
            data: data,
        },
    ],
    },
    options: {
        responsive: true,
        animation: {duration: 0},
        plugins: {
            tooltip: false,
            legend: {
                display: false,
            },
            datalabels: {
                color: "#ffffff",
                formatter: (_,context) =>
                context.chart.data.labels[context.dataIndex],
                rotation: "0",
                anchor: "end",
                align: "start",
                clamp: "true"
            }
        }
    }
})

// generates the value used for picking the final value using the minimum and maximum degrees
// if the angle is inbetween min and max it will select that, each segment has its own min and max degree
const valueGenerator = (angleValue) =>{
    for(let i of rotationValues){
        if(angleValue >= i.minDegree && angleValue <= i.maxDegree){
            finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
            spinBtn.disabled = false
            break;
        }
    }
}

let count = 0;

let resultValue = 101;
//animating the rotation and calculating the final value. utilizes the above function
spinBtn.addEventListener("click", () => {
    spinBtn.disabled = true;
    finalValue.innerHTML = `<p>GOOD LUCK!</p>`

    let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);

    let rotationInterval = window.setInterval(() => {   
        myChart.options.rotation = myChart.options.rotation + resultValue;
        myChart.update()

        if(myChart.options.rotation >= 360){
            count += 1
            resultValue -= 5
            myChart.options.rotation = 0
            
        }else if(count > 15 && myChart.options.rotation == randomDegree){
            valueGenerator(randomDegree);
            console.log(randomDegree)
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;
        }
    })
})  
