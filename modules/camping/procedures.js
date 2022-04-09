const camping = $jSpaghetti.module("camping")
camping.config.debugMode = true

camping.procedure("startBankCamping", function(shared, hooks){
	/*shared.myAccountsInfo = */
	getBankAccountAddr((info) => {

		getBTCWalletInfo(btcWallet => {

			for (let i = 0; i == 0; i++){
			
				shared.myAccountsInfo = info

				shared.ip = controllers.bot.controlPanel.fieldsContent[FIELD_BANK_IP_TARGET]
				shared.myAccount = shared.myAccountsInfo[shared.ip]
				shared.transferToBTC = controllers.bot.controlPanel.checkBoxes[SET_TRANSFER_TO_BTC]

				if(shared.transferToBTC){
					shared.BTCInfo = btcWallet
					//console.log(shared.BTCInfo)
					if(!shared.BTCInfo.isLogged){
						shared.isBTCLogged = false
						window.alert(LANG.DISCONNECTED_BTC_WALLET)
						//return false
						hooks.next(false)
						break
					} else {
						shared.isBTCLogged = true
					}
				}

				if (shared.myAccount === undefined){
					if(shared.ip.length){
						LANG.CAMPING_WITHOUT_VINCULATED_ACCOUNT
						window.alert(LANG.CAMPING_WITHOUT_VINCULATED_ACCOUNT.replace('{CONTENT}', ' "' + shared.ip + '"'))
					} else {
						window.alert(LANG.CAMPING_CHOOSE_IP)
					}
					//return false
					hooks.next(false)
					break
				}
				shared.accounts = []
				shared.myCluesFound = false
				/*shared.myIp = */
				getMyIp(true, (myip) => {
					shared.myIp = myip
					shared.listenForTransferActivities = true
					shared.listenForAccountAccessActivities = false
					shared.isLogged = false
					//return true
					hooks.next(true)
				})
				break
			}

		})

			
	})
		
})


camping.procedure("goToIp", function(shared, hooks){
	hooks.next()
	goToPage("/internet?ip=" + shared.ip)
})

camping.procedure("logout", function(shared, hooks){
	shared.isLogged = false
	hooks.next()
	goToPage("/internet?view=logout")
})

camping.procedure("logoutAccount", function(shared, hooks){
	hooks.next()
	goToPage("/internet?bAction=logout")
})

camping.procedure("isThereMessageError", function(){
	if (getDOMElement("div", "class", "alert alert-error", 0))
		return true
	return null
})

camping.procedure("forceToAccessTarget", function(shared, hooks){
	hooks.next()
	goToPage("/internet?action=hack")
})

camping.procedure("signInTarget", function(shared, hooks){
	shared.isLogged = true
	hooks.next()
	getDOMElement("input", "type", "submit", 1).click(); //Click on the Login button
	return null
})

camping.procedure("hackTargetBruteForce", function(shared, hooks){
	hooks.next()
	goToPage("/internet?action=hack&method=bf")
})

camping.procedure("hackAccount", function(shared, hooks){
	hooks.next()
	goToPage("/internet?action=hack&acc=" + shared.accounts.shift())
})

camping.procedure("accessKnownAccount", function(shared, hooks){
	var labels = ["This bank account does not exists", "Invalid bank account", "Essa conta bancária não existe", "inválida"]
	var errorMessageContainer = getDOMElement("div", "class", "alert alert-error", 0)
	if (strposOfArray(errorMessageContainer.innerHTML, labels) == -1){
		hooks.next()
		getDOMElement("input", "name", "acc", 0).value = getDOMElement("div", "class", "alert alert-error", 0).innerHTML.match(/[0-9]+/)[0]
		getDOMElement("input", "name", "pass", 0).value = getDOMElement("strong", null, null, 1).childNodes[0].nodeValue //Fill the password field with the password on screen
		getDOMElement("input", "type", "submit", 1).click() //Click on the Login button
	}
	return null
})

camping.procedure("accessUnknownAccount", function(shared, hooks){
	hooks.next()
	getDOMElement("input", "type", "submit", 1).click() //Click on the Login button
	return null
})

camping.procedure("goToOwnLogTab", function(shared, hooks){
	hooks.next()
	goToPage("/log")
})

camping.procedure("cleanMyIpClues", function(shared){
	var textArea = getDOMElement("textarea", "class", "logarea", 0)
	var pattern = new RegExp("^.*" + shared.myIp + ".*$")
	var textFiltered = removeLinesFromText(textArea.value, pattern)
	if (textArea.value != textFiltered){
		shared.myCluesFound = true
		textArea.value = textFiltered
	} else {
		shared.myCluesFound = false
	}
	return null
})

camping.procedure("cleanTextAreaContent", function(shared, hooks){
	var textArea = getDOMElement("textarea", "class", "logarea", 0)
	textArea.value = ""
	hooks.next()
	getDOMElement("input", "class", "btn btn-inverse", "last").click()
	return null
})

camping.procedure("submitLogs", function(shared, hooks){
	hooks.next()
	getDOMElement("input", "class", "btn btn-inverse", "last").click()
	return null
}) 

camping.procedure("extractDataFromLog", function(shared){
	console.log('entrei aki')
	console.log(shared)
	var textArea = getDOMElement("textarea", "class", "logarea", 0)
	var lines = textArea.value.split(/[\n\r]/)
	var outputLines = []
	var myIpPattern = new RegExp("^.*" + shared.myIp + ".*$")
	var myAccounttTransferPattern = new RegExp("^.* to #" + shared.myAccount + ".*$")
	var myAccounttAccessPattern = new RegExp("^.* on account #" + shared.myAccount + ".*$")
	for (var i = 0; i < lines.length; i++) {
		if ((shared.listenForTransferActivities) &&
			(
				(/^.*transfer+ed \$[0-9]+ from #[0-9]+.*to #[0-9]+ at localhost$/.test(lines[i]))
			) &&
			(!myIpPattern.test(lines[i])) && (!myAccounttTransferPattern.test(lines[i]))) {
			var result = lines[i].match(/#[0-9]+/g)
			shared.accounts.push(result[1].replace("#", ""))
		} else 
		if ((shared.listenForAccountAccessActivities) &&
			((/^.*logged on account #[0-9]+$/.test(lines[i]))) &&
			(!myIpPattern.test(lines[i])) && (!myAccounttAccessPattern.test(lines[i]))) {
			var result = lines[i].match(/#[0-9]+/g)
			shared.accounts.push(result[0].replace("#", ""))
		} else {
			outputLines.push(lines[i])
		}
	}
	console.log("Caught accounts:", shared.accounts)
	var accounts = shared.accounts
	shared.accounts = accounts.filter(function(value, pos) {
		return accounts.indexOf(value) == pos
	})
	textArea.value = outputLines.join("\n")
	return null
})

camping.procedure("goToTargetLogs", function(shared, hooks){
	//if (!getDOMElement("textarea", "class", "logarea", 0) || (location.href.indexOf("/internet") == -1))
	hooks.next()
	goToPage("/internet?view=logs")
})

camping.procedure("transferMoneyToTarget", function(shared, hooks){
	hooks.next()
	getDOMElement("input", "name", "acc", 0).value = shared.myAccount //Fill the To field
	getDOMElement("input", "name", "ip", 1).value = shared.ip //Fill the Bank IP field
	getDOMElement("button", "class", "btn btn-success", 0).click() //Click on the Transfer Money button
	return null
})

/*camping.procedure("checkProgressBar", function(shared, funcs){
	var loop = setInterval(function(){
		var progressBar = getDOMElement("div", "role", "progressbar", 0)
		if(!progressBar){
			clearInterval(loop)
			funcs.sendSignal("Mishchap, go ahead. It'll never crash anymore ;)")
		}
	}, 50)
	return null
})*/

/*camping.procedure('waitProgressBar', (shared, hooks) => {
	var loop = setInterval(() => {
		const successContainer = getDOMElement("div", "class", "alert alert-success", 0)
		const errorContainer = getDOMElement("div", "class", "alert alert-error", 0)
		//var progressBar = getDOMElement("div", "role", "progressbar", 0)
		if (successContainer || errorContainer) {
			clearInterval(loop)
			shared.cleanLogs = void 0;
			shared.isThereMessageError = false;
			if(errorContainer){
				shared.isThereMessageError = true;
				console.warn('ERROR MESSAGE')
			} else {
				console.warn('SUCCESS MESSAGE')
			}
			hooks.next()
		}
	}, 100)
});*/


camping.procedure('waitProgressBar', (shared, hooks) => {
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
	}, 200)
})

camping.procedure("goToLoginPage", function(shared, hooks){
	if (location.href.indexOf("/internet?action=login") == -1){
		hooks.next()
		goToPage("/internet?action=login")
	}
	return null
})

camping.procedure("checkFunds", function(shared){
	var fundsContainer = getDOMElement("ul", "class", "finance-box", 0)
	var funds = fundsContainer.innerHTML.match(/\$[0-9,]+/)[0].replace(/[\$,]/gm, '')
	shared.funds = Number(funds)
	if (shared.funds > 0){
		return true
	} else {
		return false
	}
})

camping.procedure("sendMoneyToBTCWallet", function(shared, hooks){
	if(shared.isBTCLogged){
		/*var accountBalance = */
		getBankAccountsBalance((result) => {
			var accountBalance = result[shared.destinationAccount]
			getBTCExchangeRate((btcExchangeRate) => {
				var bitcoinsToBuy = roundNumber(accountBalance / btcExchangeRate)
				if (bitcoinsToBuy >= 0.1){
					sendMoneyToBTCWallet(shared.destinationAccount, bitcoinsToBuy, () => {
						console.log("Account " + shared.destinationAccount + ": $" + accountBalance + " - " + bitcoinsToBuy + " BTC bought")
						hooks.next()
					})
				} else {
					console.log("Money is not enough to buy a bitcoin")
					hooks.next()
				}
			})
		})
	} else {
		console.log("BTC wallet unavailable")
		return null
	}
})

camping.procedure("cancelLogProcesses", function(shared, hooks){
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
			hooks.next()
		}
	})
})


