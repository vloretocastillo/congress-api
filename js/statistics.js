
// *******************************************************STATISTICS OBJECTS


const senateStatistics = {
    numberOfDemocrats : () => { return parseInt( senateDemocratMembers.length) },
    numberOfRepublicans : () => { return parseInt( senateRepublicanMembers.length) },
    numberOfIndependents : () =>  { return parseInt( senateIndependentMembers.length)},
    totalNumber :  function ()  { return this.numberOfDemocrats() + this.numberOfRepublicans() + this.numberOfIndependents() },
    democratsPercentageVoted : function () {
        const sumPercentages = senateDemocratMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
        return (sumPercentages / this.numberOfDemocrats()).toFixed(2) + ' %'
    },
    republicansPercentageVoted : function () {
        const sumPercentages = senateRepublicanMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
        return (sumPercentages / this.numberOfRepublicans()).toFixed(2) + ' %'
    },
    independentsPercentageVoted : function () {
        const sumPercentages = senateIndependentMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
        return (sumPercentages / this.numberOfIndependents()).toFixed(2) + ' %'
    }

}



const houseStatistics = {
    numberOfDemocrats : () => { return parseInt( houseDemocratMembers.length) },
    numberOfRepublicans : () => { return parseInt( houseRepublicanMembers.length) },
    numberOfIndependents : () =>  { return parseInt( houseIndependentMembers.length)},
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
    }
}


// ******************************************************* FILTER 

const filter = () => {
    const selectedOption = selectElement.options[selectElement.selectedIndex].value
    const h2 = document.getElementsByTagName('h2')[0]
    selectedOption == "S" ? h2.innerHTML = "Senate at a Glance" : h2.innerHTML = 'House at a Glance'
    renderTable(selectedOption)
}

// ******************************************************* RENDER TABLE  


const renderTable = (selectedOption) => {

    let statistics = selectedOption == "S" ? senateStatistics : houseStatistics
    const tableBody = document.getElementById('table-body')
    tableBody.innerHTML = ''

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

// ******************************************************* GET SELECT ELEMENT AND ADD EVEN LISTENER

const selectElement = document.getElementById('party-attendance')
selectElement.addEventListener('change', () => filter() ) 

// ******************************************************* CALL FILTER
filter();
