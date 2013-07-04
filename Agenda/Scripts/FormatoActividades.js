function consultedActivity(Acc) 
{
    //$('#' + checkZeroes(Acc.Inicio.getDate()) + "/" + checkZeroes(Acc.Inicio.getMonth() + (1)) + "/" + Acc.Inicio.getFullYear()).html(divActivityFormat(Acc));
	document.getElementById(checkZeroes(Acc.Inicio.getDate()) + "/" + checkZeroes(Acc.Inicio.getMonth() + (1)) + "/" + Acc.Inicio.getFullYear()).innerHTML += divActivityFormat(Acc);//Por alguna razon no funciona el JQuery
}
function consultedActivityDay(Acc) 
{
    //$('#' + checkZeroes(Acc.Inicio.getDate()) + "/" + checkZeroes(Acc.Inicio.getMonth() + (1)) + "/" + Acc.Inicio.getFullYear() + " " + checkZeroes(Acc.Inicio.getHours()) + ":" + checkZeroes(Acc.Inicio.getMinutes())).html(divActivityFormat(Acc));
    debugger;
	document.getElementById(checkZeroes(Acc.Inicio.getDate()) + "/" + checkZeroes(Acc.Inicio.getMonth() + (1)) + "/" + Acc.Inicio.getFullYear() + " " + checkZeroes(Acc.Inicio.getHours()) + ":" + checkZeroes(Acc.Inicio.getMinutes())).innerHTML += divActivityFormat(Acc, '', (100/Acc.ActivityCount)-(2));//Por alguna razon no funciona el JQuery
}
function consultedNextWeeks(Acc, divDate)
{
    //$('#' + checkZeroes(divDate.getDate()) + "/" + checkZeroes(divDate.getMonth() + (1)) + "/" + divDate.getFullYear()).html(divActivityFormat(Acc));
	document.getElementById(checkZeroes(divDate.getDate()) + "/" + checkZeroes(divDate.getMonth() + (1)) + "/" + divDate.getFullYear()).innerHTML += divActivityFormat(Acc, divDate);//Por alguna razon no funciona el JQuery
}
function divActivityFormat(Acc, divDate, width) {
    debugger;
    var Activity = '<div style="width:98%" class="activityDiv">';
    if (width !== undefined)
        Activity = '<div style="width:' + width + '%;float:left" class="activityDiv">';

    Activity += '<div id="Imagen" style="float:left; background-color:#f5deb3;">';
        switch (Acc.TipoActividad)
        {
            case "task":
                Activity += '<img alt="task" src="/_imgs/ico_16_4212.gif?ver=1561266035"/>';
                break;
            case "fax":
                Activity += '<img alt="fax" src="/_imgs/ico_16_4204.gif?ver=1561266035"/>';
                break;
            case "appointment":
                Activity += '<img alt="appointment" src="/_imgs/ico_16_4201.gif?ver=1561266035"/>';
                break;
            case "letter":
                Activity += '<img alt="letter" src="/_imgs/ico_16_4207.gif?ver=1561266035"/>';
                break;
            case "email":
                Activity += '<img alt="email" src="/_imgs/ico_16_4202.gif?ver=1561266035"/>';
                break;
            case "phonecall":
                Activity += '<img alt="phonecall" src="/_imgs/ico_16_4210.gif?ver=1561266035"/>';
                break;
            case "serviceappointment":
                Activity += '<img alt="serviceappointment" src="/_imgs/ico_16_4214.gif?ver=1561266035"/>';
                break;
            case "recurringappointment":
                Activity += '<img alt="recurringappointment" src="/_imgs/ico_16_4251.gif?ver=1561266035"/>';
                break;
        }
        Activity += '</div>' +
        '<div style="width:2px"></div>' +
        '<div id="Hora" style="float:left; background-color:#f5deb3; padding-left:1px;">' +
            checkZeroes(Acc.Inicio.getHours()) + ':' + checkZeroes(Acc.Inicio.getMinutes());
			if (divDate)
				Activity += " " + checkZeroes(Acc.Inicio.getDate()) + "/" + checkZeroes(Acc.Inicio.getMonth()) + "/" + Acc.Inicio.getFullYear();
			
		Activity += '</div>' +
        '<div style="width:2px"></div>' +
		'<a ';
        switch (Acc.TipoActividad)
        {
			case "task":
				Activity += 'href="../main.aspx?etc=4212&extraqs=%3f_gridType%3d4200%26etc%3d4212%26id%3d%257b' + Acc.Id + '%257d%26&pagetype=entityrecord" target="_blank">';
				break;
			case "fax":
				Activity += 'href="../main.aspx?etc=4204&extraqs=%3f_gridType%3d4204%26etc%3d4204%26id%3d%257b' + Acc.Id + '%257d%26&pagetype=entityrecord" target="_blank">';
				break;
			case "appointment":
				Activity += 'href="../main.aspx?etc=4201&extraqs=%3f_gridType%3d4201%26etc%3d4201%26id%3d%257b' + Acc.Id + '%257d%26&pagetype=entityrecord" target="_blank">';
				break;
			case "letter":
				Activity += 'href="../main.aspx?etc=4207&extraqs=%3f_gridType%3d4207%26etc%3d4207%26id%3d%257b' + Acc.Id + '%257d%26&pagetype=entityrecord" target="_blank">';
				break;
			case "email":
				Activity += 'href="../main.aspx?etc=4202&extraqs=%3f_gridType%3d4202%26etc%3d4202%26id%3d%257b' + Acc.Id + '%257d%26&pagetype=entityrecord" target="_blank">';
				break;
			case "phonecall":
				Activity += 'href="../main.aspx?etc=4210&extraqs=%3f_gridType%3d4200%26etc%3d4210%26id%3d%257b' + Acc.Id + '%257d%26&pagetype=entityrecord" target="_blank">';
				break;
			case "serviceappointment":
				Activity += 'href="../main.aspx?etc=4214&extraqs=%3f_gridType%3d4214%26etc%3d4214%26id%3d%257b' + Acc.Id + '%257d%26&pagetype=entityrecord" target="_blank">';
				break;
			case "recurringappointment":
				Activity += 'href="../main.aspx?etc=4251&extraqs=%3fetc%3d4251%26id%3d%257b' + Acc.Id + '%257d%26&pagetype=entityrecord" target="_blank">';
				break;
		}
		Activity += Acc.Asunto + '</a>' +
        '<div id="Id" style="visibility:hidden; height:5px;">' +
            Acc.Id +
        '</div>' +		
    '</div>';
	return Activity;
}