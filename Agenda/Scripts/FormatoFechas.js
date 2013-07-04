/*Fechas de inicio,fin y actual para manejo de Calendario y MiniCalendario*/
var today = new Date();
var initialDate = new Date();
var finalDate = new Date();
var day = new Date();
var actualMonth;

today.setFullYear(new Date().getFullYear(), new Date().getMonth(), 15);
var middleDate = new Date(today);

if (today.getDay() != 1)
    today.setFullYear(new Date().getFullYear(), new Date().getMonth(), (15 - (today.getDay() - (1))));

initialDate.setDate(today.getDate() - (14));
finalDate.setDate(today.getDate() + (27));
today = new Date();
actualMonth = today.getMonth();

var initialDateWeek = new Date();
initialDateWeek.setHours(00, 00, 00);
if (initialDateWeek.getDay() != 1)
    initialDateWeek.setFullYear(initialDateWeek.getFullYear(), initialDateWeek.getMonth(), (initialDateWeek.getDate() - (initialDateWeek.getDay() - (1))));

var finalDateWeek = new Date(initialDateWeek.getFullYear(), initialDateWeek.getMonth(), (initialDateWeek.getDate() + 6));
finalDateWeek.setHours(23, 59, 59);
/**************************************************************************/
function checkZeroes(i) 
{
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function startTime() 
{
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkZeroes(m);
    s = checkZeroes(s);
    $('#actualHourTitle').text(h + ":" + m + ":" + s);
    t = setTimeout(function () { startTime() }, 500);
}
function dayOfWeek(day) 
{
    switch (day) {
        case 0:
            return "Lunes";
            break;
        case 1:
            return "Martes";
            break;
        case 2:
            return "Mi" + '\u00e9' + "rcoles";
            break;
        case 3:
            return "Jueves";
            break;
        case 4:
            return "Viernes";
            break;
        case 5:
            return "S" + '\u00e1' + "bado";
            break;
        case 6:
            return "Domingo";
            break;
        default:
            return "Domingo";
            break;
    }
}
function monthOfYear(month) 
{
    switch (month) {
        case 0:
            return "Enero";
            break;
        case 1:
            return "Febrero";
            break;
        case 2:
            return "Marzo";
            break;
        case 3:
            return "Abril";
            break;
        case 4:
            return "Mayo";
            break;
        case 5:
            return "Junio";
            break;
        case 6:
            return "Julio";
            break;
        case 7:
            return "Agosto";
            break;
        case 8:
            return "Septiembre";
            break;
        case 9:
            return "Octubre";
            break;
        case 10:
            return "Noviembre";
            break;
        case 11:
            return "Diciembre";
            break;
    }
}
function MonthBack() 
{
    var finalMonthBack = new Date(initialDate);
    finalMonthBack.setFullYear(finalMonthBack.getFullYear(), finalMonthBack.getMonth(), finalMonthBack.getDate() - (1));
    var middleMonthBack = new Date();
    middleMonthBack.setFullYear(finalMonthBack.getFullYear(), finalMonthBack.getMonth(), 15);

    if (middleMonthBack.getDay() != 1)
        middleMonthBack.setFullYear(finalMonthBack.getFullYear(), finalMonthBack.getMonth(), (15 - (middleMonthBack.getDay() - (1))));
		
    var initialMonthBack = new Date(middleMonthBack);
    initialMonthBack.setDate(middleMonthBack.getDate() - (14));
    finalMonthBack.setDate(middleMonthBack.getDate() + (27));

    initialDate = new Date(initialMonthBack);
    finalDate = new Date(finalMonthBack);
	middleDate = new Date(middleMonthBack);
	actualMonth = middleMonthBack.getMonth();
	initialDateWeek = new Date(middleMonthBack);
	finalDateWeek = new Date(initialDateWeek.getFullYear(), initialDateWeek.getMonth(), (initialDateWeek.getDate() + 6));
	finalDateWeek.setHours(23, 59, 59);
}
function MonthForward() 
{
    var initialMonthForward = new Date(finalDate);
	initialMonthForward.setFullYear(initialMonthForward.getFullYear(), initialMonthForward.getMonth(), initialMonthForward.getDate() + (1));
	var middleMonthForward = new Date();
    middleMonthForward.setFullYear(initialMonthForward.getFullYear(), initialMonthForward.getMonth(), 15);

    if (middleMonthForward.getDay() != 1)
        middleMonthForward.setFullYear(initialMonthForward.getFullYear(), initialMonthForward.getMonth(), (15 - (middleMonthForward.getDay() - (1))));
	
	initialMonthForward.setDate(middleMonthForward.getDate() - (14));
	var finalMonthBack = new Date(middleMonthForward);
    finalMonthBack.setDate(middleMonthForward.getDate() + (27));
	
    initialDate = new Date(initialMonthForward);
    finalDate = new Date(finalMonthBack);
	middleDate = new Date(middleMonthForward);	
	actualMonth = middleMonthForward.getMonth();
	initialDateWeek = new Date(middleMonthBack);
	finalDateWeek = new Date(initialDateWeek.getFullYear(), initialDateWeek.getMonth(), (initialDateWeek.getDate() + 6));
	finalDateWeek.setHours(23, 59, 59);	
}
function WeekBack() 
{
    initialDateWeek.setFullYear(initialDateWeek.getFullYear(), initialDateWeek.getMonth(), initialDateWeek.getDate() - (7));
    finalDateWeek = new Date(initialDateWeek.getFullYear(), initialDateWeek.getMonth(), initialDateWeek.getDate() + (6));
}
function WeekForward() 
{
    initialDateWeek.setFullYear(initialDateWeek.getFullYear(), initialDateWeek.getMonth(), initialDateWeek.getDate() + (7));
    finalDateWeek = new Date(initialDateWeek.getFullYear(), initialDateWeek.getMonth(), initialDateWeek.getDate() + (6));
}
function WeekChange(newWeek) 
{
    initialDateWeek = new Date(setDateTimeObject(newWeek));
	finalDateWeek = new Date(initialDateWeek.getFullYear(), initialDateWeek.getMonth(), initialDateWeek.getDate() + (6));
}
function SetActualDay() 
{
    alert("Setear Dia Actual")
}
function setDateTimeObject(day) 
{
    var NewDay = new Date();
    var selectedDay = day.split('/');
    NewDay.setFullYear(selectedDay[2], selectedDay[1], selectedDay[0]);
    return NewDay;
}