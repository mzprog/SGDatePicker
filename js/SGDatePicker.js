class SGDatePicker{
    
    
    constructor() {
        let dt = new Date();
        // defualt date
        this.date = dt.getDate()
        this.month = dt.getMonth() + 1
        this.year = dt.getFullYear()

        this.data={
            monthsNames: {
                0: 'Jan',
                1: 'Feb',
                2: 'Mar',
                3: 'Apr',
                4: 'May',
                5: 'Jun',
                6: 'Jul',
                7: 'Aug',
                8: 'Sep',
                9: 'Oct',
                10: 'Nov',
                11: 'Dec'
            },
            daysNames: {
                0: 'Sun',
                1: 'Mon',
                2: 'Tue',
                3: 'Wed',
                4: 'Thu',
                5: 'Fri',
                6: 'Sat'
            },
            minYear: 1900,
            maxYear: 2100,
            minDateOn: false,
            minDate: {
                d: null,
                m: null,
                y: null
            },
            maxDateOn : false,
            maxDate: {
                d: null,
                m: null,
                y: null
            },

            divId: null
        }
    }
    setDate(d,m,y){
        this.date = d
        this.month = m
        this.year = y
    }

    setMinDate(d,m,y){
        this.data.minDateOn = true

        this.data.minDate.d = d
        this.data.minDate.m = m
        this.data.minDate.y = y
    }

    setMaxDate(d,m,y){
        this.data.maxDateOn = true

        this.data.maxDate.d = d
        this.data.maxDate.m = m
        this.data.maxDate.y = y
    }

    validDate(d,m,y){
        if(this.data.minDateOn){
            if(y < this.data.minDate.y){
                return false
            }
            if(y == this.data.minDate.y){
                if(m < this.data.minDate.m){
                    return false
                }
                else if(m == this.data.minDate.m && d < this.data.minDate.d){
                    return false
                }
            }
        }
        else if(y < this.data.minYear){
            return false
        }

        if(this.data.maxDateOn){
            if( y > this.data.maxDate.y){
                return false
            }
    
             if(y == this.data.maxDate.y){
                if(m > this.data.maxDate.m){
                    return false
                }
                else if(m == this.data.maxDate.m && d > this.data.maxDate.d){
                    return false
                }
            }
        }
        else if(y > this.data.maxYear){
            return false
        }

        return true
    }
    

    buildDatePicker(divId){  
        let main = document.createElement('div')
        main.classList.add('mtr-row')

        main.appendChild(this.buildDays())
        main.appendChild(this.buildMonths())
        main.appendChild(this.buildYears())

        //last append
        let div = document.getElementById(divId)
        div.classList.add("mtr-datepicker")
        div.appendChild(main)

        this.data.divId = divId

        this.scrollToDate()
    }

    buildDays(){
        let days = document.createElement("div")

        days.id = "datepicker-demo-input-dates";
        days.classList.add("mtr-input-slider")

        let dayUpF = this.dayListUpScroll
        let dayDownF = this.dayListDownScroll
        
        
        let upArrow = document.createElement("div")
        upArrow.classList.add("mtr-arrow")
        upArrow.classList.add("up")
        upArrow.appendChild(document.createElement("span"))
          
        let content = document.createElement("div")
        content.classList.add("mtr-content")

        let inp = document.createElement("input")
        inp.setAttribute('type',"hidden")
        inp.setAttribute('max-date',new Date(this.year, this.month, 0).getDate())
        inp.value = this.date
        inp.id = "dayVal"
        content.appendChild(inp)

        content.appendChild(this.buildDateList())
        this.DateParent = content

        let downArrow = document.createElement("div")
        downArrow.classList.add("mtr-arrow")
        downArrow.classList.add("down")
        downArrow.appendChild(document.createElement("span"))

        upArrow.addEventListener('click',function () {
            
            dayUpF(content,inp)
        })
        downArrow.addEventListener('click',function() { 

            dayDownF(content,inp)
        })
        days.appendChild(upArrow)
        days.appendChild(content)
        days.appendChild(downArrow)
        
        return days
    }

    buildDateList(){
        let list = document.createElement('div')
        list.classList.add("mtr-values")

        let monthLen = new Date(this.year, this.month, 0).getDate();
        let d = new Date(this.year, this.month - 1,1).getDay()

        //safety node
        list.appendChild(this.buildDateListItem(monthLen,new Date(this.year, this.month - 1,monthLen).getDay()))
        for (let i = 1; i <= monthLen; i++) {
            list.appendChild(this.buildDateListItem(i,d++))
            if(d>6)d=0
        }
        list.appendChild(this.buildDateListItem(1,new Date(this.year, this.month - 1,1).getDay()))
        this.DateList = list
        return list
    }

    buildDateListItem(i, d){
        let listItem = document.createElement("div")
        listItem.classList.add('mtr-default-value-holder')
        listItem.setAttribute("data-value",i)

        let num = document.createElement("div")
        num.classList.add('mtr-default-value')
        num.classList.add('has-name')
        num.setAttribute("data-value",i)
        num.innerHTML = i

        let name = document.createElement("div")
        name.classList.add('mtr-default-value-name')
        name.innerHTML = this.data.daysNames[d];

        listItem.appendChild(num)
        listItem.appendChild(name)

        return listItem
    }

    dayListUpScroll(cont,inp){
        let st = cont.scrollTop
        let h = cont.offsetHeight
        let val = parseInt(inp.value) - 1
        if(val == 0){
            val = inp.getAttribute("max-date")
            cont.scrollTop = (val+1) * h
            st = cont.scrollTop 
        }
        
        cont.classList.add("mtr-active")
        let pos = val * h
        let id = setInterval(frame, 1);
        function frame() {
            if (st <= pos) {
                cont.scrollTop = pos
                clearInterval(id);   
                setTimeout(function(){ cont.classList.remove("mtr-active") }, 500);
            } else {
                st-=3
                cont.scrollTop = st; 
            }
        }
        inp.value = val
    }

    dayListDownScroll(cont,inp){
        let st = cont.scrollTop
        let h = cont.offsetHeight
        let val = parseInt(inp.value) +1
        if(val > parseInt(inp.getAttribute("max-date"))){
            val = 1
            cont.scrollTop = 0
            st = 0
        }
        let pos = val * h
        cont.classList.add("mtr-active")
        
        let id = setInterval(frame, 1);
        function frame() {
            if (st >= pos) {
                cont.scrollTop = pos
                clearInterval(id);
                setTimeout(function(){ cont.classList.remove("mtr-active") }, 500);
            } else {
                st+=3
                cont.scrollTop = st; 
            }
        }
        inp.value = val
    }
    
    // months
    buildMonths(){
        let months = document.createElement("div")

        months.id = "datepicker-demo-input-months";
        months.classList.add("mtr-input-slider")

        let monthUpF = this.monthListUpScroll
        let monthDownF = this.monthListDownScroll
        let DateObj = this
        
        let upArrow = document.createElement("div")
        upArrow.classList.add("mtr-arrow")
        upArrow.classList.add("up")
        upArrow.appendChild(document.createElement("span"))
          
        let content = document.createElement("div")
        content.classList.add("mtr-content")

        let inp = document.createElement("input")
        inp.setAttribute('type',"hidden")
        inp.value = this.month
        inp.id = "monthVal"
        content.appendChild(inp)

        content.appendChild(this.buildMonthList())

        let downArrow = document.createElement("div")
        downArrow.classList.add("mtr-arrow")
        downArrow.classList.add("down")
        downArrow.appendChild(document.createElement("span"))

        upArrow.addEventListener('click',function () {
            monthUpF(content,inp,DateObj)
        })
        downArrow.addEventListener('click',function() {
            monthDownF(content,inp,DateObj)
        })
        months.appendChild(upArrow)
        months.appendChild(content)
        months.appendChild(downArrow)
        
        return months
    }

    
    buildMonthList(){
        let list = document.createElement('div')
        list.classList.add("mtr-values")
        list.appendChild(this.buildMonthListItem(11))
        for (let i = 0; i < 12; i++) {
            list.appendChild(this.buildMonthListItem(i))
        }
        list.appendChild(this.buildMonthListItem(0))
        return list
    }

    buildMonthListItem(i){
        let listItem = document.createElement("div")
        listItem.classList.add('mtr-default-value-holder')
        listItem.setAttribute("data-value",i)

        let num = document.createElement("div")
        num.classList.add('mtr-default-value')
        num.classList.add('has-name')
        num.setAttribute("data-value",i)
        num.innerHTML = i+1

        let name = document.createElement("div")
        name.classList.add('mtr-default-value-name')
        name.innerHTML = this.data.monthsNames[i];

        listItem.appendChild(num)
        listItem.appendChild(name)

        return listItem
    }

    
    monthListUpScroll(cont, inp, DateObj){
        let st = cont.scrollTop
        let h = cont.offsetHeight
        let val = parseInt(inp.value) - 1
        if(val < 1){
            val = 12
            cont.scrollTop = 13 * h
            st = cont.scrollTop
        }
        let pos = val * h
        cont.classList.add("mtr-active")
        DateObj.month = val

        //days update
        DateObj.updateDays()
        
        let id = setInterval(frame, 1);
        function frame() {
            if (st <= pos) {
                clearInterval(id);   
                setTimeout(function(){ cont.classList.remove("mtr-active") }, 500);
            } else {
                st -= 3
                cont.scrollTop = st; 
            }
        }
        inp.value = val
    }

    monthListDownScroll(cont,inp, DateObj){
        let st = cont.scrollTop
        let h = cont.offsetHeight
        let val = parseInt(inp.value) +1
        if(val > 12){
            val = 1
            cont.scrollTop = 0
            st = 0
        }
        let pos = val * h
        cont.classList.add("mtr-active")
        DateObj.month = val

        //days update
        DateObj.updateDays()
        
        let id = setInterval(frame, 1);
        function frame() {
            if (st >= pos) {
                clearInterval(id);
                setTimeout(function(){ cont.classList.remove("mtr-active") }, 500);
            } else {
                st += 3 
                cont.scrollTop = st; 
            }
        }
        inp.value = val 
    }

        
    // years
    buildYears(){
        let years = document.createElement("div")

        years.id = "datepicker-demo-input-years";
        years.classList.add("mtr-input-slider")

        let yearUpF = this.yearListUpScroll
        let yearDownF = this.yearListDownScroll
        let DateObj = this
        
        let upArrow = document.createElement("div")
        upArrow.classList.add("mtr-arrow")
        upArrow.classList.add("up")
        upArrow.appendChild(document.createElement("span"))
          
        let content = document.createElement("div")
        content.classList.add("mtr-content")

        let inp = document.createElement("input")
        inp.setAttribute('type',"hidden")
        inp.setAttribute('minyear',this.data.minYear)
        inp.setAttribute('maxyear',this.data.maxYear)
        inp.value = this.year
        inp.id = "yearVal"
        content.appendChild(inp)

        content.appendChild(this.buildYearList())

        let downArrow = document.createElement("div")
        downArrow.classList.add("mtr-arrow")
        downArrow.classList.add("down")
        downArrow.appendChild(document.createElement("span"))

        upArrow.addEventListener('click',function () {
            yearUpF(content,inp,DateObj)
        })
        downArrow.addEventListener('click',function() { 
            yearDownF(content,inp,DateObj)
        })
        years.appendChild(upArrow)
        years.appendChild(content)
        years.appendChild(downArrow)
        
        return years
    }

    
    buildYearList(){
        let list = document.createElement('div')
        list.classList.add("mtr-values")

        for (let i = this.data.minYear; i <= this.data.maxYear; i++) {
            list.appendChild(this.buildYearListItem(i))
        }
        return list
    }

    buildYearListItem(i){
        let listItem = document.createElement("div")
        listItem.classList.add('mtr-default-value-holder')
        listItem.setAttribute("data-value",i)

        let num = document.createElement("div")
        num.classList.add('mtr-default-value')
        num.classList.add('has-name')
        num.setAttribute("data-value",i)
        num.innerHTML = i

        listItem.appendChild(num)

        return listItem
    }
    
    yearListUpScroll(cont, inp, DateObj){
        let st = cont.scrollTop
        let h = cont.offsetHeight
        let minyear = parseInt(inp.getAttribute('minyear'))
        let val = parseInt(inp.value) - 1 - minyear
        let pos = val * h
        cont.classList.add("mtr-active")
        DateObj.year = parseInt(inp.value) - 1

        DateObj.updateDays()
        
        let id = setInterval(frame, 1);
        function frame() {
            if (st <= pos) {
                clearInterval(id);   
                setTimeout(function(){ cont.classList.remove("mtr-active") }, 500);
            } else {
                st-=3 
                cont.scrollTop = st; 
            }
        }
        inp.value = parseInt(inp.value)  - 1
    }

    yearListDownScroll(cont,inp, DateObj){
        let st = cont.scrollTop
        let h = cont.offsetHeight
        let minyear = parseInt(inp.getAttribute('minyear'))
        let val = parseInt(inp.value) - minyear +1
        let pos = val * h
        cont.classList.add("mtr-active")
        DateObj.year = val + 1 +minyear

        DateObj.updateDays()
        
        let id = setInterval(frame, 1);
        function frame() {
            if (st >= pos) {
                clearInterval(id);
                setTimeout(function(){ cont.classList.remove("mtr-active") }, 500);
            } else {
                st+=3
                cont.scrollTop = st; 
            }
        }
        inp.value = val +1 + minyear
    }

    scrollToDate(){
        let divId = this.data.divId

        let date = document.querySelector("#" + divId+ " #datepicker-demo-input-dates .mtr-content")
        let month = document.querySelector("#" + divId+ " #datepicker-demo-input-months .mtr-content")
        let year = document.querySelector("#" + divId+ " #datepicker-demo-input-years .mtr-content")

        let h,val
        h = date.offsetHeight
        val = document.querySelector("#"+divId+" #dayVal").value 
        date.scrollTop = h * val

        h = month.offsetHeight
        val = document.querySelector("#"+divId+" #monthVal").value
        month.scrollTop = h * val

        h = month.offsetHeight
        val = document.querySelector("#"+divId+" #yearVal").value - this.data.minYear
        year.scrollTop = h * val
    }

    updateDays(){

        this.DateParent.removeChild(this.DateList)
        this.DateParent.appendChild(this.buildDateList())

        let divId = this.data.divId
        let date = document.querySelector("#" + divId+ " #datepicker-demo-input-dates .mtr-content")
        let h,val

        h = date.offsetHeight
        val = document.querySelector("#"+divId+" #dayVal").value 
        date.scrollTop = h * val
    }
}