const webcrawler = $jSpaghetti.module("webcrawler")
webcrawler.config.debugMode = true

webcrawler.procedure("createFiles", function(shared, hook){
	/*let title = 'opa guica'
	let content = `[b]this[/b] is a thing
that makes me thing about it.
~&boe
lot
`
	postFile('/internet', title, content, () => {
		alert('arquivo enviado')
	})
	return true
	*/

	const promisses = []

	/* The following code is pure art <3 */

	promisses.push(() => {
		console.log('files creating process finished!')
		hook.next(shared.filesToCreate.length)
		goToPage("/internet?view=logs")
	})

	shared.filesToCreate.slice().reverse().forEach((descriptor, index) => {
		promisses.push(currentPromissePosition => {
			postFile('/internet', descriptor.title, descriptor.content, () => {
				promisses[currentPromissePosition - 1](currentPromissePosition - 1)
			})
		})
	})

	promisses[promisses.length - 1](promisses.length - 1)

})

webcrawler.procedure("startSearching", function(shared, hooks){
	var inputIps = controllers.bot.controlPanel.fieldsContent[FIELD_IPS_START_SEARCHING].match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/gm)
	if ((inputIps) && (inputIps.length > 0)){
		if (controllers.bot.controlPanel.checkBoxes[SET_IGNORE_LIST]){
			shared.closedList = controllers.bot.controlPanel.fieldsContent[FIELD_HOSTS_TO_IGNORE].match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/gm)
			if (!shared.closedList)
			shared.closedList = []
		} else {
			shared.closedList = []
		}
		/*if (controllers.bot.controlPanel.checkBoxes[SET_SKIP_AFTER_UPLOAD]){
			shared.skipHideLogs = true;
		} else {
			shared.skipHideLogs = false;
		}*/

		shared.openList = inputIps
		shared.openList = inputIps.filter(function(item, pos) {
			return ((inputIps.indexOf(item) == pos) && (shared.closedList.indexOf(item) == -1))
		})

		if (shared.openList.length == 0)
			return false

		controllers.bot.webcrawler.debugLines = []
		//controllers.bot.controlPanel.fieldsContent[WEBCRAWLER_SCRIPT_DEBUG] = ""
		controllers.bot.controlPanel.fieldsContent[FIELD_IPS_START_SEARCHING] = shared.openList.join(", ")
		controllers.storage.set(controllers.bot)
		shared.getSoftwareMode = true
		
		shared.inaccessibleHostsList = {}
		shared.accessibleHostsList = {}
		shared.NPCList = []
		
		shared.accessCounter = 0
		shared.currentIp = []
		shared.newHostsList = []
		shared.BTCAccountList = []
		shared.shoppingLogList = []
		shared.softwareList = []
		shared.currentSoftware = 0
		shared.mustLeaveSignature = controllers.bot.controlPanel.checkBoxes[SET_SIGNATURE]
		
		shared.softwaresToUpload = []
		shared.isUploadAborted = false
		shared.uploadRegister = {}

		//shared.myIp = getMyIp(true)
		getMyIp(true, (myip) => {
			shared.myIp = myip
			hooks.next(true)
		})
		//return true
	} else {
		return false
	}	
})

webcrawler.procedure("isWithinTimeLimit", function(shared){
	var timeContainer = getDOMElement("div", "class", "elapsed", 0)
	if (timeContainer){
		var time = timeContainer.innerHTML.match(/[0-9]+/g)
		if(time.length == 3){
			var leftTime = (Number(time[0])*Math.pow(60, 2)) + (Number(time[1])*60) + (Number(time[2]))
			if ((shared.timeLimit == 0) || (leftTime <= shared.timeLimit)){
				return true
			} else {	
				return false
			}
		} else {
			return true
		}
	} else {
		return true
	}
})

webcrawler.procedure("registerUploaded", function(shared){
	var currentSoftware = shared.softwaresToUpload[shared.currentSoftware].name + ": " + shared.softwaresToUpload[shared.currentSoftware].version
	if(shared.uploadRegister[currentSoftware] === undefined)
		shared.uploadRegister[currentSoftware] = {}
	if(shared.uploadRegister[currentSoftware][shared.currentIp] === undefined)
		shared.uploadRegister[currentSoftware][shared.currentIp] = ""
	shared.uploadRegister[currentSoftware][shared.currentIp] += "U"
	return null
})

webcrawler.procedure("registerInstalled", function(shared, hooks){
	var currentSoftware = shared.softwaresToUpload[shared.currentSoftware].name + ": " + shared.softwaresToUpload[shared.currentSoftware].version
	if(shared.uploadRegister[currentSoftware] === undefined)
		shared.uploadRegister[currentSoftware] = {}
	if(shared.uploadRegister[currentSoftware][shared.currentIp] === undefined)
		shared.uploadRegister[currentSoftware][shared.currentIp] = ""
	shared.uploadRegister[currentSoftware][shared.currentIp] += "I"
	playSound('+malware_installed.mp3')
	setTimeout(() => {
		hooks.next()
	},1000)
	//return null
})

webcrawler.procedure("registerHidden", function(shared){
	var currentSoftware = shared.softwaresToUpload[shared.currentSoftware].name + ": " + shared.softwaresToUpload[shared.currentSoftware].version
	if(shared.uploadRegister[currentSoftware] === undefined)
		shared.uploadRegister[currentSoftware] = {}
	if(shared.uploadRegister[currentSoftware][shared.currentIp] === undefined)
		shared.uploadRegister[currentSoftware][shared.currentIp] = ""
	shared.uploadRegister[currentSoftware][shared.currentIp] += "H"
	return null
})

webcrawler.procedure("manageUploadCounter", function(shared){
	if(shared.currentSoftware < shared.softwaresToUpload.length - 1){
		shared.currentSoftware += 1
	} else {
		shared.currentSoftware = 0
	}
	return null
})

webcrawler.procedure("isSoftwareAlreadyThere", function(){
	var labels = ["O cliente remoto já tem esse software", "The remote client already have this software"]
	var errorContainer = getDOMElement("div", "class", "alert alert-error", 0)
	const dangerContainer = getDOMElement("div", "class", "alert alert-danger", 0)
	if (errorContainer){
		if(strposOfArray(errorContainer.innerHTML, labels) >= 0)
		return true
	} else 
	if(dangerContainer){
		if(strposOfArray(dangerContainer.innerHTML, labels) >= 0)
		return true
	}
	return false
})

webcrawler.procedure("abortUpload", function(shared, hooks){
	pidContainer = document.getElementsByClassName("span4")[0]
	if (pidContainer){
		var pid = pidContainer.className.match(/[0-9]+/g)[1]
		if (pid){
			shared.isUploadAborted = true
			hooks.next()
			goToPage("/processes?pid=" + pid + "&del=1")
		} else {
			shared.isUploadAborted = false
		}
	} else {
		shared.isUploadAborted = false
	}
	return null
})


webcrawler.procedure("runUploadSoftware", function(shared, hooks){
	//console.log("currentSoftware", shared.currentSoftware)
	const softwareId = shared.softwaresToUpload[shared.currentSoftware].id
	//getSoftwareId(shared.softwaresToUpload[shared.currentSoftware].name, shared.softwaresToUpload[shared.currentSoftware].version, "/internet", "view=software", (softwareId) => {
		hooks.next()
		goToPage("/internet?view=software&cmd=up&id=" + softwareId)
	//})
})

webcrawler.procedure("installSoftware", function(shared, hooks){
	/*var softwareId = */
	//const softwareId = shared.softwaresToUpload[shared.currentSoftware].id
	getSoftwareId(shared.softwaresToUpload[shared.currentSoftware].name, shared.softwaresToUpload[shared.currentSoftware].version, "/internet", "view=software", (softwareId) => {
		hooks.next()
		goToPage("/internet?view=software&cmd=install&id=" + softwareId)
		//return null
	})
})

webcrawler.procedure("testUploadsoftware", function(shared, hooks){
	const softwareId = shared.softwaresToUpload[0].id
	//getSoftwareId("heartbleed.vspam", "1.0", "/internet", "view=software", (softwareId) => {
		//console.log("trying to run " + "/internet?view=software&cmd=up&id=" + softwareId)
		hooks.next()
		goToPage("/internet?view=software&cmd=up&id=" + softwareId)
	//})
})


webcrawler.procedure("isSkipHideAfterUploadEnabled", function(shared){
	return shared.skipHideLogs
})

webcrawler.procedure("hideSoftware", function(shared, hooks){
	/*var softwareId = */
	//const softwareId = shared.softwaresToUpload[shared.currentSoftware].id
	getSoftwareId(shared.softwaresToUpload[shared.currentSoftware].name, shared.softwaresToUpload[shared.currentSoftware].version, "/internet", "view=software", (softwareId) => {
		hooks.next()
		goToPage("/internet?view=software&cmd=hide&id=" + softwareId)
		//return null
	})
})

webcrawler.procedure("isIpInvalid", function(){
	var labels = ["invalid", "inválido"]
	var errorContainer = getDOMElement("div", "class", "alert alert-error", 0)
	const dangerContainer = getDOMElement("div", "class", "alert alert-danger", 0)
	if ((errorContainer)||(dangerContainer)){
		if (strposOfArray(errorContainer.innerHTML, labels) >= 0)
		return true
	}
	return null
})

webcrawler.procedure("registerInaccessible", function(shared){
	if (shared.inaccessibleHostsList[shared.hostLabel] === undefined)
		shared.inaccessibleHostsList[shared.hostLabel] = []
	shared.inaccessibleHostsList[shared.hostLabel].push(shared.currentIp)
	return null	
})

webcrawler.procedure("registerAccessible", function(shared){
	if (shared.accessibleHostsList[shared.hostLabel] === undefined)
		shared.accessibleHostsList[shared.hostLabel] = []
	shared.accessibleHostsList[shared.hostLabel].push(shared.currentIp)
	shared.accessCounter++
	//Add ip to closed list on the bot field
	var field_ips = controllers.bot.controlPanel.fieldsContent[FIELD_HOSTS_TO_IGNORE].split(',')
	if (field_ips.indexOf(shared.currentIp) == -1){
		if(field_ips[0].length)
			field_ips.push(shared.currentIp)
		else
			field_ips[0] = shared.currentIp
		controllers.bot.controlPanel.checkBoxes[SET_IGNORE_LIST] = true
		controllers.bot.controlPanel.fieldsContent[FIELD_HOSTS_TO_IGNORE] = field_ips.join(',')
	}
	return null
})

webcrawler.procedure("registerNPCNamesList", function(shared){
	if (shared.hostLabel != "VPC"){
		var container = document.getElementsByClassName("widget-content padding noborder")
		if((container) && (container.length > 0)){
			var imageContainer = container[0].getElementsByTagName("img")
			if((imageContainer) && (imageContainer.length > 0)){
				var imageTitle = imageContainer[0].title
				var imageSrc = imageContainer[0].src
			}
		}
		if (imageTitle){
			var name = imageTitle
		} else if (imageSrc){
			var name = imageSrc.replace(/^.*[\\\/]/, '')
			name = name.replace(/\..*/, '')
			name = name.replace(/^x/, '')
		} else {
			var name = null
		}
		var NPCObject = {
			ip: shared.currentIp, 
			label: shared.hostLabel,
			name: name
		}
		shared.NPCList.push(NPCObject)
	}
	return null
})

webcrawler.procedure("signInTarget", function(shared, hooks){
	hooks.next()
	getDOMElement("input", "type", "submit", 1).click(); //Click on the Login button
	return null
})

webcrawler.procedure("getIpsFromLogs", function(shared){
	var textArea = getDOMElement("textarea", "class", "logarea", 0)
	if(textArea){
		var ips = textArea.value.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/gm)
		if (ips){
			var uniqueIps = ips.filter(function(item, pos){
			return ips.indexOf(item) == pos
			})
			/* START capturing hosts for sharing with community */
			shared.host.ips = uniqueIps;
			/* STOP capturing hosts for sharing with community */
			for (var i = 0; i < uniqueIps.length; i++) {
				if ((shared.openList.indexOf(uniqueIps[i]) == -1) && (shared.closedList.indexOf(uniqueIps[i]) == -1)){
					shared.newHostsList.push(uniqueIps[i])
					shared.openList.push(uniqueIps[i])
				}
			}
		}
	}
	return null
})

webcrawler.procedure("updateCrawlerLogs", function(data){
	controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] = ""
	if(data.newHostsList.length > 0){
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += LANG.WEBCRAWLER_RESULTS_IPS_FOUND + data.newHostsList.length + "\n" 
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += data.newHostsList.join(", ") + "\n\n"
	} 
	if(Object.keys(data.accessibleHostsList).length > 0){
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += LANG.WEBCRAWLER_RESULTS_ACCESSIBLE_HOSTS + "\n" 
		for(var list in data.accessibleHostsList){
			controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += list + ": " + data.accessibleHostsList[list].length + "\n"
			controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += data.accessibleHostsList[list].join(", ") + "\n\n"
		}
	}

	if(Object.keys(data.inaccessibleHostsList).length > 0){
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += LANG.WEBCRAWLER_RESULTS_INACCESSIBLE_HOSTS + "\n" 
		for(var list in data.inaccessibleHostsList){
			controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += list + ": " + data.inaccessibleHostsList[list].length + "\n"
			controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += data.inaccessibleHostsList[list].join(", ") + "\n\n"
		}
	}

	if(data.NPCList.length > 0){
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += LANG.WEBCRAWLER_RESULTS_NOVPC + data.NPCList.length + "\n" 
		for (var i = 0; i < data.NPCList.length; i++) {
			controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += data.NPCList[i].ip + ", " + data.NPCList[i].label
			if (data.NPCList[i].name != null){
				controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += ", " + data.NPCList[i].name + "\n"
			} else {
				controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += "\n"
			}
		}
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += "\n"
	}

	if(data.openList.length > 0){
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += LANG.WEBCRAWLER_RESULTS_UNCHECKED_HOSTS + data.openList.length + "\n" 
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += data.openList.join(", ") + "\n\n"	
	}

	if(data.uploadMode){
		if(Object.keys(data.uploadRegister).length > 0){
			controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += LANG.WEBCRAWLER_RESULTS_UPLOADS + "\n" 
			for(upload in data.uploadRegister){
				controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += upload + " " + Object.keys(data.uploadRegister[upload]).length + "\n"
				var list = []
				for(ip in data.uploadRegister[upload]){
					list.push(ip + " " + data.uploadRegister[upload][ip])
				}
				controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += list.join(", ") + "\n"
			}
			controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += "\n"
		}
	}

	if(data.BTCAccountList.length > 0){
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += LANG.WEBCRAWLER_RESULTS_BTC + data.BTCAccountList.length + "\n" 
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += data.BTCAccountList.join("\n") + "\n\n"		
	}
	if(data.shoppingLogList.length > 0){
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += LANG.WEBCRAWLER_RESULTS_SHOPPING + data.shoppingLogList.length + "\n" 
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += data.shoppingLogList.join("\n") + "\n\n"	
	}
	if(data.softwareList.length > 0){
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += LANG.WEBCRAWLER_RESULTS_SOFTWARES + "\n" 
		controllers.bot.controlPanel.fieldsContent[FIELD_IP_SEARCH_RESULT] += data.softwareList.join("\n")	
	}
	controllers.storage.set(controllers.bot)
	return null
})

webcrawler.procedure("getBTCAccounts", function(shared){
	var textArea = getDOMElement("textarea", "class", "logarea", 0)
	if (textArea){
		var BTCAccounts = textArea.value.match(/^.*\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\] on account .* using key .*$/gm)
		if ((BTCAccounts) && (BTCAccounts.length > 0)) shared.BTCAccountList = shared.BTCAccountList.concat(BTCAccounts)
	}
	return null
})

webcrawler.procedure("leaveSignature", function(shared){
	if (shared.mustLeaveSignature){
		var textArea = getDOMElement("textarea", "class", "logarea", 0)
		if (textArea){
			var signature = controllers.bot.controlPanel.fieldsContent[FIELD_SIGNATURE]
			if (textArea.value.indexOf(signature) == -1) textArea.value = signature + textArea.value
		}
	}
	return null
})

webcrawler.procedure("getShoppingLogs", function(shared){
	var textArea = getDOMElement("textarea", "class", "logarea", 0)
	if (textArea){
		var shoppingLogs = textArea.value.match(/^.*were transferred.*$/gm)
		if ((shoppingLogs) && (shoppingLogs.length > 0)) shared.shoppingLogList = shared.shoppingLogList.concat(shoppingLogs)
	}
	return null
})

webcrawler.procedure("goToNextIp", function(shared, hooks){
	shared.currentIp = shared.openList.shift()
	shared.closedList.push(shared.currentIp)
	shared.host.ip = shared.currentIp
	hooks.next()
	goToPage("/internet?ip=" + shared.currentIp)
	return null
})

webcrawler.procedure("submitLogs", function(shared, hooks){
	hooks.next()
	getDOMElement("input", "class", "btn btn-inverse", "last").click()
	return null
}) 

webcrawler.procedure("goToSoftwarePage", function(shared, hooks){
	hooks.next()
	goToPage("/software")
	return null
})

webcrawler.procedure("logout", function(shared, hooks){
	hooks.next()
	goToPage("/internet?view=logout")
	return null
})

webcrawler.procedure("isThereMessageError", function(shared){
	var result = false
	if (getDOMElement("div", "class", "alert alert-error", 0)){
		result = true
	} else if (getDOMElement("div", "class", "alert alert-danger", 0)){
		result = true
	}
	shared.isThereMError = result
	return shared.isThereMError
})

webcrawler.procedure("forceToAccessTarget", function(shared, hooks){
	hooks.next()
	goToPage("/internet?action=hack")
	return null
})

webcrawler.procedure("hackTargetBruteForce", function(shared, hooks){
	hooks.next()
	goToPage("/internet?action=hack&method=bf")
	return null
})

webcrawler.procedure("goToTargetLogs", function(shared, hooks){
	if (!getDOMElement("textarea", "class", "logarea", 0) || (location.href.indexOf("/internet") == -1)){
		hooks.next()
		goToPage("/internet?view=logs")
	}
	return null
})

webcrawler.procedure("cleanMyIpClues", function(shared){
	var textArea = getDOMElement("textarea", "class", "logarea", 0)
	if (textArea){
		var pattern = new RegExp("^.*" + shared.myIp + ".*$")
		var textFiltered = removeLinesFromText(textArea.value, pattern)
		if (textArea.value != textFiltered) textArea.value = textFiltered
	}
	return null
})

webcrawler.procedure("isThereLogs", function(){
	var textArea = getDOMElement("textarea", "class", "logarea", 0)
	if (textArea){
		return true
	} else {
		return false
	}
})

webcrawler.procedure("goToTargetSoftwares", function(shared, hooks){
	if (location.href.indexOf("/internet?view=software") == -1){
		hooks.next()
		goToPage("/internet?view=software")
	}
	return null
})

webcrawler.procedure("goToOwnSoftwareArea", function(shared, hooks){
	hooks.next()
	goToPage("/software")
	return null
})

webcrawler.procedure("goToOwnLogTab", function(shared, hooks){
	hooks.next()
	goToPage("/log")
	return null
})

webcrawler.procedure("goToLoginPage", function(){
	if (location.href.indexOf("/internet?action=login") == -1)
	goToPage("/internet?action=login")
	return null
})

webcrawler.procedure("cleanTextAreaContent", function(shared, hooks){
	hooks.next()
	var textArea = getDOMElement("textarea", "class", "logarea", 0)
	textArea.value = ""
	getDOMElement("input", "class", "btn btn-inverse", "last").click()
	return null
})

webcrawler.procedure("isThereProgressBar", function(){
	var progressBar = getDOMElement("div", "role", "progressbar", 0)
	if (progressBar){
		return true
	} else {
		return false
	}
})

webcrawler.procedure("resetAccessCounter", function(shared){
	shared.accessCounter = 0
	return null
})

webcrawler.procedure("ipDoesNotExist", function(){
	var labels = ["Esse IP não existe", "This ip does not exists"]
	var container = getDOMElement("div", "class", "widget-content padding noborder", 0)
	if (container){
		if(strposOfArray(container.innerHTML, labels) >= 0)
		return true
	}
	return false
})

webcrawler.procedure("getSoftwares", function(shared){
	var softwareTable = getDOMElement("table", "class", "table table-cozy table-bordered table-striped table-software table-hover with-check", 0)
	if(softwareTable){
		var rows = softwareTable.getElementsByTagName("tr")
		if(rows){
			for (var i = 0; i < rows.length; i++) {
				var data = rows[i].getElementsByTagName("td")
				var softwareMetaData = []
				if ((data) && (data.length == 5) && (/(delete|=del)/.test(data[4].innerHTML))){
					for (var z = 1; z < 5; z++) {
						var metaData = data[z].innerHTML.replace(/(<([^>]+)>)/ig, "")
						if (metaData){
							metaData = metaData.replace(/[\n\r]+/g, '')
							if (metaData.length > 0) softwareMetaData.push(metaData)
						}
					}
					shared.softwareList.push(softwareMetaData.join(", ") + ": " + shared.currentIp)
				}
			}
		}
	}
	return null	
})

webcrawler.procedure("getHostLabel", function(shared){
	var labelContainer = document.getElementsByClassName("label pull-right")
	if (labelContainer){
		shared.hostLabel = labelContainer[0].innerHTML
	} else {
		shared.hostLabel = null
	}
	controllers.bot.webcrawler.current_target_label = shared.hostLabel
	controllers.storage.set(controllers.bot)
	return null
})

webcrawler.procedure("cancelLogProcesses", function(shared, hooks){
	/*var processesPage = */
	sendXMLHttpRequest("/processes", "GET", "", false, (processesPage) => {
		var parser = new DOMParser()
		var requestContentDOM = parser.parseFromString(processesPage, "text/html")
		var container = requestContentDOM.getElementsByClassName("widget-content padding noborder")
		var processesId = []
		if((container) && (container.length > 0)){
			var processes = container[0].getElementsByTagName("LI")
			if ((processes) && (processes.length > 0)){
				var labels = ["Edit log at", "Editar log at"]
				for (var i = 0; i < processes.length; i++) {
					if(strposOfArray(processes[i].innerHTML, labels) >= 0){
						var pidContainer = processes[i].innerHTML.match(/processBlock[0-9]+/)
						if(pidContainer){
							var pid = pidContainer[0].match(/[0-9]+/)
							processesId.push(pid[0])
						}
					}
				}
			}
		}
		if(processesId.length){
			for (var i = 0; i < processesId.length; i++) {
				sendXMLHttpRequest("/processes", "GET", "pid=" + processesId[i] + "&del=1", false, () => {
					console.log("HwB webcrawler: Process " + processesId[i] + " is terminated")
					if(i === processesId.length - 1){
						hooks.next()
					}
				})
			}
		} else {
			console.log('no log process running', processesId)
			hooks.next()
		}
	})
})

webcrawler.procedure("isThereMessageSuccess", function(){
	var messageContainer = getDOMElement("div", "class", "alert alert-success", 0)
	var labels = ["Software successfully uploaded", "Upload do software realizado com sucesso"]
	if (messageContainer){
		if (strposOfArray(messageContainer.innerHTML, labels) >= 0) return true
	}
	return false
})

/*webcrawler.procedure("checkProgressBar", function(shared, funcs){
	var loop = setInterval(function(){
		var progressBar = getDOMElement("div", "role", "progressbar", 0)
		if(!progressBar){
			clearInterval(loop)
			funcs.sendSignal("Mishchap, go ahead. It'll never crash anymore ;)")
		}
	}, 50)
	return null
})*/

webcrawler.procedure('waitProgressBar', (shared, hooks) => {
	var counter = 0;
	var loop = setInterval(() => {

		const successContainer = getDOMElement("div", "class", "alert alert-success", 0)
		const errorContainer = getDOMElement("div", "class", "alert alert-error", 0)
		const dangerContainer = getDOMElement("div", "class", "alert alert-danger", 0)
		//var progressBar = getDOMElement("div", "role", "progressbar", 0)
		if ((successContainer) || (errorContainer) || (dangerContainer)) {
			clearInterval(loop)
			shared.cleanLogs = void 0;
			shared.isThereMessageError = false;
			if((errorContainer)||(dangerContainer)){
				shared.isThereMessageError = true;
				console.warn('ERROR MESSAGE')
			} else {
				console.warn('SUCCESS MESSAGE')
			}
			hooks.next()
		} else {
			var progressBar = getDOMElement("div", "role", "progressbar", 0)
			if(!progressBar){
				counter += 200;
				if(counter > 5000){//It wait 5 seconds for the progress bar 
					shared.isThereMessageError = false;
					clearInterval(loop)
					hooks.next()
				}
			} else {
				counter = 0;
				console.log("I see! Waiting progressbar!")
			}
		}
	}, 300)
})

webcrawler.procedure("getUserCommandsResult", function(shared, hooks){
	sandbox = new Sandbox()
	sandbox.run(controllers.bot.controlPanel.fieldsContent[WEBCRAWLER_SCRIPT], (result) => {

		/* START capturing hosts for sharing with community */
		//shared.host.ip = shared.currentIp
		if(!shared.host) shared.host = new Host()
		shared.host.softwares = result.softwares.target
		shared.host.internet = result.target.internet
		shared.host.freehd = result.target.freehd
		/* END capturing hosts for sharing with community*/

		if(result.uploads.length)
			shared.uploadMode = true
		else
			shared.uploadMode = false

		shared.timeLimit = result.seconds_limit

		shared.cleaningLogsDisabled = result.clean_disabled

		shared.mustLeaveSignature = result.must_leave_signature

		shared.filesToCreate = result.files_to_create

		shared.skipHideLogs = result.clean_just_after_upload
		shared.softwaresToUpload = result.uploads
		/*controllers.bot.webcrawler.debugLines.push({content: result, ip: shared.currentIp})
		controllers.bot.controlPanel.fieldsContent[WEBCRAWLER_SCRIPT_DEBUG] = "WEBCRAWLER SCRIPT DEBUG\n\n"
		
		for (var i = 0; i < controllers.bot.webcrawler.debugLines.length; i++){
			if (controllers.bot.webcrawler.debugLines[i].ip != "")
				controllers.bot.controlPanel.fieldsContent[WEBCRAWLER_SCRIPT_DEBUG] += controllers.bot.webcrawler.debugLines[i].ip + ": " + JSON.stringify(controllers.bot.webcrawler.debugLines[i].content) + "\n\n"
			else
				controllers.bot.controlPanel.fieldsContent[WEBCRAWLER_SCRIPT_DEBUG] += controllers.bot.webcrawler.debugLines[i].content + "\n\n"
		}*/
		controllers.storage.set(controllers.bot)

		hooks.next(result)
		//return null

	})
})

webcrawler.procedure("isInstallRequired", function(shared, funcs){
	if(/install/i.test(shared.softwaresToUpload[shared.currentSoftware].actions))
		return true
	else
		return false
})

webcrawler.procedure("isHiddingRequired", function(shared, funcs){
	if(/hide/i.test(shared.softwaresToUpload[shared.currentSoftware].actions))
		return true
	else
		return false
})

webcrawler.procedure("createNewHost", function(shared, hooks){
	/* START capturing hosts for sharing with community */
	shared.host = new Host();
	return null
	/* END capturing hosts for sharing with community*/
});




