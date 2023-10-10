
const textArea = document.getElementById("input-area")
const submitButton = document.getElementById("submit-data")

let query = {
    "query": [
        {
            "code": "Vuosi",
            "selection": {
                "filter": "item",
                "values": [
                    "2000",
                    "2001",
                    "2002",
                    "2003",
                    "2004",
                    "2005",
                    "2006",
                    "2007",
                    "2008",
                    "2009",
                    "2010",
                    "2011",
                    "2012",
                    "2013",
                    "2014",
                    "2015",
                    "2016",
                    "2017",
                    "2018",
                    "2019",
                    "2020",
                    "2021"
                ]
            }
        },
        {
            "code": "Alue",
            "selection": {
                "filter": "item",
                "values": [
                    "SSS"
                ]
            }
        },
        {
            "code": "Tiedot",
            "selection": {
                "filter": "item",
                "values": [
                    "vaesto"
                ]
            }
        }
    ],
    "response": {
        "format": "json-stat2"
    }
}

submitButton.addEventListener("click", async () => {
    event.preventDefault()
    areaCodes = await getAreaCodes()
    let areaCode = ""
    for (let i = 0; i < areaCodes.length; i++) {
        if (areaCodes[i].name.toLowerCase() == textArea.value.toLowerCase()) {
            areaCode = areaCodes[i].areaCode
            break
        }
    }

    console.log(areaCode)
    query.query[1].selection.values[0] = areaCode
    
    makeChart()
})


const getData = async () => {
    const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"

    const response = await fetch(url, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(query)
    })

    if (!response.ok) {
        return
    }

    data = await response.json()

    return data
}

const getAreaCodes= async () => {
    const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"

    const response = await fetch(url)

    if (!response.ok) {
        return
    }

    data = await response.json()

    let areaCodes = []
    const codes = data.variables[1].values
    const names = data.variables[1].valueTexts 

    codes.forEach((areaCode, index) => {
        areaCodes.push({
            areaCode: areaCode,
            name: names[index]
        })
    });
    
    return areaCodes
}

const makeChart = async () => {
    const data = await getData()

    const population = data.value
    const years = Object.values(data.dimension.Vuosi.category.label)

    const dataset = [
        {
            name: "Population",
            values: population
        }
    ]

    const chartData = {
        labels: years,
        datasets: dataset
    }

    const chart = new frappe.Chart("#chart", {
        title: "Finnish population 2000-2021",
        data: chartData,
        type: "line",
        height: 450,
        color: "#eb5146"
    })
}

makeChart()