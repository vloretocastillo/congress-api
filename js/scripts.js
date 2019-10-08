// ********************************************************* CURRENT HTML PAGE

const currentPage = window.location.pathname.split('/').pop();

// ********************************************************* READ TOGGLE BUTTON - HOME PAGE

const changeText = (thisButton) => {
    const isTextVisible = window.getComputedStyle(document.querySelector( '#toggleText' ) );
    const readToggleButton = document.getElementById(thisButton.id);
    isTextVisible == 'block' ? readToggleButton.innerHTML = 'Read More' : readToggleButton.innerHTML = 'Read Less'
}

// ********************************************************* 

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

if (stateSelect) {
    stateSelect.addEventListener('change', () => filter() ) 

    for(let i = 0; i < states.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = states[i].name;
        option.value = states[i].abbreviation;
        stateSelect.appendChild(option);
    }
}

// ********************************************************* ADD EVENT LISTENERS  

const checkboxesParties = document.getElementsByName('party') || null

if (checkboxesParties) {
    for (let i=0; i < checkboxesParties.length; i++) { checkboxesParties[i].addEventListener('change', () => filter() ) }
}
// if (stateSelect) {
//     stateSelect.addEventListener('change', () => filter() ) 
// }

// ********************************************************* GENERATE MEMBER TABLES FUNCTIONS 

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
        // tr.setAttribute('data-party', member.party )

        let party_votes = document.createElement('td')
        party_votes.innerHTML =  members[i].votes_with_party_pct
        tr.appendChild(party_votes)

        tableBody.appendChild( tr ) 

    }
}


// ********************************************************* FILTER 

const filter = () => {
    let members = currentPage == "senate.html" ? dataSenate['results'][0]['members'] : currentPage == "representatives.html" ? dataHouse['results'][0]['members'] : null
    const checkboxesValuesParties = [...document.querySelectorAll('input[type=checkbox]:checked')].map(el => el.value)

    const stateSelect = [...document.getElementById('state')].filter(el => el.selected)[0].value

    if (stateSelect != "all") { members = members.filter(el => el.state == stateSelect) }

    members = members.filter(el => checkboxesValuesParties.indexOf(el.party) != -1)
    members = members.map(el => createMemberObj(el))

    document.getElementById('table-body').innerHTML = ''
    renderTable( members )
}


if (currentPage == "senate.html" || currentPage == "representatives.html") filter();
