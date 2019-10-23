
const makeMenuStickyOnScroll = function (menuOffSetTop) {
    window.scrollY >= menuOffSetTop ? document.getElementById('menu').classList.add("sticky") : document.getElementById('menu').classList.remove("sticky") 
}

const onScrollAddEventListener = function () {
    let menuOffSetTop = document.getElementById('menu').offsetTop
    window.addEventListener('scroll', () => makeMenuStickyOnScroll(menuOffSetTop) )   
}

onScrollAddEventListener()

let app = new Vue({
    el: '#root',
    data : {
        currentPage: '',
        displayText: false,
        toggleTextInnerHtml : 'Read More',
        chamber: 'senate',
        statistic: 'attendance',
        loader : true,
        states : [],
        selectedState: 'all',
        selectedParties : ['R', 'D', 'I'],
        members: [],
        democrats: [],
        republicans : [],
        independents: [],
        mostEngaged : [],
        leastEngaged : [],
        mostLoyal : []        
    },

    methods : {
        updateCurrentPage : function() { this.currentPage = window.location.pathname.split('/').pop() },
        toggleLoader : function (status) { 
            this.loader = status == 'reveal' ? true : false
        },
        toggleText : function () {
            this.toggleTextInnerHtml = this.displayText ? 'Read More' : 'Read Less'
            this.displayText = !this.displayText
        },

        // ***********************************************************************************************************************

        getData : async function (chamber) {
            const response = await fetch(`https://api.propublica.org/congress/v1/113/${chamber}/members.json`, {
                method: 'GET',
                headers: {
                    'X-API-Key': 'VW1RX1TgbPr1hp9uHtgJW2Nr01QcNzQAm8CqrDGl',
                }
            });
            const json = await response.json();
            const members = await json['results'][0]['members']
            return members;
        },

        // ***********************************************************************************************************************

        filterByParty : function (members, party) { return members.filter(el => el.party == party) },

        // ***********************************************************************************************************************


        votePercentageByParty : function (party) {
            if (party.length == 0 ) return '0 %'
            const total = party.reduce((prev, cur) => prev += parseInt( cur.votes_with_party_pct ), 0)
            return (total / party.length ).toFixed(2) + ' %'
        },

        createMemberObj : function (member) {
            return {
                first_name : member.first_name || '',
                middle_name : member.middle_name || '',
                last_name : member.last_name || '',
                state : member.state || '',
                seniority : member.seniority || '',
                party : member.party || '',
                votes_with_party_pct : member.votes_with_party_pct + "%" || '', 
            }
        },

        // ***********************************************************************************************************************

        
        percentageOfMembersLoyalty : function (members, preference, percentage) {

            members = members.map( (el) => {
                el.votesWithParty = Math.floor(el.total_votes * el.votes_with_party_pct / 100)
                return el
            }).sort(function(a, b){return b.votes_with_party_pct-a.votes_with_party_pct})

            const limit = Math.floor( (percentage * members.length) / 100 )
            if (preference == 'least') members = [...members].reverse()
            let arr = members.splice(0,limit)
            let i = 0;
            while (members[i].missed_votes_pct == arr[arr.length -1].missed_votes_pct) {
                arr.push(members[i])
                i += 1
            }
            
            return arr
        },

        percentageOfMembersEngagement : function (members, preference, percentage) {
            members = members.sort(function(a, b){return b.missed_votes_pct-a.missed_votes_pct})
            const limit = Math.floor( (percentage * members.length) / 100 )
            if (preference == 'most') members = [...members].reverse()
            let arr = members.splice(0,limit)
            let i = 0;
            while (members[i].missed_votes_pct == arr[arr.length -1].missed_votes_pct) {
                arr.push(members[i])
                i += 1
            }
            return arr
        },

        // ************************************************************************************************************

        fetchApiData : function (event) {
            this.toggleLoader('reveal')
            if (this.currentPage == 'statistics.html') {
                if (event) {
                    if (event.target.name == 'chamber') this.chamber = event.target.value 
                    if (event.target.name == 'statistic') this.statistic = event.target.value
                }
            } else {
                this.chamber = this.currentPage == 'senate.html' ? 'senate' : 'house'
            }
            this.getData(this.chamber)
                .then( members => {
                    if (this.currentPage == 'statistics.html') {
                        this.members = members
                        this.democrats = this.filterByParty(this.members, 'D')
                        this.republicans = this.filterByParty(this.members, 'R')
                        this.independents = this.filterByParty(this.members, 'I')
                        this.mostEngaged = this.percentageOfMembersEngagement(this.members, 'most', 10)
                        this.leastEngaged = this.percentageOfMembersEngagement(this.members, 'least', 10)
                        this.mostLoyal = this.percentageOfMembersLoyalty(this.members, 'most', 10)
                        this.leastLoyal = this.percentageOfMembersLoyalty(this.members, 'least', 10)
                    } else {
                        members = members.filter(el => this.selectedParties.indexOf(el.party) != -1)
                        if (this.selectedState != "all") { members = members.filter(el => el.state == this.selectedState) }
                        this.members = members.map(el => this.createMemberObj(el))
                    }
                }).then(()=>{
                    this.toggleLoader('hide')
                    const tableBody = document.getElementById('tablebody')//.children.length
                    if (tableBody) {
                        const tableBodyRows = tableBody.children.length 
                        tableBodyRows == 0 ? document.getElementById('zero-results-box').classList.remove('hide-me') : document.getElementById('zero-results-box').classList.add('hide-me')                    
                    }

                }).catch(err => console.log(err))
        },

    },

    created : function () {        
        this.updateCurrentPage()
        if (this.currentPage != 'index.html') this.fetchApiData()
        if (this.currentPage == 'senate.html' || this.currentPage == 'representatives.html') this.states = states
    }

    // check datos actuales in the instance before fetching the data 
    // remoev all the vanilla js 
})

