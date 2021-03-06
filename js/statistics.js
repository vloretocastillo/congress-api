


// *******************************************************STATISTICS OBJECTS


const senateStatistics = {

    basicStats : {
        numberOfDemocrats : () => { return parseInt( senateDemocratMembers.length) },
        numberOfRepublicans : () => { return parseInt( senateRepublicanMembers.length) },
        numberOfIndependents : () =>  { return parseInt( senateIndependentMembers.length)},
        totalNumber :  function ()  { return this.numberOfDemocrats() + this.numberOfRepublicans() + this.numberOfIndependents() },
        democratsPercentageVoted : function () {
            const sum = senateDemocratMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
            return (sum / this.numberOfDemocrats()).toFixed(2) + ' %'
        },
        republicansPercentageVoted : function () {
            const sum = senateRepublicanMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
            return (sum / this.numberOfRepublicans()).toFixed(2) + ' %'
        },
        independentsPercentageVoted : function () {
            const sum = senateIndependentMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
            return (sum / this.numberOfIndependents()).toFixed(2) + ' %'
        }, 
        totalPercentage : function () {
            const sum = senateMembers.reduce((prev, cur) => prev + parseInt( cur.votes_with_party_pct ), 0)
            return (sum / senateMembers.length).toFixed(2) + ' %'
        },
    },
    leastEngaged : senateLeastEngaged,
    mostEngaged : senateMostEngaged,
    leastLoyal : senateLeastLoyal,
    mostLoyal : senateMostLoyal,
}



const houseStatistics = {

    basicStats : {
        numberOfDemocrats : () =>  parseInt( houseDemocratMembers.length) ,
        numberOfRepublicans : () =>  parseInt( houseRepublicanMembers.length) ,
        numberOfIndependents : () =>   parseInt( houseIndependentMembers.length),
        totalNumber :  function ()  { return this.numberOfDemocrats() + this.numberOfRepublicans() + this.numberOfIndependents() },
        democratsPercentageVoted : function () {
            const sumPercentages = houseDemocratMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
            return (sumPercentages / this.numberOfDemocrats()).toFixed(2) + ' %'
        },
        republicansPercentageVoted : function () {
            const sumPercentages = houseRepublicanMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0) 
            return (sumPercentages / this.numberOfRepublicans()).toFixed(2) + ' %'
        },
        independentsPercentageVoted : function () {
            if ( this.numberOfIndependents() == 0 ) return '0 %'
            const sumPercentages = houseIndependentMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0) 
            return (sumPercentages / this.numberOfIndependents()).toFixed(2) + ' %'
        },
        totalPercentage : function () {
            const sum = houseMembers.reduce((prev, cur) => prev + parseInt( cur.votes_with_party_pct ), 0)
            return (sum / houseMembers.length).toFixed(2) + ' %'
        },

    },
    leastEngaged : houseLeastEngaged,
    mostEngaged : houseMostEngaged,
    leastLoyal : houseLeastLoyal,
    mostLoyal : houseMostLoyal,

}




// ******************************************************* RENDER TABLE  


const renderMainTable = (statistics) => {
    const tableBody = document.getElementById('table-body')
    // tableBody.innerHTML = ''

    let keys = ['Democrats', 'Republicans', 'Independents', 'Total']
 
    for (let i=0; i < keys.length; i++) {
       let tr = document.createElement('tr')
       let td = document.createElement('td')
       td.innerHTML = keys[i] 
       tr.appendChild(td)
       tableBody.appendChild(tr)
    }

    let i = 0
    for (let key in statistics) {
        const td = document.createElement('td')
        td.innerHTML = statistics[key]();
        tableBody.rows[i].appendChild(td) 
        i >= 3 ? i = 0 : i +=1 
    }
}

const renderStatisticsTable = (members, id) => {
    const tableBody = document.getElementById(id)
    for (let i=0; i < members.length; i++) {
        let tr = document.createElement('tr')
        for (let j=0; j < members[i].length; j++) {
            let td = document.createElement('td')
            td.innerHTML = members[i][j]
            tr.appendChild(td)
        }
        tableBody.appendChild(tr)
    }
}



// ******************************************************* ADD EVEN LISTENER

const selectElement = document.getElementById('party-attendance')
selectElement.addEventListener('change', () => filter() ) 

const radioElements = document.getElementsByName('statistic')
for (let i=0; i < radioElements.length; i++) { radioElements[i].addEventListener('click', () => filter()) }




// ******************************************************* FILTER 

const filter = () => {

    

    const selectedChamber = selectElement.options[selectElement.selectedIndex].value
    let statistics = selectedChamber == "S" ? senateStatistics : houseStatistics
    const h2 = document.getElementsByTagName('h2')[0]
    selectedChamber == "S" ? h2.innerHTML = "Senate at a Glance" : h2.innerHTML = 'House at a Glance'

    const tableBodies = document.getElementsByTagName('tbody')
    for (let i=0; i < tableBodies.length; i++) { tableBodies[i].innerHTML = '' }


    renderMainTable(statistics.basicStats)

    const selectedTypeStatistic = document.querySelector('input[type=radio]:checked').value
    const attendanceTables = document.getElementById('attendance-tables')
    const loyaltyTables = document.getElementById('loyalty-tables')


    if (selectedTypeStatistic == 'attendance') {
        loyaltyTables.classList.add('hide-me')
        attendanceTables.classList.remove('hide-me')
        renderStatisticsTable(statistics.mostEngaged, 'most-engaged')
        renderStatisticsTable(statistics.leastEngaged, 'least-engaged')
    } else {
        attendanceTables.classList.add('hide-me')
        loyaltyTables.classList.remove('hide-me')
        renderStatisticsTable(statistics.mostLoyal, 'most-loyal')
        renderStatisticsTable(statistics.leastLoyal, 'least-loyal')
    }

}

// ******************************************************* CALL FILTER
filter();


