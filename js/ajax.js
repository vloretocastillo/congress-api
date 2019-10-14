// ******************************************************* ADD EVEN LISTENERS

const selectElement = document.getElementById('party-attendance')
selectElement.addEventListener('change', () => filter() ) 

const radioElements = document.getElementsByName('statistic')
for (let i=0; i < radioElements.length; i++) { radioElements[i].addEventListener('click', () => filter()) }

// *******************************************************  GET DATA ASYNC FUNCTION

const getData =  async (chamber) => {
    
     const response = await fetch(`https://api.propublica.org/congress/v1/113/${chamber}/members.json`, {
        method: 'GET',
        headers: {
          'X-API-Key': 'VW1RX1TgbPr1hp9uHtgJW2Nr01QcNzQAm8CqrDGl',
        }
      });
    const json = await response.json();
    const members = await json['results'][0]['members']
    return members
     
};

// ******************************************************* RENDER TABLES

const renderMainTable = (basicStats) => {
    const tableBody = document.getElementById('table-body')
    let keys = ['Democrats', 'Republicans', 'Independents', 'Total']
 
    for (let i=0; i < keys.length; i++) {
       let tr = document.createElement('tr')
       let td = document.createElement('td')
       td.innerHTML = keys[i] 
       tr.appendChild(td)
       tableBody.appendChild(tr)
    }

    let i = 0
    for (let key in basicStats) {
        const td = document.createElement('td')
        td.innerHTML = basicStats[key]();
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

// ******************************************************* FILTER 

const filter = () => {

    const loader = document.getElementById('loader')
    loader.classList.remove('hide-me')

    const selectedChamber = selectElement.options[selectElement.selectedIndex].value

    let chamber = selectedChamber == "S" ? 'senate' : 'house'
    const h2 = document.getElementsByTagName('h2')[0]
    selectedChamber == "S" ? h2.innerHTML = "Senate at a Glance" : h2.innerHTML = 'House at a Glance'

    const tableBodies = document.getElementsByTagName('tbody')
    for (let i=0; i < tableBodies.length; i++) { tableBodies[i].innerHTML = '' }

    const selectedTypeStatistic = document.querySelector('input[type=radio]:checked').value
    const attendanceTables = document.getElementById('attendance-tables')
    const loyaltyTables = document.getElementById('loyalty-tables')

    getData(chamber)
        .then(statistics => {

            const democratMembers = statistics.filter(el => el.party == 'D');
            const republicanMembers = statistics.filter(el => el.party == 'R');
            const independentMembers = statistics.filter(el => el.party == 'I');

            const basicStats = {
                numberOfDemocrats : () => { return parseInt( democratMembers.length) },
                numberOfRepublicans : () => { return parseInt( republicanMembers.length) },
                numberOfIndependents : () =>  { return parseInt( independentMembers.length)},
                totalNumber :  function ()  { return this.numberOfDemocrats() + this.numberOfRepublicans() + this.numberOfIndependents() },
                democratsPercentageVoted : function () {
                    const sum = democratMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
                    return (sum / this.numberOfDemocrats()).toFixed(2) + ' %'
                },
                republicansPercentageVoted : function () {
                    const sum = republicanMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
                    return (sum / this.numberOfRepublicans()).toFixed(2) + ' %'
                },
                independentsPercentageVoted : function () {
                    if ( this.numberOfIndependents() == 0 ) return '0 %'
                    const sum = independentMembers.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
                    return (sum / this.numberOfIndependents()).toFixed(2) + ' %'
                }, 
                totalPercentage : function () {
                    const sum = statistics.reduce((prev, cur) => prev + parseInt( cur.votes_with_party_pct ), 0)
                    return (sum / statistics.length).toFixed(2) + ' %'
                },
            }

            renderMainTable(basicStats)

            let tenPercent = (10 * statistics.length) / 100
            const membersEngagement = statistics.map((el) => [el.first_name + " " + (el.middle_name || '') + ' ' + el.last_name, el.missed_votes, el.missed_votes_pct]).sort(function(a, b){return b[1]-a[1]})
            const leastEngaged = membersEngagement.slice(0,tenPercent)
            const mostEngaged = membersEngagement.reverse().slice(0,tenPercent)

            const membersLoyalty = statistics.map((el) => {
                let votesWithParty = Math.floor(el.total_votes * el.votes_with_party_pct / 100)
                return [el.first_name + " " + (el.middle_name || '') + ' ' + el.last_name, votesWithParty, el.votes_with_party_pct]
            }).sort(function(a, b){return a[2]-b[2]})
            const leastLoyal = membersLoyalty.slice(0,tenPercent)
            const mostLoyal = membersLoyalty.reverse().slice(0,tenPercent)

            if (selectedTypeStatistic == 'attendance') {
                loyaltyTables.classList.add('hide-me')
                attendanceTables.classList.remove('hide-me')
                renderStatisticsTable(mostEngaged, 'most-engaged')
                renderStatisticsTable(leastEngaged, 'least-engaged')
            } else {
                attendanceTables.classList.add('hide-me')
                loyaltyTables.classList.remove('hide-me')
                renderStatisticsTable(mostLoyal, 'most-loyal')
                renderStatisticsTable(leastLoyal, 'least-loyal')
            }
        })
        .then (() => {
            // console.log(data)
            loader.classList.add('hide-me')
        })
    

    

}

// ******************************************************* CALL FILTER

filter();