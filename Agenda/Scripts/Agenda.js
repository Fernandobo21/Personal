//Pasar a jQuery
document.oncontextmenu = new Function("return false");
var ReferenteParaDIV = "";
var context = GetGlobalContext();
userid = context.getUserId();
function OnLoad() {
    changeSelectedView($("#selectedView").text());
    $('#actualDayTittle').text(dayOfWeek(new Date().getDay() - 1) + " " + new Date().getDate() + " de " + monthOfYear(new Date().getMonth()) + " de " + new Date().getFullYear());
    startTime();
}
function popUpReferentePara(form)
{
	var consulta = 	"$select=AccountId" +
					"&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')" ;

    var ReferentePara =
        '<div id="popUpGenerico">'
			+'<div style="width:100%; height:7%; padding-left:2px;">'
				+'<div style="width:12%; height:100%; float:left;">'
					+'<label title="Entidad">Entidad: </label>'
				+'</div>';
				if (form == "Para")
				{
					ReferentePara +=
					'<div id="selectPara" style="width:36%; height:100%; float:left;">'
						+'<select id="EntitiesSelect" onchange="onChangeSelected();" style="vertical-align:middle;" title="Entidades">'
							+'<option value="Queue">Cola</option>'
							+'<option value="Lead">Cliente Potencial</option>'
							+'<option value="Contact">Contacto</option>'
							+'<option value="Account" selected="selected">Cliente</option>'
							//+'<option value="SystemUser">Usuario</option>' //Systemuser no se puede consultar por owner, de momento quito.
							//+'<option value="Equipment">Instalaciones/Equipamiento</option>' //Equipment no se puede consultar por owner.
						+'</select>'
					+'</div>'
				}
				else
				{
					ReferentePara +=
					'<div id="selectReferente" style="width:36%; height:100%; float:left;">'
						+'<select id="EntitiesSelect" onchange="onChangeSelected()" style="vertical-align:middle;" title="Entidades">'
							+'<option value="Campaign">Campaña</option>'
							+'<option value="Incident">Caso</option>'
							+'<option value="Lead">Cliente Potencial</option>'
							+'<option value="Contact">Contacto</option>'
							+'<option value="Contract">Contrato</option>'
							+'<option value="Account" selected="selected">Cliente</option>'
							+'<option value="Invoice">Factura</option>'
							+'<option value="Quote">Oferta</option>'
							+'<option value="Opportunity">Oportunidad</option>'
							+'<option value="SalesOrder">Pedido</option>'
						+'</select>'
					+'</div>'
				}
				ReferentePara +=
				'</div>'
			+'</div>'
			+'<div style="width:100%; height:2%; float:left;">'
			+'</div>'
			+'<div style="width:100%; height:5%; padding-left:2px;">'
				+'<div style="width:12%; height:100%; float:left;">'
					+'<label title="Entidad">Buscar: </label>'
				+'</div>'
				+'<div style="height:100%; float:left;">'
					+'<input id="txtSearch" style="vertical-align:middle;" type="text" value="Buscar registros" title="Use el caracter comodin asterisco (*) para realizar busquedas de texto parcial" onblur="eraseText(this.id)" />'
				+'</div>'
				+'<div style="width:8%; height:100%; float:left;">'
					+'<button onclick="findRegistry()" title="Iniciar Busqueda" class="buscarButton" style="width:100%; height:86%;"></button>'
				+'</div>'
			+'</div>'
			+'<div style="width:100%; height:2%;">'
			+'</div>'
			+'<div id="gridResults" style="width:100%; height:64%;">'
			+'</div>'
			+'<div style="width:100%; height:2%;">'
		+'</div>'
	$("#ReferentePara").html(ReferentePara);
	if (form == "Para")
		$("#gridResults").html(resultsPara());
	else 
		$("#gridResults").html(resultsReferente());
					
    SDK.REST.retrieveMultipleRecords(
		$("#EntitiesSelect").children("option[selected=selected]").val(),
		consulta,
		function (resultado) 
		{
            if ((resultado.length/10) != 1)
                $("#lastPageId").text(resultado[resultado.length - parseInt(String(resultado.length/10).split('.')[1])].AccountId);
            else
                $("#lastPageId").text(resultado[resultado.length - 10].AccountId);

			if (resultado.length == 0)
				$("#labelTotalRecords").text(resultado.length);
			else
			{
				$("#imgBack").attr('src', '/WebResources/new_PNG_AtrasBlock');
				$("#imgInit").attr('src', '/WebResources/new_PNG_PrimerPaginaBlock');
				if (resultado.length <= 20)
				{
					$("#imgEnd").attr('src', '/WebResources/new_PNG_UltimaPaginaBlock');
					if (resultado.length <= 10)
                    {
						$("#imgForward").attr('src', '/WebResources/new_PNG_AdelanteBlock');
                        $("#imgForward").attr('onclick', '');
                    }
				}
				$("#labelTotalRecords").text(resultado.length);
			}
		},
		printMsg,
		function Complete() 
		{
			var consulta = 	"$select=Name,Description,AccountId" +
					"&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')" +
					"&$top=10" +
					"&$orderby=AccountId%20asc";
					
			SDK.REST.retrieveMultipleRecords(
			$("#EntitiesSelect").children("option[selected=selected]").val(),
			consulta,
			function (resultado) {
				$("#labelRecords").text(resultado.length);
				if (resultado.length == 0)
					emptyDiv();
				else
				{
					var ires = 0;
					for (var i = 1; i < (resultado.length + (1)); i++)
					{
						$("#lblTitleAtributte1").text("Nombre");
						$("#lblTitleAtributte2").text("Identificador");
						$("#lblAtributtePrincipal" + i).text(resultado[ires].Name);
						$("#lblAtributteSecundary" + i).text(resultado[ires].Description);
						$("#selectedId" + i).text(resultado[ires].AccountId);
						ires++;
					}
				}
			},
			printMsg,
			function Complete(){
			});
		});
}
function popUpMessage()
{
    var Message =
        '<div id="contenido">'
            + '<table style="width:100%; height:100%;">'
                + '<tr>'
                    + '<td style="text-align:center;">'
                        + '<label id="lblTipoActividad" title="Tipo de Actividad" style="text-align:center;">Tipo Actividad</label>'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td>'
                        + '<table style="width:100%; border:1px solid #2f4f4f;">'
                            + '<tr>'
                                + '<td id="imgNewTask" onclick="selectedActivity(this)" class="selectActivitie" style="text-align:center;">'
                                    + '<img alt="Tarea Nueva" src="/_imgs/ico_16_4212.gif?ver=1561266035"/>'
                                + '</td>'
                                + '<td id="imgNewFax" onclick="selectedActivity(this)" class="selectActivitie" style="text-align:center;">'
                                    + '<img alt="Fax Nuevo" src="/_imgs/ico_16_4204.gif?ver=1561266035" />'
                                + '</td>'
                                + '<td id="imgNewAppointment" onclick="selectedActivity(this)" class="selectActivitie" style="text-align:center;">'
                                    + '<img alt="Cita Nueva" src="/_imgs/ico_16_4201.gif?ver=1561266035" />'
                                + '</td>'
                                + '<td id="imgNewLetter" onclick="selectedActivity(this)" class="selectActivitie" style="text-align:center;">'
                                    + '<img alt="Carta Nueva" src="/_imgs/ico_16_4207.gif?ver=1561266035" />'
                                + '</td>'
                                + '<td id="imgNewEmail" onclick="selectedActivity(this)" class="selectActivitie" style="text-align:center;">'
                                    + '<img alt="Correo Electronico Nuevo" src="/_imgs/ico_16_4202.gif?ver=1561266035" />'
                                + '</td>'
                                + '<td id="imgNewPhoneCall" onclick="selectedActivity(this)" class="selectActivitie" style="text-align:center;">'
                                    + '<img alt="Llamada de Telefono Nuevo" src="/_imgs/ico_16_4210.gif?ver=1561266035" />'
                                + '</td>'
                                + '<td id="imgNewServiceAppointment" onclick="selectedActivity(this)" class="selectActivitie" style="text-align:center;">'
                                    + '<img alt="Actividad de Servicio Nueva" src="/_imgs/ico_16_4214.gif?ver=1561266035" />'
                                + '</td>'
                                + '<td id="imgNewRecurringAppointment" onclick="selectedActivity(this)" class="selectActivitie" style="text-align:center;">'
                                    + '<img alt="Actividad de Servicio Nueva" src="/_imgs/ico_16_4251.gif?ver=1561266035" />'
                                + '</td>'
                            + '</tr>'
                        + '</table>'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td style="text-align:center;">'
                        + '<label id="lblAsunto" title="Asunto de la Actividad" style="text-align:center;">Asunto</label>'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td style="border:1px solid #2f4f4f;">'
                        + '<input type="text" id="txtAsunto" onkeyup="checkText();" style="width:98%" />'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td style="text-align:center;">'
                        + '<label title="Descripcion de la Actividad" style="text-align:center;">Descripcion</label>'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td style="border:1px solid #2f4f4f; width:100%;">'
                        + '<input type="text" style="width:98%" />'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td id="tdInicioTitulo" style="text-align:center;">'
                        + '<label id title="Inicio de la Actividad" style="text-align:center;">Inicio</label>'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td id="tdInicioDatos" style="border:1px solid #2f4f4f;">'
                        + '<table style="width:100%">'
                            + '<tr>'
                                + '<td>'
                                    + '<label title="Dia Inicio">Dia: </label>'
                                    + '<input type="text" style="width:40%" title="Calendario" id="datePickerInit"/>'
                                + '</td>'
                                + '<td>'
                                    + '<label title="Dia Inicio">Hora: </label>'
                                    + '<select id="selectInicio" size="1">'
                                        + optionHoras()
                                    + '</select><br />'
                                + '</td>'
                            + '</tr>'
                        + '</table>'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td style="text-align:center;">'
                        + '<label title="Fin de la Actividad" style="text-align:center;">Fin</label>'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td style="border:1px solid #2f4f4f;">'
                        + '<table style="width:100%">'
                            + '<tr>'
                                + '<td>'
                                    + '<label title="Dia Fin">Dia: </label>'
                                    + '<input type="text" style="width:40%" title="Calendario" id="datePickerEnd"/>'
                                + '</td>'
                                + '<td>'
                                    + '<label title="Dia Fin">Hora: </label>'
                                    + '<select id="selectFin" size="1">'
                                        + optionHoras()
                                    + '</select><br />'
                                + '</td>'
                            + '</tr>'
                        + '</table>'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td style="text-align:center;">'
                        + '<label title="Para">Para</label>'
                    + '</td>'
                + '</tr>'
                + '<tr style="width:100%; height:100%;">'
                    + '<td style="border:1px solid #2f4f4f; width:100%; height:100%;">'
                        + '<table style="width:100%; height:100%;">'
                            + '<tr>'
                                + '<td style="width:95%; height:100%;">'
									+ '<div id="txtPara" style="width:98%; height:17px; float:left; overflow:auto; border:#c6c6c6 1px solid; display:block;" title="Para"/></div>'
                                + '</td>'
                                + '<td style="width:5%; height:100%;">'
                                    + '<button id="Para" type="button" style="height:23px; width:100%; float:left; display:block;" title="" class="buscarButtonDisable" disabled="disabled" onclick="dialogReferentePara(this.id);"></button>'
                                + '</td>'
                            + '</tr>'
                        + '</table>'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td style="text-align:center;">'
                        + '<label title="Referente A">Referente A</label>'
                    + '</td>'
                + '</tr>'
                + '<tr style="width:100%; height:100%;">'
                    + '<td style="border:1px solid #2f4f4f; width:100%; height:100%;">'
                        + '<table style="width:100%; height:100%;">'
                            + '<tr>'
                                + '<td style="width:95%; height:100%;">'
									+ '<div id="txtReferente" style="width:98%; height:17px; overflow:auto; border:#c6c6c6 1px solid; display:block;" title="Referente A"/></div>'
                                + '</td>'
                                + '<td style="width:5%; height:100%;">'
                                    + '<button id="Referente" type="button" style="height:23px; width:100%; float:left;" title="" class="buscarButton" onclick="dialogReferentePara(this.id);"></button>'
                                + '</td>'
                            + '</tr>'
                        + '</table>'
                    + '</td>'
                + '</tr>'
                + '<tr>'
                    + '<td style="text-align:left;width:100%; height:100%;">'
                        + '<a id="lnkCrmForm" style="font-size:smaller; visibility:hidden;">Formulario Completo</a>'
                    + '</td>'
                + '</tr>'
            + '</table>'
        + '</div>'
    $("#dialogForm").html(Message);
}
function dialogReferentePara(form)
{
	popUpReferentePara(form);
	/*Referente o Para*/
	$("#ReferentePara").dialog({
		draggable: false,
        height: 485,
        width: 540,
        hide: "implode",
        show: "implode",
        title: form,
        closeOnEscape: true,		
        modal: "true",		
		modalcolor: "#0000ff",
        resizable: false,
        buttons: {
            "Seleccionar": function () 
			{
				var img = "";
				var a = "";
				for (var i = 0; i < 11; i++)
				{
					if (($("img", $("#trCheck" + i)).css('visibility') == 'visible')||($("#Check" + i).is(':checked')))
					{
						img = '<img id="' + $("#selectedId" + i).text() + '" style="float:left;" alt="' + $("#EntitiesSelect").children("option[selected=selected]").val() + '" ';
						var registryURL =  "../main.aspx?etc=";
						switch($("#EntitiesSelect").children("option[selected=selected]").val())
						{
							case "Account":
								img += 'src="/_imgs/ico_16_1.gif?ver=-1964545169"/>';
								registryURL += "1&extraqs=%3f_gridType%3d1%26etc%3d1%26id%3d%257b" + $("#selectedId" + i).text() + "%257d%26&pagetype=entityrecord";
								break;
                            case "Contact":
                                img += 'src="/_imgs/ico_16_2.gif?ver=-1964545169"/>';
                                registryURL += "2&extraqs=%3f_gridType%3d2%26etc%3d2%26id%3d%257b" + $("#selectedId" + i).text() + "%257d%26&pagetype=entityrecord";
                                break;
                            case "Opportunity":
                                img += 'src="/_imgs/ico_16_3.gif?ver=-1964545169"/>';
                                registryURL += "3&extraqs=%3f_gridType%3d3%26etc%3d3%26id%3d%257b" + $("#selectedId" + i).text() + "%257d%26&pagetype=entityrecord";
                                break;                                                                
							case "Lead":
								img += 'src="/_imgs/ico_16_4.gif?ver=-1964545169"/>';
								registryURL += "4&extraqs=%3f_gridType%3d4%26etc%3d4%26id%3d%257b" + $("#selectedId" + i).text() + "%257d%26&pagetype=entityrecord";
								break;
							case "Incident":
								img += 'src="/_imgs/ico_16_112.gif?ver=-1964545169"/>';
								//registryURL += "1&extraqs=%3f_gridType%3d1%26etc%3d1%26id%3d%257b" + $("#selectedId" + i).text() + "%257d%26&pagetype=entityrecord";
								break;
							case "Contract":
								img += 'src="/_imgs/ico_16_1010.gif?ver=-1964545169"/>';
								registryURL += "1010&extraqs=%3f_gridType%3d1010%26etc%3d1010%26id%3d%257b" + $("#selectedId" + i).text() + "%257d%26&pagetype=entityrecord";
								break;
							case "Campaign":
								img += 'src="/_imgs/ico_16_4400.gif?ver=-1964545169"/>';
								registryURL += "4400&extraqs=%3f_gridType%3d4400%26etc%3d4400%26id%3d%257b" + $("#selectedId" + i).text() + "%257d%26&pagetype=entityrecord";
								break;
							case "Invoice":
								img += 'src="/_imgs/ico_16_1090.gif?ver=-1964545169"/>';
								registryURL += "1090&extraqs=%3f_gridType%3d1090%26etc%3d1090%26id%3d%257b" + $("#selectedId" + i).text() + "%257d%26&pagetype=entityrecord";
								break;
							case "Quote":
								img += 'src="/_imgs/ico_16_1084.gif?ver=-1964545169"/>';
								registryURL += "1084&extraqs=%3f_gridType%3d1084%26etc%3d1084%26id%3d%257b" + $("#selectedId" + i).text() + "%257d%26&pagetype=entityrecord";
								break;
							case "SalesOrder":
								img += 'src="/_imgs/ico_16_1088.gif?ver=-1964545169"/>';
								registryURL += "1088&extraqs=%3f_gridType%3d1088%26etc%3d1088%26id%3d%257b" + $("#selectedId" + i).text() + "%257d%26&pagetype=entityrecord";
								break;						
						}
						a = '<a style="font-size:smaller; float:left;" href="' + registryURL + '" target="_blank">' + $("#lblAtributtePrincipal" + i).text() + '</a>';
						if ($("div[id=gridReferente]").attr('id') == "gridReferente")
							ReferenteParaDIV = '<div id="campoReferente" disabled="disabled" style="width:100%; display:block; float:left;" title="Referente A">' + img  + a + '</div>';
						else
							ReferenteParaDIV += img  + a + '<div id="campoPara" style="width:2px;"></div>';
					}
				}
				if ($("div[id=gridReferente]").attr('id') == "gridReferente")
					$("#txtReferente").html(ReferenteParaDIV);
				else
					$("#txtPara").html(ReferenteParaDIV);
				$(this).hide();
                $(this).dialog("close");
            },
            "Volver": function () 
			{
                $(this).hide();
                $(this).dialog("close");
            }
        }		
    });	
    $("#ReferentePara").slideDown("slow");
    if ($("#popUpGenerico").is(":hidden"))
        $("#popUpGenerico").slideDown("slow");
}
function addActivity(date) {
    var completeDate = date.split(' ');
    $("#datePickerEnd").val(completeDate[0]);
    $("#datePickerInit").val(completeDate[0]);
    if (completeDate.length >1)
    {
        $("#selectFin").val(completeDate[1]);
        $("#selectInicio").val(completeDate[1]);
    }
	/*Nueva Actividad*/
    $("#dialogForm").dialog({
        draggable: false,
        height: 460,
        width: 540,
        hide: "implode",
        show: "implode",
        title: "Nueva Actividad",
        closeOnEscape: true,
        modal: "true",
        modalcolor: "#000000",
        resizable: false,
        buttons: {
            "Crear Actividad": function () 
			{
                if (($('#txtAsunto').val() != '')&&($(".selectedActivitie").length != 0))
                {
                	debugger;
                	var endDate = new Date(
						$("#datePickerEnd").val().split('/')[2], 
						$("#datePickerEnd").val().split('/')[1] - (1), 
						$("#datePickerEnd").val().split('/')[0],
						$("#selectFin").children("option[selected=selected]").val().split(':')[0],
						$("#selectFin").children("option[selected=selected]").val().split(':')[1], 0, 0);

    				if ($("#datePickerInit").val() != "")
    				{
    					var initDate = new Date(
							$("#datePickerInit").val().split('/')[2],
							$("#datePickerInit").val().split('/')[1] - (1), 
							$("#datePickerInit").val().split('/')[0],
							$("#selectInicio").children("option[selected=selected]").val().split(':')[0],
							$("#selectInicio").children("option[selected=selected]").val().split(':')[1], 0, 0);

    					if (initDate < endDate)
    						{printMsg("Fecha Inicio no puede ser menor a fecha fin");}

					}
					createActivity();
					$(this).hide();
                    $(this).dialog("close");
					popUpMessage();
					changeSelectedView($("#selectedView").text());
                }
                else
                {
                    if ($('#txtAsunto').val() == '')
                        $('#lblAsunto').text("Asunto *").css("color", "red");

                    if ($(".selectedActivitie").length == 0)
                        $('#lblTipoActividad').text($('#lblTipoActividad').text() +" *").css("color", "red");
                }
                    
            },
            "Salir": function () 
			{
                $(this).hide();
                $(this).dialog("close");
            }
        }
    });
    $("#dialogForm").slideDown("slow");
    if ($("#contenido").is(":hidden"))
        $("#contenido").slideDown("slow");
}
function SelectedFilter(elementId) {
    if (($("#" + elementId).css('backgroundColor') == "rgb(212,212,212)")||($("#" + elementId).css('backgroundColor')=="#d4d4d4"))
    {
        $("#" + elementId).css('backgroundColor', 'transparent');
        checkVisibility("hidden", elementId);
		$("img[alt=" + elementId.toLowerCase().slice(8) + "]").parent().parent().hide();
    }
    else
    {
        $("#" + elementId).css('backgroundColor', "rgb(212,212,212)");
        checkVisibility("visible", elementId);
		$("img[alt=" + elementId.toLowerCase().slice(8) + "]").parent().parent().show();
    }
}
$(function () {
    window.status = "Agenda";
    popUpMessage();
    editMiniCalendar();
    $("#contenido").hide();
    $("#dialogForm").hide();
    $("#errorDialog").hide();
	$("#popUpGenerico").hide();
	$("#ReferentePara").hide();
    //-------------Fechas-----------------//
    $("#datePickerInit").datepicker({
        showOn: "button",
        buttonImage: "/WebResources/new_GIF_CalendarioIcono",
        buttonImageOnly: true,
        showAnim: "blind",
        dateFormat: 'dd/mm/yy'
        //showOn: "both"
    });
    $("#datePickerInit").datepicker().val(checkZeroes(new Date().getDate()) + "/" + checkZeroes((new Date().getMonth() + (1))) + "/" + new Date().getFullYear());
    $("#datePickerEnd").datepicker({
        showOn: "button",
        buttonImage: "/WebResources/new_GIF_CalendarioIcono",
        buttonImageOnly: true,
        showAnim: "blind",
        dateFormat: 'dd/mm/yy'
        //showOn: "both"
    });
    //------------------------------------//
    //-------------Hide-------------------//
    $('#MiniCalendar').hide();
    $('#toggableTask').hide();
    $('#toggableFax').hide();
    $('#toggablePhoneCall').hide();
    $('#toggableEmail').hide();
    $('#toggableServiceAppointment').hide();
    $('#toggableLetter').hide();
    $('#toggableAppointment').hide();
    $('#toggableRecurringAppointment').hide();
    $('#togabbleNewTasks').hide();
	$("#lateralMenu").hide();
    //------------------------------------//
    $("#radio").buttonset();
});
function optionHoras() {
    var todayOption = new Date();
    var option;
    for (var indice = 0; indice < 24; indice++) {
        if (todayOption.getHours() == indice) {
            if (todayOption.getMinutes() < 30) {
                option += '<option selected="selected">' + checkZeroes(indice) + ':00</option>';
                option += '<option>' + checkZeroes(indice) + ':30</option>';
            }
            else {
                option += '<option>' + checkZeroes(indice) + ':00</option>';
                option += '<option selected>' + checkZeroes(indice) + ':30</option>';
            }
        }
        else {
            option += '<option>' + checkZeroes(indice) + ':00</option>';
            option += '<option>' + checkZeroes(indice) + ':30</option>';
        }
    }
    return option;
}
function editMiniCalendar() {
    var Calendar = $(".ui-datepicker-calendar");
    Calendar.addClass(".dialog");
}
function calendarMonth() {
    var initialMonthDate = new Date(initialDate);
    var finalMonthDate = new Date(finalDate);

	var consulta = 	"$select=ActivityTypeCode,Subject,ScheduledStart,ActivityId" +
					"&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')" +
					"%20and%20ScheduledEnd%20ge%20datetime'" + initialMonthDate.getFullYear() + '-' + checkZeroes(initialMonthDate.getMonth() + (1)) + '-' + checkZeroes(initialMonthDate.getDate()) + "'" +
					"%20and%20ScheduledEnd%20le%20datetime'" + finalMonthDate.getFullYear() + '-' + checkZeroes(finalMonthDate.getMonth() + (1)) + '-' + checkZeroes(finalMonthDate.getDate()) + "'" +
					"%20and%20StateCode/Value%20eq%20" + 0 + "" +
					"&$orderby=ScheduledStart%20asc";

    SDK.REST.retrieveMultipleRecords(
		"ActivityPointer",
		consulta,
		function (resultado) {
			if (resultado.length == 0)
				$("#tituloCalendar").text("No tiene actividades para este mes");
			else
			{
				var actualActivityDay = resultado[0].ScheduledStart;
				var activityCounter = 0;
				for (var i = 0; i < resultado.length; i++)
				{
					if (actualActivityDay.toDateString() == resultado[i].ScheduledStart.toDateString())
					{
						var act = {};
						act.TipoActividad = resultado[i].ActivityTypeCode;
						act.Asunto = resultado[i].Subject;
						act.Inicio = resultado[i].ScheduledStart;
						act.Id = resultado[i].ActivityId;
						consultedActivity(act);
					}
					else
					{
						activityCounter = 0;
						actualActivityDay = resultado[i].ScheduledStart;
						var act = {};
						act.TipoActividad = resultado[i].ActivityTypeCode;
						act.Asunto = resultado[i].Subject;
						act.Inicio = resultado[i].ScheduledStart;
						act.Id = resultado[i].ActivityId;
						consultedActivity(act);						
					}
					activityCounter++;
					$("#lblActivityCount" + checkZeroes(resultado[i].ScheduledStart.getDate()) + checkZeroes(resultado[i].ScheduledStart.getMonth() + (1))).text("Actividades: " + activityCounter);
					$("#tituloCalendar").text("Tiene " + resultado.length + " actividades para este mes");
				}
			}
		},
		printMsg,
		function Complete() {
			makeDraggable();
		}
	);
    var calMonth =
        '<table style="width:100%; height:100%; border:solid 1px #A9A9A9; border-collapse:collapse; background-color:#FFFFFF;">'
            + '<tr>';
    for (var row = 0; row < 7; row++) {
        calMonth += '<td style="border:solid 1px #A9A9A9; text-align:center; width:14%;">'
                            + '<label style="text-align:center;">' + dayOfWeek(row) + '</label>'
                          + '</td>';
    }
    calMonth += '</tr>';
    for (row = 0; row < 6; row++) {
        calMonth += '<tr>';
        for (var column = 0; column < 7; column++) {
            calMonth += '<td style="border:solid 1px #A5ACB5; text-align:left;">'
                        + '<table style="width:100%; height:100%;">'
                            + '<tr>'
                                + '<td style="text-align:left; height:10%; border:solid 1px #000000; background-color: #ECF4FF;">'
									+ '<table>'
										+ '<tr>'
											+ '<td>'
												+ '<a style="text-decoration:none; color:black;" href=javascript:seeDay("' + checkZeroes(initialMonthDate.getDate()) + '/' + checkZeroes(initialMonthDate.getMonth() + (1)) + '/' + initialMonthDate.getFullYear() + '");>'
													+ checkZeroes(initialMonthDate.getDate())
												+ '</a>'
											+ '</td>'
											+ '<td>'
												+ '<label id="lblActivityCount' + checkZeroes(initialMonthDate.getDate()) + checkZeroes(initialMonthDate.getMonth() + (1)) + '"></label>'
											+ '</td>'
										+ '</tr>'
									+ '</table>'
                                + '</td>'
                            + '</tr>'
                            + '<tr>';
							if (actualMonth != initialMonthDate.getMonth())
                                calMonth += '<td style="height:90%; border:solid 1px #000000; background-color: #C5C5C7;">';
							else
                            {
                                if (new Date().toDateString() == initialMonthDate.toDateString())
                                    calMonth += '<td style="height:90%; border:solid 1px #000000; background-color: #add8e6;">';
                                else
                                    calMonth += '<td style="height:90%; border:solid 1px #000000;">';
                            }
							calMonth += '<div id="' + checkZeroes(initialMonthDate.getDate()) + '/' + checkZeroes(initialMonthDate.getMonth() + (1)) + '/' + initialMonthDate.getFullYear() + '" onclick="addActivity(this.id);" class="droppable" style="height:63px; overflow:hidden; border-width:medium; border-color:#DBDEE1;">'
                                    + '</div>'
                                + '</td>'
                            + '</tr>'
                        + '</table>'
                    + '</td>';
            if (initialMonthDate != finalMonthDate) {
                initialMonthDate.setDate(initialMonthDate.getDate() + 1);
                if (initialMonthDate.getDate() == 15)
                    $("#titleSelectedCalendar").text($("#titleSelectedCalendar").text() + monthOfYear(initialMonthDate.getMonth()) + " de " + initialMonthDate.getFullYear());
            }
        }
        calMonth += '</tr>';
    }
    calMonth += '</table>';
    $("#tblCalendarioCustom").html(calMonth);
    setTimeout('delayCicle()',1);
}
function calendarDay(openDay) {
	var consulta = 	"$select=ActivityTypeCode,Subject,ScheduledStart,ActivityId" +
					"&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')" +
					"%20and%20ScheduledEnd%20eq%20datetime'" + openDay.getFullYear() + '-' + checkZeroes(openDay.getMonth() + (1)) + '-' + checkZeroes(openDay.getDate()) + "'" +
					//"%20or%20ScheduledStart%20eq%20datetime'" + openDay.getFullYear() + '-' + checkZeroes(openDay.getMonth() + (1)) + '-' + checkZeroes(openDay.getDate()) + "'" +
					"%20and%20StateCode/Value%20eq%20" + 0 + "" +
					"&$orderby=ScheduledEnd%20asc";

    SDK.REST.retrieveMultipleRecords(
		"ActivityPointer",
		consulta,
		function (resultado) {
			if (resultado.length == 0)
				$("#tituloCalendar").text("No tiene actividades para el dia");
			else
			{
				$("#tituloCalendar").text("Tiene " + resultado.length + " actividades para el dia");
                debugger;
				for (var i = 0; i < resultado.length; i++)
				{
					var act = {};
					act.TipoActividad = resultado[i].ActivityTypeCode;
					act.Asunto = resultado[i].Subject;
					act.Inicio = resultado[i].ScheduledStart;
                    act.ActivityCount = 0;
                    for (var c = 0; c < resultado.length; c++)
                    {
                        if (resultado[c].ScheduledStart == resultado[i].ScheduledStart)
                            act.ActivityCount++;
                        //Ver
                    }
					act.Id = resultado[i].ActivityId;
					consultedActivityDay(act);
				}
			}
		},
		printMsg,
		function Complete() {
			makeDraggable();
		}
	);	
    var calDay =
        '<table style="width:100%; height:100%; border:solid 1px #A9A9A9; border-collapse:collapse; background-color:#FFFFFF;">';
    for (var row = 0; row < 24; row++) {
        if ((row > 7) && (row < 21))
            calDay += '<tr>';
        else
            calDay += '<tr style="background-color:#E6E6E6;">';

        calDay += '<td style="border:solid 1px #A5ACB5; text-align:center; width:2%;">'
                            + '<label style="font-size:large; text-align:center;">' + row + '</label>'
                          + '</td>'
                          + '<td style="text-align:center;">'
                            + '<table style="width:100%; border-collapse:collapse;">'
                                + '<tr>';
                            if ((openDay.getDate() == new Date().getDate()) && (new Date().getMinutes() < 30) && (new Date().getHours() == checkZeroes(row)))
                                calDay += '<td style="border:solid 1px #FF0000; text-align:center; width:2%;">';
                            else
                                calDay += '<td style="border:solid 1px #A5ACB5; text-align:center; width:2%;">';
                             calDay += '<label style="text-align:center;">00</label>'
                                    + '</td>'
                                    + '<td style="border:solid 1px #A5ACB5; text-align:center; width:95%;">'
                                        + '<div id="'+ checkZeroes(openDay.getDate()) + '/' + checkZeroes(openDay.getMonth() + (1)) + '/' + openDay.getFullYear() + ' ' + checkZeroes(row) + ':00" onclick="addActivity(this.id)" class="droppable" style="height:10px;overflow:hidden; border-width:medium; border-color:#DBDEE1;">'
                                        + '</div>'
                                    + '</td>'
                                + '</tr>'
                                + '<tr>';
                             if ((openDay.getDate() == new Date().getDate()) && (new Date().getMinutes() > 30) && (new Date().getHours() == checkZeroes(row)))
                                 calDay += '<td style="border:solid 1px #FF0000; text-align:center; width:2%;">';
                             else
                                 calDay += '<td style="border:solid 1px #A5ACB5; text-align:center; width:2%;">';
                                    calDay += '<label style="text-align:center;">30</label>'
                                    + '</td>'
                                    + '<td style="border:solid 1px #A5ACB5; text-align:center; width:95%;">'
                                        + '<div id="'+ checkZeroes(openDay.getDate()) + '/' + checkZeroes(openDay.getMonth() + (1)) + '/' + openDay.getFullYear() + ' ' + checkZeroes(row) + ':30" onclick="addActivity(this.id);" class="droppable" style="height:10px;overflow:hidden; border-width:medium; border-color:#DBDEE1;">'
                                        + '</div>'
                                    + '</td>'
                                + '</tr>'
                            + '</table>'
                          + '</td>'
                        +'</tr>'
    }
    calDay += '</table>';
    $("#titleSelectedCalendar").text($("#titleSelectedCalendar").text() + dayOfWeek(openDay.getDay() - 1) + " " + openDay.getDate() + " de " + monthOfYear(openDay.getMonth()));
    $("#tblCalendarioCustom").html(calDay);
    setTimeout('delayCicle()',1);
}
function addDroppableFunctions() {
    //--------------Lanzables--------------//
    $(".droppable").droppable({
		accept: ".activityDiv",
        drop: function (event, ui) {
			updateActivity(ui, this.id);
        },
        out: function (event, ui) {
			//Aca que vuelva a hacer aceptables los divs.
        }
    });
    //------------------------------------//
}
function changeSelectedView(Selected, selectedDay)
{
    $("#selectedView").text(Selected);
	$("#miniCalendarBack").attr("onclick", $("#btnAtras").attr("onclick"));
	$("#miniCalendarForward").attr("onclick", $("#btnAdelante").attr("onclick"));
	$("#" + Selected).css('backgroundColor', '#D4D4D4');
    $("#btnAtras").css("visibility", "visible");
    $("#btnAdelante").css("visibility", "visible");
    checkVisibility("visible", Selected);
    switch (Selected) {
        case "divMonthly":
            $("#divWeekly").css('backgroundColor', '');
            $("#divDaily").css('backgroundColor', '');
            $("#divWorking").css('backgroundColor' , '');
            checkVisibility("hidden", "divWeekly");
            checkVisibility("hidden", "divDaily");
            checkVisibility("hidden", "divWorking");
            $("#titleSelectedCalendar").text("Calendario Mensual - ");
            calendarMonth();
			$('#MiniCalendar').html(getMiniCalendar(Selected, selectedDay));
			$('#miniCalendarBack').attr("onclick","changeMonthBack();");
			$('#miniCalendarForward').attr("onclick","changeMonthForward();");
            break;
        case "divWeekly":
            $("#divMonthly").css('backgroundColor', '');
            $("#divDaily").css('backgroundColor', '');
            $("#divWorking").css('backgroundColor' , '');
            checkVisibility("hidden", "divMonthly");
            checkVisibility("hidden", "divDaily");
            checkVisibility("hidden", "divWorking");
            $("#titleSelectedCalendar").text("Calendario Semanal - ");
            calendarWeek();         
			$('#MiniCalendar').html(getMiniCalendar(Selected, selectedDay));
			$('#miniCalendarBack').attr("onclick",$("#btnAtras").attr("onclick"));
			$('#miniCalendarForward').attr("onclick",$("#btnAdelante").attr("onclick"));
            break;
        case "divDaily":
            $("#divMonthly").css('backgroundColor', '');
            $("#divWeekly").css('backgroundColor', '');
            $("#divWorking").css('backgroundColor' , '');
            checkVisibility("hidden", "divMonthly");
            checkVisibility("hidden", "divWeekly");
            checkVisibility("hidden", "divWorking");
            $("#titleSelectedCalendar").text("Calendario Diario - ");
			if (typeof selectedDay === 'undefined')
				selectedDay = new Date();
            calendarDay(selectedDay);          
			$('#MiniCalendar').html(getMiniCalendar(Selected, selectedDay));
			//$('#miniCalendarBack').attr("onclick","changeMonthBack();");
			//$('#miniCalendarForward').attr("onclick","changeMonthForward();");
            break;
        case "divWorking":
            $("#divMonthly").css('backgroundColor', '');
            $("#divWeekly").css('backgroundColor', '');
            $("#divDaily").css('backgroundColor', '');
            checkVisibility("hidden", "divMonthly");
            checkVisibility("hidden", "divWeekly");
            checkVisibility("hidden", "divDaily");
            $("#btnAtras").css("visibility", "hidden");
            $("#btnAdelante").css("visibility", "hidden");
			if (typeof selectedDay === 'undefined')
				selectedDay = new Date();			
            calendarWork(new Date());        
			$('#MiniCalendar').html(getMiniCalendar(Selected, selectedDay));
            break;
    }
    addDroppableFunctions();//Si tiene muchos div que hacer droppable se pone lenta la pagina (Dependiendo servidor).

}
function selectedActivity(Selected) {
    $("#" + Selected.id).removeClass().addClass("selectedActivitie");
    $("#" + Selected.id).css("backgroundColor", "#FFFFFF");
    $("#lnkCrmForm").css("visibility", "");
	$("#lnkCrmForm").attr('href', 'javascript:openNewActivityForm("' + Selected.id + '")');
    switch (Selected.id) {
        case "imgNewTask":
        	$("#datePickerInit").val('');
            $("#tdInicioDatos").hide();
            $("#tdInicioTitulo").hide();
            $("#imgNewFax").removeClass().addClass("selectActivitie");
            $("#imgNewFax").css("backgroundColor", "");
            $("#imgNewAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewAppointment").css("backgroundColor", "");
            $("#imgNewLetter").removeClass().addClass("selectActivitie");
            $("#imgNewLetter").css("backgroundColor", "");
            $("#imgNewEmail").removeClass().addClass("selectActivitie");
            $("#imgNewEmail").css("backgroundColor", "");
            $("#imgNewPhoneCall").removeClass().addClass("selectActivitie");
            $("#imgNewPhoneCall").css("backgroundColor", "");
            $("#imgNewServiceAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewServiceAppointment").css("backgroundColor", "");
            $("#imgNewRecurringAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewRecurringAppointment").css("backgroundColor", "");
            $("#Para").attr('disabled', 'disabled');
            $("#Para").removeClass().addClass("buscarButtonDisable");
            break;
        case "imgNewFax":
        	$("#datePickerInit").val('');
            $("#tdInicioDatos").hide();
            $("#tdInicioTitulo").hide();
            $("#imgNewTask").removeClass().addClass("selectActivitie");
            $("#imgNewTask").css("backgroundColor", "");
            $("#imgNewAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewAppointment").css("backgroundColor", "");
            $("#imgNewLetter").removeClass().addClass("selectActivitie");
            $("#imgNewLetter").css("backgroundColor", "");
            $("#imgNewEmail").removeClass().addClass("selectActivitie");
            $("#imgNewEmail").css("backgroundColor", "");
            $("#imgNewPhoneCall").removeClass().addClass("selectActivitie");
            $("#imgNewPhoneCall").css("backgroundColor", "");
            $("#imgNewServiceAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewServiceAppointment").css("backgroundColor", "");
            $("#imgNewRecurringAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewRecurringAppointment").css("backgroundColor", "");
            $("#Para").removeAttr('disabled');
            $("#Para").removeClass().addClass("buscarButton");
            break;
        case "imgNewAppointment":
        	$("#datePickerInit").val($("#datePickerEnd").val());
        	//$("#selectInicio").val($("#selectFin").children("option[selected=selected]").val()); //Ver como hacer para asignar el indice de la hora de fin a la hora de inicio
        	//$("#selectFin").children("option[selected=selected]").val();
            $("#tdInicioDatos").show();
            $("#tdInicioTitulo").show();
            $("#imgNewTask").removeClass().addClass("selectActivitie");
            $("#imgNewTask").css("backgroundColor", "");
            $("#imgNewFax").removeClass().addClass("selectActivitie");
            $("#imgNewFax").css("backgroundColor", "");
            $("#imgNewLetter").removeClass().addClass("selectActivitie");
            $("#imgNewLetter").css("backgroundColor", "");
            $("#imgNewEmail").removeClass().addClass("selectActivitie");
            $("#imgNewEmail").css("backgroundColor", "");
            $("#imgNewPhoneCall").removeClass().addClass("selectActivitie");
            $("#imgNewPhoneCall").css("backgroundColor", "");
            $("#imgNewServiceAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewServiceAppointment").css("backgroundColor", "");
            $("#imgNewRecurringAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewRecurringAppointment").css("backgroundColor", "");
            $("#Para").attr('disabled', 'disabled');
            $("#Para").removeClass().addClass("buscarButtonDisable");
            break;
        case "imgNewLetter":
        	$("#datePickerInit").val('');
            $("#tdInicioDatos").hide();
            $("#tdInicioTitulo").hide();
            $("#imgNewTask").removeClass().addClass("selectActivitie");
            $("#imgNewTask").css("backgroundColor", "");
            $("#imgNewFax").removeClass().addClass("selectActivitie");
            $("#imgNewFax").css("backgroundColor", "");
            $("#imgNewAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewAppointment").css("backgroundColor", "");
            $("#imgNewEmail").removeClass().addClass("selectActivitie");
            $("#imgNewEmail").css("backgroundColor", "");
            $("#imgNewPhoneCall").removeClass().addClass("selectActivitie");
            $("#imgNewPhoneCall").css("backgroundColor", "");
            $("#imgNewServiceAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewServiceAppointment").css("backgroundColor", "");
            $("#imgNewRecurringAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewRecurringAppointment").css("backgroundColor", "");
            $("#Para").removeAttr('disabled');
            $("#Para").removeClass().addClass("buscarButton");
            break;
        case "imgNewEmail":
        	$("#datePickerInit").val('');
            $("#tdInicioDatos").hide();
            $("#tdInicioTitulo").hide();
            $("#imgNewTask").removeClass().addClass("selectActivitie");
            $("#imgNewTask").css("backgroundColor", "");
            $("#imgNewFax").removeClass().addClass("selectActivitie");
            $("#imgNewFax").css("backgroundColor", "");
            $("#imgNewAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewAppointment").css("backgroundColor", "");
            $("#imgNewLetter").removeClass().addClass("selectActivitie");
            $("#imgNewLetter").css("backgroundColor", "");
            $("#imgNewPhoneCall").removeClass().addClass("selectActivitie");
            $("#imgNewPhoneCall").css("backgroundColor", "");
            $("#imgNewServiceAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewServiceAppointment").css("backgroundColor", "");
            $("#imgNewRecurringAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewRecurringAppointment").css("backgroundColor", "");
            $("#Para").removeAttr('disabled');
            $("#Para").removeClass().addClass("buscarButton");
            break;
        case "imgNewPhoneCall":
        	$("#datePickerInit").val('');
            $("#tdInicioDatos").hide();
            $("#tdInicioTitulo").hide();
            $("#imgNewTask").removeClass().addClass("selectActivitie");
            $("#imgNewTask").css("backgroundColor", "");
            $("#imgNewFax").removeClass().addClass("selectActivitie");
            $("#imgNewFax").css("backgroundColor", "");
            $("#imgNewAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewAppointment").css("backgroundColor", "");
            $("#imgNewLetter").removeClass().addClass("selectActivitie");
            $("#imgNewLetter").css("backgroundColor", "");
            $("#imgNewEmail").removeClass().addClass("selectActivitie");
            $("#imgNewEmail").css("backgroundColor", "");
            $("#imgNewServiceAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewServiceAppointment").css("backgroundColor", "");
            $("#imgNewRecurringAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewRecurringAppointment").css("backgroundColor", "");
            $("#Para").removeAttr('disabled');
            $("#Para").removeClass().addClass("buscarButton");
            break;
        case "imgNewServiceAppointment":
        	$("#datePickerInit").val($("#datePickerEnd").val());
        	//$("#selectInicio") //Ver como hacer para asignar el indice de la hora de fin a la hora de inicio
        	//$("#selectFin").children("option[selected=selected]").index();
            $("#tdInicioDatos").show();
            $("#tdInicioTitulo").show();
            $("#imgNewTask").removeClass().addClass("selectActivitie");
            $("#imgNewTask").css("backgroundColor", "");
            $("#imgNewFax").removeClass().addClass("selectActivitie");
            $("#imgNewFax").css("backgroundColor", "");
            $("#imgNewAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewAppointment").css("backgroundColor", "");
            $("#imgNewLetter").removeClass().addClass("selectActivitie");
            $("#imgNewLetter").css("backgroundColor", "");
            $("#imgNewEmail").removeClass().addClass("selectActivitie");
            $("#imgNewEmail").css("backgroundColor", "");
            $("#imgNewPhoneCall").removeClass().addClass("selectActivitie");
            $("#imgNewPhoneCall").css("backgroundColor", "");
            $("#imgNewRecurringAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewRecurringAppointment").css("backgroundColor", "");
            $("#Para").attr('disabled', 'disabled');
            $("#Para").removeClass().addClass("buscarButtonDisable");
            break;
        case "imgNewRecurringAppointment":
        	$("#datePickerInit").val($("#datePickerEnd").val());
        	//$("#selectInicio") //Ver como hacer para asignar el indice de la hora de fin a la hora de inicio
        	//$("#selectFin").children("option[selected=selected]").index();
            $("#tdInicioDatos").show();
            $("#tdInicioTitulo").show();
            $("#imgNewTask").removeClass().addClass("selectActivitie");
            $("#imgNewTask").css("backgroundColor", "");
            $("#imgNewFax").removeClass().addClass("selectActivitie");
            $("#imgNewFax").css("backgroundColor", "");
            $("#imgNewAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewAppointment").css("backgroundColor", "");
            $("#imgNewLetter").removeClass().addClass("selectActivitie");
            $("#imgNewLetter").css("backgroundColor", "");
            $("#imgNewEmail").removeClass().addClass("selectActivitie");
            $("#imgNewEmail").css("backgroundColor", "");
            $("#imgNewPhoneCall").removeClass().addClass("selectActivitie");
            $("#imgNewPhoneCall").css("backgroundColor", "");
            $("#imgNewServiceAppointment").removeClass().addClass("selectActivitie");
            $("#imgNewServiceAppointment").css("backgroundColor", "");
            $("#Para").attr('disabled', 'disabled');
            $("#Para").removeClass().addClass("buscarButtonDisable");
            break;
    }
}
function seeDay(day) 
{
    var openDay = new Date();
    openDay.setFullYear(day.split('/')[2], (parseInt(day.split('/')[1]) - (1)), day.split('/')[0]);
    changeSelectedView("divDaily", openDay);
}
function calendarWork(openDay) {
	var nextWeek = new Date();
	nextWeek.setDate(openDay.getDate() + (14));
	var tomorrow = new Date();
	tomorrow.setDate(openDay.getDate() + (1));
	var consulta = 	"$select=ActivityTypeCode,Subject,ScheduledStart,ActivityId" +
					"&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')" +
					// "%20and%20ScheduledStart%20ge%20datetime'" + openDay.getFullYear() + '-' + checkZeroes(openDay.getMonth() + (1)) + '-' + checkZeroes(openDay.getDate()) + "'" +
					// "%20and%20ScheduledStart%20le%20datetime'" + nextWeek.getFullYear() + '-' + checkZeroes(nextWeek.getMonth() + (1)) + '-' + checkZeroes(nextWeek.getDate()) + "'" +
					"%20and%20ScheduledEnd%20ge%20datetime'" + openDay.getFullYear() + '-' + checkZeroes(openDay.getMonth() + (1)) + '-' + checkZeroes(openDay.getDate()) + "'" +
					"%20and%20ScheduledEnd%20le%20datetime'" + nextWeek.getFullYear() + '-' + checkZeroes(nextWeek.getMonth() + (1)) + '-' + checkZeroes(nextWeek.getDate()) + "'" +
					//"%20and%20ActivityTypeCode%20ne%20'incidentresolution'" +//Ver como quitar las resoluciones de incidentes.
					"%20and%20StateCode/Value%20eq%20" + 0 + "" +
					"&$orderby=ScheduledEnd%20asc";

    SDK.REST.retrieveMultipleRecords(
		"ActivityPointer",
		consulta,
		function (resultado) {
			if (resultado.length == 0)
				$("#tituloCalendar").text("No tiene actividades para el dia");
			else
			{
				var activitiesCount = 0;
				$("#tituloCalendar").text("Tiene " + resultado.length + " actividades para el dia");		
				for (var i = 0; i < resultado.length; i++)
				{
					if (resultado[i].ScheduledStart != null)
					{
						activitiesCount++;
						var act = {};
						act.TipoActividad = resultado[i].ActivityTypeCode;
						act.Asunto = resultado[i].Subject;
						act.Inicio = resultado[i].ScheduledStart;
						act.Id = resultado[i].ActivityId;
						if ((resultado[i].ScheduledStart.toDateString() == openDay.toDateString()) || (resultado[i].ScheduledStart.toDateString() == tomorrow.toDateString()))
							consultedActivity(act);
						else
							consultedNextWeeks(act, nextWeek);
					}	
					$("#tituloCalendar").text("Tiene " + activitiesCount + " actividades para esta semana");
				}
			}
		},
		printMsg,
		function Complete() {
			makeDraggable();
		}
	);
	//nuevo html div
    var calWork =
        '<table style="width:100%; height:100%; border-collapse:collapse; background-color:#FFFFFF;">' //border:solid 1px #A9A9A9;
        + '<tr>'
            + '<td style="width:2%; height:30%;">'
                + '<table style="width:100%; border-collapse:collapse; height:30%;">'
                    + '<tr>'
                        + '<td style="text-align:center; width:95%;">'
                            + '<label style="font-size:large; font-weight:bold; color:#3B3B3B; text-align:center;">Actividades para el dia de hoy</label>'
                        + '</td>'
                    + '</tr>'
                    + '<tr>'
                        + '<td style="border:solid 1px #A5ACB5; text-align:center; width:95%;">'
                            + '<div id="' + checkZeroes(openDay.getDate()) + '/' + checkZeroes(openDay.getMonth() + (1)) + '/' + openDay.getFullYear() + '" onclick="addActivity(this.id);" class="droppable" style="height:145px;overflow:hidden; border-width:medium; overflow:auto; border-color:#DBDEE1;">'
                            + '</div>'
                        + '</td>'
                    + '</tr>'
                + '</table>'
            + '</td>'
        + '</tr>'
        + '<tr>'
            + '<td style="text-align:center;">'
                + '<table style="width:100%; border-collapse:collapse; height:30%;">'
                    + '<tr>'
                        + '<td style="text-align:center; width:95%;">'
                            + '<label style="font-size:large; font-weight:bold; color:#3B3B3B; text-align:center;">Actividades para ma\u00f1ana</label>'
                        + '</td>'
                    + '</tr>'
                    + '<tr>'
                        + '<td style="border:solid 1px #A5ACB5; text-align:center; width:95%;">'
                            + '<div id="' + checkZeroes(tomorrow.getDate()) + '/' + checkZeroes(tomorrow.getMonth() + (1)) + '/' + tomorrow.getFullYear() + '" onclick="addActivity(this.id);" class="droppable" style="height:145px;overflow:hidden; border-width:medium; overflow:auto; border-color:#DBDEE1;">'
                            + '</div>'
                        + '</td>'
                    + '</tr>'
                + '</table>'
            + '</td>'
        + '</tr>'
        + '<tr>'
            + '<td style="text-align:center;">'
                + '<table style="width:100%; border-collapse:collapse; height:30%;">'
                    + '<tr>'
                        + '<td style="text-align:center; width:95%;">'
                            + '<label style="font-size:large; font-weight:bold; color:#3B3B3B; text-align:center;">Proximas Actividades</label>'
                        + '</td>'
                    + '</tr>'
                    + '<tr>'
                        + '<td style="border:solid 1px #A5ACB5; text-align:center; width:95%;">'
							+ '<div id="' + checkZeroes(nextWeek.getDate()) + '/' + checkZeroes(nextWeek.getMonth() + (1)) + '/' + nextWeek.getFullYear() + '" onclick="addActivity(this.id);" class="droppable" style="height:145px;overflow:hidden; border-width:medium; overflow:auto; border-color:#DBDEE1;">'//Ver
							+ '</div>'
                        + '</td>'
                    + '</tr>'
                + '</table>'
            + '</td>'
        + '</tr>'
    + '</table>';
    $("#titleSelectedCalendar").text("Calendario Laboral - " + dayOfWeek(openDay.getDay() - 1) + " " + openDay.getDate() + " de " + monthOfYear(openDay.getMonth()));
    $("#tblCalendarioCustom").html(calWork);
	//document.getElementById("09/04/2013").style.visibility = "hidden";//Ver por que no me acepta jquery
    setTimeout('delayCicle()',1);
}
function calendarWeek() {
    var initialDayWeek = new Date(initialDateWeek);
    var finalDayWeek = new Date(finalDateWeek);//Ver si realmente es necesario.
	var consulta = 	"$select=ActivityTypeCode,Subject,ScheduledEnd,ActivityId" +
					"&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')" +
					"%20and%20ScheduledEnd%20ge%20datetime'" + initialDayWeek.getFullYear() + '-' + checkZeroes(initialDayWeek.getMonth() + (1)) + '-' + checkZeroes(initialDayWeek.getDate()) + "'" +
					"%20and%20ScheduledEnd%20le%20datetime'" + finalDayWeek.getFullYear() + '-' + checkZeroes(finalDayWeek.getMonth() + (1)) + '-' + checkZeroes(finalDayWeek.getDate()) + "'" +
					"%20and%20StateCode/Value%20eq%20" + 0 + "" +
					"&$orderby=ScheduledEnd%20asc";

    SDK.REST.retrieveMultipleRecords(
		"ActivityPointer",
		consulta,
		function (resultado) {
			if (resultado.length == 0)
				$("#tituloCalendar").text("No tiene actividades para la semana");
			else
			{
				for (var i = 0; i < resultado.length; i++)
				{
					var act = {};
					act.TipoActividad = resultado[i].ActivityTypeCode;
					act.Asunto = resultado[i].Subject;
					act.Inicio = resultado[i].ScheduledEnd;
					act.Id = resultado[i].ActivityId;
					consultedActivity(act);
					$("#tituloCalendar").text("Tiene " + resultado.length + " actividades para esta semana");
				}
			}
		},
		printMsg,
		function Complete() {
			makeDraggable();
		}
	);
					
    var calWeek = '<table style="width:100%; height:100%; border:solid 1px #A9A9A9; border-collapse:collapse; background-color:#FFFFFF;">'
        + '<tr>';
    for (var column = 0; column < 7; column++) {
        calWeek += '<td style="border:solid 1px #A5ACB5; text-align:center; width:14%; height:5%">'
            + '<a style="text-decoration:none;color:black;" href=javascript:seeDay("' + checkZeroes(initialDayWeek.getDate()) + '/' + checkZeroes(initialDayWeek.getMonth() + (1)) + '/' + initialDayWeek.getFullYear() + '"); style="font-size:large; text-align:center;" title="' + checkZeroes(initialDayWeek.getDate()) + '/' + checkZeroes(initialDayWeek.getMonth() + (1)) + '/' + initialDayWeek.getFullYear() + '">' + dayOfWeek(column) + '</a>'
        + '</td>';
        initialDayWeek.setDate(initialDayWeek.getDate() + (1));
    }
    calWeek += '</tr>'
        + '<tr>';
    var initialDayWeek = new Date(initialDateWeek);
    for (var column = 0; column < 7; column++) {
        calWeek += '<td style="border:solid 1px #A5ACB5; text-align:center; width:14%; height:93%">';
        if (new Date().toDateString() == initialDayWeek.toDateString())
            calWeek += '<div id="' + checkZeroes(initialDayWeek.getDate()) + '/' + checkZeroes(initialDayWeek.getMonth() + (1)) + '/' + initialDayWeek.getFullYear() + '" onclick="addActivity(this.id);" class="droppable" style="overflow:hidden; background-color:#add8e6">';
        else
            calWeek += '<div id="' + checkZeroes(initialDayWeek.getDate()) + '/' + checkZeroes(initialDayWeek.getMonth() + (1)) + '/' + initialDayWeek.getFullYear() + '" onclick="addActivity(this.id);" class="droppable" style="overflow:hidden;">';
                calWeek += '</div>'
            + '</td>'
        initialDayWeek.setDate(initialDayWeek.getDate() + (1));
    }
    calWeek += '</tr>';
    + '</table>';
    $("#titleSelectedCalendar").text($("#titleSelectedCalendar").text() + "Semana del " + initialDateWeek.getDate() + " de " + monthOfYear(initialDateWeek.getMonth()) + " hasta el " + finalDateWeek.getDate() + " de " + monthOfYear(finalDateWeek.getMonth()));
    $("#tblCalendarioCustom").html(calWeek);
    setTimeout('delayCicle()',1);
}
function getMiniCalendar(SelectedCalendar, selectedDay) 
{
    var initialMiniCalDate = new Date(initialDate);
    var midleMiniCalDate = new Date(middleDate);
    var finalMiniCalDate = new Date(finalDate);
    var initialDayWeek = new Date(initialDateWeek);
    var finalDayWeek = new Date(finalDateWeek);
    var MiniCal =
    '<table style="width:100%; height:100%; border-collapse:collapse;>'
        + '<tr>'
            + '<td>'
                + '<table style="width:100%; height:100%; border-collapse:collapse; background-color:#A9A9A9;">'
                    + '<tr style="border:solid 1px black;">'
                        + '<td width="90%" style="text-align:center;border:solid 1px black;">'
                            + '<span>' + monthOfYear(midleMiniCalDate.getMonth()) + ' de ' + midleMiniCalDate.getFullYear() + '</span>'
                        + '</td>'
                        + '<td width="5%">'
                            + '<a id="miniCalendarBack" style="cursor:hand;"><</a>'
                        + '</td>'
                        + '<td width="5%">'
                            + '<a id="miniCalendarForward" style="cursor:hand;">></a>'
                        + '</td>'
                    + '</tr>'
                + '</table>'
            + '</td>'
        + '</tr>';
    for (var row = 0; row < 7; row++) {
        MiniCal += '<tr>'
            + '<td>'
                + '<table style="background-color:#FFFFFF; border-collapse:collapse;">'
                    + '<tr>';
        for (var column = 0; column < 7; column++) 
		{
            if (row == 0) {
                MiniCal += '<td width="5%" style="text-align:center;">'
                            + '<span title="' + dayOfWeek(column) + '">' + dayOfWeek(column).substring(0, 2) + '</span>'
                        + '</td>';
            }
            else 
			{
                if (initialMiniCalDate != finalMiniCalDate) 
				{
					switch (SelectedCalendar) 
					{
						case "divMonthly":
							$("#btnAtras").attr("onclick","changeMonthBack();");
							$("#btnAdelante").attr("onclick","changeMonthForward();");
							if (initialMiniCalDate.getMonth() != midleMiniCalDate.getMonth())
							{
								MiniCal += '<td width="5%" style="text-align:center;" class="calendar">'
								if (initialMiniCalDate.getMonth() < midleMiniCalDate.getMonth())
									MiniCal += '<a style="color:#A5ACB5; text-decoration:none;" href=javascript:changeMonthBack();>'
								else
									MiniCal += '<a style="color:#A5ACB5; text-decoration:none;" href=javascript:changeMonthForward();>'

								MiniCal += checkZeroes(initialMiniCalDate.getDate())
									+ '</a>'
								+ '</td>';
							}
							else 
							{
								if ((initialMiniCalDate.getDate() == new Date().getDate())&&(initialMiniCalDate.getMonth() == new Date().getMonth()))
								{
									MiniCal += '<td width="5%" style="text-align:center; border:1px solid red;" class="calendarSelected">'
										+ '<a style="color:#000000;text-decoration:none;" href=javascript:seeDay("' + checkZeroes(initialMiniCalDate.getDate()) + '/' + checkZeroes(initialMiniCalDate.getMonth()) + '/' + initialMiniCalDate.getFullYear() + '");>'
											+ checkZeroes(initialMiniCalDate.getDate())
										+ '</a>'
									+ '</td>';
								}
								else 
								{
										MiniCal += '<td width="5%" style="text-align:center;" class="calendarSelected">'
											+ '<a style="color:#000000;text-decoration:none;" href=javascript:seeDay("' + checkZeroes(initialMiniCalDate.getDate()) + '/' + checkZeroes(initialMiniCalDate.getMonth()) + '/' + initialMiniCalDate.getFullYear() + '");>'
												+ checkZeroes(initialMiniCalDate.getDate())
											+ '</a>'
										+ '</td>';
								}
							}
							break;
						case "divWeekly":
							$("#btnAtras").attr("onclick","changeWeekBack();");
							$("#btnAdelante").attr("onclick","changeWeekForward();");
							
							if (initialMiniCalDate.getMonth() != (midleMiniCalDate.getMonth())) 
							{
								if ((initialMiniCalDate.getDate() == new Date().getDate())&&(initialMiniCalDate.getMonth() == new Date().getMonth()))
								{
									MiniCal += '<td width="5%" style="text-align:center;" class="calendarSelected">'
										+ '<a style="color:#A5ACB5; text-decoration:none;" href=javascript:seeDay("' + initialMiniCalDate.getDate() + '/' + checkZeroes(initialMiniCalDate.getMonth() + (1)) + '/' + initialMiniCalDate.getFullYear() + '");>'
											+ checkZeroes(initialMiniCalDate.getDate())
										+ '</a>'
									+ '</td>';
								}
								else 
								{
									if (initialMiniCalDate.getDate() == initialDayWeek.getDate()&&(initialMiniCalDate.getMonth() == initialDayWeek.getMonth()))
									{
										if ((initialMiniCalDate.getDate() == new Date().getDate())&&(initialMiniCalDate.getMonth() == new Date().getMonth()))
										{
											MiniCal += '<td width="5%" style="text-align:center; border:1px solid red;" class="calendarSelected">'
												+ '<a style="color:#000000;text-decoration:none;" href=javascript:seeDay("' + checkZeroes(initialMiniCalDate.getDate()) + '/' + checkZeroes(initialMiniCalDate.getMonth() + (1)) + '/' + initialMiniCalDate.getFullYear() + '");>'
													+ checkZeroes(initialMiniCalDate.getDate())
												+ '</a>'
											+ '</td>';
										}
										else 
										{
											MiniCal += '<td width="5%" style="text-align:center;" class="calendarSelected">'
												+ '<a style="color:#000000;text-decoration:none;" href=javascript:seeDay("' + checkZeroes(initialMiniCalDate.getDate()) + '/' + checkZeroes(initialMiniCalDate.getMonth() + (1)) + '/' + initialMiniCalDate.getFullYear() + '");>'
													+ checkZeroes(initialMiniCalDate.getDate())
												+ '</a>'
											+ '</td>';
										}									
									}
									else 
									{
										var firstDayOfWeek = new Date();
										firstDayOfWeek.setFullYear(initialMiniCalDate.getFullYear(), initialMiniCalDate.getMonth(), initialMiniCalDate.getDate() - (column));
										MiniCal += '<td width="5%" style="text-align:center;" class="calendar">'
													+ '<a style="color:#A5ACB5; text-decoration:none;" href=javascript:changeWeek("' + checkZeroes(firstDayOfWeek.getDate()) + '/' + checkZeroes(firstDayOfWeek.getMonth() + (1)) + '/' + firstDayOfWeek.getFullYear() + '");>'

										MiniCal += checkZeroes(initialMiniCalDate.getDate())
											+ '</a>'
										+ '</td>';									
									}
								}
							}
							else 
							{
								if ((initialMiniCalDate.getDate() == initialDayWeek.getDate())&&(initialMiniCalDate.getMonth() == initialDayWeek.getMonth()))
								{
									if ((initialMiniCalDate.getDate() == new Date().getDate())&&(initialMiniCalDate.getMonth() == new Date().getMonth()))
									{
										MiniCal += '<td width="5%" style="text-align:center; border:1px solid red;" class="calendarSelected">'
											+ '<a style="color:#000000;text-decoration:none;" href=javascript:seeDay("' + checkZeroes(initialMiniCalDate.getDate()) + '/' + checkZeroes(initialMiniCalDate.getMonth() + (1)) + '/' + initialMiniCalDate.getFullYear() + '");>'
												+ checkZeroes(initialMiniCalDate.getDate())
											+ '</a>'
										+ '</td>';
									}
									else 
									{
										MiniCal += '<td width="5%" style="text-align:center;" class="calendarSelected">'
											+ '<a style="color:#000000;text-decoration:none;" href=javascript:seeDay("' + checkZeroes(initialMiniCalDate.getDate()) + '/' + checkZeroes(initialMiniCalDate.getMonth() + (1)) + '/' + initialMiniCalDate.getFullYear() + '");>'
												+ checkZeroes(initialMiniCalDate.getDate())
											+ '</a>'
										+ '</td>';
									}
								}
								else 
								{
									if ((initialMiniCalDate.getDate() == new Date().getDate())&&(initialMiniCalDate.getMonth() == new Date().getMonth()))
									{
										var firstDayOfWeek = new Date();
										firstDayOfWeek.setFullYear(initialMiniCalDate.getFullYear(), initialMiniCalDate.getMonth(), initialMiniCalDate.getDate() - (column));
										MiniCal += '<td width="5%" style="text-align:center; border:1px solid red;" class="calendar">'
													+ '<a style="color:#000000;text-decoration:none;" href=javascript:changeWeek("' + checkZeroes(firstDayOfWeek.getDate()) + '/' + checkZeroes(firstDayOfWeek.getMonth() + (1)) + '/' + firstDayOfWeek.getFullYear() + '");>'
										MiniCal += checkZeroes(initialMiniCalDate.getDate())
											+ '</a>'
										+ '</td>';
									}
									else 
									{
										var firstDayOfWeek = new Date();
										firstDayOfWeek.setFullYear(initialMiniCalDate.getFullYear(), initialMiniCalDate.getMonth(), initialMiniCalDate.getDate() - (column));
										MiniCal += '<td width="5%" style="text-align:center;" class="calendar">'
													+ '<a style="color:#000000;text-decoration:none;" href=javascript:changeWeek("' + checkZeroes(firstDayOfWeek.getDate()) + '/' + checkZeroes(firstDayOfWeek.getMonth() + (1)) + '/' + firstDayOfWeek.getFullYear() + '");>'
										MiniCal += checkZeroes(initialMiniCalDate.getDate())
											+ '</a>'
										+ '</td>';
									}
								}
							}
							if ((initialDayWeek.getDate() == initialMiniCalDate.getDate()) && 
								(initialDayWeek.getDate() != finalDayWeek.getDate()) &&
								(initialDayWeek.getMonth() == initialMiniCalDate.getMonth()))
								initialDayWeek.setDate(initialDayWeek.getDate() + 1);
							
							if ((finalDateWeek.getDate() == finalDate.getDate())&&(finalDateWeek.getMonth() == finalDate.getMonth()))
								$("#btnAdelante").attr("onclick","changeMonthForward();");
							if ((initialDateWeek.getDate() == initialDate.getDate())&&(initialDateWeek.getMonth() == initialDate.getMonth()))
								$("#btnAtras").attr("onclick","changeMonthBack();");								

							break;
						default:
							var dayPrevNext = new Date(selectedDay);
							dayPrevNext.setDate(dayPrevNext.getDate() - (1));
							$("#btnAtras").attr("onclick","changeDayBack('" + checkZeroes(dayPrevNext.getDate()) + "/" + checkZeroes(dayPrevNext.getMonth()) + "/" + dayPrevNext.getFullYear() + "');");
							dayPrevNext.setDate(dayPrevNext.getDate() + (2));
							$("#btnAdelante").attr("onclick","changeDayForward('" + checkZeroes(dayPrevNext.getDate()) + "/" + checkZeroes(dayPrevNext.getMonth()) + "/" + dayPrevNext.getFullYear() + "');");
							
							if (initialMiniCalDate.getMonth() != midleMiniCalDate.getMonth())
							{
								if ((selectedDay.getDate() == initialMiniCalDate.getDate())&&(selectedDay.getMonth() == initialMiniCalDate.getMonth()))
									MiniCal += '<td width="5%" style="text-align:center; border:1px solid red;" class="calendarSelected">';
								else
									MiniCal += '<td width="5%" style="text-align:center;" class="calendar">';
								MiniCal += '<a style="color:#A5ACB5; text-decoration:none;" href=javascript:seeDay("' + checkZeroes(initialMiniCalDate.getDate()) + '/' + checkZeroes(initialMiniCalDate.getMonth() + (1)) + '/' + initialMiniCalDate.getFullYear() + '");>'
									+ checkZeroes(initialMiniCalDate.getDate())
								+ '</a>'
								+ '</td>';
							}
							else 
							{
								if (selectedDay.getDate() == initialMiniCalDate.getDate())
								{
									if ((initialMiniCalDate.getDate() == new Date().getDate())&&(initialMiniCalDate.getMonth() == new Date().getMonth()))
									{
										MiniCal += '<td width="5%" style="text-align:center; border:1px solid red;" class="calendarSelected">'
											+ '<a style="color:#000000;text-decoration:none;" href=javascript:seeDay("' + checkZeroes(initialMiniCalDate.getDate()) + '/' + checkZeroes(initialMiniCalDate.getMonth() + (1)) + '/' + initialMiniCalDate.getFullYear() + '");>'
												+ checkZeroes(initialMiniCalDate.getDate())
											+ '</a>'
										+ '</td>';
									}
									else 
									{
										MiniCal += '<td width="5%" style="text-align:center;" class="calendar">'
											+ '<a style="color:#000000;text-decoration:none;" href=javascript:seeDay("' + checkZeroes(initialMiniCalDate.getDate()) + '/' + checkZeroes(initialMiniCalDate.getMonth() + (1)) + '/' + initialMiniCalDate.getFullYear() + '");>'
												+ checkZeroes(initialMiniCalDate.getDate())
											+ '</a>'
										+ '</td>';
									}
								}
								else 
								{
									MiniCal += '<td width="5%" style="text-align:center;" class="calendar">'
										+ '<a style="color:#000000;text-decoration:none;" href=javascript:seeDay("' + checkZeroes(initialMiniCalDate.getDate()) + '/' + checkZeroes(initialMiniCalDate.getMonth() + (1)) + '/' + initialMiniCalDate.getFullYear() + '");>'
											+ checkZeroes(initialMiniCalDate.getDate())
										+ '</a>'
									+ '</td>';
								}								
							}
							break;
					}
                    initialMiniCalDate.setDate(initialMiniCalDate.getDate() + 1);
                }
            }
        }
	    MiniCal += '</tr>'
	    + '</table>'
			+ '</td>'
	    + '</tr>';
    }
	MiniCal += '</table>';
    return MiniCal;
}
function SwitchOnOffMiniCal() {
    $('#MiniCalendar').toggle("blind");
    if ($('#imgArrowMiniCal')[0].src.indexOf('Derecha') != -1)
        $('#imgArrowMiniCal').attr('src', '/WebResources/new_GIF_Abajo');
    else
        $('#imgArrowMiniCal').attr('src', '/WebResources/new_GIF_Derecha');
    
}
function SwitchOnOffActivities() {
    $('#toggableTask').toggle("blind");
    $('#toggableFax').toggle("blind");
    $('#toggablePhoneCall').toggle("blind");
    $('#toggableEmail').toggle("blind");
    $('#toggableServiceAppointment').toggle("blind");
    $('#toggableLetter').toggle("blind");
    $('#toggableAppointment').toggle("blind");
    $('#toggableRecurringAppointment').toggle("blind");
    if ($('#imgArrowFilters')[0].src.indexOf('Derecha') != -1)
        $('#imgArrowFilters').attr('src', '/WebResources/new_GIF_Abajo');
    else
        $('#imgArrowFilters').attr('src', '/WebResources/new_GIF_Derecha');
}
function SwitchOnOffSetCalendar() {
    $('#divMonthly').toggle("blind");
    $('#divWeekly').toggle("blind");
    $('#divDaily').toggle("blind");
    $('#divWorking').toggle("blind");
    if ($('#imgArrowCalendarType')[0].src.indexOf('Derecha') != -1)
        $('#imgArrowCalendarType').attr('src', '/WebResources/new_GIF_Abajo');
    else
        $('#imgArrowCalendarType').attr('src', '/WebResources/new_GIF_Derecha');
}
function SwitchOnOffNewActivities() {
    $('#togabbleNewTasks').toggle("blind");
    if ($('#imgArrowNewTasks')[0].src.indexOf('Derecha') != -1)
        $('#imgArrowNewTasks').attr('src', '/WebResources/new_GIF_Abajo');
    else
        $('#imgArrowNewTasks').attr('src', '/WebResources/new_GIF_Derecha');
}
function checkVisibility(value, object)
{
    switch (object)
    {
        case "toggableTask":
            $('#CheckTask').css("visibility",value);
            break;
        case "toggableFax":
            $('#CheckFax').css("visibility",value);
            break;
        case "toggablePhoneCall":
            $('#CheckPhoneCall').css("visibility",value);
            break;
        case "toggableEmail":
            $('#CheckEmail').css("visibility",value);
            break;
        case "toggableLetter":
            $('#CheckLetter').css("visibility",value);
            break;
        case "toggableAppointment":
            $('#CheckAppointment').css("visibility",value);
            break;
        case "toggableServiceAppointment":
            $('#CheckServiceAppointment').css("visibility",value);
            break;
        case "toggableRecurringAppointment":
            $('#CheckRecurringAppointment').css("visibility",value);
            break;
        case "divMonthly":
            $('#CheckMonth').css("visibility",value);
            break;
        case "divWeekly":
            $('#CheckWeek').css("visibility",value);
            break;
        case "divDaily":
            $('#CheckDay').css("visibility",value);
            break;
        case "divWorking":
            $('#CheckWork').css("visibility",value);
            break;
    }
}
function makeDraggable()
{
	//--------------Movibles--------------//
    $(".activityDiv").draggable({
        helper: "clone",
        opacity: 0.7,
        cursor: "move",
        revert: "invalid",
        stop: function (event, ui) {
            if ($(".droppable").hasClass("calendarDayHover"))
                $(this).draggable({ revert: true, helper: "clone", opacity: 0.7 });
        }
    });
	//------------------------------------//
}
function checkText()
{
    if ($("#txtAsunto").val() != '')
        $("#lblAsunto").text("Asunto").css("color", "");
    else
        $("#lblAsunto").text("Asunto *").css("color", "red");
}
function hideShowMenu()
{
    switch ($("#lateralMenuSwitch").text())
    {
        case ">>":
            $("#lateralMenuSwitch").text("<<");
            $("#lateralMenu").show('implode');
			$("#contentCalendar").width('79%');
            break;
        case "<<":
            $("#lateralMenuSwitch").text(">>");
            $("#lateralMenu").hide('implode', "swing", function () { $("#contentCalendar").width('98%'); } );
            break;
    }
}
/* Cambio de Mes */
function changeMonthBack()
{
	MonthBack();
	switch ($("#selectedView").text())
	{
		case "divWeekly":
			//Ver cambio de semana y de mes
			initialDateWeek = new Date(finalDate);
			initialDateWeek.setDate(finalDate.getDate() - (13));
			finalDateWeek.setDate(initialDateWeek.getDate() + (6));
			changeSelectedView($("#selectedView").text());
			break;
		case "divDaily":
			initialDateWeek = new Date(finalDate);
			initialDateWeek.setDate(finalDate.getDate() - (1));		
			changeSelectedView($("#selectedView").text());
			break;
		default:
			changeSelectedView($("#selectedView").text());
			break;
	}
}
function changeMonthForward()
{
	MonthForward();
	switch ($("#selectedView").text())
	{
		case "divWeekly":
			//Ver caso
			initialDateWeek = new Date(initialDate);
			initialDateWeek.setDate(initialDate.getDate() + (7));
			finalDateWeek.setDate(initialDateWeek.getDate() + (6));
			changeSelectedView($("#selectedView").text());
			break;
		case "divDaily":
			initialDateWeek = new Date(initialDate);
			initialDateWeek.setDate(initialDate.getDate() + (1));
			changeSelectedView($("#selectedView").text());
			break;
		default:
			changeSelectedView($("#selectedView").text());
			break;
	}
}
/* Cambio de Semana */
function changeWeekBack()
{
	WeekBack();
	changeSelectedView($("#selectedView").text());
}
function changeWeekForward()
{
	WeekForward();
	changeSelectedView($("#selectedView").text());
}
function changeWeek(BeginOfWeek)
{
    WeekChange(BeginOfWeek);
	changeSelectedView($("#selectedView").text(), BeginOfWeek);
}
/* Cambio de Dia */
function changeDayBack(day)
{
	changeSelectedView($("#selectedView").text(), setDateTimeObject(day));
}
function changeDayForward(day)
{
	changeSelectedView($("#selectedView").text(), setDateTimeObject(day));
}
function updateActivity(divActivity, activityDate)
{
	var activity = {};
	activity.ScheduledStart = new Date(activityDate.split('/')[2], activityDate.split('/')[1], activityDate.split('/')[0], $("div#Hora", divActivity.draggable).text().split(':')[0], $("div#Hora", divActivity.draggable).text().split(':')[1], 00, 00);
	
	var TipoActividad = $("img", divActivity.draggable).attr("alt").substring(0,1).toUpperCase() + $("img", divActivity.draggable).attr("alt").substring(1);
	switch (TipoActividad)
	{
		case "Phonecall":
			TipoActividad = "PhoneCall";
		break;
		case "Serviceappointment":
			TipoActividad = "ServiceAppointment";
		break;	
	}

	SDK.REST.updateRecord(
		$("div#Id", divActivity.draggable).text(),
		activity,
		TipoActividad,
		function (resultado) {
			divActivity.draggable.appendTo(document.getElementById(activityDate));
            //divActivity.draggable.appendTo($(activityDate));//Pasar a jQuery
			printMsg("Actualizacion de Actividad correcta");
			makeDraggable();
		},
		printMsg
	);	
}
function createActivity()
{
	var activity = {};
	activity.Subject = $('#txtAsunto').val();
	activity.Description = "";
	activity.ScheduledEnd = new Date(
		$('#datePickerEnd').val().split('/')[2], 
		$('#datePickerEnd').val().split('/')[1] - 1, 
		$('#datePickerEnd').val().split('/')[0], 
		$('#selectFin').val().split(':')[0], 
		$('#selectFin').val().split(':')[1], 0, 0);
	activity.ScheduledEnd.setHours(activity.ScheduledEnd.getHours() + 2);
	
	if (($(".selectedActivitie").attr("id").substring(6) == "ServiceAppointment")||($(".selectedActivitie").attr("id").substring(6) == "Appointment"))
	{
		activity.ScheduledStart  = new Date(
			$('#datePickerInit').val().split('/')[2], 
			$('#datePickerInit').val().split('/')[1] - 1, 
			$('#datePickerInit').val().split('/')[0], 
			$('#selectInicio').val().split(':')[0], 
			$('#selectInicio').val().split(':')[1], 0, 0);
		activity.ScheduledStart.setHours(activity.ScheduledStart.getHours() + 2);
	}
	//Ver como  insertar un regarding object
    if ($("#campoReferente").length != 0)
        activity.RegardingObjectId = { 
            Id: $("#campoReferente").children("img").attr('id'), 
            LogicalName: $("#campoReferente").children("img").attr('alt').toLowerCase()
        };
	if ($("#campoPara").length != 0)
	{
		activity.To = new Array();
		$("#txtPara").children().children("img").each(function(index){
			activity.To[index] = {
				Id: $(this).attr("id"),
				Name: $(this).attr("alt").toLowerCase()
			};
		});
	}

	SDK.REST.createRecord(
	activity,
    $(".selectedActivitie").attr("id").substring(6),
    function (resultado) {
		printMsg("Actividad creada con exito");
		makeDraggable();
    },
    printMsg
   );
}
function openNewActivityForm(activityType)
{
	var URL = "main.aspx?etc=";
	switch (activityType)
	{
		case "imgNewTask":
			URL += "4212";
			break;
		case "imgNewFax":
			URL += "4204";
			break;
		case "imgNewAppointment":
			URL += "4201";
			break;
		case "imgNewLetter":
			URL += "4207";
			break;
		case "imgNewEmail":
			URL += "4202";
			break;
		case "imgNewPhoneCall":
			URL += "4210";
			break;
		case "imgNewServiceAppointment":
			URL += "4214";
			break;
		case "imgNewRecurringAppointment":
			URL += "4251";
			break;			
	}
	URL += "&pagetype=entityrecord";
	window.open("../" + URL);
}
function printMsg(ex)
{
	$("#errorDialog").html('<label title="Descripcion">' + ex + '</label>');
	$("#errorDialog").dialog({
        draggable: false,
        height: 200,
        width: 200,
        hide: "implode",
        show: "implode",
        title: "Mensaje",
        closeOnEscape: true,
        modal: "true",
        modalcolor: "#000000",
        resizable: false,
        buttons: {
            "Ok": function () 
			{
                $(this).hide();
                $(this).dialog("close");
            }
        }
    });
}
function resultsReferente() {
	var grid = '<div id="gridReferente" style="width:99%; height:95%; border-collapse:collapse; float:left;">';
    for (var i = 0; i < 12; i++) {
        switch (i) {
            case 0: //Cabecera
				grid += '<div style="width:99%; height:20px; border: 1px solid transparent; border-collapse:collapse; float:left;">'
					+ '<div style="width:3%; height:20px; border:solid 1px #A5ACB5; background-color:#E0E4E9; float:left;"></div>'
					+ '<div style="width:48%; height:20px; border:solid 1px #A5ACB5; background-color:#E0E4E9; float:left;">'
						+ '<label id="lblTitleAtributte1"></label>'
					+ '</div>'
					+ '<div style="width:47%; height:20px; border:solid 1px #A5ACB5; background-color:#E0E4E9; float:left;">'
						+ '<label id="lblTitleAtributte2"></label>'
					+ '</div>'				
				+ '</div>'
                break;
            case 11: //Pie
				grid += '<div style="width:98%; height:20px; border-collapse:collapse; border:1px solid #A5ACB5; background-color:#E0E4E9; float:left;">'
					+ '<div style="width:8%; height:20px; float:left;">'
						+ '<img alt="Inicio" id="imgInit" src="/WebResources/new_PNG_PrimerPaginaBlock" />'
					+ '</div>'
					+ '<div style="width:7%; height:20px; float:left;">'
						+ '<img alt="Atras" onclick="changePageBack()" id="imgBack" src="/WebResources/new_PNG_Atras" />'
					+ '</div>'
					+ '<div style="width:70%; height:20px; text-align:center; float:left;">'
						+ '<label id="labelRecords"></label>'
						+ '<label> registros de </label>'
						+ '<label id="labelTotalRecords"></label>'						
					+ '</div>'
					+ '<div style="width:7%; height:20px; padding-left:0cm; float:left;">'
						+ '<img alt="Adelante" onclick="changePageForward()" id="imgForward" src="/WebResources/new_PNG_Adelante" />'
					+ '</div>'
					+ '<div style="width:8%; height:20px; padding-left:0cm; float:left;">'
						+ '<img alt="Fin" id="imgEnd" src="/WebResources/new_PNG_UltimaPaginaBlock" />'
					+ '</div>'					
				+ '</div>'
                break;				
            default: //Contenido
				grid += '<div id="trCheck' + i + '" onclick="selectedRegistry(' + i + ');" class="divFiltersTable" style="width:99%; height:20px; border-collapse:collapse; float:left;">'
					+ '<div style="width:3%; height:20px; border:solid 1px #A5ACB5; float:left;">'
                        + '<img id="Check' + i + '" style="visibility:hidden;" alt="" src="/WebResources/new_GIF_Check" />'
						+ '<div id="selectedId' + i + '" style="visibility:hidden"></div>'					
                        + '<div id="lastPageId" style="visibility:hidden"></div>'
					+ '</div>'
					+ '<div style="width:48%; height:20px; border:solid 1px #A5ACB5; overflow:hidden; text-overflow:ellipsis; float:left;">'
						+ '<label id="lblAtributtePrincipal' + i + '"></label>'
					+ '</div>'
					+ '<div style="width:47%; height:20px; border:solid 1px #A5ACB5; overflow:hidden; text-overflow:ellipsis; float:left;">'
						+ '<label id="lblAtributteSecundary' + i + '"></label>'
					+ '</div>'				
				+ '</div>'
                break;				
        }
    }
	grid += '</div>';
    return grid;
}
function resultsPara() {
	var grid = '<div id="gridPara" style="width:99%; height:95%; border-collapse:collapse; float:left;">';
    for (var i = 0; i < 12; i++) {
        switch (i) {
            case 0: //Cabecera
				grid += '<div style="width:99%; height:20px; border: 1px solid transparent; border-collapse:collapse; float:left;">'
					+ '<div style="width:3%; height:20px; border:solid 1px #A5ACB5; background-color:#E0E4E9; float:left;">'
						+ '<input id="checkAll" type="checkbox" onclick="selectAll()" />'
					+ '</div>'
					+ '<div style="width:47%; height:20px; border:solid 1px #A5ACB5; background-color:#E0E4E9; float:left;">'
						+ '<label id="lblTitleAtributte1"></label>'
					+ '</div>'
					+ '<div style="width:47%; height:20px; border:solid 1px #A5ACB5; background-color:#E0E4E9; float:left;">'
						+ '<label id="lblTitleAtributte2"></label>'
					+ '</div>'				
				+ '</div>'
                break;
            case 11: //Pie
				grid += '<div style="width:98%; height:20px; border-collapse:collapse; border:1px solid #A5ACB5; background-color:#E0E4E9; float:left;">'
					+ '<div style="width:8%; height:20px; float:left;">'
						+ '<img alt="Inicio" id="imgInit" src="/WebResources/new_PNG_PrimerPaginaBlock" />'
					+ '</div>'
					+ '<div style="width:7%; height:20px; float:left;">'
						+ '<img alt="Atras" onclick="changePageBack()" id="imgBack" src="/WebResources/new_PNG_Atras" />'
					+ '</div>'
					+ '<div style="width:70%; height:20px; text-align:center; float:left;">'
						+ '<label id="labelRecords"></label>'
						+ '<label> registros de </label>'
						+ '<label id="labelTotalRecords"></label>'						
					+ '</div>'
					+ '<div style="width:7%; height:20px; padding-left:0cm; float:left;">'
						+ '<img alt="Adelante" onclick="changePageForward()" id="imgForward" src="/WebResources/new_PNG_Adelante" />'
					+ '</div>'
					+ '<div style="width:8%; height:20px; padding-left:0cm; float:left;">'
						+ '<img alt="Fin" id="imgEnd" src="/WebResources/new_PNG_UltimaPaginaBlock" />'
					+ '</div>'					
				+ '</div>'
                break;	
            default: //Contenido
				grid += '<div id="trCheck' + i + '" onclick="selectedRow(' + i + ');" class="divFiltersTable" style="width:99%; height:20px; border-collapse:collapse; float:left;">'
					+ '<div style="width:3%; height:20px; border:solid 1px #A5ACB5; float:left;">'
						+ '<input type="checkbox" id="Check' + i + '"  />'
						+ '<div id="selectedId' + i + '" style="visibility:hidden"></div>'
                        + '<div id="lastPageId" style="visibility:hidden"></div>'
					+ '</div>'
					+ '<div style="width:48%; height:20px; border:solid 1px #A5ACB5; overflow:hidden; text-overflow:ellipsis; float:left;">'
						+ '<label id="lblAtributtePrincipal' + i + '"></label>'
					+ '</div>'
					+ '<div style="width:47%; height:20px; border:solid 1px #A5ACB5; overflow:hidden; text-overflow:ellipsis; float:left;">'
						+ '<label id="lblAtributteSecundary' + i + '"></label>'
					+ '</div>'				
				+ '</div>'
                break;	
        }
    }
	grid += '</div>';
	return grid;
}
function selectedRegistry(row) 
{
    for (var i = 1; i < 11; i++) 
	{
        if (row == i) 
		{
            if ($('#Check' + row).css('visibility') == 'visible')
                $('#Check' + row).css('visibility', 'hidden');
            else
                $('#Check' + row).css('visibility', 'visible');
        }
        else 
            $('#Check' + i).css('visibility', 'hidden');
    }
}
function selectAll() {
    if ($('#checkAll').is(':checked')) {
        for (var i = 0; i < 11; i++) {
            if ($('#Check' + i).attr('checked') != "checked") {
                for (i = 1; i < 11; i++) {
                    $('#Check' + i).attr('checked', true)
                    $("#trCheck" + i).css('backgroundColor', '#a7cdf0')
                    //document.getElementById("trCheck" + i).style.backgroundColor = "#a7cdf0";
                }
            }
        }
    }
    else {
        for (var i = 0; i < 11; i++) {
            if ($('#Check' + i).is(':checked')) {
                for (i = 1; i < 11; i++) {
                    $('#Check' + i).attr('checked', false)
                    $("#trCheck" + i).css('backgroundColor', '')
                    //document.getElementById("trCheck" + i).style.backgroundColor = "";
                }
            }
        }        
    }
}
function selectedRow(row) {
	if ($("#trCheck" + row).css('backgroundColor') == "#a7cdf0"){
    //if (document.getElementById("trCheck" + row).style.backgroundColor == "#a7cdf0") {
        //document.getElementById("trCheck" + row).style.backgroundColor = "";
        $('#trCheck' + row).css('backgroundColor', '');
        $('#Check' + row).attr('checked', false);
    }
    else {
    	$('#trCheck' + row).css('backgroundColor', '#a7cdf0');
        //document.getElementById("trCheck" + row).style.backgroundColor = "#a7cdf0";
        $('#Check' + row).attr('checked', true);
    }
}
function onChangeSelected()
{
	// $("#gridResults").children();
	var consulta = 	"$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id" +//OwnerId Antes
					"&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')" ;

    SDK.REST.retrieveMultipleRecords(
		$("#EntitiesSelect").children("option[selected=selected]").val(),
		consulta,
		function (resultado) {
			if (resultado.length == 0)
				$("#labelTotalRecords").text(resultado.length);
			else
			{
                if ((resultado.length/10) != 1)
                    $("#lastPageId").text(resultado[resultado.length - parseInt(String(resultado.length/10).split('.')[1])][$("#EntitiesSelect").children("option[selected=selected]").val() + "Id"]);
                else
                    $("#lastPageId").text(resultado[resultado.length - 10][$("#EntitiesSelect").children("option[selected=selected]").val() + "Id"]); 
                               
				$("#imgBack").attr('src', '/WebResources/new_PNG_AtrasBlock');
				$("#imgInit").attr('src', '/WebResources/new_PNG_PrimerPaginaBlock');
				if (resultado.length <= 20)
				{
					$("#imgEnd").attr('src', '/WebResources/new_PNG_UltimaPaginaBlock');
					if (resultado.length <= 10)
                    {
						$("#imgForward").attr('src', '/WebResources/new_PNG_AdelanteBlock');
                        $("#imgForward").attr('onclick', '');
                    }
				}
                else
                {
                    $("#imgEnd").attr('src', '/WebResources/new_PNG_UltimaPagina');
                    $("#imgEnd").attr('onclick', 'goEnd()');
                }

				$("#labelTotalRecords").text(resultado.length);
			}
		},
		printMsg,
		function Complete() {
			var Select, Filter, Top, Order;
			Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id,Name,Description";
			Filter = "&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')";
			Top = "&$top=10";
			Order = "&$orderby=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id%20asc";
			switch($("#EntitiesSelect").children("option[selected=selected]").val())
			{
				case "Lead":
					Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id,FirstName,Description";
					break;
				case "Contact":
					Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id,FullName,Description";
					break;
				case "Incident":
					Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id,Title,Description";
					break;
				case "Contract":
					Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id,Title,StateCode";
					break;
                // case "SystemUser":
                //     Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id,FullName,DomainName";
                //     Filter = "";
                //     break;
			}
			consulta = Select + Filter + Top + Order;
			SDK.REST.retrieveMultipleRecords(
			$("#EntitiesSelect").children("option[selected=selected]").val(),
			consulta,
			function (resultado) {
				$("#labelRecords").text(resultado.length);
				if (resultado.length == 0)
					emptyDiv();
				else
				{
					$("#lblTitleAtributte1").text("Nombre");
					$("#lblTitleAtributte2").text("Descripcion");
					var ires = 0;
					for (var i = 1; i < (resultado.length + (1)); i++)
					{
						$("#selectedId" + i).text(resultado[ires][$("#EntitiesSelect").children("option[selected=selected]").val() + "Id"]);
						switch($("#EntitiesSelect").children("option[selected=selected]").val())
						{
							case "Lead":
								$("#lblTitleAtributte1").text("Primer Nombre");
								if (resultado[ires].FirstName != null)
									$("#lblAtributtePrincipal" + i).text(resultado[ires].FirstName);
								else
									$("#lblAtributtePrincipal" + i).text("");
								break;								
							case "Contact":
								$("#lblTitleAtributte1").text("Nombre Completo");
								if (resultado[ires].FullName != null)
									$("#lblAtributtePrincipal" + i).text(resultado[ires].FullName);
								else
									$("#lblAtributtePrincipal" + i).text("");
								break;
							case "Incident":
								$("#lblTitleAtributte1").text("Titulo");
								if (resultado[ires].Title != null)
									$("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
								else
									$("#lblAtributtePrincipal" + i).text("");
								break;
							case "Contract":
								$("#lblTitleAtributte1").text("Titulo");
								if (resultado[ires].Title != null)
									$("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
								else
									$("#lblAtributtePrincipal" + i).text("");								
								break;
                            case "SystemUser":
                                $("#lblTitleAtributte1").text("Nombre Completo");
                                $("#lblTitleAtributte2").text("Nombre de Dominio");
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].FullName);
                                $("#lblAtributtePrincipal" + i).text("");                               
                                break;                                
							default:
								if (resultado[ires].Name != null)
									$("#lblAtributtePrincipal" + i).text(resultado[ires].Name);
								else
									$("#lblAtributtePrincipal" + i).text("");								
								break;								
						}
						switch($("#EntitiesSelect").children("option[selected=selected]").val())
						{
							case "Contract":
								$("#lblTitleAtributte1").text("Titulo");
								$("#lblTitleAtributte2").text("Estado");
								if (resultado[ires].StateCode != null)
									$("#lblAtributteSecundary" + i).text(resultado[ires].StateCode);
								else
									$("#lblAtributteSecundary" + i).text("");								
								break;
                            case "SystemUser":
                                $("#lblTitleAtributte1").text("Nombre Completo");
                                $("#lblTitleAtributte2").text("Nombre de Dominio");
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].FullName);
                                $("#lblAtributteSecundary" + i).text(resultado[ires].DomainName);
                                break;                                  
							default:
								if (resultado[ires].Description != null)
									$("#lblAtributteSecundary" + i).text(resultado[ires].Description);
								else
									$("#lblAtributteSecundary" + i).text("Sin Descripcion");
								ires++;
							break;
						}
					}
				}
			},
			printMsg,
			function Complete(){
			});
		}
	);
    if ($("#selectPara").length != 0)
        $("#gridResults").html(resultsPara());
    else
        $("#gridResults").html(resultsReferente());
}
function emptyDiv() 
{
	var grid = '<div style="width:100%; height:75%; border-collapse:collapse; float:left; background-color: white; text-align: center;">' +
		'No se encontraron resultados para la busqueda' +
		'</div>';
    $("#gridResults").html(grid);
}
function changePageBack()
{
    var Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id";
    switch($("#EntitiesSelect").children("option[selected=selected]").val())
    {
        case "Lead":
            Select = ",FirstName,Description";
            break;
        case "Contact":
            Select = ",FullName,Description";
            break;
        case "Incident":
            Select = ",Title,Description";
            break;
        case "Contract":
            Select = ",Title,StateCode";
            break;        
        default:
            Select += ",Name,Description";
        break;
    }
    var consulta = Select +
        "&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')" +
        "%20and%20" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id%20lt%20(guid'{" + $("#selectedId1").text().toUpperCase() + "}')" +
        "&$top=10" + 
        "&$orderby=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id%20asc";

    SDK.REST.retrieveMultipleRecords(
    $("#EntitiesSelect").children("option[selected=selected]").val(),
    consulta,
    function (resultado) {
        if (resultado.length == 0)
            printMsg("No hubo coincidencia");
        else
        {
            $("#labelRecords").text(resultado.length);
            $("#imgForward").attr('src', '/WebResources/new_PNG_Adelante');
            $("#imgForward").attr('onclick', 'changePageForward()');            
            if (parseInt($("#labelTotalRecords").text()) <= 20)
            {
                $("#imgInit").attr('src', '/WebResources/new_PNG_PrimerPaginaBlock');
                $("#imgEnd").attr('src', '/WebResources/new_PNG_UltimaPaginaBlock');
                $("#imgBack").attr('src', '/WebResources/new_PNG_AtrasBlock');
                $("#imgBack").attr('onclick', '');
            }
            else
            {
                $("#imgInit").attr('src', '/WebResources/new_PNG_PrimerPagina');
                $("#imgInit").attr('onclick', '');//Volver
                $("#imgEnd").attr('src', '/WebResources/new_PNG_UltimaPagina');
            }            
            var ires = 0;
            for (var i = 1; i < (resultado.length + (1)); i++)
            {
                $("#selectedId" + i).text(resultado[ires][$("#EntitiesSelect").children("option[selected=selected]").val() + "Id"]);
                $("#lblTitleAtributte1").text("Nombre");
                $("#lblTitleAtributte2").text("Descripcion");
                switch($("#EntitiesSelect").children("option[selected=selected]").val())
                {
                    case "Lead":
                        $("#lblTitleAtributte1").text("Titulo");
                        $("#lblTitleAtributte2").text("Descripcion");
                        $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                        $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                    break;
                    case "Contract":
                        $("#lblTitleAtributte1").text("Titulo");
                        $("#lblTitleAtributte2").text("Descripcion");
                        $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                        $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                    break;
                    case "Contact":
                        $("#lblTitleAtributte1").text("Nombre Completo");
                        $("#lblTitleAtributte2").text("Descripcion");
                        $("#lblAtributtePrincipal" + i).text(resultado[ires].FullName);
                        $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                    break;
                    case "Incident":
                        $("#lblTitleAtributte1").text("Titulo");
                        $("#lblTitleAtributte2").text("Descripcion");
                        $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                        $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                    break;
                    case "Opportunity":
                        $("#lblTitleAtributte1").text("Titulo");
                        $("#lblTitleAtributte2").text("Descripcion");
                        $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                        $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                    break;
                }
                ires++;
            }
        }
    },
    printMsg,
    function Complete(){
    });
    var lblRecords = parseInt($("#labelRecords").text());
    var lblTotalRecords = parseInt($("#labelTotalRecords").text());

    if ($('#selectPara').attr('id') == "selectPara")
        $("#gridResults").html(resultsPara());
    else 
        $("#gridResults").html(resultsReferente());

    $("#labelRecords").text(lblRecords);
    $("#labelTotalRecords").text(lblTotalRecords);


}
function changePageForward()
{
    //Validar de que grilla se esta llamando a la funcion.
    //Si vengo de la grilla "Para" mantener lo que selecciono.
    var Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id";
    switch($("#EntitiesSelect").children("option[selected=selected]").val())
    {
        case "Lead":
            Select = ",FirstName,Description";
            break;
        case "Contact":
            Select = ",FullName,Description";
            break;
        case "Incident":
            Select = ",Title,Description";
            break;
        case "Contract":
            Select = ",Title,StateCode";
            break;        
        default:
            Select += ",Name,Description";
        break;
    }
    var consulta = Select +
        "&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')" +
        "%20and%20" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id%20gt%20(guid'{" + $("#selectedId10").text().toUpperCase() + "}')" +
        "&$top=10" + 
        "&$orderby=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id%20asc";
            
    SDK.REST.retrieveMultipleRecords(
    $("#EntitiesSelect").children("option[selected=selected]").val(),
    consulta,
    function (resultado) {
        if (resultado.length == 0)
            printMsg("No hubo coincidencia");
        else
        {
            $("#labelRecords").text(parseInt($("#labelRecords").text()) + resultado.length);
            $("#imgBack").attr('src', '/WebResources/new_PNG_Atras');
            if (parseInt($("#labelTotalRecords").text()) <= 20)
            {
                $("#imgInit").attr('src', '/WebResources/new_PNG_PrimerPaginaBlock');
                $("#imgEnd").attr('src', '/WebResources/new_PNG_UltimaPaginaBlock');
                $("#imgForward").attr('src', '/WebResources/new_PNG_AdelanteBlock');
                $("#imgForward").attr('onclick', '');
            }
            else
            {
                $("#imgInit").attr('src', '/WebResources/new_PNG_PrimerPagina');
                $("#imgInit").attr('onclick', 'goInit()');
                $("#imgEnd").attr('src', '/WebResources/new_PNG_UltimaPagina');
            }
            //Cambiar datos de la grid interna
            var ires = 0;
            for (var i = 1; i < (resultado.length + (1)); i++)
            {
                $("#selectedId" + i).text(resultado[ires][$("#EntitiesSelect").children("option[selected=selected]").val() + "Id"]);
                $("#lblTitleAtributte1").text("Nombre");
                $("#lblTitleAtributte2").text("Descripcion");
                switch($("#EntitiesSelect").children("option[selected=selected]").val())
                {
                    case "Lead":
                        $("#lblTitleAtributte1").text("Titulo");
                        $("#lblTitleAtributte2").text("Descripcion");
                        $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                        $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                    break;
                    case "Contract":
                        $("#lblTitleAtributte1").text("Titulo");
                        $("#lblTitleAtributte2").text("Descripcion");
                        $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                        $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                    break;
                    case "Contact":
                        $("#lblTitleAtributte1").text("Nombre Completo");
                        $("#lblTitleAtributte2").text("Descripcion");
                        $("#lblAtributtePrincipal" + i).text(resultado[ires].FullName);
                        $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                    break;
                    case "Incident":
                        $("#lblTitleAtributte1").text("Titulo");
                        $("#lblTitleAtributte2").text("Descripcion");
                        $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                        $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                    break;
                    case "Opportunity":
                        $("#lblTitleAtributte1").text("Titulo");
                        $("#lblTitleAtributte2").text("Descripcion");
                        $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                        $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                    break;
                }
                ires++;
            }
        }
    },
    printMsg,
    function Complete(){
    });
    var lblRecords = parseInt($("#labelRecords").text());
    var lblTotalRecords = parseInt($("#labelTotalRecords").text());

    if ($('#selectPara').attr('id') == "selectPara")
        $("#gridResults").html(resultsPara());
    else 
        $("#gridResults").html(resultsReferente());

    $("#labelRecords").text(lblRecords);
    $("#labelTotalRecords").text(lblTotalRecords);
}
function goInit()
{
    var Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id";
    switch($("#EntitiesSelect").children("option[selected=selected]").val())
    {
        case "Lead":
            Select = ",FirstName,Description";
            break;
        case "Contact":
            Select = ",FullName,Description";
            break;
        case "Incident":
            Select = ",Title,Description";
            break;
        case "Contract":
            Select = ",Title,StateCode";
            break;
        default:
            Select = ",Name,Description";
            break;
        // case "SystemUser":
        //     Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id,FullName,DomainName";
        //     Filter = "";
        //     break;
    }
    consulta = Select + 
        "&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')" + 
        "&$top=10" + 
        "&$orderby=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id%20asc";
    SDK.REST.retrieveMultipleRecords(
        $("#EntitiesSelect").children("option[selected=selected]").val(),
        consulta,
        function (resultado) 
        {
            $("#labelRecords").text(resultado.length);
            $("#imgInit").attr('src', '/WebResources/new_PNG_PrimerPaginaBlock');
            $("#imgInit").attr('onclick', '');
            $("#imgBack").attr('src', '/WebResources/new_PNG_AtrasBlock');
            $("#imgBack").attr('onclick', '');
            $("#imgForward").attr('src', '/WebResources/new_PNG_Adelante');
            $("#imgForward").attr('onclick', 'changePageForward()');
            $("#imgEnd").attr('src', '/WebResources/new_PNG_UltimaPagina');
            $("#imgEnd").attr('onclick', 'goEnd()');
            if (resultado.length == 0)
                emptyDiv();
            else
            {
                $("#lblTitleAtributte1").text("Nombre");
                $("#lblTitleAtributte2").text("Descripcion");
                var ires = 0;
                for (var i = 1; i < (resultado.length + (1)); i++)
                {
                    $("#selectedId" + i).text(resultado[ires][$("#EntitiesSelect").children("option[selected=selected]").val() + "Id"]);
                    switch($("#EntitiesSelect").children("option[selected=selected]").val())
                    {
                        case "Lead":
                            $("#lblTitleAtributte1").text("Primer Nombre");
                            if (resultado[ires].FirstName != null)
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].FirstName);
                            else
                                $("#lblAtributtePrincipal" + i).text("");
                            break;                              
                        case "Contact":
                            $("#lblTitleAtributte1").text("Nombre Completo");
                            if (resultado[ires].FullName != null)
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].FullName);
                            else
                                $("#lblAtributtePrincipal" + i).text("");
                            break;
                        case "Incident":
                            $("#lblTitleAtributte1").text("Titulo");
                            if (resultado[ires].Title != null)
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                            else
                                $("#lblAtributtePrincipal" + i).text("");
                            break;
                        case "Contract":
                            $("#lblTitleAtributte1").text("Titulo");
                            if (resultado[ires].Title != null)
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                            else
                                $("#lblAtributtePrincipal" + i).text("");                               
                            break;
                        case "SystemUser":
                            $("#lblTitleAtributte1").text("Nombre Completo");
                            $("#lblTitleAtributte2").text("Nombre de Dominio");
                            $("#lblAtributtePrincipal" + i).text(resultado[ires].FullName);
                            $("#lblAtributtePrincipal" + i).text("");                               
                            break;                                
                        default:
                            if (resultado[ires].Name != null)
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].Name);
                            else
                                $("#lblAtributtePrincipal" + i).text("");                               
                            break;                              
                    }
                    switch($("#EntitiesSelect").children("option[selected=selected]").val())
                    {
                        case "Contract":
                            $("#lblTitleAtributte1").text("Titulo");
                            $("#lblTitleAtributte2").text("Estado");
                            if (resultado[ires].StateCode != null)
                                $("#lblAtributteSecundary" + i).text(resultado[ires].StateCode);
                            else
                                $("#lblAtributteSecundary" + i).text("");                               
                            break;
                        case "SystemUser":
                            $("#lblTitleAtributte1").text("Nombre Completo");
                            $("#lblTitleAtributte2").text("Nombre de Dominio");
                            $("#lblAtributtePrincipal" + i).text(resultado[ires].FullName);
                            $("#lblAtributteSecundary" + i).text(resultado[ires].DomainName);
                            break;                                  
                        default:
                            if (resultado[ires].Description != null)
                                $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                            else
                                $("#lblAtributteSecundary" + i).text("Sin Descripcion");
                            ires++;
                        break;
                    }
                }
            }
        },
        printMsg,
        function Complete(){
        });

}
function goEnd()
{
    $("#imgInit").attr('src', '/WebResources/new_PNG_PrimerPagina');
    $("#imgInit").attr('onclick', 'goInit()');
    $("#imgBack").attr('src', '/WebResources/new_PNG_Atras');
    $("#imgBack").attr('onclick', 'changePageBack()');
    $("#imgForward").attr('src', '/WebResources/new_PNG_AdelanteBlock');
    $("#imgForward").attr('onclick', '');
    $("#imgEnd").attr('src', '/WebResources/new_PNG_UltimaPaginaBlock');
    $("#imgEnd").attr('onclick', '');    

    var Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id";
    switch($("#EntitiesSelect").children("option[selected=selected]").val())
    {
        case "Lead":
            Select = ",FirstName,Description";
            break;
        case "Contact":
            Select = ",FullName,Description";
            break;
        case "Incident":
            Select = ",Title,Description";
            break;
        case "Contract":
            Select = ",Title,StateCode";
            break;
        default:
            Select = ",Name,Description";
            break;
        // case "SystemUser":
        //     Select = "$select=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id,FullName,DomainName";
        //     Filter = "";
        //     break;
    }
    consulta = Select + 
        "&$filter=OwnerId/Id%20eq%20(guid'" + userid + "')" + 
        "%20and%20" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id%20ge%20(guid'{" + $("#lastPageId").text().toUpperCase() + "}')" +        
        "&$top=10" + 
        "&$orderby=" + $("#EntitiesSelect").children("option[selected=selected]").val() + "Id%20asc";

    SDK.REST.retrieveMultipleRecords(
        $("#EntitiesSelect").children("option[selected=selected]").val(),
        consulta,
        function (resultado) 
        {
            $("#labelRecords").text(resultado.length);
            if (resultado.length == 0)
                emptyDiv();
            else
            {
                $("#lblTitleAtributte1").text("Nombre");
                $("#lblTitleAtributte2").text("Descripcion");
                var ires = 0;
                for (var i = 1; i < (resultado.length + (1)); i++)
                {
                    $("#selectedId" + i).text(resultado[ires][$("#EntitiesSelect").children("option[selected=selected]").val() + "Id"]);
                    switch($("#EntitiesSelect").children("option[selected=selected]").val())
                    {
                        case "Lead":
                            $("#lblTitleAtributte1").text("Primer Nombre");
                            if (resultado[ires].FirstName != null)
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].FirstName);
                            else
                                $("#lblAtributtePrincipal" + i).text("");
                            break;                              
                        case "Contact":
                            $("#lblTitleAtributte1").text("Nombre Completo");
                            if (resultado[ires].FullName != null)
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].FullName);
                            else
                                $("#lblAtributtePrincipal" + i).text("");
                            break;
                        case "Incident":
                            $("#lblTitleAtributte1").text("Titulo");
                            if (resultado[ires].Title != null)
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                            else
                                $("#lblAtributtePrincipal" + i).text("");
                            break;
                        case "Contract":
                            $("#lblTitleAtributte1").text("Titulo");
                            if (resultado[ires].Title != null)
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].Title);
                            else
                                $("#lblAtributtePrincipal" + i).text("");                               
                            break;
                        case "SystemUser":
                            $("#lblTitleAtributte1").text("Nombre Completo");
                            $("#lblTitleAtributte2").text("Nombre de Dominio");
                            $("#lblAtributtePrincipal" + i).text(resultado[ires].FullName);
                            $("#lblAtributtePrincipal" + i).text("");
                            break;                                
                        default:
                            if (resultado[ires].Name != null)
                                $("#lblAtributtePrincipal" + i).text(resultado[ires].Name);
                            else
                                $("#lblAtributtePrincipal" + i).text("");
                            break;                              
                    }
                    switch($("#EntitiesSelect").children("option[selected=selected]").val())
                    {
                        case "Contract":
                            $("#lblTitleAtributte1").text("Titulo");
                            $("#lblTitleAtributte2").text("Estado");
                            if (resultado[ires].StateCode != null)
                                $("#lblAtributteSecundary" + i).text(resultado[ires].StateCode);
                            else
                                $("#lblAtributteSecundary" + i).text("");
                            break;
                        case "SystemUser":
                            $("#lblTitleAtributte1").text("Nombre Completo");
                            $("#lblTitleAtributte2").text("Nombre de Dominio");
                            $("#lblAtributtePrincipal" + i).text(resultado[ires].FullName);
                            $("#lblAtributteSecundary" + i).text(resultado[ires].DomainName);
                            break;                                  
                        default:
                            if (resultado[ires].Description != null)
                                $("#lblAtributteSecundary" + i).text(resultado[ires].Description);
                            else
                                $("#lblAtributteSecundary" + i).text("Sin Descripcion");
                            ires++;
                        break;
                    }
                }
                for (var i = (resultado.length + 1); i < 11; i++)
                {
                    $("#lblAtributtePrincipal" + i).text("");
                    $("#lblAtributteSecundary" + i).text("");
                }
            }
        },
        printMsg,
        function Complete(){
        }
    );
}
function delayCicle()
{
    for (var i= 0; i < 8; i++)
    {
        if ($("[id^=toggable]").children("div").children()[i].style.visibility == "hidden")
            $("img[alt=" + $("[id^=toggable]")[i].id.toLowerCase().slice(8) + "]").parent().parent().hide();
    }   
}