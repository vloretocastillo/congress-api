// ********************************************************* GET CURRENT HTML PAGE

const currentPage = window.location.pathname.split('/').pop();

// ******************************************************* STICKY NAVBAR ON SCROLL

window.onscroll = () => { 
    makeMenuStickyOnScroll() 
};

let menu = document.getElementById('menu')
let sticky = menu.offsetTop;

let makeMenuStickyOnScroll = () => { 
    window.scrollY >= sticky ? menu.classList.add("sticky") : menu.classList.remove("sticky"); 
}


// ********************************************************* INDEX PAGE

if (currentPage == 'index.html') {
    const changeText = (thisButton) => {
        const isTextVisible = window.getComputedStyle(document.querySelector( '#toggleText' ) );
        const readToggleButton = document.getElementById(thisButton.id);
        isTextVisible == 'block' ? readToggleButton.innerHTML = 'Read More' : readToggleButton.innerHTML = 'Read Less'
    }
}

// ********************************************************* FETCH DATA


const pagesThatFetchData = [ 'senate.html', 'representatives.html', 'statistics.html' ]
if ( pagesThatFetchData.indexOf(currentPage) != -1) {

    const loader = document.getElementById('loader')
    // loader.classList.remove('hide-me')


    const getData =  async (chamber) => {
        loader.classList.remove('hide-me')
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



    if (currentPage == 'statistics.html') {

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

        const filter = () => {

            // const loader = document.getElementById('loader')
            // loader.classList.remove('hide-me')
        
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
                .then(data => {
        
                    const democratMembers = data.filter(el => el.party == 'D');
                    const republicanMembers = data.filter(el => el.party == 'R');
                    const independentMembers = data.filter(el => el.party == 'I');
        
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
                            const sum = data.reduce((prev, cur) => prev + parseInt( cur.votes_with_party_pct ), 0)
                            return (sum / data.length).toFixed(2) + ' %'
                        },
                    }
        
                    renderMainTable(basicStats)
        
                    let tenPercent = (10 * data.length) / 100
                    const membersEngagement = data.map((el) => [el.first_name + " " + (el.middle_name || '') + ' ' + el.last_name, el.missed_votes, el.missed_votes_pct]).sort(function(a, b){return b[1]-a[1]})
                    const leastEngaged = membersEngagement.slice(0,tenPercent)
                    const mostEngaged = membersEngagement.reverse().slice(0,tenPercent)
        
                    const membersLoyalty = data.map((el) => {
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
                    loader.classList.add('hide-me')
                })
        }

        const selectElement = document.getElementById('party-attendance')
        selectElement.addEventListener('change', () => filter() ) 

        const radioElements = document.getElementsByName('statistic')
        for (let i=0; i < radioElements.length; i++) { radioElements[i].addEventListener('click', () => filter()) }


        filter();

   } 
   
   else if (currentPage == 'senate.html' || currentPage == 'representatives.html') {
        const states = [
            { name: 'ALABAMA', abbreviation: 'AL'},
            { name: 'ALASKA', abbreviation: 'AK'},
            { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
            { name: 'ARIZONA', abbreviation: 'AZ'},
            { name: 'ARKANSAS', abbreviation: 'AR'},
            { name: 'CALIFORNIA', abbreviation: 'CA'},
            { name: 'COLORADO', abbreviation: 'CO'},
            { name: 'CONNECTICUT', abbreviation: 'CT'},
            { name: 'DELAWARE', abbreviation: 'DE'},
            { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
            { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
            { name: 'FLORIDA', abbreviation: 'FL'},
            { name: 'GEORGIA', abbreviation: 'GA'},
            { name: 'GUAM', abbreviation: 'GU'},
            { name: 'HAWAII', abbreviation: 'HI'},
            { name: 'IDAHO', abbreviation: 'ID'},
            { name: 'ILLINOIS', abbreviation: 'IL'},
            { name: 'INDIANA', abbreviation: 'IN'},
            { name: 'IOWA', abbreviation: 'IA'},
            { name: 'KANSAS', abbreviation: 'KS'},
            { name: 'KENTUCKY', abbreviation: 'KY'},
            { name: 'LOUISIANA', abbreviation: 'LA'},
            { name: 'MAINE', abbreviation: 'ME'},
            { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
            { name: 'MARYLAND', abbreviation: 'MD'},
            { name: 'MASSACHUSETTS', abbreviation: 'MA'},
            { name: 'MICHIGAN', abbreviation: 'MI'},
            { name: 'MINNESOTA', abbreviation: 'MN'},
            { name: 'MISSISSIPPI', abbreviation: 'MS'},
            { name: 'MISSOURI', abbreviation: 'MO'},
            { name: 'MONTANA', abbreviation: 'MT'},
            { name: 'NEBRASKA', abbreviation: 'NE'},
            { name: 'NEVADA', abbreviation: 'NV'},
            { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
            { name: 'NEW JERSEY', abbreviation: 'NJ'},
            { name: 'NEW MEXICO', abbreviation: 'NM'},
            { name: 'NEW YORK', abbreviation: 'NY'},
            { name: 'NORTH CAROLINA', abbreviation: 'NC'},
            { name: 'NORTH DAKOTA', abbreviation: 'ND'},
            { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
            { name: 'OHIO', abbreviation: 'OH'},
            { name: 'OKLAHOMA', abbreviation: 'OK'},
            { name: 'OREGON', abbreviation: 'OR'},
            { name: 'PALAU', abbreviation: 'PW'},
            { name: 'PENNSYLVANIA', abbreviation: 'PA'},
            { name: 'PUERTO RICO', abbreviation: 'PR'},
            { name: 'RHODE ISLAND', abbreviation: 'RI'},
            { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
            { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
            { name: 'TENNESSEE', abbreviation: 'TN'},
            { name: 'TEXAS', abbreviation: 'TX'},
            { name: 'UTAH', abbreviation: 'UT'},
            { name: 'VERMONT', abbreviation: 'VT'},
            { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
            { name: 'VIRGINIA', abbreviation: 'VA'},
            { name: 'WASHINGTON', abbreviation: 'WA'},
            { name: 'WEST VIRGINIA', abbreviation: 'WV'},
            { name: 'WISCONSIN', abbreviation: 'WI'},
            { name: 'WYOMING', abbreviation: 'WY' }
        ];

        let stateSelect = document.getElementById('state');
        stateSelect.addEventListener('change', () => filter() ) 
        for(let i = 0; i < states.length; i++) {
            var option = document.createElement("option");
            option.innerHTML = states[i].name;
            option.value = states[i].abbreviation;
            stateSelect.appendChild(option);
        }
        const checkboxesParties = document.getElementsByName('party') || null
        for (let i=0; i < checkboxesParties.length; i++) { checkboxesParties[i].addEventListener('change', () => filter() ) } 
        
        const createMemberObj = (member) => {
            const memberObject = {}
            memberObject.first_name = member.first_name
            memberObject.middle_name = member.middle_name
            memberObject.last_name = member.last_name
            memberObject.state = member.state
            memberObject.seniority = member.seniority
            memberObject.party = member.party
            memberObject.votes_with_party_pct = member.votes_with_party_pct + "%"
            return memberObject
        }

        const renderTable = (members) => {
            const tableBody = document.getElementById('table-body')
            for (let i = 0; i < members.length; i++) { 
                const tr = document.createElement('tr')
                
                let full_name = document.createElement('td') 
                full_name.innerHTML = `${ members[i].first_name} ${members[i].middle_name || ""} ${members[i].last_name}`
                tr.appendChild(full_name)
                
                let state = document.createElement('td')
                state.innerHTML = members[i].state 
                tr.appendChild(state)
        
                let seniority = document.createElement('td')
                seniority.innerHTML =  members[i].seniority 
                tr.appendChild(seniority)
                
                let party = document.createElement('td')  
                party.innerHTML = members[i].party 
                tr.appendChild(party)
        
                let party_votes = document.createElement('td')
                party_votes.innerHTML =  members[i].votes_with_party_pct
                tr.appendChild(party_votes)
        
                tableBody.appendChild( tr ) 
            }
        }

        const filter = () => {
            

            const checkboxesValuesParties = [...document.querySelectorAll('input[type=checkbox]:checked')].map(el => el.value)
            const selectedState  = [...document.getElementById('state')].filter(el => el.selected)[0].value 
            
            let chamber = currentPage == "senate.html" ? 'senate' : 'house'
            
            getData(chamber)
                .then(members => {
                    if (selectedState != "all") { members = members.filter(el => el.state == selectedState) }
                    members = members.filter(el => checkboxesValuesParties.indexOf(el.party) != -1)
                    members = members.map(el => createMemberObj(el))
                    document.getElementById('table-body').innerHTML = ''
                    renderTable( members )
                    const tableBodyRows = document.getElementById('table-body').rows.length
                    tableBodyRows == 0 ? document.getElementById('zero-results-box').classList.remove('hide-me') : document.getElementById('zero-results-box').classList.add('hide-me')
                }).then (() => {
                    loader.classList.add('hide-me')
                })
        }

        filter();
   
    } 

}
















